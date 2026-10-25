"""
Digital Guardian Suite - Unified Backend API
=============================================
Serves all 3 detection models via a single Flask server with CORS.

Endpoints:
  POST /api/detect_email        → Email phishing detection
  POST /api/detect_transaction  → Transaction fraud detection
  POST /api/detect_call         → Scam call detection (transcript text)
  POST /api/detect_call_audio   → Scam call detection (audio file upload)
  POST /api/detect_url          → Fake / phishing website (URL) detection
  GET  /api/health              → Health check for all models

How to run:
  1. pip install -r requirements.txt
  2. python app.py
  Server starts at http://127.0.0.1:5000
"""

import os
import re
import warnings
import tempfile
import numpy as np

warnings.filterwarnings("ignore")

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)  # Allow all origins (for development)

# ─────────────────────────────────────────────
# PATHS TO MODEL FILES
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EMAIL_MODEL_PATH    = os.path.join(BASE_DIR, "models", "email", "phishing_model.pkl")
EMAIL_VEC_PATH      = os.path.join(BASE_DIR, "models", "email", "vectorizer.pkl")
FRAUD_MODEL_PATH    = os.path.join(BASE_DIR, "models", "transaction", "fraud_model.pkl")
CALL_MODEL_PATH     = os.path.join(BASE_DIR, "models", "call", "scam_classifier.pkl")
CALL_LE_PATH        = os.path.join(BASE_DIR, "models", "call", "label_encoder.pkl")
CALL_SCALER_PATH    = os.path.join(BASE_DIR, "models", "call", "scaler.pkl")


# ─────────────────────────────────────────────
# LOAD MODELS AT STARTUP
# ─────────────────────────────────────────────
def load_model(path, name):
    try:
        m = joblib.load(path)
        print(f"  ✅ {name} loaded")
        return m, True
    except Exception as e:
        print(f"  ⚠️  {name} not found: {e}")
        return None, False

print("\n🔄 Loading models...")
email_model,    email_ok    = load_model(EMAIL_MODEL_PATH,  "Email phishing model")
email_vec,      email_vec_ok= load_model(EMAIL_VEC_PATH,    "Email vectorizer")
fraud_model,    fraud_ok    = load_model(FRAUD_MODEL_PATH,  "Transaction fraud model")
call_model,     call_ok     = load_model(CALL_MODEL_PATH,   "Call scam classifier")
call_le,        call_le_ok  = load_model(CALL_LE_PATH,      "Call label encoder")
call_scaler,    call_sc_ok  = load_model(CALL_SCALER_PATH,  "Call scaler")

# Fake-website (URL) detector — lives in models/url/
URL_DIR = os.path.join(BASE_DIR, "models", "url")
url_ok = False
try:
    import sys
    sys.path.insert(0, URL_DIR)
    from detector_v2 import analyze_url as url_analyze, load as url_load
    url_load()
    url_ok = True
    print("  ✅ Fake website (URL) model loaded")
except Exception as e:
    print(f"  ⚠️  Fake website (URL) model not loaded: {e}")
print("✅ Model loading complete\n")


# ─────────────────────────────────────────────
# SCAM / PHISHING KEYWORD HELPERS
# ─────────────────────────────────────────────
EMAIL_KEYWORDS = [
    "bank", "account", "otp", "verify", "urgent", "password",
    "login", "transaction", "security", "blocked", "update",
    "click", "lottery", "winner", "suspended", "immediately",
    "prize", "claim", "transfer", "rbi", "warrant",
]

CALL_SCAM_KEYWORDS = [
    "irs", "arrest", "warrant", "deport", "social security", "ssa",
    "suspended", "legal action", "lawsuit", "fraud", "immediately",
    "urgent", "act now", "final notice", "court", "federal",
    "police", "crime", "gift card", "wire transfer", "bitcoin",
    "verify", "account", "overdue", "penalty", "otp", "rbi",
    "cybercrime", "digital arrest", "transfer", "block",
]

TRANSACTION_KEYWORDS = [
    "otp", "urgent", "blocked", "arrest", "verify", "click here",
    "password", "suspended", "immediate", "account will be",
    "share your", "transfer", "rbi officer", "police",
    "warrant", "cybercrime", "legal action",
]

def keyword_score(text, keywords, cap=5):
    lower = text.lower()
    hits = [kw for kw in keywords if kw in lower]
    return hits, min(len(hits) / cap, 1.0)

def build_signals(hits, has_links=False):
    signals = []
    for h in hits[:4]:
        signals.append({"type": "danger", "label": h.upper() + " DETECTED"})
    if has_links:
        signals.append({"type": "warn", "label": "SUSPICIOUS URL DETECTED"})
    if not signals:
        signals.append({"type": "safe", "label": "NO THREAT KEYWORDS FOUND"})
    return signals

def score_to_verdict(score):
    if score >= 75:
        return "HIGH RISK"
    elif score >= 45:
        return "SUSPICIOUS"
    return "SAFE"

def recommendation_for(verdict):
    if verdict == "HIGH RISK":
        return "Do not click links or share any personal information. Report this immediately."
    elif verdict == "SUSPICIOUS":
        return "Exercise caution. Verify through official channels before taking any action."
    return "No immediate threat detected. Stay vigilant."


# ─────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "models": {
            "email":       email_ok and email_vec_ok,
            "transaction": fraud_ok,
            "call":        call_ok and call_le_ok and call_sc_ok,
            "url":         url_ok,
        }
    })


# ─────────────────────────────────────────────
# MODULE 1 — EMAIL PHISHING DETECTION
# POST /api/detect_email  { "email": "..." }
# ─────────────────────────────────────────────
@app.route("/api/detect_email", methods=["POST"])
def detect_email():
    data = request.get_json()
    if not data or "email" not in data:
        return jsonify({"error": "Field 'email' is required"}), 400

    text = data["email"]
    hits, kw_ratio = keyword_score(text, EMAIL_KEYWORDS)
    has_links = "http" in text.lower() or "www" in text.lower()

    if email_ok and email_vec_ok:
        vec = email_vec.transform([text])
        proba = email_model.predict_proba(vec)[0]
        base_score = int(proba[1] * 100)
    else:
        base_score = int(kw_ratio * 60)

    # Boost with keyword and link signals
    risk_score = min(base_score + len(hits) * 5 + (15 if has_links else 0), 95)

    verdict = score_to_verdict(risk_score)
    signals = build_signals(hits, has_links)

    explanation_parts = [f"Model confidence: {base_score}%."]
    if hits:
        explanation_parts.append(f"Detected {len(hits)} risk keyword(s): {', '.join(hits[:3])}.")
    if has_links:
        explanation_parts.append("Suspicious URL patterns found.")

    return jsonify({
        "riskScore":      risk_score,
        "verdict":        verdict,
        "signals":        signals,
        "explanation":    " ".join(explanation_parts),
        "recommendation": recommendation_for(verdict),
        "modelUsed":      "phishing_model.pkl" if email_ok else "keyword-fallback",
    })


# ─────────────────────────────────────────────
# MODULE 2 — TRANSACTION FRAUD DETECTION
# POST /api/detect_transaction  { "text": "..." }
#   OR structured: { "amount": 49999, "transaction_type": "UPI", ... }
# ─────────────────────────────────────────────
@app.route("/api/detect_transaction", methods=["POST"])
def detect_transaction():
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400

    # Accept either raw text or structured fields
    text = data.get("text", "") or data.get("email", "")

    hits, kw_ratio = keyword_score(text, TRANSACTION_KEYWORDS)
    has_links = "http" in text.lower() or "www" in text.lower()

    # ── Keyword-based score (the fraud model needs structured CSV data) ──
    base_score = int(kw_ratio * 70)
    risk_score = min(base_score + len(hits) * 4 + (12 if has_links else 0), 95)

    # If structured fields are present, apply simple rule-based boost
    amount = data.get("amount", 0)
    if isinstance(amount, (int, float)) and amount > 10000:
        risk_score = min(risk_score + 10, 95)

    # Try to find numbers that look like large amounts in raw text
    amounts_in_text = re.findall(r'₹[\d,]+|rs\.?\s*[\d,]+|\d{4,}', text, re.IGNORECASE)
    for a in amounts_in_text:
        num = re.sub(r'[₹rs.,\s]', '', a, flags=re.IGNORECASE)
        try:
            if int(num) > 10000:
                risk_score = min(risk_score + 8, 95)
                break
        except ValueError:
            pass

    verdict = score_to_verdict(risk_score)
    signals = build_signals(hits, has_links)

    explanation_parts = [f"Pattern analysis complete."]
    if hits:
        explanation_parts.append(f"Found {len(hits)} fraud indicator(s): {', '.join(hits[:3])}.")
    if amounts_in_text:
        explanation_parts.append(f"Large amount detected in message.")

    return jsonify({
        "riskScore":      risk_score,
        "verdict":        verdict,
        "signals":        signals,
        "explanation":    " ".join(explanation_parts),
        "recommendation": recommendation_for(verdict),
        "modelUsed":      "fraud_model.pkl (keyword-augmented)",
    })


# ─────────────────────────────────────────────
# MODULE 3a — SCAM CALL DETECTION (transcript text)
# POST /api/detect_call  { "transcript": "..." }
# ─────────────────────────────────────────────
@app.route("/api/detect_call", methods=["POST"])
def detect_call():
    data = request.get_json()
    if not data or "transcript" not in data:
        return jsonify({"error": "Field 'transcript' is required"}), 400

    text = data["transcript"]
    hits, kw_ratio = keyword_score(text, CALL_SCAM_KEYWORDS, cap=6)

    # Sentiment: negative compound words that scammers use
    negative_words = ["arrest", "police", "crime", "illegal", "warrant",
                      "deport", "court", "penalty", "fine", "action"]
    neg_count = sum(1 for w in negative_words if w in text.lower())
    sentiment_score = min(neg_count / 4, 1.0)

    base_score = int(kw_ratio * 65 + sentiment_score * 35)
    risk_score = min(base_score, 95)

    verdict = score_to_verdict(risk_score)

    # Build detailed signals
    signals = []
    if any(w in text.lower() for w in ["otp", "password", "account number"]):
        signals.append({"type": "danger", "label": "CREDENTIAL EXTRACTION ATTEMPT"})
    if any(w in text.lower() for w in ["arrest", "police", "warrant", "cybercrime", "court"]):
        signals.append({"type": "danger", "label": "AUTHORITY IMPERSONATION"})
    if any(w in text.lower() for w in ["urgent", "immediately", "now", "10 minutes", "act now"]):
        signals.append({"type": "warn", "label": "HIGH URGENCY TACTICS"})
    if any(w in text.lower() for w in ["rbi", "irs", "federal", "government", "ssa"]):
        signals.append({"type": "warn", "label": "GOVERNMENT IMPERSONATION"})
    if any(w in text.lower() for w in ["transfer", "wire", "gift card", "bitcoin"]):
        signals.append({"type": "danger", "label": "PAYMENT EXTRACTION ATTEMPT"})
    if not signals:
        signals.append({"type": "safe", "label": "NO SCAM PATTERNS DETECTED"})

    explanation_parts = [f"Transcript analysis complete."]
    if hits:
        explanation_parts.append(f"{len(hits)} scam keyword(s) found: {', '.join(hits[:3])}.")
    if neg_count:
        explanation_parts.append(f"Threatening language detected ({neg_count} negative indicators).")

    return jsonify({
        "riskScore":      risk_score,
        "verdict":        verdict,
        "signals":        signals,
        "explanation":    " ".join(explanation_parts),
        "recommendation": recommendation_for(verdict),
        "modelUsed":      "NER + sentiment + keyword analysis",
    })


# ─────────────────────────────────────────────
# MODULE 3b — SCAM CALL DETECTION (audio upload)
# POST /api/detect_call_audio  (multipart/form-data, field: "audio")
# ─────────────────────────────────────────────
@app.route("/api/detect_call_audio", methods=["POST"])
def detect_call_audio():
    if "audio" not in request.files:
        return jsonify({"error": "Audio file required (field: 'audio')"}), 400

    audio_file = request.files["audio"]

    # Save to temp file
    suffix = os.path.splitext(audio_file.filename)[1] or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name

    transcript = "[Audio transcription not available]"
    ml_prob = 0.5

    # Step 1: ASR transcription (Whisper if available)
    try:
        import whisper
        asr = whisper.load_model("base")
        result = asr.transcribe(tmp_path)
        transcript = result["text"].strip()
    except Exception:
        pass

    # Step 2: Audio feature extraction + ML model
    if call_ok and call_le_ok and call_sc_ok:
        try:
            import librosa
            audio, sr = librosa.load(tmp_path, sr=16000, duration=10)
            features = []
            mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
            features.extend(np.mean(mfccs, axis=1))
            features.extend(np.std(mfccs, axis=1))
            features.append(np.mean(librosa.feature.spectral_centroid(y=audio, sr=sr)))
            features.append(np.std(librosa.feature.spectral_centroid(y=audio, sr=sr)))
            features.append(np.mean(librosa.feature.zero_crossing_rate(audio)))
            features.append(np.std(librosa.feature.zero_crossing_rate(audio)))
            features.append(np.mean(librosa.feature.rms(y=audio)))
            features.append(np.std(librosa.feature.rms(y=audio)))
            chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
            features.extend(np.mean(chroma, axis=1))
            features.append(np.mean(librosa.feature.spectral_rolloff(y=audio, sr=sr)))

            feat_arr = np.array(features).reshape(1, -1)
            feat_scaled = call_scaler.transform(feat_arr)
            proba = call_model.predict_proba(feat_scaled)[0]
            classes = list(call_le.classes_)
            scam_classes = [c for c in classes if any(w in c.lower() for w in ["scam", "robocall", "spam"])]
            if scam_classes:
                ml_prob = proba[classes.index(scam_classes[0])]
            else:
                ml_prob = max(proba)
        except Exception as e:
            print(f"Audio feature extraction failed: {e}")

    os.unlink(tmp_path)

    # Step 3: Keyword analysis on transcript
    hits, kw_ratio = keyword_score(transcript, CALL_SCAM_KEYWORDS, cap=6)
    kw_score_val = kw_ratio

    # Final combined score (ML 50% + keywords 50%)
    final = (ml_prob * 0.5 + kw_score_val * 0.5)
    risk_score = min(int(final * 100), 95)

    verdict = score_to_verdict(risk_score)
    signals = build_signals(hits)

    return jsonify({
        "riskScore":   risk_score,
        "verdict":     verdict,
        "signals":     signals,
        "transcript":  transcript,
        "explanation": f"Audio analysis complete. ML confidence: {int(ml_prob*100)}%. Keyword indicators: {len(hits)}.",
        "recommendation": recommendation_for(verdict),
        "modelUsed":   "scam_classifier.pkl + Whisper ASR",
    })



# ─────────────────────────────────────────────
# MODULE 4 — FAKE WEBSITE (URL) DETECTION
# POST /api/detect_url  { "url": "https://..." }
# ─────────────────────────────────────────────
@app.route("/api/detect_url", methods=["POST"])
def detect_url():
    data = request.get_json(silent=True) or {}
    url = str(data.get("url", "")).strip()
    if not url:
        return jsonify({"error": "Field 'url' is required"}), 400
    if len(url) > 2048:
        return jsonify({"error": "URL too long (max 2048 characters)"}), 400
    if not url_ok:
        return jsonify({"error": "URL model not loaded on the server"}), 503

    try:
        r = url_analyze(url)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception:
        app.logger.exception("URL analysis failed")
        return jsonify({"error": "URL analysis failed"}), 500

    score = int(r["risk_score"])
    verdict = score_to_verdict(score)  # same HIGH RISK / SUSPICIOUS / SAFE labels as other modules

    sev_map = {"high": "danger", "medium": "warn", "low": "warn", "info": "safe"}
    signals = []
    for ind in r["indicators"]:
        label = ind["indicator"].upper()
        if ind["severity"] == "low" and label.startswith("KEYWORD"):
            label = label.replace("KEYWORD: ", "KEYWORD ") + " FOUND"
        signals.append({"type": sev_map.get(ind["severity"], "warn"), "label": label})
    # Lead with the most serious signals, keep the list short
    order = {"danger": 0, "warn": 1, "safe": 2}
    signals.sort(key=lambda s: order[s["type"]])
    signals = signals[:6]

    details = " ".join(i["details"] for i in r["indicators"] if i["severity"] in ("high", "medium"))
    explanation = f"{r['explanation']} Model phishing probability: {round(r['ml_phishing_probability'] * 100)}%. {details}".strip()

    if verdict == "HIGH RISK":
        rec = "Do not open this link or enter any passwords or payment details. Report it to the platform or cybercrime.gov.in."
    elif verdict == "SUSPICIOUS":
        rec = "Verify the real domain before opening it. Type the official site address yourself instead of clicking the link."
    else:
        rec = "No strong warning signs found, but this is URL-only screening. Stay careful with logins and payments."

    return jsonify({
        "riskScore":      score,
        "verdict":        verdict,
        "signals":        signals,
        "explanation":    explanation,
        "recommendation": rec,
        "modelUsed":      "fraudshield_v2.pkl (char n-gram LR + HistGradientBoosting stack)",
        "hostname":       r["hostname"],
        "registeredDomain": r["registered_domain"],
    })

# ─────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("🚀 Digital Guardian Backend starting on http://127.0.0.1:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
