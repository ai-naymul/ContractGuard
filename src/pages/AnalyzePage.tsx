import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, FileText, X, File, FileSearch, Scale, AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import AnalysisResults, { AnalysisData } from "@/components/AnalysisResults";

const analysisSteps = [
  { icon: FileSearch, label: "Reading document", detail: "Extracting text content" },
  { icon: Scale, label: "Analyzing clauses", detail: "Identifying key terms" },
  { icon: AlertTriangle, label: "Scanning for risks", detail: "Checking for red flags" },
  { icon: Shield, label: "Generating report", detail: "Preparing your results" },
];

const quickOptions = [
  { emoji: "🏠", label: "Lease Clause", sample: 'The landlord reserves the right to terminate this lease with 7 days notice for any reason, and tenant forfeits all deposits upon termination. Landlord may enter the premises at any time without prior notice for inspection purposes.' },
  { emoji: "💼", label: "Employment Terms", sample: 'Employee agrees to a 2-year non-compete clause covering all industries within a 500-mile radius. Any intellectual property created during or outside working hours becomes the sole property of the employer.' },
  { emoji: "🏦", label: "Loan Agreement", sample: 'The lender reserves the right to change the interest rate at any time without notice. Borrower waives all rights to dispute fees, penalties, or rate changes applied to the account.' },
  { emoji: "📱", label: "Terms of Service", sample: 'By using this service, you grant us an irrevocable, perpetual, worldwide license to use, modify, and sell your content. We may share your personal data with third parties without explicit consent.' },
];

const AnalyzePage = () => {
  const [text, setText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (text.trim().length <= 10 && !uploadedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      let requestBody: any = {};

      if (uploadedFile) {
        // Convert file to base64
        const base64 = await fileToBase64(uploadedFile);
        requestBody = {
          text: text.trim() || undefined,
          file: base64,
          fileType: uploadedFile.type,
          fileName: uploadedFile.name
        };
      } else {
        requestBody = { text: text.trim() };
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Analysis failed');
      }

      if (result.success) {
        setAnalysisData(result.data);
        setDemoMode(result.demoMode || false);
        setShowResults(true);
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:*/*;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = (file: File) => {
    const validTypes = ['application/pdf', 'text/plain'];
    const validExtensions = ['.pdf', '.txt'];
    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidType && !hasValidExtension) {
      setError('Please upload a PDF or TXT file.');
      return;
    }

    if (file.size > 16 * 1024 * 1024) {
      setError('File too large. Maximum size is 16MB.');
      return;
    }

    setUploadedFile(file);
    setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleQuickOption = (sample: string) => {
    setText(sample);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleReset = () => {
    setText("");
    setShowResults(false);
    setAnalysisData(null);
    setError(null);
    setDemoMode(false);
    setUploadedFile(null);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showResults]);

  // Animate through analysis steps
  useEffect(() => {
    if (isAnalyzing) {
      setAnalysisStep(0);
      const interval = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev < analysisSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const canAnalyze = text.trim().length > 10 || uploadedFile;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal top bar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          <span className="font-sans text-sm">Back</span>
        </Link>
        <span className="font-serif text-lg font-semibold text-foreground tracking-tight">
          ContractGuard
        </span>
        <div className="w-16" />
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          {!showResults && !isAnalyzing ? (
            <motion.div
              key="input"
              className="w-full max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                  ContractGuard
                </h1>
                <p className="font-sans text-muted-foreground mt-3 text-base">
                  AI-Powered Consumer Protection
                </p>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="font-sans text-sm text-destructive">{error}</p>
                </motion.div>
              )}

              {/* File Upload Area */}
              <div
                className={`relative mb-4 border-2 border-dashed rounded-2xl transition-all duration-200 ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : uploadedFile
                      ? 'border-success/50 bg-success/5'
                      : 'border-border hover:border-muted-foreground/30'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                {uploadedFile ? (
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        {uploadedFile.name.endsWith('.pdf') ? (
                          <FileText size={20} className="text-success" />
                        ) : (
                          <File size={20} className="text-success" />
                        )}
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium text-foreground">{uploadedFile.name}</p>
                        <p className="font-sans text-xs text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-6 flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <Upload size={20} className="text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-sans text-sm font-medium text-foreground">
                        Drop your contract here or click to upload
                      </p>
                      <p className="font-sans text-xs text-muted-foreground mt-1">
                        Supports PDF and TXT files up to 16MB
                      </p>
                    </div>
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="font-sans text-xs text-muted-foreground uppercase tracking-wider">or paste text</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Text Input area */}
              <div className="card-elevated rounded-2xl overflow-hidden">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, 10000))}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste your contract clause here..."
                    rows={4}
                    className="w-full bg-transparent px-5 pt-5 pb-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between px-4 pb-3">
                  <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                    {text.length > 0 ? `${text.length.toLocaleString()} / 10,000 chars` : ""}
                  </span>
                  <button
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-sans text-sm font-medium transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Analyze
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Quick options */}
              <div className="flex flex-wrap gap-2 mt-5 justify-center">
                {quickOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleQuickOption(opt.sample)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-sans text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all"
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div
              key="analyzing"
              className="w-full max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Document being analyzed */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-elevated rounded-2xl p-5 mb-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-foreground truncate">
                      {uploadedFile ? uploadedFile.name : 'Contract clause'}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">
                      {uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : `${text.length} characters`}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Analysis steps */}
              <div className="space-y-3">
                {analysisSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i === analysisStep;
                  const isComplete = i < analysisStep;
                  const isPending = i > analysisStep;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: isPending ? 0.4 : 1,
                        x: 0,
                      }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-primary/10 border border-primary/20'
                          : isComplete
                            ? 'bg-success/5 border border-success/20'
                            : 'bg-secondary/30 border border-transparent'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-primary/20'
                          : isComplete
                            ? 'bg-success/20'
                            : 'bg-muted'
                      }`}>
                        {isComplete ? (
                          <CheckCircle2 size={20} className="text-success" />
                        ) : (
                          <Icon size={20} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-sans text-sm font-medium ${
                          isActive ? 'text-foreground' : isComplete ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground">
                          {step.detail}
                        </p>
                      </div>
                      {isActive && (
                        <motion.div
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-primary"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center font-sans text-xs text-muted-foreground mt-6"
              >
                This usually takes 10-15 seconds
              </motion.p>
            </motion.div>
          ) : analysisData ? (
            <motion.div
              key="results"
              ref={resultsRef}
              className="w-full max-w-2xl py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Show the submitted info */}
              <div className="mb-6 p-4 rounded-xl bg-secondary/30 border border-border">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
                  {uploadedFile ? 'Uploaded document' : 'Your clause'}
                </span>
                {uploadedFile ? (
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-muted-foreground" />
                    <span className="font-sans text-sm text-foreground/80">{uploadedFile.name}</span>
                  </div>
                ) : (
                  <p className="font-sans text-sm text-foreground/80 leading-relaxed line-clamp-3">{text}</p>
                )}
              </div>

              <AnalysisResults
                data={analysisData}
                demoMode={demoMode}
                onReset={handleReset}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Footer branding */}
      <div className="text-center py-4 border-t border-border/30">
        <span className="font-sans text-xs text-muted-foreground/60">
          Powered by <span className="font-medium text-muted-foreground">DigitalOcean Gradient AI</span>
        </span>
      </div>
    </div>
  );
};

export default AnalyzePage;
