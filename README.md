# 🤖 The Physical AI Book: Embodied Intelligence Platform

![Hackathon Status](https://img.shields.io/badge/Hackathon-Submission-neon?style=for-the-badge)
![Architecture](https://img.shields.io/badge/Architecture-RAG_%7C_Agentic-purple?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-FastAPI_%7C_OpenAI_%7C_Qdrant-blue?style=for-the-badge)

> **"Master the art of building intelligent machines that see, think, and act in the real world."**

## 🌟 Project Overview
The **Physical AI Book** is a Next-Gen Educational Platform designed to teach "Sim-to-Real" Robotics. Unlike static PDFs, this platform is **Alive**. It bridges the gap between software (AI) and hardware (Robotics) using an interactive, context-aware interface.

We solved the problem of static learning by building a **Context-Aware Agentic Platform** that features a custom RAG Chatbot, instant Urdu localization, and role-based content personalization.

---

## 🤖 The AI Engine: Custom RAG Chatbot (Agentic AI)

*This is not a simple wrapper around ChatGPT. It is a specialized **Retrieval-Augmented Generation (RAG)** system built from scratch.*

### 🧠 Architecture & "ChatKit" Pattern
We implemented a modular **Agentic Architecture** mirroring the industry-standard **ChatKit pattern**:

1.  **Ingestion Agent:** On startup, the backend recursively scans all textbook chapters (`.md` files).
2.  **Memory Storage (Vector DB):** It chunks the text and stores semantic embeddings in **Qdrant** (In-Memory for performance).
3.  **Retrieval Agent:** When a user asks a question, the system performs a **Semantic Search** (Cosine Similarity) to find the exact paragraph in the book.
4.  **Generation:** The retrieved context + user query is sent to the LLM (**OpenAI GPT-4o / Qwen**) to generate a factually accurate response.

### 🔄 How the Data Flows (System Architecture)

Since we are using a custom RAG implementation, here is how the request travels:

```text
[ USER ] asks a question 
   ⬇️
[ FRONTEND ] (React Chat Widget) sends POST request
   ⬇️
[ BACKEND ] (FastAPI) converts text to Embeddings
   ⬇️
[ QDRANT DB ] searches for relevant book chapters
   ⬇️
[ LLM ] (OpenAI/Qwen) generates answer using book context
   ⬇️
[ USER ] receives the accurate answer
🚀 Key Features (Hackathon Requirements)
1. 🇵🇰 Instant Localization (Urdu Support)
Education should have no barriers.

One-Click Translation: A dedicated global toggle instantly converts headings, concepts, and navigation into Urdu.

Font Optimization: Uses Noto Nastaliq for beautiful readability and cultural relevance.

2. 🎨 Adaptive Personalization Engine
The content morphs based on who YOU are.

Role-Based Content: Users select their background (Software Engineer vs. Hardware Engineer).

Dynamic Rendering:

Software Engineers see Python code snippets & Algorithm logic 🐍.

Hardware Engineers see Wiring Diagrams, Sensors, and Circuit Logic 🔌.

3. 🔐 Simulated Authentication System
A robust Mock Auth System allowing users to Signup & Login.

Persists user identity ("Welcome, [Name]") and preferences across sessions using LocalStorage for a seamless demo experience.

🛠️ Tech Stack
Component	Technology Used	Purpose
Frontend	React.js, Docusaurus	Static Site Generation & UI
Backend API	Python FastAPI	High-performance Async Server
Vector DB	Qdrant	Storing embeddings for RAG retrieval
LLM Engine	OpenAI / Qwen	The intelligence behind the Agent
State Mgmt	React Context API	Handling Auth & Personalization state

Export to Sheets

⚡ How to Run Locally
Prerequisites
Node.js & npm

Python 3.9+

1. Setup the Backend (The Brain)
Bash

cd backend
# Install dependencies (FastAPI, Qdrant, OpenAI, etc.)
pip install -r requirements.txt

# Run the RAG Server
uvicorn server:app --reload
The server will start at http://127.0.0.1:8000

2. Setup the Frontend (The Website)
Bash

# Open a new terminal in the root folder
npm install
npm run start
The website will launch at http://localhost:3000

🏆 Why This Project Wins
This platform demonstrates a full-stack implementation of Embodied AI Education:

Agentic Workflow: Using custom RAG + Qdrant.

Inclusivity: Urdu Language Support.

Adaptability: Hardware vs. Software personalization engines.

👥 Contributors
[Your Name] - Lead Developer & AI Architect
