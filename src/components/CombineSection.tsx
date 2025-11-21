import { Loader2, Download, FileCheck } from "lucide-react";
import { Button } from "./ui/button";

interface CombineSectionProps {
  isProcessing: boolean;
  isComplete: boolean;
  onCombine: () => void;
  onDownload: () => void;
  fileCount: number;
}

const CombineSection = ({
  isProcessing,
  isComplete,
  onCombine,
  onDownload,
  fileCount,
}: CombineSectionProps) => {
  if (isComplete) {
    return (
      <div className="space-y-4 animate-scale-in">
        <div className="rounded-lg bg-primary/10 p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <FileCheck className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            PDFs Combined Successfully!
          </h3>
          <p className="text-sm text-muted-foreground">
            Your merged PDF is ready to download
          </p>
        </div>

        <Button
          onClick={onDownload}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
        >
          <Download className="mr-2 h-5 w-5" />
          Download Merged PDF
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={onCombine}
      disabled={isProcessing || fileCount < 2}
      size="lg"
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md disabled:opacity-50"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Combining PDFs...
        </>
      ) : (
        <>Combine PDFs</>
      )}
    </Button>
  );
};

export default CombineSection;
