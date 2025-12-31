import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/mr-pdf-logo.jpg";
import { 
  Camera, Combine, Scissors, Minimize2, FileText, 
  Presentation, Table, FileSpreadsheet, Image, FileImage, 
  Globe, PenTool, Lock, LogOut, User, Crown, RotateCw,
  Hash, Droplets, ScanLine, FileCheck, LucideIcon, ChevronRight
} from "lucide-react";

interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  category: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const tools: Tool[] = [
    // Scan & Create
    { title: "Scan to PDF", description: "Capture documents with your camera", icon: Camera, href: "/scan", color: "#DC2626", category: "Create" },
    { title: "JPG to PDF", description: "Convert images to PDF", icon: FileImage, href: "/convert", color: "#F59E0B", category: "Create" },
    { title: "HTML to PDF", description: "Convert web pages to PDF", icon: Globe, href: "/html-to-pdf", color: "#6366F1", category: "Create" },
    
    // Organize
    { title: "Merge PDF", description: "Combine multiple PDFs", icon: Combine, href: "/tools", color: "#B8935C", category: "Organize" },
    { title: "Split PDF", description: "Separate PDF pages", icon: Scissors, href: "/split", color: "#7C3AED", category: "Organize" },
    { title: "Rotate PDF", description: "Rotate PDF pages", icon: RotateCw, href: "/rotate", color: "#0EA5E9", category: "Organize" },
    { title: "Crop PDF", description: "Crop PDF pages", icon: ScanLine, href: "/crop", color: "#10B981", category: "Organize" },
    
    // Convert from PDF
    { title: "PDF to Word", description: "Convert to Word document", icon: FileText, href: "/pdf-to-word", color: "#2563EB", category: "Convert" },
    { title: "PDF to Excel", description: "Extract to spreadsheet", icon: Table, href: "/pdf-to-excel", color: "#059669", category: "Convert" },
    { title: "PDF to PowerPoint", description: "Convert to presentation", icon: Presentation, href: "/pdf-to-powerpoint", color: "#DC2626", category: "Convert" },
    { title: "PDF to JPG", description: "Convert pages to images", icon: Image, href: "/pdf-to-jpg", color: "#F59E0B", category: "Convert" },
    { title: "PDF to PDF/A", description: "Archive-ready format", icon: FileCheck, href: "/pdf-to-pdfa", color: "#8B5CF6", category: "Convert" },
    { title: "JPG to WebP", description: "Convert JPG to WebP", icon: Image, href: "/jpg-to-webp", color: "#10B981", category: "Convert" },
    
    // Convert to PDF
    { title: "Word to PDF", description: "Convert Word to PDF", icon: FileText, href: "/word-to-pdf", color: "#2563EB", category: "To PDF" },
    { title: "Excel to PDF", description: "Convert Excel to PDF", icon: FileSpreadsheet, href: "/excel-to-pdf", color: "#059669", category: "To PDF" },
    { title: "PowerPoint to PDF", description: "Convert PPT to PDF", icon: Presentation, href: "/powerpoint-to-pdf", color: "#DC2626", category: "To PDF" },
    
    // Optimize & Edit
    { title: "Compress PDF", description: "Reduce file size", icon: Minimize2, href: "/compress", color: "#059669", category: "Optimize" },
    { title: "OCR PDF", description: "Make PDFs searchable", icon: ScanLine, href: "/ocr", color: "#6366F1", category: "Optimize" },
    { title: "Watermark PDF", description: "Add watermarks", icon: Droplets, href: "/watermark", color: "#0EA5E9", category: "Edit" },
    { title: "Page Numbers", description: "Add page numbers", icon: Hash, href: "/page-numbers", color: "#8B5CF6", category: "Edit" },
    { title: "Redact PDF", description: "Hide sensitive info", icon: Lock, href: "/redact", color: "#EF4444", category: "Edit" },
    
    // Secure & Sign
    { title: "Sign PDF", description: "Add electronic signatures", icon: PenTool, href: "/sign", color: "#B8935C", category: "Secure" },
    { title: "Protect PDF", description: "Password protection", icon: Lock, href: "/protect", color: "#059669", category: "Secure" },
  ];

  const categories = [...new Set(tools.map(t => t.category))];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out", description: "You have been signed out successfully." });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="MR PDF Logo" className="h-10 w-auto rounded-lg" />
              <div>
                <h1 className="text-lg font-bold text-foreground">MR PDF</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                <Crown className="h-4 w-4" />
                <span className="font-medium">Pro</span>
              </div>
              
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[150px] truncate">{user?.email}</span>
              </div>
              
              <ThemeToggle />
              
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}!
              </h1>
              <p className="text-muted-foreground text-sm">Choose a tool to get started</p>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        <div className="space-y-10">
          {categories.map(category => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-foreground">{category}</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tools
                  .filter(tool => tool.category === category)
                  .map((tool, index) => (
                    <Link
                      key={`${tool.title}-${index}`}
                      to={tool.href}
                      className="group relative bg-card border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: `${tool.color}15` }}
                        >
                          <tool.icon className="h-5 w-5" style={{ color: tool.color }} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {tool.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {tool.description}
                          </p>
                        </div>
                        
                        <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 MR PDF. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <a href="mailto:support@mrpdf.co.za" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
