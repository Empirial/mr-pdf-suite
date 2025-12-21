import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Crop, Download, Loader2, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ToolsNavHeader from "@/components/ToolsNavHeader";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import UploadZone from "@/components/UploadZone";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from "pdf-lib";

type PdfjsLibType = typeof import("pdfjs-dist");

const CropPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageImage, setPageImage] = useState<string>("");
  const [cropMargins, setCropMargins] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  const [applyToAll, setApplyToAll] = useState(true);
  const [pdfjsLib, setPdfjsLib] = useState<PdfjsLibType | null>(null);
  const { toast } = useToast();

  const loadPdfjs = async (): Promise<PdfjsLibType> => {
    if (pdfjsLib) return pdfjsLib;
    const lib = await import("pdfjs-dist") as PdfjsLibType;
    lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`;
    setPdfjsLib(lib);
    return lib;
  };

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length > 0) {
      const lib = await loadPdfjs();
      setFile(files[0]);
      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
      setCurrentPage(1);
      renderPage(lib, arrayBuffer, 1);
    }
  }, []);

  const renderPage = async (lib: PdfjsLibType, arrayBuffer: ArrayBuffer, pageNum: number) => {
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport, canvas }).promise;
    setPageImage(canvas.toDataURL("image/png"));
  };

  useEffect(() => {
    if (file && pdfjsLib) {
      file.arrayBuffer().then((buffer) => renderPage(pdfjsLib, buffer, currentPage));
    }
  }, [currentPage, file, pdfjsLib]);

  const cropPdf = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      const pagesToCrop = applyToAll ? pages : [pages[currentPage - 1]];

      for (const page of pagesToCrop) {
        const { width, height } = page.getSize();
        const cropBox = {
          x: cropMargins.left,
          y: cropMargins.bottom,
          width: width - cropMargins.left - cropMargins.right,
          height: height - cropMargins.top - cropMargins.bottom,
        };
        page.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(".pdf", "_cropped.pdf");
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: "Success", description: "PDF cropped successfully!" });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Crop error:", error);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setProcessing(false);
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
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#F59E0B]/15">
                <Crop className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Crop PDF</h1>
                <p className="text-muted-foreground">Crop margins from PDF pages</p>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-6xl mx-auto">
            {!file ? (
              <UploadZone
                onFilesSelected={handleFilesSelected}
                isDragging={isDragging}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
              />
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Preview</h3>
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
                  <div className="relative border border-dashed border-primary/50 rounded-lg overflow-hidden">
                    {pageImage && (
                      <div className="relative">
                        <img src={pageImage} alt="Page preview" className="w-full h-auto" />
                        <div
                          className="absolute border-2 border-primary bg-primary/10 pointer-events-none"
                          style={{
                            top: `${(cropMargins.top / 792) * 100}%`,
                            left: `${(cropMargins.left / 612) * 100}%`,
                            right: `${(cropMargins.right / 612) * 100}%`,
                            bottom: `${(cropMargins.bottom / 792) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{pageCount} pages</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Crop Margins (points)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Top</Label>
                          <Input
                            type="number"
                            value={cropMargins.top}
                            onChange={(e) =>
                              setCropMargins({ ...cropMargins, top: Number(e.target.value) })
                            }
                            min={0}
                          />
                        </div>
                        <div>
                          <Label>Bottom</Label>
                          <Input
                            type="number"
                            value={cropMargins.bottom}
                            onChange={(e) =>
                              setCropMargins({ ...cropMargins, bottom: Number(e.target.value) })
                            }
                            min={0}
                          />
                        </div>
                        <div>
                          <Label>Left</Label>
                          <Input
                            type="number"
                            value={cropMargins.left}
                            onChange={(e) =>
                              setCropMargins({ ...cropMargins, left: Number(e.target.value) })
                            }
                            min={0}
                          />
                        </div>
                        <div>
                          <Label>Right</Label>
                          <Input
                            type="number"
                            value={cropMargins.right}
                            onChange={(e) =>
                              setCropMargins({ ...cropMargins, right: Number(e.target.value) })
                            }
                            min={0}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="applyToAll"
                          checked={applyToAll}
                          onChange={(e) => setApplyToAll(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="applyToAll">Apply to all pages</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setFile(null)} className="flex-1">
                      Change File
                    </Button>
                    <Button onClick={cropPdf} disabled={processing} className="flex-1">
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Cropping...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Crop & Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
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

export default CropPdf;
