---
id: 001
title: Build Complete RAG Chatbot System
stage: general
date: 2025-12-09
surface: agent
model: claude-haiku-4-5-20251001
feature: none
branch: main
user: hackathon-developer
command: Build integrated RAG Chatbot for Docusaurus
labels: ["RAG", "FastAPI", "Qdrant", "OpenAI", "React", "Docusaurus"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - requirements.txt
 - ingest.py
 - backend/main.py
 - backend/__init__.py
 - physical-ai-book/src/components/ChatBot/ChatBot.tsx
 - physical-ai-book/src/components/ChatBot/ChatBot.module.css
 - physical-ai-book/src/components/Root.tsx (modified)
 - .env.example
 - RAG_CHATBOT_SETUP.md
 - QUICK_START.md
 - setup.py
tests:
 - Manual health check via curl http://localhost:8000/health
 - API endpoint testing with curl POST requests
 - Frontend integration test in browser
 - Text selection feature test
---

## Prompt

Build an integrated RAG Chatbot for a Docusaurus book that strictly adheres to the following hackathon technical stack requirements.

**Technical Stack (Strict Requirements):**
1.  **Backend:** FastAPI (Python) hosted on a separate port.
2.  **Vector Database:** Qdrant Cloud (Free Tier) for storing book embeddings.
3.  **Database:** Neon Serverless Postgres for storing chat history/logs.
4.  **AI Engine:** OpenAI Assistants API (Agents).
5.  **Frontend Integration:** A React component embedded inside the Docusaurus site (`swizzled` component or embedded widget).
6.  **Libraries:** `fastapi`, `uvicorn`, `qdrant-client`, `openai`, `psycopg2` (or asyncpg for Neon).

**Core Features Needed:**
1.  **Ingestion Script (`ingest.py`):**
    - Load Markdown files from the local `/docs` folder.
    - Split text into chunks.
    - Generate embeddings using OpenAI.
    - Upsert these embeddings into **Qdrant Cloud**.

2.  **FastAPI Backend (`main.py`):**
    - Endpoint `/chat`: Accepts user query, searches Qdrant for context, retrieves answer from OpenAI, and saves the conversation to **Neon Postgres**.
    - Endpoint `/ask-selection`: A specific endpoint that receives **highlighted/selected text** from the frontend and explains it.

3.  **Docusaurus Integration (Frontend):**
    - Create a React Chat Widget that floats on the Docusaurus site.
    - **Crucial Feature:** Implement a "Context Menu" or "Button" feature. When a user highlights text in the book, a "Ask AI" button should appear. Clicking it sends that specific text to the `/ask-selection` endpoint.

**Input for you:**
- My Docusaurus docs are in the `docs/` folder.
- I will provide `.env` variables for: `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `NEON_DATABASE_URL`.

**Deliverables:**
1.  Complete `requirements.txt`.
2.  Code for `ingest.py` (Data loading).
3.  Code for `backend/main.py` (FastAPI server).
4.  Code for the Frontend Component to add to Docusaurus (React code).
5.  Instructions on how to run the FastAPI server and Docusaurus simultaneously.

**Constraint:** ensure the code is production-ready for a hackathon demo.

## Response snapshot

Created a complete, production-ready RAG chatbot system with the following deliverables:

**Backend (Python):**
- `requirements.txt`: All necessary dependencies (FastAPI, Qdrant, OpenAI, Postgres, etc.)
- `ingest.py`: Document ingestion script with batching, chunking, and embedding generation
- `backend/main.py`: FastAPI server with endpoints:
  - POST `/chat`: Search + RAG with GPT-4, saves to Postgres
  - POST `/ask-selection`: Explain selected text
  - GET `/health`: Service health check
  - GET `/conversations/{id}`: Retrieve conversation history

**Frontend (React/TypeScript):**
- `ChatBot.tsx`: Full-featured React component with:
  - Floating chat button with animation
  - Messages display with loading states
  - Text selection detection with "Ask AI" button
  - Source citations with relevance scores
  - Conversation persistence
- `ChatBot.module.css`: Professional styling with dark mode support

**Documentation & Setup:**
- `.env.example`: Template for all required API keys
- `RAG_CHATBOT_SETUP.md`: Complete setup guide (60+ lines)
- `QUICK_START.md`: 5-minute quick start instructions
- `setup.py`: Interactive setup verification script

**Integration:**
- Updated `Root.tsx` to include ChatBot component
- CORS enabled for frontend-backend communication
- Database schema auto-creation on startup

## Outcome

- ✅ Impact: Complete RAG system integrated and ready for hackathon demo
- 🧪 Tests: Manual testing via curl and browser; health check endpoint included
- 📁 Files: 11 new files created, 1 existing file (Root.tsx) modified
- 🔁 Next prompts: Deploy to production, optimize response times, add rate limiting
- 🧠 Reflection: System is fully functional for hackathon use case with clear documentation

## Evaluation notes (flywheel)

- Failure modes observed: None - all endpoints designed with error handling
- Graders run and results (PASS/FAIL): Not applicable (hackathon project)
- Prompt variant (if applicable): null
- Next experiment: Production deployment with proper CORS restrictions and rate limiting
