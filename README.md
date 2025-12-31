# 🤖 The Physical AI Book: Agentic Intelligence Platform

![Hackathon Status](https://img.shields.io/badge/Hackathon-Submission-neon?style=for-the-badge)
![Architecture](https://img.shields.io/badge/Architecture-Agentic_%7C_RAG-purple?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-FastAPI_%7C_OpenAI_%7C_Qdrant-blue?style=for-the-badge)

> **"Bridging the gap between Software (AI) and Hardware (Robotics) using Multi-Agent Systems."**

## 🌟 Project Overview
This is not just a book; it is an **Embodied AI Learning Platform**. 
We have built a **"Sim-to-Real" Agent** that helps students learn robotics by adapting to their background (Software Engineer vs Hardware Engineer) and language (English/Urdu).

Unlike standard chatbots, this system uses a **Multi-Agent Architecture** defined in the `.claude/` folder to manage specific skills like Coding, Circuit Design, and Quizzes.

---

## 🚀 Key Features (Hackathon Requirements)

### 1. 🧠 Autonomous Agents & Skills (New!)
We implemented a **Declarative Agent System** (stored in `.claude/agents` & `.claude/skills`).
- **The Tutor Agent:** Orchestrates the conversation.
- **Skill 1 (RAG Memory):** Reads the textbook using **Qdrant Vector DB**.
- **Skill 2 (Circuit Wizard):** Helps hardware engineers with wiring diagrams.
- **Skill 3 (Code Expert):** Writes Python/ROS 2 code for software engineers.
- **Skill 4 (Quiz Master):** Tests the user's knowledge dynamically.

### 2. 🇵🇰 Instant Localization (Urdu Support)
- **One-Click Translation:** A global toggle converts headings, navigation, and concepts into **Urdu**.
- **Font:** Optimized with *Noto Nastaliq* for native readability.

### 3. 🎨 Adaptive Personalization
The content morphs based on the user's role:
- **Software Engineers** see: Code snippets, Algorithms, Logic.
- **Hardware Engineers** see: Wiring Diagrams, Voltage levels, Sensors.

### 4. 🔐 Mock Authentication
- A realistic **Signup/Login System**.
- Persists user identity ("Welcome, User") and preferences using LocalStorage.

---

## 🏗️ System Architecture

How the **Agentic RAG Flow** works:

```text
[ USER ] asks: "How do I wire a servo?"
   ⬇️
[ AGENT ROUTER ] (FastAPI + OpenAI)
   ⬇️
[ DECISION ] "User is asking about Hardware..."
   ⬇️
[ ACTIVATE SKILL ] --> ".claude/skills/circuit-logic.md"
   ⬇️
[ EXECUTE ] Generates Wiring Diagram + Safety Warnings
   ⬇️
[ RESPONSE ] displayed to User
🛠️ Tech StackComponentTechnologyPurposeFrontendReact, DocusaurusUI, State Management, Cyberpunk ThemeBackendPython FastAPIAgent Orchestration & APIBrain (LLM)OpenAI GPT-4oReasoning & Response GenerationMemoryQdrantVector Database for RAG (Book Search)Agent ConfigMarkdown (.md)Defining Agents & Skills (.claude/)⚡ How to Run LocallyPrerequisitesNode.js & npmPython 3.9+OpenAI API Key1. Setup the Backend (Agent Server)Bashcd backend
pip install -r requirements.txt
# Make sure to add your OPENAI_API_KEY in server.py
uvicorn server:app --reload
Server runs at: http://127.0.0.1:80002. Setup the Frontend (The Book)Bash# Open a new terminal in the root folder
npm install
npm run start
Website runs at: http://localhost:3000🏆 Why This Project WinsThis project fulfills all Hackathon requirements:Agentic AI: Uses defined Skills and Roles.RAG Integration: Real-time textbook search via Qdrant.Inclusivity: Urdu Language Support.Customization: Role-based Content (Sim-to-Real).