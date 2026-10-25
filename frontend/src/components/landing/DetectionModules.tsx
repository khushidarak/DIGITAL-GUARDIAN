import { Link } from "react-router-dom";

const modules = [
  {
    icon: "📧",
    title: "Email Phishing",
    subtitle: "Detector",
    desc: "BERT & RoBERTa NLP models analyze sender domains, embedded links, urgency language, and social engineering patterns in real-time.",
    stats: ["94% Accuracy", "< 200ms", "BERT + RoBERTa"],
    color: "#4ade80",
    borderColor: "rgba(74, 222, 128, 0.15)",
    glowColor: "rgba(74, 222, 128, 0.08)",
    href: "/email",
    tag: "MODULE 01",
  },
  {
    icon: "💳",
    title: "Transaction Fraud",
    subtitle: "Detector",
    desc: "Isolation Forest anomaly detection combined with GNN relationship mapping flags suspicious transactions, fake OTP SMS, and phishing bank alerts.",
    stats: ["Anomaly Detection", "GNN Mapping", "Isolation Forest"],
    color: "#f87171",
    borderColor: "rgba(248, 113, 113, 0.15)",
    glowColor: "rgba(248, 113, 113, 0.08)",
    href: "/transaction",
    tag: "MODULE 02",
  },
  {
    icon: "📞",
    title: "Call Scam",
    subtitle: "Detector",
    desc: "Whisper ASR transcribes calls, then NER + sentiment analysis detects authority impersonation, OTP extraction, and digital arrest scam patterns.",
    stats: ["Whisper ASR", "NER Analysis", "Sentiment AI"],
    color: "#fbbf24",
    borderColor: "rgba(251, 191, 36, 0.15)",
    glowColor: "rgba(251, 191, 36, 0.08)",
    href: "/call",
    tag: "MODULE 03",
  },
  {
    icon: "🌐",
    title: "Fake Website",
    subtitle: "Detector",
    desc: "Paste any link. Character n-gram + gradient boosting stack checks brand look-alikes, suspicious keywords, IP hosts and shortened URLs before you click.",
    stats: ["~97% Accuracy", "< 10ms", "URL-only Scan"],
    color: "#60a5fa",
    borderColor: "rgba(96, 165, 250, 0.15)",
    glowColor: "rgba(96, 165, 250, 0.08)",
    href: "/url",
    tag: "MODULE 04",
  },
];

const DetectionModules = () => {
  return (
    <section id="threats" className="px-6 md:px-16 py-24">
      <div className="text-center mb-16">
        <span className="section-tag reveal">[ CHOOSE YOUR DETECTION MODULE ]</span>
        <h2 className="reveal delay-1 font-display text-[clamp(36px,4.5vw,64px)] mt-4">
          Four tools. One mission.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((m) => (
          <Link
            key={m.tag}
            to={m.href}
            className="tilt-card reveal group block rounded-2xl p-8 min-h-[440px] flex flex-col justify-between transition-all"
            style={{
              background: `linear-gradient(135deg, ${m.glowColor}, transparent 60%)`,
              border: `1px solid ${m.borderColor}`,
            }}
          >
            <div>
              <span className="font-mono text-[10px] tracking-[3px] text-dg-text-dim">
                [ {m.tag} ]
              </span>
              <div className="text-4xl mt-4 mb-6">{m.icon}</div>
              <h3 className="font-display text-3xl leading-tight">
                {m.title}
                <br />
                <span className="text-ghost font-display italic">{m.subtitle}</span>
              </h3>
              <p className="font-body text-sm text-dg-text-dim mt-4 leading-relaxed">{m.desc}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {m.stats.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[9px] tracking-[1px] rounded-full px-3 py-1"
                  style={{ border: `1px solid ${m.borderColor}`, color: m.color }}
                >
                  {s}
                </span>
              ))}
            </div>
            <div
              className="mt-6 font-mono text-[11px] tracking-[2px] transition-colors"
              style={{ color: m.color }}
            >
              LAUNCH SCANNER →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DetectionModules;
