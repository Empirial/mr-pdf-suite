import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Scissors, Upload, Download } from "lucide-react";
import { downloadPDF } from "@/utils/pdfUtils";
import ToolPageLayout from "@/components/ToolPageLayout";

const SplitPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdfDoc.getPageCount());
      
      toast({ title: "PDF uploaded", description: `${pdfDoc.getPageCount()} pages found` });
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF file", variant: "destructive" });
    }
  };

  const parsePageRange = (range: string, maxPages: number): number[] => {
    const pages: number[] = [];
    const parts = range.split(",").map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(n => parseInt(n.trim()));
        for (let i = start; i <= end && i <= maxPages; i++) {
          if (i >= 1) pages.push(i - 1);
        }
      } else {
        const num = parseInt(part);
        if (num >= 1 && num <= maxPages) {
          pages.push(num - 1);
        }
      }
    }
    
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || !pageRange) {
      toast({ title: "Missing information", description: "Please upload a PDF and specify page range", variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const pages = parsePageRange(pageRange, sourcePdf.getPageCount());

      if (pages.length === 0) {
        throw new Error("No valid pages found in the specified range");
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, pages);
      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      downloadPDF(pdfBytes, `split_${file.name}`);

      toast({ title: "Success!", description: `Extracted ${pages.length} pages` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      title="Split PDF"
      description="Extract specific pages from your PDF"
      icon={Scissors}
      iconColor="#7C3AED"
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
              {totalPages > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {totalPages} pages
                </p>
              )}
            </label>
          </div>
        </div>

        <div>
          <Label htmlFor="page-range">Page Range</Label>
          <Input
            id="page-range"
            placeholder="e.g., 1-3, 5, 7-10"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Enter page numbers or ranges separated by commas
          </p>
        </div>

        <Button
          onClick={handleSplit}
          disabled={!file || !pageRange || isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isProcessing ? "Processing..." : "Split PDF"}
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </ToolPageLayout>
  );
};

export default SplitPdf;
