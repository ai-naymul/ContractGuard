import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AnalysisResults from "@/components/AnalysisResults";

const quickOptions = [
  { emoji: "🏠", label: "Analyze a Lease Clause", sample: 'The landlord reserves the right to terminate this lease with 7 days notice for any reason, and tenant forfeits all deposits upon termination. Landlord may enter the premises at any time without prior notice for inspection purposes.' },
  { emoji: "💼", label: "Review Employment Terms", sample: 'Employee agrees to a 2-year non-compete clause covering all industries within a 500-mile radius. Any intellectual property created during or outside working hours becomes the sole property of the employer.' },
  { emoji: "🏦", label: "Check Loan Agreement", sample: 'The lender reserves the right to change the interest rate at any time without notice. Borrower waives all rights to dispute fees, penalties, or rate changes applied to the account.' },
  { emoji: "📱", label: "Scan Terms of Service", sample: 'By using this service, you grant us an irrevocable, perpetual, worldwide license to use, modify, and sell your content. We may share your personal data with third parties without explicit consent.' },
];

const AnalyzePage = () => {
  const [text, setText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = () => {
    if (text.trim().length > 10) {
      setIsAnalyzing(true);
      // Simulate analysis delay for UX
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 1500);
    }
  };

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

  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showResults]);

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
        <div className="w-16" /> {/* Spacer for centering */}
      </nav>

      {/* Main content - centered like Perplexity */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
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
              <div className="text-center mb-10">
                <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                  ContractGuard
                </h1>
                <p className="font-sans text-muted-foreground mt-3 text-base">
                  AI-Powered Consumer Protection
                </p>
              </div>

              {/* Input area */}
              <div className="card-elevated rounded-2xl overflow-hidden">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, 10000))}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste your contract clause here..."
                    rows={3}
                    className="w-full bg-transparent px-5 pt-5 pb-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between px-4 pb-3">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground">
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                      {text.length > 0 ? `${text.length.toLocaleString()} chars` : ""}
                    </span>
                    <button
                      onClick={handleAnalyze}
                      disabled={text.trim().length <= 10}
                      className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick options */}
              <div className="flex flex-wrap gap-2 mt-5 justify-center">
                {quickOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleQuickOption(opt.sample)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-sans text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all"
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div
              key="analyzing"
              className="w-full max-w-2xl text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-border" />
                  <div className="absolute inset-0 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-foreground">Analyzing contract...</p>
                  <p className="font-sans text-xs text-muted-foreground mt-1">Scanning for risks, red flags, and unfair terms</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              ref={resultsRef}
              className="w-full max-w-2xl py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Show the submitted clause */}
              <div className="mb-6 p-4 rounded-xl bg-secondary/30 border border-border">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Your clause</span>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed line-clamp-3">{text}</p>
              </div>

              <AnalysisResults
                onReset={() => {
                  setText("");
                  setShowResults(false);
                }}
              />
            </motion.div>
          )}
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
