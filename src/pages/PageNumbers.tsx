import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Hash, Upload, Download } from "lucide-react";
import { downloadPDF } from "@/utils/pdfUtils";
import ToolPageLayout from "@/components/ToolPageLayout";

type Position = "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";

const PageNumbers = () => {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const positions: { value: Position; label: string }[] = [
    { value: "top-left", label: "Top Left" },
    { value: "top-center", label: "Top Center" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-center", label: "Bottom Center" },
    { value: "bottom-right", label: "Bottom Right" },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      toast({ title: "PDF uploaded", description: uploadedFile.name });
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF file", variant: "destructive" });
    }
  };

  const getCoordinates = (pos: Position, pageWidth: number, pageHeight: number, textWidth: number) => {
    const margin = 40;
    
    switch (pos) {
      case "top-left":
        return { x: margin, y: pageHeight - margin };
      case "top-center":
        return { x: pageWidth / 2 - textWidth / 2, y: pageHeight - margin };
      case "top-right":
        return { x: pageWidth - margin - textWidth, y: pageHeight - margin };
      case "bottom-left":
        return { x: margin, y: margin };
      case "bottom-center":
        return { x: pageWidth / 2 - textWidth / 2, y: margin };
      case "bottom-right":
        return { x: pageWidth - margin - textWidth, y: margin };
    }
  };

  const handleAddPageNumbers = async () => {
    if (!file) {
      toast({ title: "No file", description: "Please upload a PDF first", variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;
      const fontSize = 12;

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const text = `Page ${index + 1} of ${totalPages}`;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const coords = getCoordinates(position, width, height, textWidth);

        page.drawText(text, {
          x: coords.x,
          y: coords.y,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      });

      const pdfBytes = await pdfDoc.save();
      downloadPDF(pdfBytes, `numbered_${file.name}`);

      toast({ title: "Success!", description: `Added page numbers to ${totalPages} pages` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      title="Add Page Numbers"
      description="Add page numbers to your PDF document"
      icon={Hash}
      iconColor="#8B5CF6"
    >
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
          <Label className="block mb-3">Position</Label>
          <div className="grid grid-cols-3 gap-3">
            {positions.map(pos => (
              <button
                key={pos.value}
                onClick={() => setPosition(pos.value)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  position === pos.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleAddPageNumbers}
          disabled={!file || isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isProcessing ? "Processing..." : "Add Page Numbers"}
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </ToolPageLayout>
  );
};

export default PageNumbers;
