import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Minimize2, Upload, Download } from "lucide-react";
import { downloadPDF } from "@/utils/pdfUtils";
import ToolPageLayout from "@/components/ToolPageLayout";

const CompressPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      setOriginalSize(uploadedFile.size);
      toast({ title: "PDF uploaded", description: `Size: ${formatFileSize(uploadedFile.size)}` });
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF file", variant: "destructive" });
    }
  };

  const handleCompress = async () => {
    if (!file) {
      toast({ title: "No file", description: "Please upload a PDF first", variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const newSize = pdfBytes.length;
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

      downloadPDF(pdfBytes, `compressed_${file.name}`);

      toast({ 
        title: "Success!", 
        description: `Compressed from ${formatFileSize(originalSize)} to ${formatFileSize(newSize)} (${reduction}% reduction)` 
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality"
      icon={Minimize2}
      iconColor="#059669"
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
              {originalSize > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Original size: {formatFileSize(originalSize)}
                </p>
              )}
            </label>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            Our compression optimizes PDF structure by removing redundant data and using 
            efficient encoding. Results may vary based on original PDF content.
          </p>
        </div>

        <Button
          onClick={handleCompress}
          disabled={!file || isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isProcessing ? "Compressing..." : "Compress PDF"}
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </ToolPageLayout>
  );
};

export default CompressPdf;
