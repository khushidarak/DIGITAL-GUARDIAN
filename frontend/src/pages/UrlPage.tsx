import { useState } from "react";
import ParticleCanvas from "@/components/ParticleCanvas";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import AppWindow from "@/components/AppWindow";
import ResultPanel from "@/components/ResultPanel";
import { analyzeContent, type AnalysisResult } from "@/lib/analyze";

const presets = [
  { label: "⚠ Bank Look-alike", text: "https://sbi-kyc-update.xyz/login" },
  { label: "⚠ Typosquat", text: "http://paypa1-secure-login.tk/verify" },
  { label: "⚠ IP Address Link", text: "http://192.168.45.12/secure/account-verify.php" },
  { label: "✓ Legit Site", text: "https://www.wikipedia.org" },
];

const UrlPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setTerminalLog([
      "> DIGITAL GUARDIAN — WEBSITE MODULE v2.0",
      "> Parsing URL and registered domain...",
      "> Extracting 37 lexical + brand features...",
      "> Checking look-alike / leetspeak brand impersonation...",
      "> Running char n-gram + gradient boosting stack...",
    ]);

    const res = await analyzeContent(input.trim(), "url");

    setTerminalLog((prev) => [
      ...prev,
      `> FRAUD RISK SCORE: ${res.riskScore} / 100`,
      `> VERDICT: ${res.verdict}`,
      `> Signals detected: ${res.signals.length}`,
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
            style={{ border: "1px solid rgba(96,165,250,0.18)" }}
          >
            🌐 Char N-grams · Gradient Boosting · Brand Analysis
          </span>
        </div>
        <span className="section-tag">[ MODULE 04 · FAKE WEBSITE DETECTOR ]</span>
        <h1 className="font-display text-[clamp(36px,5vw,64px)] mt-4 leading-tight">
          Fake Website
          <br />
          <span className="text-ghost font-display italic">Detection</span>
        </h1>
        <p className="font-body text-sm text-dg-text-dim max-w-[560px] leading-[1.8] mt-4 mb-12">
          Paste a suspicious link below. We analyse the URL structure, look-alike brand names, risky keywords and
          hosting patterns to estimate whether it is a phishing or fake website. The link is never opened.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="rounded-2xl p-8"
            style={{ background: "#060d06", border: "1px solid rgba(96,165,250,0.12)" }}
          >
            <div className="font-mono text-[11px] tracking-[3px] mb-4" style={{ color: "#60a5fa" }}>
              [ PASTE WEBSITE URL ]
            </div>
            <div className="w-full h-px mb-6" style={{ background: "rgba(96,165,250,0.22)" }} />

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"https://example.com/login\n\nPaste the full link exactly as you received it."}
              className="w-full min-h-[120px] bg-transparent font-mono text-sm text-dg-text leading-relaxed resize-none outline-none placeholder:text-dg-text-dim/50"
            />

            <div className="flex flex-wrap gap-2 mt-4 mb-6">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setInput(p.text)}
                  className="font-mono text-[9px] tracking-[1px] px-3 py-1.5 rounded-full text-dg-text-dim hover:text-dg-green transition-colors"
                  style={{ border: "1px solid rgba(96,165,250,0.18)" }}
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
                background: "#60a5fa",
                color: "#020c02",
                boxShadow: "0 4px 20px rgba(96,165,250,0.25)",
              }}
            >
              {isAnalyzing ? "ANALYZING..." : "SCAN WEBSITE →"}
            </button>

            <div className="text-center mt-4 font-mono text-[9px] text-dg-text-dim">
              URL-only screening · not a live reputation check
            </div>
          </div>

          <ResultPanel
            result={result}
            isAnalyzing={isAnalyzing}
            accentColor="#60a5fa"
            terminalLog={terminalLog}
            moduleLabel="WEBSITE"
          />
        </div>
      </div>

      <BottomNav />
    </AppWindow>
  );
};

export default UrlPage;
