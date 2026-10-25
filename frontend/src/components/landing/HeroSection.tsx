import { useEffect, useRef, useState } from "react";

const useCountUp = (end: number, duration = 2000, triggerRef?: React.RefObject<HTMLDivElement | null>) => {
  const [value, setValue] = useState(0);
  const ownRef = useRef<HTMLDivElement>(null);
  const ref = triggerRef || ownRef;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, ref]);

  return { value, ref };
};

const HeroSection = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const stat1 = useCountUp(200, 1800, statsRef);
  const stat2 = useCountUp(800, 2000, statsRef);
  const stat3 = useCountUp(54000, 2200, statsRef);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-20 overflow-hidden">
      {/* Background orb */}
      <div
        data-parallax="0.18"
        className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Grid */}
      <div
        data-parallax="0.30"
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,222,128,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl">
        {/* Eyebrow */}
        <div className="reveal mb-8">
          <span
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[4px] text-dg-text-dim rounded-full px-[18px] py-2"
            style={{ border: "1px solid rgba(74,222,128,0.12)" }}
          >
            <span className="w-[6px] h-[6px] rounded-full bg-dg-red animate-blink" />
            REAL-TIME AI FRAUD DETECTION — ACTIVE
          </span>
        </div>

        {/* Headline */}
        <h1 className="reveal delay-1 font-display text-[clamp(48px,7vw,110px)] leading-[0.94] mb-8">
          We are{" "}
          <span className="text-dg-green animate-pulse_glow">⌇⌇⌇</span>{" "}
          a boutique
          <br />
          <span className="text-ghost font-display italic">cyber security</span>{" "}
          system
        </h1>

        {/* Sub */}
        <p className="reveal delay-2 font-body text-[15px] text-dg-text-dim max-w-[520px] leading-[1.8] mb-10">
          Protecting emails, calls & banking transactions through AI-powered multi-channel correlation.
        </p>

        {/* CTAs */}
        <div className="reveal delay-3 flex flex-wrap gap-4 mb-16">
          <a
            href="#threats"
            className="inline-flex items-center font-body text-[13px] font-semibold px-8 py-4 rounded-full transition-all hover:-translate-y-0.5"
            style={{
              background: "#4ade80",
              color: "#020c02",
              boxShadow: "0 4px 20px rgba(74,222,128,0.2)",
            }}
          >
            Explore Threat Detectors ↓
          </a>
          <a
            href="#how"
            className="inline-flex items-center font-body text-[13px] px-8 py-4 rounded-full text-dg-green transition-all hover:border-dg-green"
            style={{ border: "1px solid rgba(74,222,128,0.12)" }}
          >
            How It Works
          </a>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="reveal delay-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {[
            { value: `< ${stat1.value}ms`, label: "Detection Speed" },
            { value: `${stat2.value}+`, label: "Frauds / Day" },
            { value: `₹${stat3.value.toLocaleString()} Cr`, label: "Lost to Scams" },
            { value: "3", label: "Channels" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-mono font-bold text-dg-green text-[clamp(24px,3vw,32px)]">
                {s.value}
              </div>
              <div className="font-body text-dg-text-dim text-[11px] tracking-[1px] mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dg-text-dim">
        <span className="font-mono text-[9px] tracking-[3px]">SCROLL</span>
        <span className="animate-bob text-lg">↓</span>
      </div>
    </section>
  );
};

export default HeroSection;
