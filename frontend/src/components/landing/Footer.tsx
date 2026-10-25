const Footer = () => (
  <footer className="px-6 md:px-16 py-12 border-t" style={{ borderColor: "rgba(74,222,128,0.08)" }}>
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="font-mono text-sm tracking-[3px] text-dg-green">⊲⊳ DIGITAL GUARDIAN</div>
      <div className="font-body text-xs text-dg-text-dim">
        © {new Date().getFullYear()} Digital Guardian. AI-powered fraud detection.
      </div>
      <div className="flex gap-6">
        <a href="#" className="font-mono text-[10px] tracking-[2px] text-dg-text-dim hover:text-dg-green transition-colors">
          PRIVACY
        </a>
        <a href="#" className="font-mono text-[10px] tracking-[2px] text-dg-text-dim hover:text-dg-green transition-colors">
          TERMS
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
