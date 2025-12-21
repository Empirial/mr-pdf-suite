import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import ToolsNavHeader from "@/components/ToolsNavHeader";
import SubscriptionGuard from "@/components/SubscriptionGuard";

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
    <SubscriptionGuard>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Global Nav Header */}
        <ToolsNavHeader />

        {/* Tool Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${iconColor}15` }}
              >
                <Icon className="h-6 w-6" style={{ color: iconColor }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        </div>

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
    </SubscriptionGuard>
  );
};

export default ToolPageLayout;
