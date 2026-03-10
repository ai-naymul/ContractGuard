import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <span className="font-serif text-xl font-semibold text-foreground tracking-tight">
          ContractGuard
        </span>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo("features")} className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </button>
          <button onClick={() => scrollTo("how-it-works")} className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </button>
          <Link to="/analyze" className="btn-primary !px-6 !py-2.5 text-sm">
            Try Now
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 py-4 flex flex-col gap-3">
          <button onClick={() => scrollTo("features")} className="font-sans text-sm text-muted-foreground text-left">Features</button>
          <button onClick={() => scrollTo("how-it-works")} className="font-sans text-sm text-muted-foreground text-left">How It Works</button>
          <Link to="/analyze" className="btn-primary !px-6 !py-2.5 text-sm w-fit">Try Now</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
