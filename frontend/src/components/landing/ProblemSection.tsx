const ProblemSection = () => (
  <section className="px-6 md:px-16 py-24 relative overflow-hidden">
    <div
      data-parallax="0.08"
      className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
      style={{
        background: "radial-gradient(circle, rgba(248,113,113,0.06) 0%, transparent 70%)",
      }}
    />
    <div className="relative z-10 max-w-3xl">
      <span className="section-tag reveal">[ THE PROBLEM ]</span>
      <h2 className="reveal delay-1 font-display text-[clamp(36px,4.5vw,64px)] mt-4 mb-8">
        ₹54,000 Cr lost.
        <br />
        <span className="text-ghost font-display italic">800+ frauds daily.</span>
      </h2>
      <p className="reveal delay-2 font-body text-lg text-dg-text-dim leading-relaxed mb-6">
        India faces an unprecedented wave of digital fraud — from phishing emails impersonating banks, to "digital arrest" scams where criminals pose as police officers to extort victims over phone calls.
      </p>
      <p className="reveal delay-3 font-body text-lg text-dg-text-dim leading-relaxed">
        Existing fraud detection operates in silos. Email filters don't talk to transaction monitors. Call screening ignores SMS patterns. Attackers exploit these gaps with coordinated multi-channel campaigns.
      </p>
      <div className="reveal delay-4 mt-10 flex gap-8">
        <div>
          <div className="font-mono font-bold text-dg-red text-3xl">₹54,000 Cr</div>
          <div className="font-body text-dg-text-dim text-xs mt-1">Lost to digital arrest scams</div>
        </div>
        <div>
          <div className="font-mono font-bold text-dg-red text-3xl">800+</div>
          <div className="font-body text-dg-text-dim text-xs mt-1">Fraud cases per day</div>
        </div>
      </div>
    </div>
  </section>
);

export default ProblemSection;
