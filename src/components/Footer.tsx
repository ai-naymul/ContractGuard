const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="font-serif text-lg font-semibold text-foreground">ContractGuard</span>
          <p className="font-sans text-xs text-muted-foreground mt-1 max-w-md">
            ContractGuard provides AI-powered analysis for educational purposes only. 
            This does not constitute legal advice. Always consult a qualified attorney for legal matters.
          </p>
        </div>
        <p className="font-sans text-xs text-muted-foreground">
          © {new Date().getFullYear()} ContractGuard. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
