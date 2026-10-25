const team = [
  { name: "REDACTED", role: "Lead AI Engineer", focus: "BERT · NLP · Phishing Detection" },
  { name: "REDACTED", role: "Security Architect", focus: "Threat Modeling · PII Redaction" },
  { name: "REDACTED", role: "Data Scientist", focus: "XGBoost · Anomaly Detection · GNN" },
  { name: "REDACTED", role: "Full-Stack Engineer", focus: "Platform · API · Infrastructure" },
];

const TeamSection = () => (
  <section id="about" className="px-6 md:px-16 py-24">
    <div className="mb-16">
      <span className="section-tag reveal">[ THE TEAM ]</span>
      <h2 className="reveal delay-1 font-display text-[clamp(36px,4.5vw,64px)] mt-4">
        Built by researchers.
        <br />
        <span className="text-ghost font-display italic">Deployed for everyone.</span>
      </h2>
    </div>

    <div className="grid md:grid-cols-4 gap-6">
      {team.map((t) => (
        <div
          key={t.name}
          className="reveal rounded-2xl p-8"
          style={{
            background: "#060d06",
            border: "1px solid rgba(74,222,128,0.08)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full mb-4 flex items-center justify-center font-mono text-lg text-dg-green"
            style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}
          >
            {t.name.charAt(0)}
          </div>
          <h3 className="font-display text-lg">{t.name}</h3>
          <div className="font-mono text-[10px] tracking-[2px] text-dg-green mt-1">{t.role.toUpperCase()}</div>
          <p className="font-body text-xs text-dg-text-dim mt-3">{t.focus}</p>
        </div>
      ))}
    </div>
  </section>
);

export default TeamSection;
