import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Image, Download, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfToJpg = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<{ page: number; dataUrl: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setImages([]);
    }
  }, []);

  const convertToImages = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const newImages: { page: number; dataUrl: string }[] = [];

      for (let i = 1; i <= numPages; i++) {
        setProgress((i / numPages) * 100);

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport, canvas }).promise;

        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        newImages.push({ page: i, dataUrl });
      }

      setImages(newImages);
      toast({ title: "Success", description: `Converted ${numPages} pages to images!` });
    } catch (error: any) {
      console.error("Conversion error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = (index: number) => {
    const image = images[index];
    const link = document.createElement("a");
    link.href = image.dataUrl;
    link.download = `${file?.name.replace(".pdf", "")}_page_${image.page}.jpg`;
    link.click();
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    const baseName = file?.name.replace(".pdf", "") || "pdf";

    for (const image of images) {
      const base64Data = image.dataUrl.split(",")[1];
      zip.file(`${baseName}_page_${image.page}.jpg`, base64Data, { base64: true });
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${baseName}_images.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Image className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">PDF to JPG</h1>
                <p className="text-sm text-muted-foreground">Convert PDF pages to images</p>
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
                  <Button variant="outline" onClick={() => { setFile(null); setImages([]); }}>
                    Change File
                  </Button>
                </div>

                {processing && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Converting pages...</span>
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

                <div className="flex gap-4">
                  <Button
                    onClick={convertToImages}
                    disabled={processing}
                    className="flex-1"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Image className="h-4 w-4 mr-2" />
                        Convert to JPG
                      </>
                    )}
                  </Button>
                  {images.length > 0 && (
                    <Button onClick={downloadAllAsZip} variant="outline" size="lg">
                      <Download className="h-4 w-4 mr-2" />
                      Download All (ZIP)
                    </Button>
                  )}
                </div>
              </div>

              {images.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Converted Images ({images.length} pages)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={image.page}
                        className="relative group border border-border rounded-lg overflow-hidden"
                      >
                        <img
                          src={image.dataUrl}
                          alt={`Page ${image.page}`}
                          className="w-full h-auto"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => downloadImage(index)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Page {image.page}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PdfToJpg;
