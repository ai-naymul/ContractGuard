import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {

  return (
    <section className="section-spacing pt-32 md:pt-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-sans text-xs font-medium tracking-wide">
                Powered by <span className="text-primary font-semibold">DigitalOcean Gradient AI</span>
              </span>
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-foreground mb-6">
              Contracts that protect you, not trap you.
            </h1>

            <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-lg mb-10">
              Paste any legal clause. Get plain English answers. Know exactly what you're signing.
            </p>

            <Link to="/analyze" className="btn-primary text-base">
              Start Analyzing <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Right mockup */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Input card */}
            <div className="card-elevated p-6 mb-4 relative z-10">
              <div className="flex justify-between mb-4">
                <span className="label-mono">CORE_INPUT</span>
                <span className="label-mono">CONTRACT_CLAUSE</span>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="font-sans text-sm text-foreground/70 leading-relaxed">
                  "The landlord reserves the right to terminate this lease with 7 days notice for any reason, 
                  and tenant forfeits all deposits upon termination..."
                </p>
              </div>
            </div>

            {/* Output card - overlapping */}
            <motion.div
              className="card-elevated p-5 ml-8 lg:ml-12 relative z-20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="label-mono">RISK_LEVEL</span>
                <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-sans font-medium">
                  HIGH RISK
                </span>
              </div>
              <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                This clause allows termination with minimal notice and you lose your deposit. 
                This is unusually aggressive for a standard lease.
              </p>
            </motion.div>

            {/* User avatar card */}
            <motion.div
              className="card-surface p-3 absolute top-4 -right-2 lg:right-0 z-30 flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                <span className="font-sans text-sm font-semibold text-primary">JD</span>
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-foreground">Jane Doe</p>
                <p className="label-mono text-[10px]">TENANT</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
