import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RotateCw, Upload, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "@/components/ThemeToggle";
import { downloadPDF } from "@/utils/pdfUtils";

const RotatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      toast({ title: "PDF uploaded", description: uploadedFile.name });
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF file", variant: "destructive" });
    }
  };

  const handleRotate = async () => {
    if (!file) {
      toast({ title: "No file", description: "Please upload a PDF first", variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      });

      const pdfBytes = await pdfDoc.save();
      downloadPDF(pdfBytes, `rotated_${file.name}`);

      toast({ title: "Success!", description: `Rotated ${pages.length} pages by ${rotation}°` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <RotateCw className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Rotate PDF</h1>
            <p className="text-muted-foreground">Rotate all pages in your PDF</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <div>
              <Label htmlFor="pdf-upload" className="block mb-2">Upload PDF</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium">
                    {file ? file.name : "Click to upload PDF"}
                  </p>
                </label>
              </div>
            </div>

            <div>
              <Label className="block mb-3">Rotation Angle</Label>
              <div className="grid grid-cols-4 gap-3">
                {[90, 180, 270, -90].map(angle => (
                  <button
                    key={angle}
                    onClick={() => setRotation(angle)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      rotation === angle
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-border hover:border-red-500/50"
                    }`}
                  >
                    <RotateCw className="h-6 w-6 mx-auto mb-2" style={{ transform: `rotate(${angle}deg)` }} />
                    <span className="text-sm font-medium">{angle}°</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleRotate}
              disabled={!file || isProcessing}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {isProcessing ? "Processing..." : "Rotate PDF"}
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RotatePdf;
