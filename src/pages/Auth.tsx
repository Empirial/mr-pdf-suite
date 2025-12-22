import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/mr-pdf-logo.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // After signup, redirect to subscribe page to start trial
        if (event === "SIGNED_IN") {
          navigate("/subscribe");
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/subscribe");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password. Please try again.");
          }
          throw error;
        }
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        const redirectUrl = `${window.location.origin}/subscribe`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });
        
        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("This email is already registered. Please log in instead.");
          }
          throw error;
        }
        
        toast({
          title: "Account created!",
          description: "Start your 3-day free trial by entering your card details.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(38_65%_50%_/_0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(40_70%_55%_/_0.1),_transparent_50%)]" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="max-w-md text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-gold rounded-full opacity-20 blur-xl" />
                <img 
                  src={logo} 
                  alt="MR PDF" 
                  className="relative h-24 w-24 rounded-2xl shadow-2xl"
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              MR <span className="text-gradient-gold">PDF</span>
            </h1>
            
            <p className="text-lg text-white/70 mb-8">
              Your complete professional PDF toolkit. Convert, merge, compress, and secure your documents with ease.
            </p>

            {/* Trial highlight */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 border border-white/20">
              <p className="text-white font-semibold text-lg mb-1">🎉 3-Day Free Trial</p>
              <p className="text-white/70 text-sm">
                Full access to all tools. No charge until trial ends.
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="space-y-4 text-left">
              {[
                "15 powerful PDF tools in one place",
                "100% secure & private processing",
                "Works on all devices"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gradient-gold" />
                  <span className="text-white/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-white/50 text-sm">🇿🇦 Proudly South African</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="MR PDF" className="h-12 w-12 rounded-xl" />
              <span className="text-2xl font-bold text-foreground">MR PDF</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome back" : "Start your free trial"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? "Enter your credentials to access your dashboard"
                : "Get 3 days free access to all PDF tools"}
            </p>
            
            {/* Trial badge for signup */}
            {!isLogin && (
              <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <span className="text-lg">🎉</span>
                3-Day Free Trial — No charge until trial ends
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-12 h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold rounded-xl shadow-gold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Please wait...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {isLogin ? "Sign In" : "Start Free Trial"}
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                {isLogin ? "Start free trial" : "Sign in"}
              </button>
            </p>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
