const steps = [
  {
    num: "01",
    title: "Ingest",
    desc: "Email, SMS, transaction data, or call recordings flow into our multi-channel ingestion pipeline. PII is redacted before processing.",
  },
  {
    num: "02",
    title: "Analyze",
    desc: "Channel-specific AI models run concurrently — BERT for email, Isolation Forest for transactions, Whisper ASR + NER for calls.",
  },
  {
    num: "03",
    title: "Correlate",
    desc: "The Fraud Fusion Layer (XGBoost ensemble) cross-references signals across all channels for coordinated attack detection.",
  },
  {
    num: "04",
    title: "Act",
    desc: "Risk scores above 85 trigger human-in-the-loop review. Automated alerts, account freezing, and forensic reports deploy in real-time.",
  },
];

const HowItWorks = () => (
  <section id="how" className="px-6 md:px-16 py-24">
    <div className="mb-16">
      <span className="section-tag reveal">[ HOW IT WORKS ]</span>
      <h2 className="reveal delay-1 font-display text-[clamp(36px,4.5vw,64px)] mt-4">
        Four stages.
        <br />
        <span className="text-ghost font-display italic">Zero blind spots.</span>
      </h2>
    </div>

    <div className="grid md:grid-cols-4 gap-6">
      {steps.map((s) => (
        <div
          key={s.num}
          className="reveal rounded-2xl p-8"
          style={{
            background: "#060d06",
            border: "1px solid rgba(74,222,128,0.10)",
          }}
        >
          <span className="font-mono text-4xl font-bold text-dg-green opacity-30">{s.num}</span>
          <h3 className="font-display text-2xl mt-4 mb-3">{s.title}</h3>
          <p className="font-body text-sm text-dg-text-dim leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
