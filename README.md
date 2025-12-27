# 🤖 The Physical AI Book: Embodied Intelligence Platform

![Hackathon Status](https://img.shields.io/badge/Hackathon-Submission-neon?style=for-the-badge)
![Architecture](https://img.shields.io/badge/Architecture-RAG_%7C_Agentic-purple?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-FastAPI_%7C_OpenAI_%7C_Qdrant-blue?style=for-the-badge)

> **"Master the art of building intelligent machines that see, think, and act in the real world."**

## 🌟 Project Overview
The **Physical AI Book** is a Next-Gen Educational Platform designed to teach "Sim-to-Real" Robotics. Unlike static PDFs, this platform is **Alive**. It bridges the gap between software (AI) and hardware (Robotics) using an interactive, context-aware interface.

Most robotics resources are static and hard to understand. We solved this by building a **Context-Aware Agentic Platform** that features a custom RAG Chatbot, instant Urdu localization, and role-based content personalization.

---

## 🤖 The AI Engine: Custom RAG Chatbot (Agentic AI)

*This is not a simple wrapper around ChatGPT. It is a specialized **Retrieval-Augmented Generation (RAG)** system built from scratch.*

### 🧠 Architecture & "ChatKit" Pattern
We implemented a modular **Agentic Architecture** mirroring the industry-standard **ChatKit pattern**:

1.  **Ingestion Agent:** On startup, the backend recursively scans all textbook chapters (`.md` files).
2.  **Memory Storage (Vector DB):** It chunks the text and stores semantic embeddings in **Qdrant** (In-Memory for performance).
3.  **Retrieval Agent:** When a user asks a question, the system performs a **Semantic Search** (Cosine Similarity) to find the exact paragraph in the book.
4.  **Generation:** The retrieved context + user query is sent to the LLM (**OpenAI GPT-4o / Qwen**) to generate a factually accurate response.

### ✨ Key Capabilities
- **Context-Awareness:** The bot answers strictly based on the provided curriculum. It won't hallucinate generic answers.
- **Code Explanations:** It can explain complex Python/C++ code snippets found in the book.
- **Fast & Private:** Uses local embedding processing and efficient vector search via Qdrant.

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Chat Widget (React)
    participant Backend as FastAPI Agent
    participant DB as Qdrant (Vector DB)
    participant LLM as OpenAI/Qwen Model

    User->>Frontend: "How does SLAM work?"
    Frontend->>Backend: POST /chat (User Query)
    Backend->>DB: Search Embeddings (Query)
    DB-->>Backend: Return Top 3 Relevant Chunks
    Backend->>LLM: Send Prompt + Context Chunks
    LLM-->>Backend: Generate Answer based on Book
    Backend-->>Frontend: Return AI Response
    Frontend-->>User: Display Answer
🚀 Key Features (Hackathon Requirements)1. 🇵🇰 Instant Localization (Urdu Support)Education should have no barriers.One-Click Translation: A dedicated global toggle instantly converts headings, concepts, and navigation into Urdu.Font Optimization: Uses Noto Nastaliq for beautiful readability and cultural relevance.2. 🎨 Adaptive Personalization EngineThe content morphs based on who YOU are.Role-Based Content: Users select their background (Software Engineer vs. Hardware Engineer).Dynamic Rendering:Software Engineers see Python code snippets & Algorithm logic 🐍.Hardware Engineers see Wiring Diagrams, Sensors, and Circuit Logic 🔌.3. 🔐 Simulated Authentication SystemA robust Mock Auth System allowing users to Signup & Login.Persists user identity ("Welcome, [Name]") and preferences across sessions using LocalStorage for a seamless demo experience.🛠️ Tech StackComponentTechnology UsedPurposeFrontendReact.js, DocusaurusStatic Site Generation & UIBackend APIPython FastAPIHigh-performance Async ServerVector DBQdrantStoring embeddings for RAG retrievalLLM EngineOpenAI / QwenThe intelligence behind the AgentState MgmtReact Context APIHandling Auth & Personalization state⚡ How to Run LocallyPrerequisitesNode.js & npmPython 3.9+1. Setup the Backend (The Brain)Bashcd backend
# Install dependencies (FastAPI, Qdrant, OpenAI, etc.)
pip install -r requirements.txt

# Run the RAG Server
uvicorn server:app --reload
The server will start at http://127.0.0.1:80002. Setup the Frontend (The Website)Bash# Open a new terminal in the root folder
npm install
npm run start
The website will launch at http://localhost:3000🏆 Why This Project WinsThis platform demonstrates a full-stack implementation of Embodied AI Education:Agentic Workflow: Using custom RAG + Qdrant.Inclusivity: Urdu Language Support.Adaptability: Hardware vs. Software personalization engines.
