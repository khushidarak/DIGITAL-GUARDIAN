import { useState } from "react";
import ParticleCanvas from "@/components/ParticleCanvas";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import AppWindow from "@/components/AppWindow";
import ResultPanel from "@/components/ResultPanel";
import { analyzeContent, type AnalysisResult } from "@/lib/analyze";

const presets = [
  {
    label: "⚠ Fake OTP SMS",
    text: `URGENT: Your SBI account has been blocked due to suspicious activity. Share your OTP 847291 to restore access immediately. Call 1800-XXX-XXXX. Failure to verify within 30 minutes will result in permanent account suspension.`,
  },
  {
    label: "⚠ UPI Fraud Alert",
    text: `Alert: ₹49,999 debited from your account ending 4521. If not authorized, click here to block your card and share your password: http://secure-bank.tk/verify. Transfer remaining balance to safe account immediately.`,
  },
  {
    label: "✓ Legit Transaction",
    text: `Transaction alert: ₹2,450 debited from account ending 7823 at Amazon India on 14-Mar-2026. Available balance: ₹45,230. If not you, call 1800-425-0000.`,
  },
];

const TransactionPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setTerminalLog([
      "> DIGITAL GUARDIAN — TRANSACTION MODULE v2.0",
      "> Loading Isolation Forest + GNN pipeline...",
      "> Parsing transaction data... " + input.length + " characters",
      "> Running anomaly detection...",
      "> Checking against fraud pattern database...",
      "> Graph neural network: mapping relationships...",
    ]);

    const res = await analyzeContent(input, "transaction");

    setTerminalLog((prev) => [
      ...prev,
      `> FRAUD RISK SCORE: ${res.riskScore} / 100`,
      `> VERDICT: ${res.verdict}`,
      `> Analysis complete.`,
    ]);
    setResult(res);
    setIsAnalyzing(false);
  };

  return (
    <AppWindow>
      <ParticleCanvas />
      <TopNav />

      <div className="relative z-10 px-6 md:px-16 py-16">
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[2px] text-dg-text-dim rounded-full px-4 py-1.5"
            style={{ border: "1px solid rgba(248,113,113,0.15)" }}
          >
            🔍 Isolation Forest · GNN · Anomaly Detection
          </span>
        </div>
        <span className="section-tag">[ MODULE 02 · TRANSACTION FRAUD DETECTOR ]</span>
        <h1 className="font-display text-[clamp(36px,5vw,64px)] mt-4 leading-tight">
          Transaction Fraud
          <br />
          <span className="text-ghost font-display italic">Detection</span>
        </h1>
        <p className="font-body text-sm text-dg-text-dim max-w-[560px] leading-[1.8] mt-4 mb-12">
          Paste a suspicious SMS, bank notification, or transaction alert. Our anomaly detection pipeline flags fake OTP requests, phishing bank messages, and social engineering patterns.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="rounded-2xl p-8"
            style={{ background: "#060d06", border: "1px solid rgba(248,113,113,0.10)" }}
          >
            <div className="font-mono text-[11px] tracking-[3px] text-dg-red mb-4">
              [ PASTE TRANSACTION / SMS CONTENT ]
            </div>
            <div className="w-full h-px mb-6" style={{ background: "rgba(248,113,113,0.20)" }} />

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Paste the suspicious SMS or transaction alert here...\n\nExample:\nURGENT: Your account has been blocked. Share OTP to restore access."}
              className="w-full min-h-[250px] bg-transparent font-body text-sm text-dg-text leading-relaxed resize-none outline-none placeholder:text-dg-text-dim/50"
            />

            <div className="flex flex-wrap gap-2 mt-4 mb-6">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setInput(p.text)}
                  className="font-mono text-[9px] tracking-[1px] px-3 py-1.5 rounded-full text-dg-text-dim hover:text-dg-red transition-colors"
                  style={{ border: "1px solid rgba(248,113,113,0.12)" }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !input.trim()}
              className="w-full py-4 rounded-lg font-mono text-[12px] tracking-[2.5px] font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "#f87171",
                color: "#1a0000",
                boxShadow: "0 4px 20px rgba(248,113,113,0.2)",
              }}
            >
              {isAnalyzing ? "ANALYZING..." : "ANALYZE TRANSACTION →"}
            </button>

            <div className="text-center mt-4 font-mono text-[9px] text-dg-text-dim">
              Powered by Isolation Forest · GNN · Anomaly Detection AI
            </div>
          </div>

          <ResultPanel
            result={result}
            isAnalyzing={isAnalyzing}
            accentColor="#f87171"
            terminalLog={terminalLog}
            moduleLabel="TRANSACTION"
          />
        </div>
      </div>

      <BottomNav />
    </AppWindow>
  );
};

export default TransactionPage;
