import { Shield, Lock, Zap } from "lucide-react";

const PrivacyMessage = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Your Privacy Matters
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Lock className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">
              100% Private & Secure
            </p>
            <p className="text-xs text-muted-foreground">
              All processing happens directly in your browser. No files are uploaded to any server.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Zap className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Lightning Fast
            </p>
            <p className="text-xs text-muted-foreground">
              Process your PDFs instantly without any uploads or downloads to external servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyMessage;
