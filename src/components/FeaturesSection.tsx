import { motion } from "framer-motion";
import { Lock, Check, Zap } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const useCountUp = (target: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const FeaturesSection = () => {
  const [sliderValue, setSliderValue] = useState(75);
  const counter = useCountUp(10000);

  return (
    <section id="features" className="section-spacing">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="label-mono mb-3 block">◆ CAPABILITIES</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground">
            Built to protect you.
          </h2>
        </motion.div>

        {/* Top row: 3 feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Plain English */}
          <motion.div
            className="card-elevated p-6"
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <div className="flex justify-between mb-6">
              <span className="label-mono">FIELD</span>
              <span className="label-mono">TRANSLATION_ENGINE</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-sans text-xs font-medium text-foreground/60">Legal</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                    style={{ width: `${sliderValue}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="font-sans text-xs font-medium text-foreground">Simple</span>
              </div>
            </div>
            <h3 className="font-serif text-xl font-medium text-foreground mb-2">Plain English</h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Toggle between legalese and human-readable explanations instantly.
            </p>
          </motion.div>

          {/* Risk Detection */}
          <motion.div
            className="card-elevated p-6"
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <div className="flex justify-between mb-6">
              <span className="label-mono">FIELD</span>
              <span className="label-mono">THREAT_ANALYSIS</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div
                    key={n}
                    className={`w-6 h-8 rounded font-mono text-[10px] flex items-center justify-center font-medium ${
                      n <= 7
                        ? n <= 3
                          ? "bg-success/15 text-success"
                          : n <= 6
                          ? "bg-warning/15 text-warning"
                          : "bg-destructive/15 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {n}
                  </div>
                ))}
              </div>
              <div className="h-1 bg-muted rounded-full mt-2">
                <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-success via-warning to-destructive" />
              </div>
            </div>
            <h3 className="font-serif text-xl font-medium text-foreground mb-2">Risk Detection</h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Every clause scored 1-10. See exactly where the danger hides.
            </p>
          </motion.div>

          {/* Private By Design */}
          <motion.div
            className="card-elevated p-6"
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <div className="flex justify-between mb-6">
              <span className="label-mono">FIELD</span>
              <span className="label-mono">SECURITY_GRADE</span>
            </div>
            <div className="flex items-center justify-center py-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-success/30 flex items-center justify-center">
                  <Lock className="text-primary" size={28} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-success flex items-center justify-center">
                  <Check className="text-success-foreground" size={14} />
                </div>
              </div>
            </div>
            <h3 className="font-serif text-xl font-medium text-foreground mb-2">Private By Design</h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Enterprise-grade encryption. Your contracts never train our models.
            </p>
          </motion.div>
        </div>

        {/* Bottom row: 2 metric cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className="card-elevated p-6 flex items-center gap-6"
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="text-primary" size={24} />
            </div>
            <div>
              <span className="label-mono mb-1 block">METRIC</span>
              <h3 className="font-serif text-2xl font-semibold text-foreground">Saves $2,400/year</h3>
              <p className="font-sans text-sm text-muted-foreground mt-1">
                Average avoided penalty fees from unfair contract terms.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="card-elevated p-6 flex items-center gap-6"
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            ref={counter.ref}
          >
            <div>
              <span className="label-mono mb-1 block">OUTPUT</span>
              <h3 className="font-serif text-2xl font-semibold text-foreground">
                {counter.count.toLocaleString()}+ Clauses Analyzed
              </h3>
              <p className="font-sans text-sm text-muted-foreground mt-1">
                Trusted by thousands of consumers to understand their contracts.
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              {counter.count
                .toString()
                .padStart(5, "0")
                .split("")
                .map((d, i) => (
                  <div
                    key={i}
                    className="w-9 h-11 rounded-lg border border-border bg-secondary/50 flex items-center justify-center font-mono text-lg font-medium text-foreground animate-counter"
                  >
                    {d}
                  </div>
                ))}
              <div className="w-9 h-11 rounded-lg border border-border bg-secondary/50 flex items-center justify-center font-mono text-lg font-medium text-foreground">
                +
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
