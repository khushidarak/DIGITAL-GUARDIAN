const layers = [
  { name: "Email Channel", models: "BERT · RoBERTa", color: "#4ade80" },
  { name: "Transaction Channel", models: "Isolation Forest · GNN", color: "#f87171" },
  { name: "Voice Channel", models: "Whisper ASR · NER", color: "#fbbf24" },
];

const AIArchitecture = () => (
  <section className="px-6 md:px-16 py-24">
    <div className="text-center mb-16">
      <span className="section-tag reveal">[ AI ARCHITECTURE ]</span>
      <h2 className="reveal delay-1 font-display text-[clamp(36px,4.5vw,64px)] mt-4">
        The Fraud Fusion
        <br />
        <span className="text-ghost font-display italic">Layer.</span>
      </h2>
    </div>

    <div className="reveal delay-2 max-w-3xl mx-auto">
      {/* Channel inputs */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {layers.map((l) => (
          <div
            key={l.name}
            className="rounded-xl p-6 text-center"
            style={{
              border: `1px solid ${l.color}22`,
              background: `${l.color}08`,
            }}
          >
            <div className="font-mono text-[11px] tracking-[2px] mb-2" style={{ color: l.color }}>
              {l.name.toUpperCase()}
            </div>
            <div className="font-mono text-[9px] text-dg-text-dim">{l.models}</div>
          </div>
        ))}
      </div>

      {/* Connector lines */}
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center">
          <div className="w-px h-8" style={{ background: "rgba(74,222,128,0.20)" }} />
          <div className="font-mono text-[9px] text-dg-text-dim tracking-[2px]">CONVERGE</div>
          <div className="w-px h-8" style={{ background: "rgba(74,222,128,0.20)" }} />
        </div>
      </div>

      {/* Fusion layer */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          border: "1px solid rgba(74,222,128,0.25)",
          background: "linear-gradient(135deg, rgba(74,222,128,0.06), transparent)",
          boxShadow: "0 0 60px rgba(74,222,128,0.06)",
        }}
      >
        <div className="font-mono text-[11px] tracking-[3px] text-dg-green mb-2">
          FRAUD FUSION LAYER
        </div>
        <div className="font-display text-2xl mb-2">XGBoost Ensemble</div>
        <p className="font-body text-sm text-dg-text-dim max-w-md mx-auto">
          Cross-correlates signals from all three AI channels. Detects coordinated multi-vector attacks that siloed systems miss.
        </p>
      </div>

      {/* Output */}
      <div className="flex justify-center mt-4 mb-4">
        <div className="w-px h-8" style={{ background: "rgba(74,222,128,0.20)" }} />
      </div>

      <div className="flex justify-center gap-4">
        <div className="rounded-full px-6 py-3 font-mono text-[10px] tracking-[2px] text-dg-green" style={{ border: "1px solid rgba(74,222,128,0.20)" }}>
          RISK SCORE 0–100
        </div>
        <div className="rounded-full px-6 py-3 font-mono text-[10px] tracking-[2px] text-dg-amber" style={{ border: "1px solid rgba(251,191,36,0.20)" }}>
          85+ → HUMAN REVIEW
        </div>
      </div>
    </div>
  </section>
);

export default AIArchitecture;
