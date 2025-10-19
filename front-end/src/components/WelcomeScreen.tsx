import { Upload, FileText, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface WelcomeScreenProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

const WelcomeScreen = ({ onFileUpload, isUploading }: WelcomeScreenProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file && (file.type === "application/pdf" || 
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      onFileUpload(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
    }
  }, [onFileUpload, toast, isUploading]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-2xl w-full animate-fade-in-up">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent glow-text">
            ChatDOCX
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            Upload your document and start a conversation instantly.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Powered by Sahil's Dev Lab • Supports PDF & DOCX
          </p>
        </div>

        <div
          className={`glass-effect rounded-2xl p-12 transition-all duration-300 ${
            isDragging && !isUploading ? "glow-border-strong scale-105" : "glow-border"
          } ${isUploading ? "opacity-75" : ""}`}
          onDragOver={(e) => {
            if (!isUploading) {
              e.preventDefault();
              setIsDragging(true);
            }
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                {isUploading ? (
                  <Loader2 className="w-20 h-20 text-primary relative animate-spin" />
                ) : (
                  <Upload className="w-20 h-20 text-primary relative animate-float" />
                )}
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              {isUploading 
                ? "Processing your document..." 
                : isDragging 
                  ? "Drop your file here" 
                  : "Upload Your Document"
              }
            </h3>
            
            <p className="text-muted-foreground mb-8">
              {isUploading 
                ? "Please wait while we process your document and prepare it for chat."
                : "Drag and drop your PDF or DOCX file here, or click to browse"
              }
            </p>

            {!isUploading && (
              <>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileSelect}
                />
                
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow-strong"
                >
                  <FileText className="w-5 h-5" />
                  Choose File
                </label>
              </>
            )}

            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                PDF
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                DOCX
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground/60">
          <p>Your documents are processed securely and never stored permanently</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
