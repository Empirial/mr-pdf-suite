import { Link } from "react-router-dom";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/mr-pdf-logo.jpg";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
}

const ToolPageLayout = ({
  title,
  description,
  icon: Icon,
  iconColor = "hsl(var(--primary))",
  children,
}: ToolPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${iconColor}15` }}
                >
                  <Icon className="h-5 w-5" style={{ color: iconColor }} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{title}</h1>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
            <Link to="/" className="hidden sm:flex items-center gap-2">
              <img src={logo} alt="MR PDF Logo" className="h-8 w-auto rounded-lg" />
              <span className="font-semibold text-foreground">MR PDF</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 MR PDF. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ToolPageLayout;
