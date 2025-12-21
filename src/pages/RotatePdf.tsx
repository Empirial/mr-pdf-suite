import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RotateCw, Upload, Download } from "lucide-react";
import { downloadPDF } from "@/utils/pdfUtils";
import ToolPageLayout from "@/components/ToolPageLayout";

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
    <ToolPageLayout
      title="Rotate PDF"
      description="Rotate all pages in your PDF"
      icon={RotateCw}
      iconColor="#DC2626"
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
          <Label className="block mb-3">Rotation Angle</Label>
          <div className="grid grid-cols-4 gap-3">
            {[90, 180, 270, -90].map(angle => (
              <button
                key={angle}
                onClick={() => setRotation(angle)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  rotation === angle
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
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
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isProcessing ? "Processing..." : "Rotate PDF"}
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </ToolPageLayout>
  );
};

export default RotatePdf;
