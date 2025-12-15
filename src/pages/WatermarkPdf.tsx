import { useState } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Stamp, Upload, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "@/components/ThemeToggle";
import { downloadPDF } from "@/utils/pdfUtils";

const WatermarkPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState([0.3]);
  const [fontSize, setFontSize] = useState([48]);
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

  const handleAddWatermark = async () => {
    if (!file || !watermarkText) {
      toast({ title: "Missing information", description: "Please upload a PDF and enter watermark text", variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize[0]);
        
        // Draw diagonal watermark
        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: fontSize[0],
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity[0],
          rotate: degrees(-45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      downloadPDF(pdfBytes, `watermarked_${file.name}`);

      toast({ title: "Success!", description: `Added watermark to ${pages.length} pages` });
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
            <div className="w-16 h-16 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
              <Stamp className="h-8 w-8 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Add Watermark</h1>
            <p className="text-muted-foreground">Add text watermark to your PDF pages</p>
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
              <Label htmlFor="watermark-text">Watermark Text</Label>
              <Input
                id="watermark-text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="mb-3 block">Opacity: {(opacity[0] * 100).toFixed(0)}%</Label>
              <Slider
                value={opacity}
                onValueChange={setOpacity}
                min={0.1}
                max={1}
                step={0.1}
              />
            </div>

            <div>
              <Label className="mb-3 block">Font Size: {fontSize[0]}px</Label>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                min={12}
                max={96}
                step={4}
              />
            </div>

            <Button
              onClick={handleAddWatermark}
              disabled={!file || !watermarkText || isProcessing}
              className="w-full bg-indigo-500 hover:bg-indigo-600"
            >
              {isProcessing ? "Processing..." : "Add Watermark"}
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WatermarkPdf;
