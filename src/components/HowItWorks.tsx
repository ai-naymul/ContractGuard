import { motion } from "framer-motion";
import { Upload, Scan, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload or Paste",
    description: "Drop a PDF, upload a document, or paste any contract text directly.",
  },
  {
    icon: Scan,
    number: "02",
    title: "AI Analyzes Risk",
    description: "Our engine scores every clause, flags red flags, and translates legalese to plain English.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Know Before You Sign",
    description: "Get actionable recommendations and understand exactly what you're agreeing to.",
  },
];

const demoSteps = [
  { label: "Uploading contract.pdf", icon: FileText },
  { label: "Extracting text...", icon: Scan },
  { label: "Analyzing clauses...", icon: Scan },
  { label: "Risk score: 7/10", icon: ShieldCheck },
  { label: "Found 3 red flags", icon: CheckCircle2 },
];

const AnimatedDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-20 max-w-2xl mx-auto"
    >
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-4 text-xs text-muted-foreground font-mono">ContractGuard</span>
        </div>

        <div className="space-y-3">
          {demoSteps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i <= currentStep;
            const isCurrent = i === currentStep;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: isActive ? 1 : 0.3,
                  x: 0,
                  scale: isCurrent ? 1.02 : 1
                }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCurrent ? "bg-primary/10 border border-primary/20" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? "bg-primary/20" : "bg-muted"
                }`}>
                  <Icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                </div>
                <span className={`font-mono text-sm ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-auto w-2 h-2 rounded-full bg-primary"
                  />
                )}
                {isActive && !isCurrent && (
                  <CheckCircle2 size={16} className="ml-auto text-primary" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => (
  <section id="how-it-works" className="section-spacing">
    <div className="max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <span className="label-mono mb-3 block">◆ WORKFLOW</span>
        <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground">
          Three steps to clarity.
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-px bg-border" />

        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="text-center relative"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 relative z-10 border border-background">
              <step.icon className="text-primary" size={22} />
            </div>
            <span className="label-mono mb-2 block">{step.number}</span>
            <h3 className="font-serif text-xl font-medium text-foreground mb-2">{step.title}</h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatedDemo />
    </div>
  </section>
);

export default HowItWorks;
