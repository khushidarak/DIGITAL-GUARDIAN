import { useState } from "react";
import ParticleCanvas from "@/components/ParticleCanvas";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import AppWindow from "@/components/AppWindow";
import ResultPanel from "@/components/ResultPanel";
import { analyzeContent, type AnalysisResult } from "@/lib/analyze";

const presets = [
  {
    label: "⚠ Phishing Alert",
    text: `Dear Customer,

We have detected suspicious activity on your account. Your account has been temporarily suspended. 

Please click here to verify your identity immediately: http://secure-bank-verify.tk/login

You must complete verification within 24 hours or your account will be permanently blocked. Share your OTP and password to restore access.

Regards,
Bank Security Team`,
  },
  {
    label: "⚠ Prize Scam",
    text: `Congratulations! You have won ₹50,00,000 in the International Lottery! 

To claim your prize, transfer ₹5,000 processing fee to the following account immediately. This is urgent — the prize will expire in 2 hours.

Contact: lottery.claims@gmail.com
Reference: LT-2024-WINNER`,
  },
  {
    label: "✓ Legit Email",
    text: `Hi,

Your order #ORD-2024-7845 has been shipped and is expected to arrive by March 18, 2026.

You can track your package using the tracking number provided in your account dashboard.

Thanks for shopping with us!
Customer Support Team`,
  },
];

const EmailPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setTerminalLog([
      "> DIGITAL GUARDIAN — EMAIL MODULE v2.0",
      "> Loading BERT + RoBERTa NLP pipeline...",
      "> Tokenizing input... " + input.length + " characters",
      "> Running phishing pattern detection...",
      "> Analyzing sender domain reputation...",
      "> Extracting embedded URLs...",
      "> Sentiment analysis: processing...",
    ]);

    const res = await analyzeContent(input, "email");

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
        {/* Hero */}
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[2px] text-dg-text-dim rounded-full px-4 py-1.5"
            style={{ border: "1px solid rgba(74,222,128,0.12)" }}
          >
            🧠 BERT · RoBERTa · Domain Analysis
          </span>
        </div>
        <span className="section-tag">[ MODULE 01 · EMAIL PHISHING DETECTOR ]</span>
        <h1 className="font-display text-[clamp(36px,5vw,64px)] mt-4 leading-tight">
          Email Phishing
          <br />
          <span className="text-ghost font-display italic">Detection</span>
        </h1>
        <p className="font-body text-sm text-dg-text-dim max-w-[560px] leading-[1.8] mt-4 mb-12">
          Paste a suspicious email below. Our NLP pipeline analyzes sender patterns, embedded links, urgency language, and social engineering tactics to generate a fraud risk score.
        </p>

        {/* Analysis panel */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input */}
          <div
            className="rounded-2xl p-8"
            style={{ background: "#060d06", border: "1px solid rgba(74,222,128,0.10)" }}
          >
            <div className="font-mono text-[11px] tracking-[3px] text-dg-green mb-4">
              [ PASTE EMAIL CONTENT ]
            </div>
            <div className="w-full h-px mb-6" style={{ background: "rgba(74,222,128,0.20)" }} />

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Paste the suspicious email content here...\n\nInclude the full email body — subject line, sender info, and message content for best results."}
              className="w-full min-h-[250px] bg-transparent font-body text-sm text-dg-text leading-relaxed resize-none outline-none placeholder:text-dg-text-dim/50"
            />

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mt-4 mb-6">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setInput(p.text)}
                  className="font-mono text-[9px] tracking-[1px] px-3 py-1.5 rounded-full text-dg-text-dim hover:text-dg-green transition-colors"
                  style={{ border: "1px solid rgba(74,222,128,0.12)" }}
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
                background: "#4ade80",
                color: "#020c02",
                boxShadow: "0 4px 20px rgba(74,222,128,0.2)",
              }}
            >
              {isAnalyzing ? "ANALYZING..." : "ANALYZE EMAIL →"}
            </button>

            <div className="text-center mt-4 font-mono text-[9px] text-dg-text-dim">
              Powered by BERT · RoBERTa · Domain Reputation AI
            </div>
          </div>

          {/* Result */}
          <ResultPanel
            result={result}
            isAnalyzing={isAnalyzing}
            accentColor="#4ade80"
            terminalLog={terminalLog}
            moduleLabel="EMAIL"
          />
        </div>
      </div>

      <BottomNav />
    </AppWindow>
  );
};

export default EmailPage;
