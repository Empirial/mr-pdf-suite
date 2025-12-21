import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Download, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolsNavHeader from "@/components/ToolsNavHeader";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import UploadZone from "@/components/UploadZone";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type TesseractType = typeof import("tesseract.js");
type PdfjsLibType = typeof import("pdfjs-dist");

const OcrPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [extractedText, setExtractedText] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setExtractedText("");
    }
  }, []);

  const processOcr = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setExtractedText("");

    try {
      const [Tesseract, pdfjsLib] = await Promise.all([
        import("tesseract.js") as Promise<TesseractType>,
        import("pdfjs-dist") as Promise<PdfjsLibType>,
      ]);

      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = "";

      for (let i = 1; i <= numPages; i++) {
        setProgressText(`Processing page ${i} of ${numPages}...`);
        setProgress((i - 1) / numPages * 100);

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Could not get canvas context");
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport, canvas }).promise;

        const result = await Tesseract.recognize(canvas, "eng", {
          logger: (m: { status: string; progress: number }) => {
            if (m.status === "recognizing text") {
              const pageProgress = ((i - 1) + m.progress) / numPages * 100;
              setProgress(pageProgress);
            }
          },
        });

        fullText += `--- Page ${i} ---\n${result.data.text}\n\n`;
      }

      setExtractedText(fullText);
      setProgress(100);
      setProgressText("OCR complete!");
      toast({ title: "Success", description: "Text extracted successfully!" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("OCR error:", error);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(".pdf", "_ocr.txt") || "ocr_result.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSearchablePdf = async () => {
    if (!file || !extractedText) return;

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const lines = extractedText.split("\n");
      let currentPage = pdfDoc.addPage([612, 792]);
      let yPosition = 750;
      const fontSize = 10;
      const lineHeight = 14;
      const margin = 50;

      for (const line of lines) {
        if (line.startsWith("--- Page")) {
          if (yPosition < 750) {
            currentPage = pdfDoc.addPage([612, 792]);
            yPosition = 750;
          }
          continue;
        }

        if (yPosition < margin) {
          currentPage = pdfDoc.addPage([612, 792]);
          yPosition = 750;
        }

        currentPage.drawText(line.substring(0, 80), {
          x: margin,
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", "_searchable.pdf");
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <ToolsNavHeader />

        {/* Tool Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#6366F1]/15">
                <Search className="h-6 w-6 text-[#6366F1]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">OCR PDF</h1>
                <p className="text-muted-foreground">Extract text from scanned PDFs</p>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-4xl mx-auto">
            {!file ? (
              <UploadZone
                onFilesSelected={handleFilesSelected}
                isDragging={isDragging}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
              />
            ) : (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setFile(null)}>
                      Change File
                    </Button>
                  </div>

                  {processing && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{progressText}</span>
                        <span className="text-foreground">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={processOcr}
                    disabled={processing}
                    className="w-full"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Extract Text (OCR)
                      </>
                    )}
                  </Button>
                </div>

                {extractedText && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Extracted Text</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={downloadText}>
                          <Download className="h-4 w-4 mr-2" />
                          Download TXT
                        </Button>
                        <Button size="sm" onClick={downloadSearchablePdf}>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                    <textarea
                      className="w-full h-96 p-4 bg-muted rounded-lg text-sm font-mono text-foreground resize-none"
                      value={extractedText}
                      readOnly
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-border py-6 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">© 2025 MR PDF. All rights reserved.</p>
              <div className="flex gap-6 text-sm">
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SubscriptionGuard>
  );
};

export default OcrPdf;
