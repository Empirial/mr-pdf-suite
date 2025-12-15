import { Link, useNavigate } from "react-router-dom";
import { 
  Camera, Combine, Scissors, Minimize2, FileText, 
  Presentation, Table, FileSpreadsheet, Image, FileImage, 
  Globe, PenTool, Lock, Check, User, LucideIcon
} from "lucide-react";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

const Landing = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const tools: Tool[] = [
    { title: "Scan to PDF", description: "Capture document scans from your device and convert to PDF instantly.", icon: Camera, href: "/scan", color: "#DC2626" },
    { title: "Merge PDF", description: "Combine multiple PDFs into one document in seconds.", icon: Combine, href: "/tools", color: "#B8935C" },
    { title: "Split PDF", description: "Separate pages from your PDF into multiple files.", icon: Scissors, href: "/split", color: "#7C3AED" },
    { title: "Compress PDF", description: "Reduce PDF file size while maintaining quality.", icon: Minimize2, href: "/compress", color: "#059669" },
    { title: "PDF to Word", description: "Convert PDF files to editable Word documents.", icon: FileText, href: "/pdf-to-word", color: "#2563EB" },
    { title: "PDF to PowerPoint", description: "Transform PDFs into PowerPoint presentations.", icon: Presentation, href: "/pdf-to-powerpoint", color: "#DC2626" },
    { title: "PDF to Excel", description: "Extract data from PDFs to Excel spreadsheets.", icon: Table, href: "/pdf-to-excel", color: "#059669" },
    { title: "Word to PDF", description: "Convert Word documents to PDF format.", icon: FileText, href: "/word-to-pdf", color: "#2563EB" },
    { title: "Excel to PDF", description: "Turn Excel spreadsheets into PDF files.", icon: FileSpreadsheet, href: "/excel-to-pdf", color: "#059669" },
    { title: "PDF to JPG", description: "Convert PDF pages to JPG images.", icon: Image, href: "/pdf-to-jpg", color: "#F59E0B" },
    { title: "JPG to PDF", description: "Create PDFs from JPG images quickly.", icon: FileImage, href: "/convert", color: "#F59E0B" },
    { title: "HTML to PDF", description: "Convert web pages to PDF documents.", icon: Globe, href: "/html-to-pdf", color: "#6366F1" },
    { title: "Sign PDF", description: "Add electronic signatures to your PDFs.", icon: PenTool, href: "/sign", color: "#B8935C" },
    { title: "Protect PDF", description: "Secure your PDFs with password protection.", icon: Lock, href: "/protect", color: "#059669" },
  ];

  const features = [
    "All 15 PDF tools included",
    "Unlimited conversions",
    "No file size limits",
    "100% secure & private",
    "Works on all devices",
    "Priority support"
  ];

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-yoco-checkout", {
        body: {
          amount: 500,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: window.location.origin,
        },
      });

      if (error) throw error;

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out", description: "You have been signed out." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* 1. Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                🇿🇦 Made in South Africa
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Your Complete PDF Toolkit
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                15 powerful PDF tools in one place. Convert, merge, compress, and secure your documents with ease. 
                Fast, private, and built for professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => user ? handleSubscribe() : navigate("/auth")}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 px-8 text-lg shadow-xl"
                >
                  Get Started - $5/month
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-14 px-8 text-lg"
                >
                  Browse Tools
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required for trial • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* 2. Tools Section */}
        <section id="tools" className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                15 Essential Tools
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Everything You Need for PDFs
              </h2>
              <p className="text-lg text-muted-foreground">
                From scanning to signing, we've got all your PDF needs covered. 
                Fast, secure, and incredibly easy to use.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {tools.map((tool, index) => (
                <Link
                  key={`${tool.title}-${index}`}
                  to={tool.href}
                  className="group bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${tool.color}15` }}
                  >
                    <tool.icon className="h-6 w-6" style={{ color: tool.color }} />
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Pricing Section */}
        <section className="py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Simple Pricing
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                  One Price. All Tools.
                </h2>
                <p className="text-lg text-muted-foreground">
                  No hidden fees. No surprises. Just powerful PDF tools.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="relative rounded-3xl border-2 border-primary bg-card p-8 md:p-10 shadow-2xl">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary px-6 py-2 rounded-full text-sm font-semibold text-primary-foreground shadow-lg">
                      Best Value
                    </span>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Pro Plan</h3>
                    <div className="mb-4">
                      <span className="text-6xl font-bold text-foreground">$5</span>
                      <span className="text-xl text-muted-foreground ml-2">/month</span>
                    </div>
                    <p className="text-muted-foreground">
                      Full access to all 15 PDF tools
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {features.map(feature => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 text-lg shadow-lg"
                  >
                    {loading ? "Processing..." : user ? "Subscribe Now" : "Sign In to Subscribe"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    Secure payment • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <img src={logo} alt="MR PDF Logo" className="h-10 w-auto rounded-lg" />
                  <span className="text-xl font-bold text-foreground">MR PDF</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Professional PDF tools for modern professionals. Fast, secure, and completely private.
                  All your documents processed locally on your device.
                </p>
                <p className="text-muted-foreground font-medium">🇿🇦 Proudly South African</p>
              </div>

              {/* Tools */}
              <div>
                <h4 className="font-semibold mb-4 text-foreground">Popular Tools</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/scan" className="text-muted-foreground hover:text-foreground transition-colors">
                      Scan to PDF
                    </Link>
                  </li>
                  <li>
                    <Link to="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                      Merge PDF
                    </Link>
                  </li>
                  <li>
                    <Link to="/compress" className="text-muted-foreground hover:text-foreground transition-colors">
                      Compress PDF
                    </Link>
                  </li>
                  <li>
                    <Link to="/sign" className="text-muted-foreground hover:text-foreground transition-colors">
                      Sign PDF
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-4 text-foreground">Support</h4>
                <ul className="space-y-2">
                  <li className="text-muted-foreground">support@mrpdf.co.za</li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © 2025 MR PDF. All rights reserved. | www.mrpdf.co.za
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
