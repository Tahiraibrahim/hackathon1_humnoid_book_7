# RAG Chatbot Setup & Deployment Guide

## 🎯 Overview

This is a complete RAG (Retrieval-Augmented Generation) chatbot system integrated with your Physical AI Docusaurus book. The system includes:

- **Backend**: FastAPI server with OpenAI integration
- **Vector Database**: Qdrant Cloud for document embeddings
- **Chat History**: Neon Postgres for storing conversations
- **Frontend**: React ChatBot widget embedded in Docusaurus
- **AI Features**: Text selection explanation and intelligent Q&A

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Python 3.9+** installed
2. **Node.js 20+** installed
3. **Git** installed
4. Active accounts for:
   - [OpenAI API](https://platform.openai.com)
   - [Qdrant Cloud](https://cloud.qdrant.io)
   - [Neon Postgres](https://neon.tech)

---

## 🔧 Step 1: Setup Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your credentials:

   **OpenAI API Key:**
   - Visit https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key to `.env` as `OPENAI_API_KEY`

   **Qdrant Cloud:**
   - Visit https://cloud.qdrant.io
   - Create a free cluster
   - Copy the URL to `QDRANT_URL`
   - Copy the API key to `QDRANT_API_KEY`

   **Neon Postgres:**
   - Visit https://neon.tech
   - Create a free project
   - Copy the connection string to `NEON_DATABASE_URL`

3. Example `.env` file:
   ```
   OPENAI_API_KEY=sk_test_abc123...
   QDRANT_URL=https://your-cluster.qdrant.io
   QDRANT_API_KEY=your_api_key_here
   NEON_DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
   DOCS_PATH=physical-ai-book/docs
   REACT_APP_API_URL=http://localhost:8000
   ```

---

## 🐍 Step 2: Setup Python Backend

### 2.1 Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

### 2.3 Ingest Documents into Qdrant

This step processes all markdown files in your docs folder and creates embeddings:

```bash
python ingest.py
```

Expected output:
```
============================================================
RAG Document Ingestion Pipeline
============================================================

[1/4] Loading documents...
✓ Loaded: 01-chapter-foundations/01-lesson-intro.mdx
✓ Loaded: 01-chapter-foundations/02-lesson-simulator.md
...
Total documents loaded: 12

[2/4] Chunking documents...
Total chunks created: 145

[3/4] Generating embeddings...
Processed batch 1/15
Processed batch 2/15
...
Total embeddings generated: 145

[4/4] Upserting to Qdrant...
✓ Created collection: book-embeddings
✓ Upserted 145 vectors to Qdrant

============================================================
✓ Ingestion completed successfully!
============================================================
```

### 2.4 Start FastAPI Server

```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
INFO: ✓ Connected to Qdrant
INFO: ✓ Connected to OpenAI
INFO: ✓ Connected to Neon Postgres
```

Test the backend health:
```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "qdrant": true,
  "database": true,
  "openai": true
}
```

---

## ⚛️ Step 3: Setup & Run Docusaurus Frontend

### 3.1 Install Frontend Dependencies

```bash
cd physical-ai-book
npm install
```

### 3.2 Start Docusaurus Development Server

In a new terminal (keep FastAPI running in another):

```bash
cd physical-ai-book
npm start
```

Expected output:
```
[INFO] Starting the development server...
[SUCCESS] Docusaurus website is running at: http://localhost:3000
```

---

## 🚀 Quick Start (All Commands)

**Terminal 1 - Ingest Documents:**
```bash
python ingest.py
```

**Terminal 2 - Start FastAPI Backend:**
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 3 - Start Docusaurus Frontend:**
```bash
cd physical-ai-book
npm start
```

Then open http://localhost:3000 in your browser.

---

## 💬 Using the ChatBot

### Features

1. **Floating Chat Button** 💬
   - Located in the bottom-right corner
   - Click to open/close the chat interface

2. **Ask Questions**
   - Type any question about the Physical AI book
   - Bot searches your docs and answers using GPT-4
   - See relevant source documents with similarity scores

3. **Highlight & Explain** 💡
   - Select/highlight any text in the book
   - Click the "💡 Ask AI" button that appears
   - Get an AI explanation of the selected text

4. **Conversation History**
   - Each conversation has a unique ID
   - History is saved in Postgres
   - Access it via `/conversations/{conversation_id}` endpoint

---

## 🔌 API Endpoints

### `POST /chat`
Ask a question about the book.

**Request:**
```json
{
  "query": "What are the basics of robotics?",
  "conversation_id": "uuid-here-optional"
}
```

**Response:**
```json
{
  "response": "Robotics is the branch of...",
  "sources": [
    {
      "filename": "01-chapter-foundations/01-lesson-intro.mdx",
      "chunk_index": 0,
      "score": 0.87
    }
  ],
  "conversation_id": "uuid-here"
}
```

### `POST /ask-selection`
Explain a selected piece of text.

**Request:**
```json
{
  "selected_text": "Actuators are devices that convert...",
  "conversation_id": "uuid-here-optional"
}
```

**Response:**
```json
{
  "response": "Actuators are mechanical devices that...",
  "sources": [],
  "conversation_id": "uuid-here"
}
```

### `GET /conversations/{conversation_id}`
Get full conversation history.

**Response:**
```json
{
  "conversation_id": "uuid",
  "messages": [
    {
      "role": "user",
      "content": "What is robotics?",
      "sources": [],
      "created_at": "2024-01-15T10:30:00"
    },
    {
      "role": "assistant",
      "content": "Robotics is...",
      "sources": [...],
      "created_at": "2024-01-15T10:30:05"
    }
  ]
}
```

### `GET /health`
Check backend status.

**Response:**
```json
{
  "status": "healthy",
  "qdrant": true,
  "database": true,
  "openai": true
}
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Qdrant"
- ✅ Check `QDRANT_URL` and `QDRANT_API_KEY` in `.env`
- ✅ Ensure your Qdrant cluster is running (Qdrant Cloud dashboard)
- ✅ Test: `curl https://your-qdrant-url/health`

### Issue: "OpenAI API key error"
- ✅ Verify `OPENAI_API_KEY` in `.env` (should start with `sk_`)
- ✅ Check your API key hasn't expired
- ✅ Ensure you have credits in OpenAI account

### Issue: "Cannot connect to Neon database"
- ✅ Check `NEON_DATABASE_URL` format
- ✅ Verify database credentials
- ✅ Ensure Neon project is active
- ✅ Test with: `psql <your-connection-string>`

### Issue: "ChatBot not appearing in Docusaurus"
- ✅ Ensure ChatBot.tsx is in `src/components/ChatBot/`
- ✅ Verify Root.tsx imports ChatBot
- ✅ Clear Docusaurus cache: `npm run clear`
- ✅ Restart dev server: `npm start`

### Issue: "Slow responses from ChatBot"
- ✅ Check that FastAPI server is running
- ✅ Verify `REACT_APP_API_URL` in `.env` points to correct backend
- ✅ Check network tab in browser DevTools
- ✅ Monitor FastAPI logs for errors

### Issue: "No documents found during ingestion"
- ✅ Verify `DOCS_PATH` in `.env` (relative path from root)
- ✅ Check markdown files exist: `ls physical-ai-book/docs`
- ✅ Ensure files have `.md` or `.mdx` extension

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
│         (Docusaurus Book with ChatBot Widget)           │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/CORS
                       │
        ┌──────────────▼──────────────┐
        │   FastAPI Backend           │
        │   (port 8000)               │
        ├─────────────────────────────┤
        │ • POST /chat                │
        │ • POST /ask-selection       │
        │ • GET /conversations/:id    │
        └──┬──────────────┬───────────┘
           │              │
           │              │ SQL Queries
           │              │
    ┌──────▼─┐      ┌─────▼──────┐
    │ Qdrant │      │  Neon      │
    │ Cloud  │      │  Postgres  │
    │(Vector │      │ (History)  │
    │ DB)    │      │            │
    └────┬───┘      └────────────┘
         │
    [OpenAI API]
         │
    (GPT-4 Turbo)
```

---

## 🎓 For Hackathon Demo

### Tips for Best Results

1. **Pre-ingestion**: Run `python ingest.py` once to populate Qdrant
2. **Keep terminals open**: FastAPI and Docusaurus should both be running
3. **Test endpoints**: Use curl or Postman to verify `/health` endpoint
4. **Demo flow**:
   - Show the ChatBot button in Docusaurus
   - Ask a question → shows sources
   - Select text → highlight feature
   - Show conversation history in browser DevTools

### Performance Notes

- **First response**: ~2-3 seconds (embedding + search)
- **Subsequent responses**: ~1-2 seconds (cached embeddings)
- **Vector search**: Using cosine similarity (threshold: 0.5)
- **Batch embedding**: 10 documents per batch for efficiency

---

## 📦 Production Deployment

For production (Vercel, AWS, etc.):

1. **Backend**: Deploy to hosting with environment variables
   - Keep `.env` variables in platform secrets
   - Use gunicorn or cloud-native servers
   - Example: `gunicorn backend.main:app`

2. **Frontend**: Deploy Docusaurus normally
   - Set `REACT_APP_API_URL` to production backend URL
   - Build: `npm run build`
   - Deploy: `npm run serve` or push to Vercel

3. **Database**: Neon Postgres is serverless - no additional setup needed

4. **Security**:
   - Never commit `.env` to git
   - Use proper CORS restrictions in production
   - Rate limit the `/chat` endpoint
   - Validate all user inputs

---

## 📞 Support

For issues:
1. Check logs in both FastAPI and Docusaurus terminals
2. Test health endpoint: `curl http://localhost:8000/health`
3. Check browser console for frontend errors
4. Verify all environment variables are set

---

## 🎉 You're Ready!

Your RAG chatbot is fully integrated and ready to use. Enjoy the hackathon! 🚀
