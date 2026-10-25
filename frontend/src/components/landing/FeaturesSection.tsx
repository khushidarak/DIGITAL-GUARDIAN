const features = [
  {
    icon: "⚡",
    title: "< 200ms Detection",
    desc: "Real-time threat assessment across all channels. No batch processing delays.",
  },
  {
    icon: "🔗",
    title: "Multi-Channel Correlation",
    desc: "Detects coordinated fraud spanning email, SMS, and voice simultaneously.",
  },
  {
    icon: "🧠",
    title: "Fraud Fusion Layer",
    desc: "XGBoost ensemble aggregates signals from BERT, GNN, and Isolation Forest models.",
  },
  {
    icon: "👤",
    title: "Human-in-the-Loop",
    desc: "Risk scores above 85 escalate to trained analysts. Zero false-positive tolerance.",
  },
  {
    icon: "🔒",
    title: "PII Redaction",
    desc: "Account numbers, names, OTPs are stripped before AI processing. Zero data leakage.",
  },
  {
    icon: "📊",
    title: "Graph Neural Networks",
    desc: "Maps account relationships to uncover fraud rings and money mule networks.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="px-6 md:px-16 py-24">
    <div className="text-center mb-16">
      <span className="section-tag reveal">[ CAPABILITIES ]</span>
      <h2 className="reveal delay-1 font-display text-[clamp(36px,4.5vw,64px)] mt-4">
        Built for the threat landscape
        <br />
        <span className="text-ghost font-display italic">of tomorrow.</span>
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      {features.map((f) => (
        <div
          key={f.title}
          className="reveal rounded-2xl p-8 group hover:border-dg-green/30 transition-colors"
          style={{
            background: "#060d06",
            border: "1px solid rgba(74,222,128,0.08)",
          }}
        >
          <div className="text-3xl mb-4">{f.icon}</div>
          <h3 className="font-display text-xl mb-3">{f.title}</h3>
          <p className="font-body text-sm text-dg-text-dim leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
