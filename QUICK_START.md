# Quick Start Guide - RAG Chatbot

## ⚡ 5-Minute Setup (Copy & Paste)

### Step 1: Setup Environment
```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your credentials:
# - OPENAI_API_KEY (from https://platform.openai.com/api-keys)
# - QDRANT_URL and QDRANT_API_KEY (from https://cloud.qdrant.io)
# - NEON_DATABASE_URL (from https://neon.tech)
```

### Step 2: Setup Python Backend (Terminal 1)
```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Ingest documents (first time only)
python ingest.py

# Start FastAPI server
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 3: Setup Frontend (Terminal 2)
```bash
cd physical-ai-book
npm install
npm start
```

### Step 4: Visit the Site
Open http://localhost:3000 in your browser

---

## 🎯 What You Get

✅ **ChatBot Widget** - Floating button in bottom-right corner
✅ **Smart Q&A** - Asks questions about your book
✅ **Text Selection** - Highlight text → Click "Ask AI"
✅ **Source Citations** - See which book chapters answer the question
✅ **Chat History** - All conversations saved to Postgres

---

## 🧪 Quick Test

### Test Backend Health
```bash
curl http://localhost:8000/health
```

### Test Chat Endpoint
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"What is robotics?"}'
```

### Test Text Explanation
```bash
curl -X POST http://localhost:8000/ask-selection \
  -H "Content-Type: application/json" \
  -d '{"selected_text":"Actuators convert electrical signals to mechanical motion."}'
```

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: openai` | Run `pip install -r requirements.txt` |
| `Cannot connect to Qdrant` | Check QDRANT_URL and API key in .env |
| `ChatBot not showing` | Stop and restart both servers |
| `API connection error` | Ensure FastAPI is running on port 8000 |
| `Slow responses` | Wait 30s (embedding generation is slow) |

---

## 📁 File Structure

```
hackathon_humnoid_book_1/
├── requirements.txt          # Python dependencies
├── ingest.py                # Document ingestion script
├── .env                      # Environment variables (create from .env.example)
├── .env.example             # Template for environment
├── RAG_CHATBOT_SETUP.md     # Full setup guide
├── QUICK_START.md           # This file
├── backend/
│   └── main.py              # FastAPI server
└── physical-ai-book/
    ├── package.json
    ├── docusaurus.config.ts
    └── src/
        └── components/
            ├── Root.tsx     # Updated with ChatBot
            └── ChatBot/
                ├── ChatBot.tsx
                └── ChatBot.module.css
```

---

## 🔄 Daily Workflow

```bash
# Terminal 1: FastAPI Backend
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Docusaurus Frontend
cd physical-ai-book
npm start

# Terminal 3: If updating docs, re-ingest
python ingest.py
```

---

## 🎁 Demo Workflow

1. Open http://localhost:3000
2. Click the 💬 button in bottom-right
3. Ask: "What are the main chapters?"
4. See sources appear below answer
5. Highlight text on the page
6. Click "💡 Ask AI"
7. Get explanation instantly

---

## 💾 Environment Variables Checklist

```bash
□ OPENAI_API_KEY=sk_...           # Get from OpenAI dashboard
□ QDRANT_URL=https://...          # Get from Qdrant Cloud
□ QDRANT_API_KEY=...              # Get from Qdrant Cloud
□ NEON_DATABASE_URL=postgresql://...  # Get from Neon
□ DOCS_PATH=physical-ai-book/docs  # Usually this
□ REACT_APP_API_URL=http://localhost:8000  # For dev
```

---

## 🎓 Next Steps

- **Full Setup Guide**: See `RAG_CHATBOT_SETUP.md` for detailed instructions
- **API Docs**: Visit `http://localhost:8000/docs` for interactive API explorer
- **Troubleshooting**: See full guide for common issues
- **Production**: See deployment section in full guide

---

**Let's go build something amazing! 🚀**
