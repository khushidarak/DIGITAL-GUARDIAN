import { useState, useRef, useCallback } from "react";
import ParticleCanvas from "@/components/ParticleCanvas";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import AppWindow from "@/components/AppWindow";
import ResultPanel from "@/components/ResultPanel";
import { analyzeContent, analyzeAudioFile, type AnalysisResult } from "@/lib/analyze";

const transcriptPresets = [
  {
    label: "⚠ Digital Arrest Scam",
    text: `Caller: Hello, am I speaking with the account holder?
Victim: Yes, who is this?
Caller: Sir, this is the RBI cyber crime division. We have identified your account in a money laundering investigation. Your Aadhaar has been linked to 14 illegal transactions.
Victim: What? I haven't done anything wrong!
Caller: Sir, we have a warrant for your immediate arrest. The only way to avoid this is to verify your identity. Share your OTP now and transfer your funds to our secure RBI account for investigation.
Victim: This sounds serious...
Caller: It IS serious. If you don't comply within 10 minutes, police will arrive at your location. Share your OTP immediately.`,
  },
  {
    label: "⚠ OTP Extraction Call",
    text: `Caller: Good afternoon, I'm calling from your bank's security department. We've detected an unauthorized transaction of ₹89,000 from your account.
Victim: Oh no, I didn't make that transaction!
Caller: Don't worry, we can block it immediately. For verification, I need your account number and the OTP you'll receive now.
Victim: Okay, I just got an OTP - 847291
Caller: Thank you, and to complete the block, please share your net banking password as well.`,
  },
  {
    label: "✓ Legit Bank Call",
    text: `Agent: Hello, this is State Bank customer service. Am I speaking with the account holder?
Customer: Yes, I called about my credit card statement.
Agent: Of course, I can help with that. For security, could you please verify the last 4 digits of your card number?
Customer: 7823
Agent: Thank you. Your current outstanding balance is ₹12,450. Your payment is due on March 25th. Would you like me to email the detailed statement?
Customer: Yes please, that would be great.
Agent: Done! You'll receive it within 24 hours. Is there anything else I can help with?`,
  },
];

const acceptedTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/webm", "audio/x-m4a"];
const acceptedExts = [".mp3", ".wav", ".ogg", ".m4a", ".webm"];

const CallPage = () => {
  const [mode, setMode] = useState<"audio" | "transcript">("audio");
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingLabel, setProcessingLabel] = useState("Transcribing audio…");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showProcessing, setShowProcessing] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderWaveform = useCallback(async (audioFile: File) => {
    try {
      const ctx = new AudioContext();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const data = audioBuffer.getChannelData(0);
      const samples = 100;
      const step = Math.ceil(data.length / samples);
      const peaks: number[] = [];
      for (let i = 0; i < samples; i++) {
        let max = 0;
        for (let j = 0; j < step; j++) {
          const val = Math.abs(data[i * step + j] || 0);
          if (val > max) max = val;
        }
        peaks.push(max);
      }
      setWaveformData(peaks);
    } catch {
      setWaveformData([]);
    }
  }, []);

  const handleFile = (f: File) => {
    if (f.size > 50 * 1024 * 1024) {
      alert("File too large. Maximum 50MB.");
      return;
    }
    setFile(f);
    renderWaveform(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleAnalyze = async () => {
    if (mode === "audio" && file) {
      await analyzeAudio();
    } else if (mode === "transcript" && input.trim()) {
      await analyzeTranscript();
    }
  };

  const analyzeAudio = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setResult(null);
    setShowProcessing(true);
    setProcessingProgress(0);

    const labels = ["Transcribing audio…", "Running NER extraction…", "Analyzing sentiment…", "Generating risk score…"];
    let idx = 0;
    const labelInterval = setInterval(() => {
      idx = (idx + 1) % labels.length;
      setProcessingLabel(labels[idx]);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProcessingProgress((p) => Math.min(p + Math.random() * 4, 92));
    }, 200);

    setTerminalLog([
      "> DIGITAL GUARDIAN — CALL MODULE v2.0",
      `> Audio file received: ${file.name} (${(file.size / 1024).toFixed(0)}KB)`,
      "> Sending to backend: POST /api/detect_call_audio",
      "> Whisper ASR: transcribing audio...",
      "> Running Named Entity Recognition (NER)...",
    ]);

    // Call real backend audio endpoint
    const res = await analyzeAudioFile(file);

    clearInterval(labelInterval);
    clearInterval(progressInterval);
    setProcessingProgress(100);

    setTerminalLog((prev) => [
      ...prev,
      res.transcript ? `> Transcript: "${res.transcript.slice(0, 60)}..."` : "> Audio analysis complete",
      `> Model: ${res.modelUsed ?? "scam_classifier.pkl"}`,
      `> FRAUD RISK SCORE: ${res.riskScore} / 100`,
      `> VERDICT: ${res.verdict}`,
    ]);

    setTimeout(() => {
      setShowProcessing(false);
      setResult(res);
      setIsAnalyzing(false);
    }, 600);
  };

  const analyzeTranscript = async () => {
    setIsAnalyzing(true);
    setResult(null);
    setTerminalLog([
      "> DIGITAL GUARDIAN — CALL MODULE v2.0",
      "> Loading Whisper ASR transcript processor...",
      "> Running Named Entity Recognition (NER)...",
      "> Analyzing sentiment patterns...",
    ]);

    const res = await analyzeContent(input, "call");

    setTerminalLog((prev) => [
      ...prev,
      `> FRAUD RISK SCORE: ${res.riskScore} / 100`,
      `> VERDICT: ${res.verdict}`,
      `> Analysis complete.`,
    ]);
    setResult(res);
    setIsAnalyzing(false);
  };

  const canAnalyze = mode === "audio" ? !!file : !!input.trim();

  return (
    <AppWindow>
      <ParticleCanvas />
      <TopNav />

      <div className="relative z-10 px-6 md:px-16 py-16">
        {/* Hero */}
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[2px] text-dg-text-dim rounded-full px-4 py-1.5"
            style={{ border: "1px solid rgba(251,191,36,0.15)" }}
          >
            🎙 Whisper ASR · NER Analysis · Sentiment Detection
          </span>
        </div>
        <span className="section-tag">[ MODULE 03 · CALL SCAM DETECTOR ]</span>
        <h1 className="font-display text-[clamp(36px,5vw,64px)] mt-4 leading-tight">
          Call Scam
          <br />
          <span className="text-ghost font-display italic">Detection</span>
        </h1>
        <p className="font-body text-sm text-dg-text-dim max-w-[560px] leading-[1.8] mt-4 mb-12">
          Upload a call recording or paste a transcript. Our ASR pipeline converts audio to text, then runs Named Entity Recognition and sentiment analysis to detect OTP extraction, authority impersonation, and psychological manipulation patterns.
        </p>

        {/* Analysis panel */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input */}
          <div
            className="rounded-2xl p-8"
            style={{ background: "#060d06", border: "1px solid rgba(251,191,36,0.10)" }}
          >
            <div className="font-mono text-[11px] tracking-[3px] text-dg-amber mb-4">
              [ UPLOAD RECORDING OR PASTE TRANSCRIPT ]
            </div>
            <div className="w-full h-px mb-6" style={{ background: "rgba(251,191,36,0.20)" }} />

            {/* Tab toggle */}
            <div className="flex border-b mb-6" style={{ borderColor: "rgba(251,191,36,0.12)" }}>
              <button
                onClick={() => setMode("audio")}
                className={`font-body text-[13px] px-5 py-2.5 transition-all ${
                  mode === "audio" ? "text-dg-amber border-b-2" : "text-dg-text-dim"
                }`}
                style={mode === "audio" ? { borderColor: "#fbbf24" } : {}}
              >
                🎵 Upload Audio File
              </button>
              <button
                onClick={() => setMode("transcript")}
                className={`font-body text-[13px] px-5 py-2.5 transition-all ${
                  mode === "transcript" ? "text-dg-amber border-b-2" : "text-dg-text-dim"
                }`}
                style={mode === "transcript" ? { borderColor: "#fbbf24" } : {}}
              >
                📝 Paste Transcript
              </button>
            </div>

            {/* Audio mode */}
            {mode === "audio" && !showProcessing && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".mp3,.wav,.ogg,.m4a,.webm"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />

                {!file ? (
                  <div
                    className={`w-full min-h-[200px] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isDragOver ? "" : ""
                    }`}
                    style={{
                      border: isDragOver
                        ? "1.5px dashed rgba(251,191,36,0.65)"
                        : "1.5px dashed rgba(251,191,36,0.30)",
                      background: isDragOver
                        ? "rgba(251,191,36,0.055)"
                        : "rgba(251,191,36,0.025)",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={onDrop}
                  >
                    <div className="text-4xl mb-3">🎙</div>
                    <div className="font-display text-xl text-dg-text mb-1">Drop audio file here</div>
                    <div className="font-body text-[13px] text-dg-text-dim mb-4">or click to browse</div>
                    <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                      {acceptedExts.map((ext) => (
                        <span
                          key={ext}
                          className="font-mono text-[9px] px-2.5 py-1 rounded text-dg-text-dim"
                          style={{ border: "1px solid rgba(74,222,128,0.12)" }}
                        >
                          {ext}
                        </span>
                      ))}
                    </div>
                    <div className="font-body text-[11px] text-dg-text-dim">
                      Max 50MB · Recordings up to 10 minutes
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className="flex items-center gap-3 p-4 rounded-lg mb-4"
                      style={{ background: "rgba(251,191,36,0.04)" }}
                    >
                      <span className="text-xl">🎵</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs text-dg-amber truncate">{file.name}</div>
                        <div className="font-body text-[11px] text-dg-text-dim">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB
                        </div>
                      </div>
                      <button
                        onClick={() => { setFile(null); setWaveformData([]); }}
                        className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs text-dg-text-dim hover:text-dg-red transition-colors"
                        style={{ border: "1px solid rgba(251,191,36,0.25)" }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Waveform */}
                    {waveformData.length > 0 && (
                      <div className="h-12 flex items-end gap-px mb-4">
                        {waveformData.map((v, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t"
                            style={{
                              height: `${Math.max(v * 100, 4)}%`,
                              background: `rgba(251,191,36,${0.3 + v * 0.5})`,
                              minWidth: 1,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Processing state */}
            {mode === "audio" && showProcessing && (
              <div className="flex flex-col items-center justify-center min-h-[200px] py-8">
                <div className="asr-bars mb-6">
                  {[...Array(5)].map((_, i) => <span key={i} />)}
                </div>
                <div className="font-mono text-[11px] tracking-[2px] text-dg-amber mb-4">
                  {processingLabel}
                </div>
                <div className="w-full h-[3px] rounded-full overflow-hidden mb-3" style={{ background: "rgba(251,191,36,0.15)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      background: "linear-gradient(90deg, #fbbf24, rgba(251,191,36,0.6))",
                      width: `${processingProgress}%`,
                    }}
                  />
                </div>
                <div className="font-mono text-[9px] tracking-[2px] text-dg-text-dim">
                  Whisper ASR · NER · Sentiment · XGBoost
                </div>
              </div>
            )}

            {/* Transcript mode */}
            {mode === "transcript" && (
              <div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Paste the call transcript here — who said what, in order...

Example:
Caller: Hello, am I speaking with the account holder?
Victim: Yes, who is this?
Caller: Sir, this is the RBI cyber crime division. Your account has been linked to a money laundering case. Share your OTP now to avoid immediate arrest.`}
                  className="w-full min-h-[250px] bg-transparent font-body text-sm text-dg-text leading-relaxed resize-none outline-none placeholder:text-dg-text-dim/50"
                />

                <div className="flex flex-wrap gap-2 mt-4 mb-4">
                  {transcriptPresets.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setInput(p.text)}
                      className="font-mono text-[9px] tracking-[1px] px-3 py-1.5 rounded-full text-dg-text-dim hover:text-dg-amber transition-colors"
                      style={{ border: "1px solid rgba(251,191,36,0.12)" }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !canAnalyze}
              className="w-full py-4 rounded-lg font-mono text-[12px] tracking-[2.5px] font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{
                background: "#fbbf24",
                color: "#1a0e00",
                boxShadow: "0 4px 20px rgba(251,191,36,0.2)",
              }}
            >
              {isAnalyzing ? "ANALYZING..." : "ANALYZE CALL →"}
            </button>

            <div className="text-center mt-4 font-mono text-[9px] text-dg-text-dim">
              Powered by Whisper ASR · NER · Claude AI
            </div>
          </div>

          {/* Result */}
          <ResultPanel
            result={result}
            isAnalyzing={isAnalyzing}
            accentColor="#fbbf24"
            terminalLog={terminalLog}
            moduleLabel="CALL"
          />
        </div>
      </div>

      <BottomNav />
    </AppWindow>
  );
};

export default CallPage;
