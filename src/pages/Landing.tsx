import { Link } from "react-router-dom";
import { 
  Combine, Camera, PenTool, FileImage, Check, 
  FileText, Scissors, Minimize2, FileType, 
  Presentation, Table, FileSpreadsheet, Image, 
  Edit, RotateCw, Stamp, Lock, Unlock, 
  SortAsc, FileCheck, Wrench, Globe,
  Hash, ScanLine, Search, GitCompare, 
  EyeOff, Crop, Workflow, LucideIcon
} from "lucide-react";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  category: string;
  isNew?: boolean;
}

const Landing = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const filters = ["All", "Workflows", "Organize PDF", "Optimize PDF", "Convert PDF", "Edit PDF", "PDF Security"];
  
  const tools: Tool[] = [
    // Organize PDF
    { title: "Merge PDF", description: "Combine PDFs in the order you want with the easiest PDF merger available.", icon: Combine, href: "/tools", color: "#B8935C", category: "Organize PDF" },
    { title: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files.", icon: Scissors, href: "/tools", color: "#7C3AED", category: "Organize PDF" },
    { title: "Organize PDF", description: "Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.", icon: SortAsc, href: "/tools", color: "#059669", category: "Organize PDF" },
    { title: "Rotate PDF", description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!", icon: RotateCw, href: "/tools", color: "#DC2626", category: "Organize PDF" },
    
    // Optimize PDF
    { title: "Compress PDF", description: "Reduce file size while optimizing for maximal PDF quality.", icon: Minimize2, href: "/tools", color: "#059669", category: "Optimize PDF" },
    { title: "Repair PDF", description: "Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.", icon: Wrench, href: "/tools", color: "#7C3AED", category: "Optimize PDF" },
    { title: "OCR PDF", description: "Easily convert scanned PDF into searchable and selectable documents.", icon: Search, href: "/tools", color: "#2563EB", category: "Optimize PDF" },
    
    // Convert PDF
    { title: "PDF to Word", description: "Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.", icon: FileType, href: "/convert", color: "#2563EB", category: "Convert PDF" },
    { title: "PDF to PowerPoint", description: "Turn your PDF files into easy to edit PPT and PPTX slideshows.", icon: Presentation, href: "/convert", color: "#DC2626", category: "Convert PDF" },
    { title: "PDF to Excel", description: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.", icon: Table, href: "/convert", color: "#059669", category: "Convert PDF" },
    { title: "Word to PDF", description: "Make DOC and DOCX files easy to read by converting them to PDF.", icon: FileText, href: "/convert", color: "#2563EB", category: "Convert PDF" },
    { title: "PowerPoint to PDF", description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.", icon: Presentation, href: "/convert", color: "#DC2626", category: "Convert PDF" },
    { title: "Excel to PDF", description: "Make EXCEL spreadsheets easy to read by converting them to PDF.", icon: FileSpreadsheet, href: "/convert", color: "#059669", category: "Convert PDF" },
    { title: "PDF to JPG", description: "Convert each PDF page into a JPG or extract all images contained in a PDF.", icon: Image, href: "/convert", color: "#F59E0B", category: "Convert PDF" },
    { title: "JPG to PDF", description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.", icon: FileImage, href: "/convert", color: "#F59E0B", category: "Convert PDF" },
    { title: "HTML to PDF", description: "Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.", icon: Globe, href: "/convert", color: "#6366F1", category: "Convert PDF" },
    
    // Edit PDF
    { title: "Edit PDF", description: "Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.", icon: Edit, href: "/tools", color: "#7C3AED", category: "Edit PDF", isNew: true },
    { title: "Sign PDF", description: "Sign yourself or request electronic signatures from others.", icon: PenTool, href: "/sign", color: "#B8935C", category: "Edit PDF" },
    { title: "Watermark", description: "Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.", icon: Stamp, href: "/tools", color: "#6366F1", category: "Edit PDF" },
    { title: "Page Numbers", description: "Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.", icon: Hash, href: "/tools", color: "#8B5CF6", category: "Edit PDF" },
    { title: "Scan to PDF", description: "Capture document scans from your mobile device and send them instantly to your browser.", icon: ScanLine, href: "/scan", color: "#DC2626", category: "Edit PDF" },
    { title: "Redact PDF", description: "Redact text and graphics to permanently remove sensitive information from a PDF.", icon: EyeOff, href: "/tools", color: "#DC2626", category: "Edit PDF", isNew: true },
    { title: "Crop PDF", description: "Crop margins of PDF documents or select specific areas, then apply the changes to one page or the whole document.", icon: Crop, href: "/tools", color: "#F59E0B", category: "Edit PDF", isNew: true },
    
    // PDF Security
    { title: "Unlock PDF", description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.", icon: Unlock, href: "/tools", color: "#F59E0B", category: "PDF Security" },
    { title: "Protect PDF", description: "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.", icon: Lock, href: "/tools", color: "#059669", category: "PDF Security" },
    { title: "PDF to PDF/A", description: "Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving. Your PDF will preserve formatting when accessed in the future.", icon: FileCheck, href: "/tools", color: "#6366F1", category: "PDF Security" },
    { title: "Compare PDF", description: "Show a side-by-side document comparison and easily spot changes between different file versions.", icon: GitCompare, href: "/tools", color: "#8B5CF6", category: "PDF Security", isNew: true },

    // Workflows
    { title: "Create Workflow", description: "Create custom workflows with your favorite tools, automate tasks, and reuse them anytime.", icon: Workflow, href: "/tools", color: "#B8935C", category: "Workflows" },
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
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-bold text-[#2C2C2C] mb-6">
                Every tool you need to work with PDFs in one place
              </h1>
              <p className="text-lg text-gray-600">
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
                      ? "bg-[#2C2C2C] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
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
                  to={tool.href}
                  className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1"
                >
                  {tool.isNew && (
                    <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      New!
                    </span>
                  )}
                  
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${tool.color}15` }}
                  >
                    <tool.icon className="h-6 w-6" style={{ color: tool.color }} />
                  </div>
                  
                  <h3 className="font-semibold text-[#2C2C2C] mb-2 group-hover:text-[#B8935C] transition-colors">
                    {tool.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {tool.description}
                  </p>
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