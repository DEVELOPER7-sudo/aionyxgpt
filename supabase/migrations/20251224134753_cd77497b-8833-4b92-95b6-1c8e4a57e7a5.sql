-- Create rate_limits table for persistent rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL DEFAULT 'openrouter-chat',
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow the service role to access this table (edge functions use service role)
-- No user-facing policies needed as this is internal

-- Create function to check and update rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _user_id uuid,
  _endpoint text DEFAULT 'openrouter-chat',
  _max_requests integer DEFAULT 50,
  _window_seconds integer DEFAULT 3600
)
RETURNS TABLE(allowed boolean, remaining integer, reset_time timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_count integer;
  _window_start timestamp with time zone;
  _now timestamp with time zone := now();
BEGIN
  -- Get or create rate limit record
  INSERT INTO public.rate_limits (user_id, endpoint, request_count, window_start)
  VALUES (_user_id, _endpoint, 0, _now)
  ON CONFLICT (user_id, endpoint) DO NOTHING;
  
  -- Get current rate limit state
  SELECT request_count, rate_limits.window_start 
  INTO _current_count, _window_start
  FROM public.rate_limits
  WHERE user_id = _user_id AND endpoint = _endpoint;
  
  -- Check if window has expired
  IF _now > _window_start + interval '1 second' * _window_seconds THEN
    -- Reset the window
    UPDATE public.rate_limits
    SET request_count = 1, window_start = _now
    WHERE user_id = _user_id AND endpoint = _endpoint;
    
    RETURN QUERY SELECT true, _max_requests - 1, _now + interval '1 second' * _window_seconds;
  ELSE
    -- Check if limit exceeded
    IF _current_count >= _max_requests THEN
      RETURN QUERY SELECT false, 0, _window_start + interval '1 second' * _window_seconds;
    ELSE
      -- Increment counter
      UPDATE public.rate_limits
      SET request_count = request_count + 1
      WHERE user_id = _user_id AND endpoint = _endpoint;
      
      RETURN QUERY SELECT true, _max_requests - _current_count - 1, _window_start + interval '1 second' * _window_seconds;
    END IF;
  END IF;
END;
$$;

-- Cleanup old rate limit records daily
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE window_start < now() - interval '24 hours';
END;
$$;