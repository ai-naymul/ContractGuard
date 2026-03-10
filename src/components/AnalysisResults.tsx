import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

export interface AnalysisData {
  clauseType: string;
  riskScore: number;
  riskLabel: string;
  plainEnglish: string;
  worstCase: string;
  redFlags: string[];
  actions: string[];
  verdict: string;
}

const getRiskColor = (score: number) => {
  if (score >= 7) return "text-destructive";
  if (score >= 4) return "text-warning";
  return "text-success";
};

const getRiskBg = (score: number) => {
  if (score >= 7) return "bg-destructive/10 text-destructive";
  if (score >= 4) return "bg-warning/10 text-warning";
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
  data: AnalysisData;
  onReset: () => void;
  demoMode?: boolean;
}

const AnalysisResults = ({ data, onReset, demoMode = false }: AnalysisResultsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Risk: ${data.riskScore}/10\n${data.plainEnglish}\n\nRed Flags:\n${data.redFlags.map((f) => `• ${f}`).join("\n")}\n\nActions:\n${data.actions.map((a) => `→ ${a}`).join("\n")}\n\nVerdict: ${data.verdict}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Demo Mode Banner */}
      {demoMode && (
        <motion.div
          className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="font-sans text-sm text-warning">
            <strong>Demo Mode:</strong> Connect Gradient AI for real analysis.
          </p>
        </motion.div>
      )}

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
            <span className={`font-serif text-5xl font-bold ${getRiskColor(data.riskScore)}`}>
              {data.riskScore}
            </span>
            <span className="font-sans text-lg text-muted-foreground">/10</span>
          </div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-md text-xs font-sans font-semibold uppercase tracking-wide ${getRiskBg(data.riskScore)}`}>
              {data.riskLabel}
            </span>
            <p className="font-sans text-sm text-muted-foreground mt-1">{data.clauseType}</p>
          </div>
        </div>
      </motion.div>

      {/* What This Means - open by default */}
      <CollapsibleCard emoji="📋" title="What This Means" defaultOpen={true} delay={0.2}>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          {data.plainEnglish}
        </p>
      </CollapsibleCard>

      {/* Worst Case Scenario - warning accent */}
      {data.worstCase && (
        <CollapsibleCard
          emoji="⚡"
          title="Worst Case Scenario"
          defaultOpen={true}
          delay={0.3}
          borderAccent="border-l-4 !border-l-warning"
        >
          <p className="font-sans text-sm text-warning leading-relaxed">
            {data.worstCase}
          </p>
        </CollapsibleCard>
      )}

      {/* Red Flags */}
      {data.redFlags.length > 0 && (
        <CollapsibleCard emoji="🚩" title="Red Flags" defaultOpen={false} delay={0.4}>
          <ul className="space-y-3">
            {data.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-destructive mt-0.5 shrink-0 text-sm">⚠</span>
                <span className="font-sans text-sm text-muted-foreground">{flag}</span>
              </li>
            ))}
          </ul>
        </CollapsibleCard>
      )}

      {/* What To Do */}
      {data.actions.length > 0 && (
        <CollapsibleCard emoji="💡" title="What To Do" defaultOpen={false} delay={0.5}>
          <ul className="space-y-3">
            {data.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-success mt-0.5 shrink-0 text-sm">→</span>
                <span className="font-sans text-sm text-muted-foreground">{action}</span>
              </li>
            ))}
          </ul>
        </CollapsibleCard>
      )}

      {/* Bottom Line */}
      {data.verdict && (
        <CollapsibleCard emoji="📌" title="Bottom Line" defaultOpen={true} delay={0.6}>
          <p className="font-sans text-sm text-foreground font-medium leading-relaxed mb-5">
            {data.verdict}
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
      )}
    </div>
  );
};

export default AnalysisResults;
