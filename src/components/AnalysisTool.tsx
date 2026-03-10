import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Upload } from "lucide-react";
import AnalysisResults from "./AnalysisResults";

const pills = [
  { emoji: "🏠", label: "Lease" },
  { emoji: "💼", label: "Employment" },
  { emoji: "🏦", label: "Loan" },
  { emoji: "📱", label: "Terms of Service" },
];

const AnalysisTool = () => {
  const [text, setText] = useState("");
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    if (text.trim().length > 10) {
      setShowResults(true);
    }
  };

  return (
    <section id="analyze" className="section-spacing">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="label-mono mb-3 block">◆ ANALYSIS_TOOL</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground">
            Try it yourself.
          </h2>
        </motion.div>

        {/* Input card */}
        <motion.div
          className="card-elevated p-6 md:p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-between mb-4">
            <span className="label-mono">CORE_INPUT</span>
            <span className="label-mono">CONTRACT_ANALYZER</span>
          </div>

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, 10000));
                if (showResults) setShowResults(false);
              }}
              placeholder="Paste your contract clause here..."
              className="w-full h-48 bg-secondary/30 rounded-2xl p-5 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus-green border border-transparent transition-all"
            />
            <span className="absolute bottom-3 right-4 label-mono text-[10px]">
              {text.length.toLocaleString()} / 10,000
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 mb-6">
            {pills.map((pill) => (
              <button
                key={pill.label}
                onClick={() => {
                  setSelectedPill(pill.label);
                  if (pill.label === "Lease") {
                    setText(
                      'The landlord reserves the right to terminate this lease with 7 days notice for any reason, and tenant forfeits all deposits upon termination. Landlord may enter the premises at any time without prior notice for inspection purposes.'
                    );
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-sans transition-all ${
                  selectedPill === pill.label
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/20"
                }`}
              >
                {pill.emoji} {pill.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleAnalyze} className="btn-primary">
              Analyze Contract <ArrowRight size={16} />
            </button>
            <button className="btn-outline">
              <Upload size={16} /> Upload PDF
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {showResults && (
            <AnalysisResults
              onReset={() => {
                setText("");
                setShowResults(false);
                setSelectedPill(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AnalysisTool;
