import { Link } from "react-router-dom";
import { Combine, Camera, PenTool, FileImage, Check, LucideIcon } from "lucide-react";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

const Landing = () => {
  const tools: Tool[] = [
    { 
      title: "Merge PDF", 
      description: "Combine multiple PDF files into one document. Drag and drop to reorder pages easily.", 
      icon: Combine, 
      href: "/tools", 
      color: "#B8935C" 
    },
    { 
      title: "Scan to PDF", 
      description: "Use your camera to capture documents and convert them instantly to PDF format.", 
      icon: Camera, 
      href: "/scan", 
      color: "#DC2626" 
    },
    { 
      title: "Sign PDF", 
      description: "Add your digital signature to any PDF document. Draw or type your signature.", 
      icon: PenTool, 
      href: "/sign", 
      color: "#7C3AED" 
    },
    { 
      title: "Convert to PDF", 
      description: "Convert images (JPG, PNG) and text files to PDF format with a single click.", 
      icon: FileImage, 
      href: "/convert", 
      color: "#059669" 
    },
  ];

  const features = [
    "100% Private - No uploads to servers", 
    "Lightning fast processing", 
    "No file size limits", 
    "Unlimited conversions", 
    "Works on all devices", 
    "All Features included"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="MR PDF Logo" className="h-12 w-auto rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-[#2C2C2C]">MR PDF</h1>
                <p className="text-xs text-gray-600">Professional PDF Suite</p>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {/* Tools Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-3xl md:text-5xl font-bold text-[#2C2C2C] mb-6">
                Every tool you need to work with PDFs in one place
              </h1>
              <p className="text-lg text-gray-600">
                Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! 
                Merge, scan, sign, and convert PDFs with just a few clicks.
              </p>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {tools.map((tool) => (
                <Link
                  key={tool.title}
                  to={tool.href}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-2"
                >
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${tool.color}15` }}
                  >
                    <tool.icon className="h-8 w-8" style={{ color: tool.color }} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#2C2C2C] mb-3 group-hover:text-[#B8935C] transition-colors">
                    {tool.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {tool.description}
                  </p>

                  <div 
                    className="mt-6 inline-flex items-center text-sm font-medium transition-colors"
                    style={{ color: tool.color }}
                  >
                    Use Tool →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#B8935C]/10 text-[#B8935C] text-sm font-medium mb-4">
                  Simple Pricing
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4">
                  One Price. Everything Included.
                </h2>
                <p className="text-lg text-gray-600">
                  No hidden fees. Cancel anytime.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="relative rounded-3xl border-2 border-[#B8935C] bg-white p-8 shadow-2xl">
                  {/* Popular Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#B8935C] px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-[#2C2C2C] mb-4">Pro Plan</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-[#2C2C2C]">$3</span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                    <p className="text-gray-600">
                      Everything you need for professional PDF work
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {features.map(feature => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-[#B8935C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-[#B8935C]" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-[#B8935C] hover:bg-[#A07D4A] text-white font-semibold h-12 text-lg shadow-lg">
                    Start Free Trial
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">3 Days Trial - Unlimited Access</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <img src={logo} alt="MR PDF Logo" className="h-10 w-auto rounded-lg" />
                  <span className="text-xl font-bold">MR PDF</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Professional PDF tools for South African businesses. Fast, secure, and completely private.
                </p>
                <p className="text-gray-400">🇿🇦 Made in South Africa</p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4 text-[#B8935C]">Tools</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/tools" className="text-gray-400 hover:text-white transition-colors">
                      Merge PDFs
                    </Link>
                  </li>
                  <li>
                    <Link to="/scan" className="text-gray-400 hover:text-white transition-colors">
                      Scanner
                    </Link>
                  </li>
                  <li>
                    <Link to="/sign" className="text-gray-400 hover:text-white transition-colors">
                      Sign PDF
                    </Link>
                  </li>
                  <li>
                    <Link to="/convert" className="text-gray-400 hover:text-white transition-colors">
                      Convert
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4 text-[#B8935C]">Contact</h4>
                <p className="text-gray-400">support@mrpdf.co.za</p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 MR PDF. All rights reserved. | www.mrpdf.co.za
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors">
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