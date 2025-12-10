# 🚀 Deployment Checklist - RAG Chatbot

## Pre-Launch Verification (Copy & Paste)

### Phase 1: Environment Setup (5 minutes)
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env and add:
#    - OPENAI_API_KEY from https://platform.openai.com/api-keys
#    - QDRANT_URL and QDRANT_API_KEY from https://cloud.qdrant.io
#    - NEON_DATABASE_URL from https://neon.tech
```

**Verification:**
- [ ] `.env` file exists
- [ ] All 4 required API keys are set
- [ ] Keys are not placeholders (don't start with `...`)

---

### Phase 2: Backend Setup (10 minutes)

```bash
# 1. Create Python environment
python -m venv venv

# 2. Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Ingest your documents (first time only)
python ingest.py

# 5. Start FastAPI server
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
✓ Connected to Qdrant
✓ Connected to OpenAI
✓ Connected to Neon Postgres
```

**Verification:**
- [ ] No errors during `pip install`
- [ ] No errors during `python ingest.py`
- [ ] FastAPI starts without errors
- [ ] Server running on port 8000

**Health Check:**
```bash
# In another terminal
curl http://localhost:8000/health
# Should return: {"status":"healthy","qdrant":true,"database":true,"openai":true}
```

---

### Phase 3: Frontend Setup (5 minutes)

```bash
# In a new terminal, from root directory
cd physical-ai-book

# Install dependencies
npm install

# Start development server
npm start
```

**Expected Output:**
```
[SUCCESS] Docusaurus website is running at: http://localhost:3000
```

**Verification:**
- [ ] No npm errors
- [ ] Docusaurus starts successfully
- [ ] Website loads at http://localhost:3000

---

### Phase 4: Integration Testing (5 minutes)

**Test 1: ChatBot Widget Appears**
- [ ] Go to http://localhost:3000
- [ ] See floating 💬 button in bottom-right corner
- [ ] Button is clickable

**Test 2: Chat Functionality**
- [ ] Click chat button to open
- [ ] Type a question: "What are the main topics?"
- [ ] Click Send
- [ ] Wait 2-3 seconds for response
- [ ] See answer with sources below

**Test 3: Text Selection**
- [ ] Highlight/select any text on the page
- [ ] See "💡 Ask AI" button appear
- [ ] Click it
- [ ] Chat opens with explanation

**Test 4: API Endpoints**
```bash
# Chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"Explain robotics"}'

# Selection endpoint
curl -X POST http://localhost:8000/ask-selection \
  -H "Content-Type: application/json" \
  -d '{"selected_text":"Actuators are devices..."}'
```

- [ ] `/chat` returns response with sources
- [ ] `/ask-selection` returns explanation
- [ ] No CORS errors in console

---

## Pre-Demo Checklist (30 minutes before)

### Infrastructure
- [ ] FastAPI server running and healthy
- [ ] Docusaurus frontend running
- [ ] Both terminals visible/accessible
- [ ] Postgres connection stable (check `/health`)
- [ ] Qdrant cluster active (check `/health`)
- [ ] OpenAI API balance sufficient

### Functionality
- [ ] ChatBot button visible on all pages
- [ ] Sample question gets response in <5 seconds
- [ ] Text selection feature works
- [ ] Sources are displayed correctly
- [ ] No console errors (F12 → Console)
- [ ] Conversation history saving (check Network tab)

### Content
- [ ] Documents ingested successfully (output from `python ingest.py`)
- [ ] At least 100+ chunks in vector DB
- [ ] Questions matching your book content prepared
- [ ] Sample text selections ready to explain

### Browser
- [ ] Clear cache (Ctrl+Shift+Delete)
- [ ] Close other tabs to reduce lag
- [ ] Set browser to full screen if demoing
- [ ] Test on same machine/network as production

---

## Troubleshooting During Demo

| Problem | Quick Fix |
|---------|-----------|
| ChatBot doesn't appear | Hard refresh (Ctrl+F5) |
| Slow first response | Expected (2-3s), explain to audience |
| API connection error | Check FastAPI terminal, restart if needed |
| "Cannot connect to Qdrant" | Verify Qdrant Cloud is running |
| Database error | Check Neon dashboard for issues |
| Text selection not working | Clear browser cache and refresh |
| No sources shown | Re-run `python ingest.py` |

---

## Demo Flow (3 minutes)

### Slide 1: Introduction (30 seconds)
"This is a RAG chatbot integrated with our Physical AI book. It uses OpenAI's GPT-4 to answer questions by searching relevant book chapters."

### Slide 2: Demo Part 1 - Smart Q&A (1 minute)
1. Click the 💬 button
2. Ask: "What's covered in Chapter 1?"
3. Show response + sources
4. Ask follow-up: "Explain sensors"
5. Show how it maintains context

### Slide 3: Demo Part 2 - Text Selection (1 minute)
1. Highlight text on the page: "Actuators convert signals..."
2. Click "💡 Ask AI"
3. Chat opens with explanation
4. Explain: "This works on any text in the book"

### Slide 4: Architecture (30 seconds)
"Backend: FastAPI + OpenAI
Database: Qdrant for vectors, Neon for history
Frontend: React integrated with Docusaurus"

---

## Post-Demo (Cleanup)

```bash
# Stop FastAPI (Ctrl+C in backend terminal)
# Stop Docusaurus (Ctrl+C in frontend terminal)
# Keep .env file (don't commit to git)
# Save any demo logs if needed
```

---

## Emergency Fallback

If something breaks during demo:

1. **Chat not working:** Restart FastAPI only
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

2. **Frontend not working:** Restart Docusaurus only
   ```bash
   cd physical-ai-book
   npm start
   ```

3. **Both broken:** Kill both, restart in order
   - Backend first
   - Frontend second
   - Give each 10 seconds to start

4. **Database issues:** Reset connection
   ```bash
   # Check if Neon/Qdrant are up
   # Might need to refresh credentials in .env
   ```

---

## Success Criteria

✅ **You're good to go if:**
- [ ] FastAPI server responds to health check
- [ ] Docusaurus loads without errors
- [ ] ChatBot widget visible and interactive
- [ ] Chat generates response with sources in <5 seconds
- [ ] Text selection feature works
- [ ] No CORS errors in browser console
- [ ] API endpoints respond correctly

🎉 **Ready for demo!**

---

## Quick Commands Reference

```bash
# Start everything (run in 3 terminals)

# Terminal 1: Python environment
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate
pip install -r requirements.txt

# Terminal 2: Backend
cd backend
python -m uvicorn main:app --reload

# Terminal 3: Frontend
cd physical-ai-book
npm start

# Terminal 4: Test (optional)
curl http://localhost:8000/health
```

---

## Resource Requirements

- **Disk Space:** ~500MB (including node_modules)
- **RAM:** 2GB+ recommended
- **Internet:** Required for API calls
- **Ports:** 8000 (backend), 3000 (frontend)
- **API Quotas:**
  - OpenAI: ~100 demo requests (embeddings + chat)
  - Qdrant: Free tier sufficient
  - Neon: Free tier sufficient

---

**Good luck with your demo!** 🚀

For detailed help, see `RAG_CHATBOT_SETUP.md` or `QUICK_START.md`
