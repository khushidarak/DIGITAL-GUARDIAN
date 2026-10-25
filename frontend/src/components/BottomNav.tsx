import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const landingItems = [
    { label: "Home", href: "/" },
    { label: "Threats", href: "/#threats" },
    { label: "How It Works", href: "/#how" },
    { label: "Features", href: "/#features" },
    { label: "• About", href: "/#about" },
  ];

  const toolItems = [
    { label: "← Home", href: "/" },
    { label: "📧 Email", href: "/email" },
    { label: "💳 Transactions", href: "/transaction" },
    { label: "📞 Calls", href: "/call" },
    { label: "🌐 Websites", href: "/url" },
    { label: "• About", href: "/#about" },
  ];

  const items = isLanding ? landingItems : toolItems;

  return (
    <div className="sticky bottom-0 z-50 flex justify-center p-4 pointer-events-none">
      <div
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 pointer-events-auto"
        style={{
          background: "rgba(8, 18, 8, 0.88)",
          border: "1px solid rgba(74, 222, 128, 0.18)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.55), 0 0 0 1px rgba(74,222,128,0.05)",
        }}
      >
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center">
            {i > 0 && (
              <div className="w-px h-[18px] mx-1" style={{ background: "rgba(74,222,128,0.12)" }} />
            )}
            <Link
              to={item.href}
              className={`font-mono text-[11px] tracking-[0.5px] px-3 md:px-[18px] py-2 rounded-full transition-all ${
                location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href))
                  ? "text-dg-green"
                  : "text-dg-text-dim hover:text-dg-text"
              }`}
              style={
                location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href))
                  ? { background: "rgba(74,222,128,0.11)" }
                  : {}
              }
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
