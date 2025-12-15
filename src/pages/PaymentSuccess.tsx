import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "@/components/ThemeToggle";

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Give a moment for webhook to process
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="MR PDF Logo" className="h-12 w-auto rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-foreground">MR PDF</h1>
                <p className="text-xs text-muted-foreground">Professional PDF Suite</p>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center py-24 px-4">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Thank you for subscribing to MR PDF Pro! Your subscription is now active 
            and you have access to all premium features.
          </p>

          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-4">What's included:</h3>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>✓ Unlimited PDF conversions</li>
              <li>✓ No file size limits</li>
              <li>✓ Priority processing</li>
              <li>✓ All premium tools</li>
              <li>✓ 30 days of access</li>
            </ul>
          </div>

          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90">
              Start Using MR PDF Pro
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
