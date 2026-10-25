/**
 * Digital Guardian Suite — API integration layer
 *
 * Tries to call the real Flask backend first.
 * Falls back to keyword analysis if the backend is unreachable.
 *
 * Backend endpoints (all POST, JSON):
 *   /api/detect_email         { email: string }
 *   /api/detect_transaction   { text: string }
 *   /api/detect_call          { transcript: string }
 *   /api/detect_url           { url: string }
 *   /api/detect_call_audio    multipart/form-data  field: "audio"
 */

// Change this if your backend runs on a different host/port
export const BACKEND_URL = "http://127.0.0.1:5000";

export interface AnalysisResult {
  riskScore: number;
  verdict: string;
  signals: { type: "danger" | "warn" | "safe"; label: string }[];
  explanation: string;
  recommendation: string;
  modelUsed?: string;
  transcript?: string;
}

// ─────────────────────────────────────────────
// KEYWORD FALLBACK
// Used when the backend server is not reachable
// ─────────────────────────────────────────────
export function keywordFallback(text: string, moduleType: string): AnalysisResult {
  const dangerWords = [
    "otp", "urgent", "blocked", "arrest", "verify",
    "click here", "password", "suspended", "immediate",
    "account will be", "share your", "transfer", "rbi officer",
    "police", "warrant", "cybercrime", "legal action",
    "prize", "lottery", "winner", "gift card", "bitcoin",
  ];

  const lowerText = text.toLowerCase();
  const matches = dangerWords.filter((w) => lowerText.includes(w));

  let riskScore: number;
  if (matches.length >= 3) {
    riskScore = 78 + Math.floor(Math.random() * 12);
  } else if (matches.length === 2) {
    riskScore = 60 + Math.floor(Math.random() * 15);
  } else if (matches.length === 1) {
    riskScore = 42 + Math.floor(Math.random() * 18);
  } else {
    riskScore = 8 + Math.floor(Math.random() * 12);
  }

  const verdict =
    riskScore >= 75 ? "HIGH RISK" : riskScore >= 45 ? "SUSPICIOUS" : "SAFE";

  return {
    riskScore,
    verdict,
    signals:
      matches.length > 0
        ? matches
            .slice(0, 4)
            .map((m) => ({ type: "danger" as const, label: m.toUpperCase() + " DETECTED" }))
        : [{ type: "safe" as const, label: "NO THREAT KEYWORDS FOUND" }],
    explanation: `Offline pattern analysis: ${matches.length} risk indicator(s) found. (Backend not connected — run the Flask server for full AI analysis.)`,
    recommendation:
      matches.length > 0
        ? "Exercise caution. Verify through official channels before taking any action."
        : "No immediate threat detected. Stay vigilant.",
    modelUsed: `keyword-fallback (${moduleType})`,
  };
}

// ─────────────────────────────────────────────
// MAIN ANALYSIS FUNCTION
// ─────────────────────────────────────────────
export async function analyzeContent(
  userInput: string,
  moduleType: string
): Promise<AnalysisResult> {
  const endpointMap: Record<string, string> = {
    email:       "/api/detect_email",
    transaction: "/api/detect_transaction",
    call:        "/api/detect_call",
    url:         "/api/detect_url",
  };

  const bodyKeyMap: Record<string, string> = {
    email:       "email",
    transaction: "text",
    call:        "transcript",
    url:         "url",
  };

  const endpoint = endpointMap[moduleType];
  const bodyKey  = bodyKeyMap[moduleType] ?? "text";

  if (!endpoint) {
    return keywordFallback(userInput, moduleType);
  }

  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [bodyKey]: userInput }),
    });

    if (!res.ok) {
      console.warn(`Backend returned ${res.status} — falling back to keyword analysis`);
      return keywordFallback(userInput, moduleType);
    }

    const data = await res.json();

    // Normalise field names in case backend sends snake_case
    return {
      riskScore:      data.riskScore      ?? data.risk_score      ?? 0,
      verdict:        data.verdict        ?? data.risk_level       ?? "UNKNOWN",
      signals:        data.signals        ?? [],
      explanation:    data.explanation    ?? data.warning_message  ?? "",
      recommendation: data.recommendation ?? "",
      modelUsed:      data.modelUsed      ?? data.model_used       ?? "",
      transcript:     data.transcript,
    };
  } catch (err) {
    console.warn("Backend unreachable — using keyword fallback:", err);
    return keywordFallback(userInput, moduleType);
  }
}

// ─────────────────────────────────────────────
// AUDIO FILE ANALYSIS (Call page — audio tab)
// ─────────────────────────────────────────────
export async function analyzeAudioFile(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("audio", file);

  try {
    const res = await fetch(`${BACKEND_URL}/api/detect_call_audio`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.warn(`Audio endpoint returned ${res.status}`);
      return keywordFallback(`Audio file: ${file.name}`, "call");
    }

    const data = await res.json();
    return {
      riskScore:      data.riskScore      ?? 0,
      verdict:        data.verdict        ?? "UNKNOWN",
      signals:        data.signals        ?? [],
      explanation:    data.explanation    ?? "",
      recommendation: data.recommendation ?? "",
      modelUsed:      data.modelUsed      ?? "",
      transcript:     data.transcript,
    };
  } catch (err) {
    console.warn("Audio backend unreachable:", err);
    return keywordFallback(`Audio file: ${file.name}`, "call");
  }
}

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────
export async function checkBackendHealth(): Promise<{
  online: boolean;
  models: Record<string, boolean>;
}> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, { method: "GET" });
    if (!res.ok) return { online: false, models: {} };
    const data = await res.json();
    return { online: true, models: data.models ?? {} };
  } catch {
    return { online: false, models: {} };
  }
}
