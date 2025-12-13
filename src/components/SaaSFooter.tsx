import { Link } from "react-router-dom";
import logo from "@/assets/mr-pdf-logo.jpg";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "PDF Merger", href: "/tools" },
    { label: "PDF Scanner", href: "/scan" },
    { label: "Sign PDF", href: "/sign" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "POPIA Compliance", href: "#" },
  ],
};

const SaaSFooter = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src={logo} 
                alt="MR PDF Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-display text-foreground">MR PDF</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Professional PDF tools for South African businesses. Fast, secure, and completely private.
            </p>
            <p className="text-sm text-muted-foreground">
              🇿🇦 Made in South Africa
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 MR PDF. All rights reserved. | www.mrpdf.co.za
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">Secure payments via</span>
            <span className="text-sm font-medium text-foreground">Yoco</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SaaSFooter;