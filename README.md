# Digital Guardian Suite — Full Stack Setup

## Architecture

```
frontend (Vite + React)          backend (Flask)
  :8080  ──────────────────────►  :5000
         POST /api/detect_email
         POST /api/detect_transaction
         POST /api/detect_call
         POST /api/detect_call_audio
         GET  /api/health
```

---

## Quick Start

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```


You should see:
```
✅ Email phishing model loaded
✅ Email vectorizer loaded
✅ Transaction fraud model loaded
✅ Call scam classifier loaded
✅ Call label encoder loaded
✅ Call scaler loaded
🚀 Digital Guardian Backend starting on http://127.0.0.1:5000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```



A status indicator in the bottom-right corner shows whether the backend is live:
- 🟢 **BACKEND ONLINE** — using real ML models
- 🔴 **BACKEND OFFLINE** — automatic keyword fallback (app still works)

---

## API Reference

### `POST /api/detect_email`
**Body:** `{ "email": "email text here" }`

**Response:**
```json
{
  "riskScore": 87,
  "verdict": "HIGH RISK",
  "signals": [
    { "type": "danger", "label": "OTP DETECTED" },
    { "type": "warn",   "label": "SUSPICIOUS URL DETECTED" }
  ],
  "explanation": "Model confidence: 85%. Found 3 risk keywords.",
  "recommendation": "Do not click links or share any personal information.",
  "modelUsed": "phishing_model.pkl"
}
```

---

### `POST /api/detect_transaction`
**Body:** `{ "text": "SMS or transaction alert text" }`

**Response:** same shape as above

---

### `POST /api/detect_call`
**Body:** `{ "transcript": "Caller: Hello... Victim: Yes..." }`

**Response:** same shape as above

---

### `POST /api/detect_call_audio`
**Body:** `multipart/form-data` with field `audio` (WAV/MP3/OGG/M4A)

**Response:** same shape + `"transcript"` field with Whisper text

**Note:** Requires `whisper` and `librosa` to be installed for full audio analysis.

---

### `GET /api/health`
```json
{
  "status": "ok",
  "models": {
    "email": true,
    "transaction": true,
    "call": true
  }
}
```

---

## Optional: Full Audio Analysis

For the scam call audio upload to work with real transcription + ML:

```bash
pip install librosa soundfile openai-whisper vaderSentiment
```

Whisper will download the `base` model (~150MB) on first use.

---

## Model Files

All `.pkl` files are pre-trained and included under `backend/models/`:

```
backend/models/
  email/
    phishing_model.pkl    ← scikit-learn classifier
    vectorizer.pkl        ← TF-IDF vectorizer
  transaction/
    fraud_model.pkl       ← RandomForest (Isolation Forest augmented)
  call/
    scam_classifier.pkl   ← RandomForest on audio MFCC features
    label_encoder.pkl     ← label encoder
    scaler.pkl            ← StandardScaler
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| CORS error in browser | Make sure `flask-cors` is installed and backend is running |
| `ModuleNotFoundError: flask_cors` | `pip install flask-cors` |
| Models not loading | Check that `backend/models/` folder has all `.pkl` files |
| Audio upload fails | Install `librosa` and `openai-whisper` |
| Frontend shows "BACKEND OFFLINE" | Start the Flask server first |
