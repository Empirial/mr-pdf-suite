import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Combine, Camera, PenTool, FileImage } from "lucide-react";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Merge", icon: Combine },
  { href: "/scan", label: "Scanner", icon: Camera },
  { href: "/sign", label: "Sign", icon: PenTool },
  { href: "/convert", label: "Convert", icon: FileImage },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="MR PDF Logo" 
              className="h-10 md:h-12 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-foreground">
                MR PDF Suite
              </h1>
              <p className="text-xs text-muted-foreground">
                Fast. Private. Professional.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  size="sm"
                  className={`gap-2 ${isActive(link.href) ? "bg-primary/10 text-primary" : ""}`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive(link.href) ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 ${isActive(link.href) ? "bg-primary/10 text-primary" : ""}`}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
