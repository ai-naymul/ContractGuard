import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const sampleResults = {
  riskScore: 8,
  riskLabel: "HIGH",
  clauseType: "Lease Termination",
  plainEnglish:
    "Your landlord can kick you out with just 7 days' notice for any reason at all — and you lose your entire deposit when that happens. In most jurisdictions, this level of discretion without cause is unusual and potentially unenforceable.",
  worstCase:
    "You could lose your entire deposit and be forced to vacate within 7 days, even if you've been a perfect tenant. This leaves you with no housing, no deposit, and no legal recourse under this clause.",
  redFlags: [
    "7-day termination without cause is far below standard (typically 30-60 days)",
    "Full deposit forfeiture upon termination with no conditions for return",
    "No requirement for landlord to provide a valid reason",
    '"Any reason" language removes all tenant protections',
    "Entry without notice violates privacy rights in most states",
  ],
  actions: [
    "Do not sign this clause as written",
    "Negotiate a minimum 30-day notice period for termination",
    "Add a clause requiring deposit return minus documented damages",
    "Request that termination be limited to specific, enumerated causes",
    "Consult a tenant rights organization in your jurisdiction",
  ],
  verdict:
    "This is a highly unfair and likely illegal clause. Do not sign it without changes to make the deposit refundable and require itemized deductions.",
};

const getRiskColor = (score: number) => {
  if (score >= 8) return "text-destructive";
  if (score >= 5) return "text-warning";
  return "text-success";
};

const getRiskBg = (score: number) => {
  if (score >= 8) return "bg-destructive/10 text-destructive";
  if (score >= 5) return "bg-warning/10 text-warning";
  return "bg-success/10 text-success";
};

interface CollapsibleCardProps {
  emoji: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  delay: number;
  borderAccent?: string;
}

const CollapsibleCard = ({ emoji, title, defaultOpen = false, children, delay, borderAccent }: CollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      className={`card-elevated overflow-hidden ${borderAccent || ""}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/20 transition-colors"
      >
        <span className="font-sans text-base font-semibold text-foreground flex items-center gap-2">
          <span className="text-lg">{emoji}</span> {title}
        </span>
        {isOpen ? (
          <ChevronUp size={18} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={18} className="text-muted-foreground" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5">{children}</div>
      </motion.div>
    </motion.div>
  );
};

interface AnalysisResultsProps {
  onReset: () => void;
}

const AnalysisResults = ({ onReset }: AnalysisResultsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Risk: ${sampleResults.riskScore}/10\n${sampleResults.plainEnglish}\n\nRed Flags:\n${sampleResults.redFlags.map((f) => `• ${f}`).join("\n")}\n\nActions:\n${sampleResults.actions.map((a) => `→ ${a}`).join("\n")}\n\nVerdict: ${sampleResults.verdict}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <motion.div
        className="flex items-center gap-2 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="font-serif text-2xl font-medium text-foreground">Analysis Results</h3>
      </motion.div>

      {/* Risk Score Card - always open, not collapsible */}
      <motion.div
        className="card-elevated p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex items-center gap-5">
          <div className="flex items-baseline gap-0.5">
            <span className={`font-serif text-5xl font-bold ${getRiskColor(sampleResults.riskScore)}`}>
              {sampleResults.riskScore}
            </span>
            <span className="font-sans text-lg text-muted-foreground">/10</span>
          </div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-md text-xs font-sans font-semibold uppercase tracking-wide ${getRiskBg(sampleResults.riskScore)}`}>
              {sampleResults.riskLabel}
            </span>
            <p className="font-sans text-sm text-muted-foreground mt-1">{sampleResults.clauseType}</p>
          </div>
        </div>
      </motion.div>

      {/* What This Means - open by default */}
      <CollapsibleCard emoji="📋" title="What This Means" defaultOpen={true} delay={0.2}>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          {sampleResults.plainEnglish}
        </p>
      </CollapsibleCard>

      {/* Worst Case Scenario - warning accent */}
      <CollapsibleCard
        emoji="⚡"
        title="Worst Case Scenario"
        defaultOpen={true}
        delay={0.3}
        borderAccent="border-l-4 !border-l-warning"
      >
        <p className="font-sans text-sm text-warning leading-relaxed">
          {sampleResults.worstCase}
        </p>
      </CollapsibleCard>

      {/* Red Flags */}
      <CollapsibleCard emoji="🚩" title="Red Flags" defaultOpen={false} delay={0.4}>
        <ul className="space-y-3">
          {sampleResults.redFlags.map((flag, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-destructive mt-0.5 shrink-0 text-sm">⚠</span>
              <span className="font-sans text-sm text-muted-foreground">{flag}</span>
            </li>
          ))}
        </ul>
      </CollapsibleCard>

      {/* What To Do */}
      <CollapsibleCard emoji="💡" title="What To Do" defaultOpen={false} delay={0.5}>
        <ul className="space-y-3">
          {sampleResults.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-success mt-0.5 shrink-0 text-sm">→</span>
              <span className="font-sans text-sm text-muted-foreground">{action}</span>
            </li>
          ))}
        </ul>
      </CollapsibleCard>

      {/* Bottom Line */}
      <CollapsibleCard emoji="📌" title="Bottom Line" defaultOpen={true} delay={0.6}>
        <p className="font-sans text-sm text-foreground font-medium leading-relaxed mb-5">
          {sampleResults.verdict}
        </p>
        <div className="flex gap-3">
          <button onClick={onReset} className="btn-primary">
            Analyze Another
          </button>
          <button onClick={handleCopy} className="btn-outline">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy Results"}
          </button>
        </div>
      </CollapsibleCard>
    </div>
  );
};

export default AnalysisResults;
