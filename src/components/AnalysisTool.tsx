import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Upload, Copy, Check, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const pills = [
  { emoji: "🏠", label: "Lease" },
  { emoji: "💼", label: "Employment" },
  { emoji: "🏦", label: "Loan" },
  { emoji: "📱", label: "Terms of Service" },
];

const sampleResults = {
  riskScore: 8,
  riskLabel: "HIGH RISK",
  clauseType: "Lease Termination",
  plainEnglish:
    "Your landlord can kick you out with just 7 days' notice for any reason at all — and you lose your entire deposit when that happens. In most jurisdictions, this level of discretion without cause is unusual and potentially unenforceable.",
  redFlags: [
    "7-day termination without cause is far below standard (typically 30-60 days)",
    "Full deposit forfeiture upon termination with no conditions for return",
    "No requirement for landlord to provide a valid reason",
    'Use of "any reason" language removes tenant protections',
  ],
  actions: [
    "Negotiate a minimum 30-day notice period for termination",
    "Add a clause requiring deposit return minus documented damages",
    "Request that termination be limited to specific, enumerated causes",
    "Consult a tenant rights organization in your jurisdiction",
  ],
  verdict:
    "Do not sign this clause as written. The termination terms are significantly one-sided and could leave you without housing and without your deposit with minimal warning.",
};

const AnalysisTool = () => {
  const [text, setText] = useState("");
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (text.trim().length > 10) {
      setShowResults(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Risk: ${sampleResults.riskScore}/10\n${sampleResults.plainEnglish}\n\nRed Flags:\n${sampleResults.redFlags.map((f) => `• ${f}`).join("\n")}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardStagger = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
    }),
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
            <div className="space-y-4">
              {/* Risk Score */}
              <motion.div className="card-elevated p-6" custom={0} initial="hidden" animate="visible" variants={cardStagger}>
                <div className="flex justify-between items-start mb-4">
                  <span className="label-mono">RISK_ASSESSMENT</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-sans font-medium">
                    <XCircle size={12} /> {sampleResults.riskLabel}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-serif text-6xl font-semibold text-foreground">{sampleResults.riskScore}</span>
                  <span className="font-sans text-xl text-muted-foreground">/10</span>
                </div>
                <span className="label-mono">{sampleResults.clauseType}</span>
              </motion.div>

              {/* Plain English */}
              <motion.div className="card-elevated p-6" custom={1} initial="hidden" animate="visible" variants={cardStagger}>
                <span className="label-mono mb-3 block">PLAIN_ENGLISH</span>
                <h3 className="font-serif text-lg font-medium text-foreground mb-2">What This Means</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{sampleResults.plainEnglish}</p>
              </motion.div>

              {/* Red Flags */}
              <motion.div className="card-elevated p-6" custom={2} initial="hidden" animate="visible" variants={cardStagger}>
                <span className="label-mono mb-3 block">WARNING_SIGNALS</span>
                <h3 className="font-serif text-lg font-medium text-foreground mb-3">Red Flags</h3>
                <ul className="space-y-2.5">
                  {sampleResults.redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertTriangle className="text-destructive mt-0.5 shrink-0" size={14} />
                      <span className="font-sans text-sm text-foreground/80">{flag}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Actions */}
              <motion.div className="card-elevated p-6" custom={3} initial="hidden" animate="visible" variants={cardStagger}>
                <span className="label-mono mb-3 block">RECOMMENDED_ACTIONS</span>
                <h3 className="font-serif text-lg font-medium text-foreground mb-3">What To Do</h3>
                <ol className="space-y-2.5">
                  {sampleResults.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="text-success mt-0.5 shrink-0" size={14} />
                      <span className="font-sans text-sm text-foreground/80">{action}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>

              {/* Verdict */}
              <motion.div className="card-elevated p-6" custom={4} initial="hidden" animate="visible" variants={cardStagger}>
                <span className="label-mono mb-3 block">VERDICT</span>
                <h3 className="font-serif text-lg font-medium text-foreground mb-2">Bottom Line</h3>
                <p className="font-sans text-sm text-foreground font-medium leading-relaxed mb-6">{sampleResults.verdict}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setText("");
                      setShowResults(false);
                      setSelectedPill(null);
                    }}
                    className="btn-primary"
                  >
                    Analyze Another
                  </button>
                  <button onClick={handleCopy} className="btn-outline">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy Results"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AnalysisTool;
