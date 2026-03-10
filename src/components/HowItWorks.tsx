import { motion } from "framer-motion";
import { ClipboardPaste, Scan, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: ClipboardPaste,
    number: "01",
    title: "Paste Your Clause",
    description: "Copy any contract text — leases, employment agreements, loan terms, or terms of service.",
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
    </div>
  </section>
);

export default HowItWorks;
