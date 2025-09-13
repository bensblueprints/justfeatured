import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Newspaper } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account Already Exists",
            description: "This email is already registered. Try logging in instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Check Your Email",
          description: "We've sent you a confirmation link. Please check your email to complete registration.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "An Error Occurred",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Invalid Credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and click the confirmation link before signing in.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Welcome Back!",
          description: "You have successfully signed in.",
          variant: "default"
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "An Error Occurred",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "An Error Occurred",
        description: "Something went wrong with Google sign in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent)]"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-white/80 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] relative">
          {/* Subtle glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/10 rounded-lg blur opacity-30"></div>
          
          <div className="relative bg-white rounded-lg">
            <CardHeader className="text-center pb-8 pt-10">
              <div className="flex justify-center mx-auto mb-6">
                <img 
                  src="/lovable-uploads/48bef6ef-a90c-4a5c-84a3-116d85580bea.png"
                  alt="Just Featured"
                  className="h-12"
                />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Join JustFeatured'}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                {isLogin 
                  ? 'Access your press release dashboard' 
                  : 'Start creating newsworthy press releases'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-10 pb-10">
              <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-11 h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full mt-6 h-12 border-2 border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {isLoading ? 'Connecting...' : `Continue with Google`}
                  </div>
                </Button>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setEmail('');
                      setPassword('');
                      setConfirmPassword('');
                    }}
                    className="border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
                  >
                    {isLogin ? 'Create New Account' : 'Sign In Instead'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            Trusted by companies worldwide for professional press releases
          </p>
          <div className="flex justify-center mt-4 space-x-6 text-white/50">
            <div className="flex items-center text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Secure & Encrypted
            </div>
            <div className="flex items-center text-xs">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Professional Service
            </div>
            <div className="flex items-center text-xs">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Expert Writers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;