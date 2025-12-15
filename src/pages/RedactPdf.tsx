import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, EyeOff, Download, Loader2, FileText, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument, rgb } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface RedactionArea {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const RedactPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageImage, setPageImage] = useState<string>("");
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [redactions, setRedactions] = useState<RedactionArea[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState<RedactionArea | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setRedactions([]);
      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
      setCurrentPage(1);
      renderPage(arrayBuffer, 1);
    }
  }, []);

  const renderPage = async (arrayBuffer: ArrayBuffer, pageNum: number) => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    setPageDimensions({ width: viewport.width, height: viewport.height });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport, canvas }).promise;
    setPageImage(canvas.toDataURL("image/png"));
  };

  useEffect(() => {
    if (file) {
      file.arrayBuffer().then((buffer) => renderPage(buffer, currentPage));
    }
  }, [currentPage, file]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setDrawStart({ x, y });
    setCurrentRect({ page: currentPage, x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentRect({
      page: currentPage,
      x: Math.min(drawStart.x, x),
      y: Math.min(drawStart.y, y),
      width: Math.abs(x - drawStart.x),
      height: Math.abs(y - drawStart.y),
    });
  };

  const handleMouseUp = () => {
    if (currentRect && currentRect.width > 5 && currentRect.height > 5) {
      setRedactions([...redactions, currentRect]);
    }
    setIsDrawing(false);
    setCurrentRect(null);
  };

  const removeRedaction = (index: number) => {
    setRedactions(redactions.filter((_, i) => i !== index));
  };

  const redactPdf = async () => {
    if (!file || redactions.length === 0) {
      toast({ title: "No redactions", description: "Please draw at least one redaction area.", variant: "destructive" });
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Calculate scale factor between preview and actual PDF
      const firstPage = pages[0];
      const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();
      const scaleX = pdfWidth / pageDimensions.width;
      const scaleY = pdfHeight / pageDimensions.height;

      for (const redaction of redactions) {
        const page = pages[redaction.page - 1];
        const { height: pageHeight } = page.getSize();
        
        // Convert coordinates and flip Y axis
        const x = redaction.x * scaleX;
        const y = pageHeight - (redaction.y + redaction.height) * scaleY;
        const width = redaction.width * scaleX;
        const height = redaction.height * scaleY;

        page.drawRectangle({
          x,
          y,
          width,
          height,
          color: rgb(0, 0, 0),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(".pdf", "_redacted.pdf");
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: "Success", description: "PDF redacted successfully!" });
    } catch (error: any) {
      console.error("Redaction error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const currentPageRedactions = redactions.filter((r) => r.page === currentPage);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <EyeOff className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Redact PDF</h1>
                <p className="text-sm text-muted-foreground">Remove sensitive information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {!file ? (
            <UploadZone
              onFilesSelected={handleFilesSelected}
              isDragging={isDragging}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
            />
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
                    Draw rectangles to redact
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {pageCount}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))}
                      disabled={currentPage === pageCount}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div
                  ref={canvasRef}
                  className="relative border border-border rounded-lg overflow-hidden cursor-crosshair select-none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {pageImage && (
                    <img
                      src={pageImage}
                      alt="Page preview"
                      className="w-full h-auto pointer-events-none"
                      draggable={false}
                    />
                  )}
                  {currentPageRedactions.map((r, i) => (
                    <div
                      key={i}
                      className="absolute bg-black"
                      style={{
                        left: r.x,
                        top: r.y,
                        width: r.width,
                        height: r.height,
                      }}
                    />
                  ))}
                  {currentRect && (
                    <div
                      className="absolute bg-black/50 border-2 border-red-500"
                      style={{
                        left: currentRect.x,
                        top: currentRect.y,
                        width: currentRect.width,
                        height: currentRect.height,
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{pageCount} pages</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-foreground">
                      Redaction Areas ({redactions.length})
                    </h4>
                    {redactions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Draw rectangles on the PDF to mark areas for redaction
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {redactions.map((r, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-muted rounded-lg px-3 py-2"
                          >
                            <span className="text-sm text-foreground">
                              Page {r.page}: {Math.round(r.width)}x{Math.round(r.height)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeRedaction(i)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button variant="outline" onClick={() => setFile(null)}>
                    Change File
                  </Button>
                  <Button onClick={redactPdf} disabled={processing || redactions.length === 0}>
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Redacting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Redact & Download
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RedactPdf;
