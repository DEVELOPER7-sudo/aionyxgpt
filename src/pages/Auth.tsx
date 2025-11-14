import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { z } from 'zod';
import MotionBackground from '@/components/MotionBackground';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const emailSchema = z.string().trim().email({ message: "Invalid email address" }).max(255);
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" });

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { user, signUp, signIn, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/chat');
    }
  }, [user, loading, navigate]);

  const validateInputs = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password);
        setIsSignUp(false);
        setPassword('');
      } else {
        await signIn(email, password);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestMode = async () => {
    try {
      setIsSubmitting(true);
      localStorage.setItem('guestMode', 'true');
      toast.success('Guest session started');
      navigate('/chat');
    } catch (error) {
      toast.error('Failed to start guest session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MotionBackground />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        {/* Gradient orbs background */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        
        <div className="w-full max-w-md relative z-20">
          {/* Logo/Brand section */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              OnyxGPT
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignUp ? 'Create your account to get started' : 'Welcome back to your AI companion'}
            </p>
          </div>

          {/* Main Card */}
          <Card className="border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
            <CardContent className="pt-6 space-y-6">
              {/* Signup/Signin toggle */}
              <div className="grid grid-cols-2 gap-2 bg-slate-800/50 p-1 rounded-lg">
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setErrors({});
                  }}
                  className={`py-2 px-3 rounded-md font-medium text-sm transition-all ${
                    !isSignUp
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setErrors({});
                  }}
                  className={`py-2 px-3 rounded-md font-medium text-sm transition-all ${
                    isSignUp
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors(prev => ({ ...prev, email: undefined }));
                      }}
                      disabled={isSubmitting}
                      className={`pl-10 border-white/10 bg-slate-800/50 focus:border-primary/50 transition-colors ${
                        errors.email ? 'border-destructive' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors(prev => ({ ...prev, password: undefined }));
                      }}
                      disabled={isSubmitting}
                      className={`pl-10 border-white/10 bg-slate-800/50 focus:border-primary/50 transition-colors ${
                        errors.password ? 'border-destructive' : ''
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-10 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-medium shadow-lg" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isSignUp ? 'Creating account...' : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900/80 px-2 text-muted-foreground font-medium">
                    Or continue as
                  </span>
                </div>
              </div>

              {/* Guest Button */}
              <Button
                variant="outline"
                className="w-full h-10 border-white/10 hover:bg-slate-800/50 font-medium"
                onClick={handleGuestMode}
                disabled={isSubmitting}
              >
                <span className="flex items-center justify-center gap-2">
                  Guest Mode
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Features hint */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs">
            <div className="space-y-1">
              <div className="text-lg">🤖</div>
              <p className="text-muted-foreground">AI Powered</p>
            </div>
            <div className="space-y-1">
              <div className="text-lg">🔒</div>
              <p className="text-muted-foreground">Secure</p>
            </div>
            <div className="space-y-1">
              <div className="text-lg">⚡</div>
              <p className="text-muted-foreground">Fast</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
