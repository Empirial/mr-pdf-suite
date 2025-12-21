import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Upload, Download, AlertTriangle } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";

const ProtectPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleProtect = async () => {
    if (!file) {
      toast({ title: "No file", description: "Please upload a PDF first", variant: "destructive" });
      return;
    }

    if (!password || password !== confirmPassword) {
      toast({ title: "Password mismatch", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    toast({ 
      title: "Feature Note", 
      description: "PDF password protection requires server-side processing. This feature will be available soon!",
    });
  };

  return (
    <ToolPageLayout
      title="Protect PDF"
      description="Add password protection to your PDF"
      icon={Lock}
      iconColor="#059669"
    >
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Coming Soon</p>
            <p className="text-sm text-muted-foreground">
              PDF password protection requires server-side processing. This feature will be available in a future update.
            </p>
          </div>
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="mt-2"
          />
        </div>

        <Button
          onClick={handleProtect}
          disabled={!file || !password || password !== confirmPassword}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          Protect PDF
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </ToolPageLayout>
  );
};

export default ProtectPdf;
