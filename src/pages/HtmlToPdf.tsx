import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe, Download, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const HtmlToPdf = () => {
  const [url, setUrl] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState<"url" | "html">("url");
  const { toast } = useToast();

  const convertToPdf = async () => {
    if (mode === "url" && !url) {
      toast({ title: "Error", description: "Please enter a URL", variant: "destructive" });
      return;
    }
    if (mode === "html" && !htmlContent) {
      toast({ title: "Error", description: "Please enter HTML content", variant: "destructive" });
      return;
    }

    setProcessing(true);
    try {
      const formData = new FormData();

      if (mode === "url") {
        formData.append("conversionType", "url-to-pdf");
        formData.append("url", url);
        // Create a dummy file for the form
        const dummyFile = new Blob([""], { type: "text/plain" });
        formData.append("file", dummyFile, "dummy.txt");
      } else {
        formData.append("conversionType", "html-to-pdf");
        const htmlFile = new Blob([htmlContent], { type: "text/html" });
        formData.append("file", htmlFile, "index.html");
      }

      const { data, error } = await supabase.functions.invoke("convert-document", {
        body: formData,
      });

      if (error) throw error;

      const blob = new Blob([data], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = mode === "url" ? "webpage.pdf" : "document.pdf";
      link.click();
      URL.revokeObjectURL(downloadUrl);

      toast({ title: "Success", description: "Converted to PDF successfully!" });
    } catch (error: any) {
      console.error("Conversion error:", error);
      toast({
        title: "Error",
        description: error.message || "Conversion failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
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
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">HTML to PDF</h1>
                <p className="text-sm text-muted-foreground">Convert webpages or HTML to PDF</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "url" | "html")}>
              <TabsList className="w-full mb-6">
                <TabsTrigger value="url" className="flex-1">
                  <Globe className="h-4 w-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="html" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  HTML Code
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Website URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter the full URL of the webpage you want to convert
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="html" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    HTML Content
                  </label>
                  <Textarea
                    placeholder="<html><body><h1>Hello World</h1></body></html>"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="font-mono min-h-[200px]"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Paste your HTML code to convert to PDF
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={convertToPdf}
              disabled={processing}
              className="w-full mt-6"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Convert to PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HtmlToPdf;
