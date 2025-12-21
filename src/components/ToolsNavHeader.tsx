import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";
import { useSubscription } from "@/hooks/useSubscription";
import logo from "@/assets/mr-pdf-logo.jpg";
import { 
  Menu, User, LogOut, Crown, ChevronDown, CreditCard,
  Camera, Combine, Scissors, Minimize2, FileText, 
  Presentation, Table, FileSpreadsheet, Image, FileImage, 
  Globe, PenTool, Lock, RotateCw, Hash, Droplets, ScanLine, 
  FileCheck, LucideIcon, EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface ToolCategory {
  name: string;
  tools: { title: string; href: string; icon: LucideIcon; color: string }[];
}

const toolCategories: ToolCategory[] = [
  {
    name: "Create",
    tools: [
      { title: "Scan to PDF", href: "/scan", icon: Camera, color: "#DC2626" },
      { title: "JPG to PDF", href: "/convert", icon: FileImage, color: "#F59E0B" },
      { title: "HTML to PDF", href: "/html-to-pdf", icon: Globe, color: "#6366F1" },
    ],
  },
  {
    name: "Organize",
    tools: [
      { title: "Merge PDF", href: "/tools", icon: Combine, color: "#B8935C" },
      { title: "Split PDF", href: "/split", icon: Scissors, color: "#7C3AED" },
      { title: "Rotate PDF", href: "/rotate", icon: RotateCw, color: "#0EA5E9" },
      { title: "Crop PDF", href: "/crop", icon: ScanLine, color: "#10B981" },
    ],
  },
  {
    name: "Convert",
    tools: [
      { title: "PDF to Word", href: "/pdf-to-word", icon: FileText, color: "#2563EB" },
      { title: "PDF to Excel", href: "/pdf-to-excel", icon: Table, color: "#059669" },
      { title: "PDF to PowerPoint", href: "/pdf-to-powerpoint", icon: Presentation, color: "#DC2626" },
      { title: "PDF to JPG", href: "/pdf-to-jpg", icon: Image, color: "#F59E0B" },
      { title: "PDF to PDF/A", href: "/pdf-to-pdfa", icon: FileCheck, color: "#8B5CF6" },
    ],
  },
  {
    name: "To PDF",
    tools: [
      { title: "Word to PDF", href: "/word-to-pdf", icon: FileText, color: "#2563EB" },
      { title: "Excel to PDF", href: "/excel-to-pdf", icon: FileSpreadsheet, color: "#059669" },
      { title: "PowerPoint to PDF", href: "/powerpoint-to-pdf", icon: Presentation, color: "#DC2626" },
    ],
  },
  {
    name: "Optimize",
    tools: [
      { title: "Compress PDF", href: "/compress", icon: Minimize2, color: "#059669" },
      { title: "OCR PDF", href: "/ocr", icon: ScanLine, color: "#6366F1" },
    ],
  },
  {
    name: "Edit & Secure",
    tools: [
      { title: "Sign PDF", href: "/sign", icon: PenTool, color: "#B8935C" },
      { title: "Protect PDF", href: "/protect", icon: Lock, color: "#059669" },
      { title: "Watermark PDF", href: "/watermark", icon: Droplets, color: "#0EA5E9" },
      { title: "Page Numbers", href: "/page-numbers", icon: Hash, color: "#8B5CF6" },
      { title: "Redact PDF", href: "/redact", icon: EyeOff, color: "#EF4444" },
    ],
  },
];

const ToolsNavHeader = () => {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isSubscribed, isTrialActive, trialDaysRemaining } = useSubscription(user?.id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="MR PDF Logo" className="h-9 w-auto rounded-lg" />
            <span className="font-semibold text-foreground hidden sm:block">MR PDF</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {toolCategories.map((category) => (
              <DropdownMenu key={category.name}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-sm">
                    {category.name}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {category.tools.map((tool) => (
                    <DropdownMenuItem key={tool.href} asChild>
                      <Link to={tool.href} className="flex items-center gap-3 cursor-pointer">
                        <div 
                          className="h-7 w-7 rounded flex items-center justify-center"
                          style={{ backgroundColor: `${tool.color}15` }}
                        >
                          <tool.icon className="h-4 w-4" style={{ color: tool.color }} />
                        </div>
                        {tool.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Subscription badge */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Crown className="h-3.5 w-3.5" />
                {isSubscribed ? "Pro" : isTrialActive ? `Trial (${trialDaysRemaining}d)` : "Free"}
              </div>
            )}

            <ThemeToggle />

            {/* User menu / Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline max-w-[100px] truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {isSubscribed ? "Pro Plan" : isTrialActive ? "Trial Active" : "No Subscription"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/subscribe" className="cursor-pointer">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                  <img src={logo} alt="MR PDF" className="h-8 w-8 rounded-lg" />
                  <span className="font-semibold">MR PDF</span>
                </div>

                <nav className="space-y-6">
                  {toolCategories.map((category) => (
                    <div key={category.name}>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-2">{category.name}</h3>
                      <div className="space-y-1">
                        {category.tools.map((tool) => (
                          <Link
                            key={tool.href}
                            to={tool.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div 
                              className="h-7 w-7 rounded flex items-center justify-center"
                              style={{ backgroundColor: `${tool.color}15` }}
                            >
                              <tool.icon className="h-4 w-4" style={{ color: tool.color }} />
                            </div>
                            <span className="text-sm">{tool.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>

                {user && (
                  <div className="mt-6 pt-6 border-t">
                    <Link to="/subscribe" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2 mb-2">
                        <CreditCard className="h-4 w-4" />
                        Manage Subscription
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2 text-destructive"
                      onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ToolsNavHeader;
