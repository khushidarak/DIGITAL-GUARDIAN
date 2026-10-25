import { type AnalysisResult } from "@/lib/analyze";

interface ResultPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  accentColor: string;
  terminalLog: string[];
  moduleLabel: string;
}

const RiskGauge = ({ score, color }: { score: number; color: string }) => {
  const radius = 70;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const gaugeColor = score > 70 ? "#f87171" : score > 40 ? "#fbbf24" : "#4ade80";

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="100" viewBox="0 0 180 100">
        <path
          d="M 10 90 A 70 70 0 0 1 170 90"
          fill="none"
          stroke="rgba(74,222,128,0.08)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 10 90 A 70 70 0 0 1 170 90"
          fill="none"
          stroke={gaugeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <text
          x="90"
          y="80"
          textAnchor="middle"
          fill={gaugeColor}
          fontFamily="'Space Mono', monospace"
          fontWeight="700"
          fontSize="36"
        >
          {score}
        </text>
        <text
          x="90"
          y="95"
          textAnchor="middle"
          fill="#6b8f6b"
          fontFamily="'Space Mono', monospace"
          fontSize="8"
          letterSpacing="2"
        >
          RISK SCORE
        </text>
      </svg>
    </div>
  );
};

const ResultPanel = ({ result, isAnalyzing, accentColor, terminalLog, moduleLabel }: ResultPanelProps) => {
  if (!result && !isAnalyzing) {
    return (
      <div
        className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px]"
        style={{
          background: "#060d06",
          border: "1px solid rgba(74,222,128,0.08)",
        }}
      >
        <div className="font-mono text-[10px] tracking-[3px] text-dg-text-dim mb-4">
          [ {moduleLabel} RESULT ]
        </div>
        <div className="text-4xl mb-4 opacity-30">🛡</div>
        <p className="font-body text-sm text-dg-text-dim text-center max-w-xs">
          Submit content for analysis. Results will appear here with risk scoring and signal detection.
        </p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div
        className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px]"
        style={{
          background: "#060d06",
          border: `1px solid ${accentColor}22`,
        }}
      >
        <div className="asr-bars mb-6">
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ background: accentColor }} />
          ))}
        </div>
        <div className="font-mono text-[11px] tracking-[2px] mb-4" style={{ color: accentColor }}>
          ANALYZING...
        </div>
        <div className="w-full max-w-[200px] h-[3px] rounded-full overflow-hidden" style={{ background: `${accentColor}22` }}>
          <div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
              width: "68%",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    );
  }

  if (!result) return null;

  const verdictColor = result.riskScore > 70 ? "#f87171" : result.riskScore > 40 ? "#fbbf24" : "#4ade80";

  return (
    <div
      className="rounded-2xl p-8 min-h-[500px]"
      style={{
        background: "#060d06",
        border: `1px solid ${accentColor}22`,
      }}
    >
      <div className="font-mono text-[10px] tracking-[3px] text-dg-text-dim mb-6">
        [ {moduleLabel} RESULT ]
      </div>

      <RiskGauge score={result.riskScore} color={accentColor} />

      {/* Verdict */}
      <div
        className="text-center font-mono text-sm font-bold tracking-[3px] mt-4 mb-6 py-2 rounded-full"
        style={{
          color: verdictColor,
          background: `${verdictColor}11`,
          border: `1px solid ${verdictColor}33`,
        }}
      >
        {result.verdict}
      </div>

      {/* Signals */}
      <div className="flex flex-wrap gap-2 mb-6">
        {result.signals.map((s, i) => (
          <span
            key={i}
            className={`font-mono text-[9px] tracking-[1px] px-3 py-1.5 rounded-full ${
              s.type === "danger" ? "signal-danger" : s.type === "warn" ? "signal-warn" : "signal-safe"
            }`}
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* Explanation */}
      <div className="mb-4">
        <div className="font-mono text-[9px] tracking-[2px] text-dg-text-dim mb-2">ANALYSIS</div>
        <p className="font-body text-sm text-dg-text leading-relaxed">{result.explanation}</p>
      </div>

      <div className="mb-6">
        <div className="font-mono text-[9px] tracking-[2px] text-dg-text-dim mb-2">RECOMMENDATION</div>
        <p className="font-body text-sm leading-relaxed" style={{ color: accentColor }}>
          {result.recommendation}
        </p>
      </div>

      {/* Terminal log */}
      <div
        className="rounded-xl p-4 overflow-auto max-h-[200px]"
        style={{ background: "#020602", border: "1px solid rgba(74,222,128,0.06)" }}
      >
        <div className="font-mono text-[9px] tracking-[2px] text-dg-text-dim mb-2">TERMINAL LOG</div>
        {terminalLog.map((line, i) => (
          <div key={i} className="font-mono text-[10px] text-dg-green/70 leading-relaxed">
            {line}
          </div>
        ))}
      </div>

      {/* AI notice */}
      <div
        className="mt-4 text-center font-mono text-[9px] tracking-[1px] py-2 rounded-lg"
        style={{ background: "rgba(251,191,36,0.06)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.12)" }}
      >
        ⚠ Pattern-based analysis — connect AI backend for full detection
      </div>
    </div>
  );
};

export default ResultPanel;
