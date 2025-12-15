import { Link, useNavigate } from "react-router-dom";
import { 
  Combine, Camera, PenTool, FileImage, Check, 
  FileText, Scissors, Minimize2, FileType, 
  Presentation, Table, FileSpreadsheet, Image, 
  Edit, RotateCw, Stamp, Lock, Unlock, 
  SortAsc, FileCheck, Wrench, Globe,
  Hash, ScanLine, Search, GitCompare, 
  EyeOff, Crop, Workflow, LucideIcon, Clock, User
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
  category: string;
  isNew?: boolean;
  comingSoon?: boolean;
}

const Landing = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const filters = ["All", "Workflows", "Organize PDF", "Optimize PDF", "Convert PDF", "Edit PDF", "PDF Security"];

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
    // Organize PDF - Functional
    { title: "Merge PDF", description: "Combine PDFs in the order you want with the easiest PDF merger available.", icon: Combine, href: "/tools", color: "#B8935C", category: "Organize PDF" },
    { title: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: Scissors, href: "/split", color: "#7C3AED", category: "Organize PDF" },
    { title: "Organize PDF", description: "Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages.", icon: SortAsc, href: "/tools", color: "#059669", category: "Organize PDF" },
    { title: "Rotate PDF", description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!", icon: RotateCw, href: "/rotate", color: "#DC2626", category: "Organize PDF" },
    
    // Optimize PDF
    { title: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: Minimize2, href: "/compress", color: "#059669", category: "Optimize PDF" },
    { title: "Repair PDF", description: "Repair a damaged PDF and recover data from corrupt PDF.", icon: Wrench, href: "#", color: "#7C3AED", category: "Optimize PDF", comingSoon: true },
    { title: "OCR PDF", description: "Easily convert scanned PDF into searchable and selectable documents.", icon: Search, href: "#", color: "#2563EB", category: "Optimize PDF", comingSoon: true },
    
    // Convert PDF - Coming Soon (requires server-side)
    { title: "PDF to Word", description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.", icon: FileType, href: "#", color: "#2563EB", category: "Convert PDF", comingSoon: true },
    { title: "PDF to PowerPoint", description: "Turn your PDF files into easy to edit PPT and PPTX slideshows.", icon: Presentation, href: "#", color: "#DC2626", category: "Convert PDF", comingSoon: true },
    { title: "PDF to Excel", description: "Pull data straight from PDFs into Excel spreadsheets.", icon: Table, href: "#", color: "#059669", category: "Convert PDF", comingSoon: true },
    { title: "Word to PDF", description: "Make DOC and DOCX files easy to read by converting them to PDF.", icon: FileText, href: "#", color: "#2563EB", category: "Convert PDF", comingSoon: true },
    { title: "PowerPoint to PDF", description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.", icon: Presentation, href: "#", color: "#DC2626", category: "Convert PDF", comingSoon: true },
    { title: "Excel to PDF", description: "Make EXCEL spreadsheets easy to read by converting them to PDF.", icon: FileSpreadsheet, href: "#", color: "#059669", category: "Convert PDF", comingSoon: true },
    { title: "PDF to JPG", description: "Convert each PDF page into a JPG or extract all images contained in a PDF.", icon: Image, href: "#", color: "#F59E0B", category: "Convert PDF", comingSoon: true },
    { title: "JPG to PDF", description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.", icon: FileImage, href: "/convert", color: "#F59E0B", category: "Convert PDF" },
    { title: "HTML to PDF", description: "Convert webpages in HTML to PDF.", icon: Globe, href: "#", color: "#6366F1", category: "Convert PDF", comingSoon: true },
    
    // Edit PDF
    { title: "Edit PDF", description: "Add text, images, shapes or freehand annotations to a PDF document.", icon: Edit, href: "#", color: "#7C3AED", category: "Edit PDF", comingSoon: true },
    { title: "Sign PDF", description: "Sign yourself or request electronic signatures from others.", icon: PenTool, href: "/sign", color: "#B8935C", category: "Edit PDF" },
    { title: "Watermark", description: "Stamp an image or text over your PDF in seconds.", icon: Stamp, href: "/watermark", color: "#6366F1", category: "Edit PDF" },
    { title: "Page Numbers", description: "Add page numbers into PDFs with ease.", icon: Hash, href: "/page-numbers", color: "#8B5CF6", category: "Edit PDF" },
    { title: "Scan to PDF", description: "Capture document scans from your mobile device and send them instantly.", icon: ScanLine, href: "/scan", color: "#DC2626", category: "Edit PDF" },
    { title: "Redact PDF", description: "Redact text and graphics to permanently remove sensitive information.", icon: EyeOff, href: "#", color: "#DC2626", category: "Edit PDF", comingSoon: true },
    { title: "Crop PDF", description: "Crop margins of PDF documents or select specific areas.", icon: Crop, href: "#", color: "#F59E0B", category: "Edit PDF", comingSoon: true },
    
    // PDF Security
    { title: "Unlock PDF", description: "Remove PDF password security, giving you the freedom to use your PDFs.", icon: Unlock, href: "#", color: "#F59E0B", category: "PDF Security", comingSoon: true },
    { title: "Protect PDF", description: "Protect PDF files with a password.", icon: Lock, href: "/protect", color: "#059669", category: "PDF Security" },
    { title: "PDF to PDF/A", description: "Transform your PDF to PDF/A for long-term archiving.", icon: FileCheck, href: "#", color: "#6366F1", category: "PDF Security", comingSoon: true },
    { title: "Compare PDF", description: "Show a side-by-side document comparison.", icon: GitCompare, href: "#", color: "#8B5CF6", category: "PDF Security", comingSoon: true },

    // Workflows
    { title: "Create Workflow", description: "Create custom workflows with your favorite tools.", icon: Workflow, href: "#", color: "#B8935C", category: "Workflows", comingSoon: true },
  ];

  const filteredTools = activeFilter === "All" 
    ? tools 
    : tools.filter(tool => tool.category === activeFilter);

  const features = [
    "100% Private - No uploads to servers", 
    "Lightning fast processing", 
    "No file size limits", 
    "Unlimited conversions", 
    "Works on all devices", 
    "All Features included"
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
          amount: 300,
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
        {/* Tools Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Every tool you need to work with PDFs in one place
              </h1>
              <p className="text-lg text-muted-foreground">
                Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! 
                Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredTools.map((tool, index) => (
                <Link
                  key={`${tool.title}-${index}`}
                  to={tool.comingSoon ? "#" : tool.href}
                  onClick={(e) => tool.comingSoon && e.preventDefault()}
                  className={`group relative bg-card border border-border rounded-xl p-6 transition-all duration-300 ${
                    tool.comingSoon 
                      ? "opacity-70 cursor-not-allowed" 
                      : "hover:shadow-xl hover:border-primary/30 hover:-translate-y-1"
                  }`}
                >
                  {tool.comingSoon && (
                    <span className="absolute top-4 right-4 bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Soon
                    </span>
                  )}
                  {tool.isNew && !tool.comingSoon && (
                    <span className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                      New!
                    </span>
                  )}
                  
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

        {/* Pricing Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Simple Pricing
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  One Price. Everything Included.
                </h2>
                <p className="text-lg text-muted-foreground">
                  No hidden fees. Cancel anytime.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="relative rounded-3xl border-2 border-primary bg-card p-8 shadow-2xl">
                  {/* Popular Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary px-4 py-1.5 rounded-full text-sm font-semibold text-primary-foreground shadow-lg">
                      Most Popular
                    </span>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Pro Plan</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-foreground">R3</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </div>
                    <p className="text-muted-foreground">
                      Everything you need for professional PDF work
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
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 text-lg shadow-lg"
                  >
                    {loading ? "Processing..." : user ? "Subscribe Now" : "Sign In to Subscribe"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">Secure payment via Yoco</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
                  Professional PDF tools for South African businesses. Fast, secure, and completely private.
                </p>
                <p className="text-muted-foreground">🇿🇦 Made in South Africa</p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4 text-primary">Tools</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                      Merge PDFs
                    </Link>
                  </li>
                  <li>
                    <Link to="/scan" className="text-muted-foreground hover:text-foreground transition-colors">
                      Scanner
                    </Link>
                  </li>
                  <li>
                    <Link to="/sign" className="text-muted-foreground hover:text-foreground transition-colors">
                      Sign PDF
                    </Link>
                  </li>
                  <li>
                    <Link to="/convert" className="text-muted-foreground hover:text-foreground transition-colors">
                      Convert
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4 text-primary">Contact</h4>
                <p className="text-muted-foreground">support@mrpdf.co.za</p>
              </div>
            </div>

            <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © 2025 MR PDF. All rights reserved. | www.mrpdf.co.za
              </p>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  POPIA Compliance
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
