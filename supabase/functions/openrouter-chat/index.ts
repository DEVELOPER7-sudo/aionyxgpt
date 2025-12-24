import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Restrict CORS to authorized origins
const ALLOWED_ORIGINS = [
  'https://onyxgpt.lovable.app',
  'http://localhost:5173', // For development
  'http://localhost:3000',  // For development
];

const corsHeaders = (origin?: string | null): Record<string, string> => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin || '') ? (origin || '') : '',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
});

// Fallback in-memory rate limiting (secondary protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS = 50;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

const checkMemoryRateLimit = (userId: string): { allowed: boolean; remaining: number; resetTime: number } => {
  const now = Date.now();
  let userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    userLimit = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    rateLimitMap.set(userId, userLimit);
  }

  const allowed = userLimit.count < RATE_LIMIT_REQUESTS;
  if (allowed) {
    userLimit.count++;
  }

  return {
    allowed,
    remaining: Math.max(0, RATE_LIMIT_REQUESTS - userLimit.count),
    resetTime: userLimit.resetTime,
  };
};

const verifyJWT = async (token: string): Promise<{ sub: string } | null> => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials');
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return null;
    }

    return { sub: data.user.id };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};

const checkDatabaseRateLimit = async (
  userId: string
): Promise<{ allowed: boolean; remaining: number; resetTime: Date } | null> => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Missing service role key, falling back to memory rate limit');
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase.rpc('check_rate_limit', {
      _user_id: userId,
      _endpoint: 'openrouter-chat',
      _max_requests: RATE_LIMIT_REQUESTS,
      _window_seconds: 3600,
    });

    if (error) {
      console.error('Database rate limit check failed:', error);
      return null;
    }

    if (data && data.length > 0) {
      return {
        allowed: data[0].allowed,
        remaining: data[0].remaining,
        resetTime: new Date(data[0].reset_time),
      };
    }

    return null;
  } catch (error) {
    console.error('Rate limit error:', error);
    return null;
  }
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers,
      status: 204 
    });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...headers, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userPayload = await verifyJWT(token);

    if (!userPayload) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        {
          status: 401,
          headers: { ...headers, 'Content-Type': 'application/json' },
        }
      );
    }

    // Reject anonymous users
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    const { data: userData } = await supabase.auth.getUser(token);
    
    if (!userData.user || userData.user.role === 'anon') {
      return new Response(
        JSON.stringify({ error: 'Authentication required. Please sign in.' }),
        {
          status: 401,
          headers: { ...headers, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check rate limit - try database first, fallback to memory
    let rateLimit = await checkDatabaseRateLimit(userPayload.sub);
    let resetTimeMs: number;
    
    if (!rateLimit) {
      // Fallback to memory-based rate limiting
      const memoryLimit = checkMemoryRateLimit(userPayload.sub);
      rateLimit = {
        allowed: memoryLimit.allowed,
        remaining: memoryLimit.remaining,
        resetTime: new Date(memoryLimit.resetTime),
      };
      resetTimeMs = memoryLimit.resetTime;
    } else {
      resetTimeMs = rateLimit.resetTime.getTime();
    }

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Maximum 50 requests per hour.',
          resetTime: resetTimeMs,
        }),
        {
          status: 429,
          headers: { 
            ...headers, 
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((resetTimeMs - Date.now()) / 1000)),
          },
        }
      );
    }

    const { messages, model, temperature, max_tokens } = await req.json();
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        }
      );
    }
    
    for (const msg of messages) {
      if (!msg.role || !['user', 'assistant', 'system'].includes(msg.role)) {
        return new Response(
          JSON.stringify({ error: 'Invalid message role' }),
          {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
          }
        );
      }
      if (typeof msg.content !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid message content' }),
          {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
          }
        );
      }
      if (msg.content.length > 10000) {
        return new Response(
          JSON.stringify({ error: 'Message too long (max 10,000 characters)' }),
          {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
          }
        );
      }
    }
    
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not configured');
    }

    console.log('OpenRouter request:', { 
      model, 
      messageCount: messages.length,
      userId: userPayload.sub,
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://onyxgpt.lovable.app',
        'X-Title': 'OnyxGPT',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait before trying again.' }),
          {
            status: 429,
            headers: { ...headers, 'Content-Type': 'application/json' },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. OpenRouter credits exhausted.' }),
          {
            status: 402,
            headers: { ...headers, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        ...headers,
        'Content-Type': 'text/event-stream',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(resetTimeMs),
      },
    });
  } catch (error) {
    console.error('Error in openrouter-chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { 
          ...headers, 
          'Content-Type': 'application/json',
        },
      }
    );
  }
});