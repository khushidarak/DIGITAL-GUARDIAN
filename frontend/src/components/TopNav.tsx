import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isToolPage = location.pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 w-full px-6 md:px-10 py-5 flex items-center justify-between"
      style={{
        backdropFilter: "blur(20px)",
        background: "rgba(3, 8, 3, 0.75)",
        borderBottom: scrolled ? "1px solid rgba(74,222,128,0.12)" : "1px solid transparent",
        transition: "border-color 0.4s ease",
      }}
    >
      <div className="flex items-center gap-4">
        <Link to="/" className="font-mono text-sm tracking-[3px] text-dg-green">
          ⊲⊳ DIGITAL GUARDIAN
        </Link>
        {isToolPage && (
          <Link
            to="/"
            className="font-mono text-[11px] text-dg-text-dim hover:text-dg-green transition-colors"
          >
            ← Back
          </Link>
        )}
      </div>
      <Link
        to="/contact"
        className="flex items-center gap-2 rounded-full px-5 py-2 font-body text-[13px] text-dg-text transition-all hover:border-dg-green"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
      >
        Contact
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "#4ade80", color: "#020c02" }}
        >
          ↗
        </span>
      </Link>
    </nav>
  );
};

export default TopNav;
