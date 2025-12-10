# Visual Architecture Guide - Better-Auth Integration

**Purpose:** Visual representation of complete system architecture
**Last Updated:** 2025-12-09

---

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    🌐 USER'S BROWSER (localhost:3000)                   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Frontend (Docusaurus)                        │  │
│  │                                                                  │  │
│  │  ┌──────────────────┐  ┌──────────────────┐ ┌──────────────┐  │  │
│  │  │   AuthButton     │  │  AuthModal       │ │  ChatBot     │  │  │
│  │  │   Component      │  │  Component       │ │  Component   │  │  │
│  │  │                  │  │                  │ │              │  │  │
│  │  │  👤 Sign in      │  │  🔐 Signup Form  │ │  💬 Chat     │  │  │
│  │  │  👤 Profile      │  │  📝 Background   │ │  📚 Sources  │  │  │
│  │  │                  │  │  ✅ Login        │ │              │  │  │
│  │  └──────────────────┘  └──────────────────┘ └──────────────┘  │  │
│  │           ▲                     ▲                   ▲           │  │
│  │           └─────────────────────┼───────────────────┘           │  │
│  │                                 │                               │  │
│  │              ┌──────────────────────────────────┐               │  │
│  │              │     AuthContext (Provider)      │               │  │
│  │              │                                  │               │  │
│  │              │  user: {                         │               │  │
│  │              │    id, email, name,              │               │  │
│  │              │    software_background, ✅      │               │  │
│  │              │    hardware_background  ✅      │               │  │
│  │              │  }                               │               │  │
│  │              │  token: JWT                      │               │  │
│  │              │  sessionId: UUID                 │               │  │
│  │              │                                  │               │  │
│  │              │  Methods:                        │               │  │
│  │              │  - signup()  → POST /auth/signup │               │  │
│  │              │  - signin()  → POST /auth/signin │               │  │
│  │              │  - signout() → POST /auth/signout│               │  │
│  │              └──────────────────────────────────┘               │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                          │                          │
                          │                          │
        ┌─────────────────┘                          └──────────────────┐
        │                                                               │
        │ HTTP/CORS                                   HTTP/CORS         │
        │ (Configured ✅)                            (Configured ✅)    │
        │                                                               │
        ▼                                                               ▼
┌──────────────────────────┐                      ┌──────────────────────┐
│  🔐 Auth Server          │                      │  🐍 Python Backend    │
│  (Node.js Express)       │                      │  (FastAPI)            │
│  Port: 4000              │                      │  Port: 8000           │
│                          │                      │                       │
│  Endpoints:              │                      │  Endpoints:           │
│  POST /auth/signup   ✅  │                      │  POST /chat       ✅  │
│  POST /auth/signin   ✅  │                      │  POST /ask-selection  │
│  POST /auth/signout  ✅  │                      │  GET /health          │
│  GET /auth/me        ✅  │                      │                       │
│  GET /auth/user/:id  ✅  │                      │  Features:            │
│  PUT /user/:id/bg    ✅  │                      │  - Search Qdrant ✅   │
│  GET /health         ✅  │                      │  - Fetch user bg  ✅  │
│                          │                      │  - Personalize    ✅  │
│  CORS Origins:           │                      │  - Call OpenAI    ✅  │
│  - localhost:3000   ✅   │                      │  - Save messages  ✅  │
│  - localhost:8000   ✅   │                      │                       │
│  - $FRONTEND_URL    ✅   │                      │  External Services:   │
│                          │                      │  - Qdrant (vectors)   │
│  CORS Methods:           │                      │  - OpenAI (LLM)       │
│  GET, POST, PUT ✅       │                      │  - Neon DB            │
│  DELETE, OPTIONS    ✅   │                      │                       │
│                          │                      │                       │
└──────────────────────────┘                      └──────────────────────┘
        │                                                      │
        │                                                      │
        │        PostgreSQL (Both servers share)              │
        │                                                      │
        └──────────────────────┬──────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   🐘 NEON Database   │
                    │   (Cloud Postgres)   │
                    │                      │
                    │  Tables:             │
                    │  - "user" ✅         │
                    │    id                │
                    │    email             │
                    │    name              │
                    │    password_hash     │
                    │    software_bg   ✅  │
                    │    hardware_bg   ✅  │
                    │    created_at        │
                    │    updated_at        │
                    │                      │
                    │  - "session" ✅      │
                    │    id                │
                    │    user_id (FK)      │
                    │    expires_at        │
                    │                      │
                    │  - "account" ✅      │
                    │  - "verification"    │
                    │                      │
                    │  Indices:            │
                    │  - idx_session_user_id  ✅
                    │  - idx_account_user_id  ✅
                    │  - idx_verification_id  ✅
                    │                      │
                    └──────────────────────┘
```

---

## 📊 User Signup Flow (Detailed)

```
STEP 1: User fills signup form
┌─────────────────────────────────────────────┐
│  AuthModal Component                        │
│                                             │
│  [Email Input]                  ✅ Filled   │
│  [Password Input]               ✅ Filled   │
│  [Name Input]                   ✅ Filled   │
│  [Software Background Dropdown] ✅ Selected │
│    └─ "Python expert"           ✅ CUSTOM   │
│  [Hardware Background Dropdown] ✅ Selected │
│    └─ "Arduino user"            ✅ CUSTOM   │
│                                             │
│  [CREATE ACCOUNT Button]        ✅ Clicked  │
└─────────────────────────────────────────────┘
                    │
                    ▼ handleSignup()
STEP 2: Frontend sends to Auth Server
┌──────────────────────────────────────┐
│ POST http://localhost:4000/auth/     │
│         signup                        │
│                                      │
│ Headers:                             │
│   Content-Type: application/json ✅  │
│   Origin: http://localhost:3000  ✅  │
│                                      │
│ Body:                                │
│ {                                    │
│   email: "user@example.com",         │
│   password: "TestPassword123!",      │
│   name: "Test User",                 │
│   softwareBackground:                │
│     "Python expert",            ✅   │
│   hardwareBackground:                │
│     "Arduino user"              ✅   │
│ }                                    │
└──────────────────────────────────────┘
                    │
                    ▼ CORS Preflight
STEP 3: Browser sends OPTIONS (CORS)
┌──────────────────────────────────────┐
│ OPTIONS http://localhost:4000/auth/  │
│          signup                       │
│                                      │
│ Headers:                             │
│   Origin: http://localhost:3000  ✅  │
│   Access-Control-Request-Method      │
│     : POST                       ✅   │
└──────────────────────────────────────┘
                    │
                    ▼ CORS Response
STEP 4: Auth Server responds with CORS
┌──────────────────────────────────────┐
│ 200 OK                               │
│                                      │
│ Headers:                             │
│   Access-Control-Allow-Origin:       │
│     http://localhost:3000        ✅  │
│   Access-Control-Allow-Methods:      │
│     POST, GET, PUT, DELETE       ✅  │
│   Access-Control-Allow-Headers:      │
│     Content-Type, Authorization  ✅  │
└──────────────────────────────────────┘
                    │
                    ▼ Browser sends POST
STEP 5: Actual POST request
┌──────────────────────────────────────┐
│ POST (same as STEP 2)                │
│                                      │
│ Auth Server processes:               │
│ 1. Validate input          ✅        │
│ 2. Check email not exists  ✅        │
│ 3. Hash password with bcrypt ✅      │
│ 4. Generate user ID        ✅        │
│ 5. INSERT INTO "user"      ✅        │
│    - id: user_1733758261... │        │
│    - email: user@...       │        │
│    - name: Test User       │        │
│    - password_hash: $2b$12$... │    │
│    - software_background:  │        │
│      "Python expert"  ✅   │        │
│    - hardware_background:  │        │
│      "Arduino user"   ✅   │        │
│    - email_verified: true  │        │
│ 6. Generate session ID     ✅        │
│ 7. INSERT INTO "session"   ✅        │
│ 8. Generate JWT token      ✅        │
└──────────────────────────────────────┘
                    │
                    ▼ Query Neon DB
STEP 6: Data stored in Neon
┌──────────────────────────────────────┐
│ SELECT * FROM "user" WHERE           │
│   email = 'user@example.com';        │
│                                      │
│ Result:                              │
│ {                                    │
│   id: "user_1733758261234_xyz789",   │
│   name: "Test User",                 │
│   email: "user@example.com",         │
│   password_hash: "$2b$12$...",       │
│   email_verified: true,              │
│   image: null,                       │
│   software_background:               │
│     "Python expert"        ✅ SAVED  │
│   hardware_background:               │
│     "Arduino user"         ✅ SAVED  │
│   created_at: 2025-12-09...,         │
│   updated_at: 2025-12-09...          │
│ }                                    │
└──────────────────────────────────────┘
                    │
                    ▼ Response sent back
STEP 7: Frontend receives response
┌──────────────────────────────────────┐
│ 201 Created                          │
│                                      │
│ Headers:                             │
│   Access-Control-Allow-Origin:       │
│     http://localhost:3000        ✅  │
│                                      │
│ Body:                                │
│ {                                    │
│   success: true,                     │
│   user: {                            │
│     id: "user_1733758261234_xyz789", │
│     name: "Test User",               │
│     email: "user@example.com",       │
│     software_background:             │
│       "Python expert"         ✅     │
│     hardware_background:             │
│       "Arduino user"          ✅     │
│   },                                 │
│   session: {                         │
│     id: "session_...",               │
│     expiresAt: "2025-01-08T..."      │
│   },                                 │
│   token: "eyJhbGciOiJIUzI1NiIs..." ✅│
│ }                                    │
└──────────────────────────────────────┘
                    │
                    ▼ Save to localStorage
STEP 8: Frontend stores in browser
┌──────────────────────────────────────┐
│ localStorage.setItem(                │
│   'auth_token',                      │
│   'eyJhbGciOiJIUzI1NiIs...'      ✅  │
│ );                                   │
│                                      │
│ localStorage.setItem(                │
│   'auth_user',                       │
│   JSON.stringify({                   │
│     id: "user_123...",               │
│     name: "Test User",               │
│     email: "user@example.com",       │
│     software_background: ✅          │
│       "Python expert",               │
│     hardware_background: ✅          │
│       "Arduino user"                 │
│   })                                 │
│ );                                   │
│                                      │
│ localStorage.setItem(                │
│   'auth_session_id',                 │
│   'session_...'               ✅     │
│ );                                   │
└──────────────────────────────────────┘
                    │
                    ▼ Update AuthContext
STEP 9: AuthContext state updated
┌──────────────────────────────────────┐
│ AuthContext.user = {                 │
│   id: "user_123...",                 │
│   email: "user@example.com",         │
│   name: "Test User",                 │
│   software_background:               │
│     "Python expert"          ✅ NOW  │
│   hardware_background:               │
│     "Arduino user"           ✅ AVAIL│
│ };                                   │
│                                      │
│ AuthContext.token = "eyJ...";  ✅    │
│ AuthContext.sessionId = "s..."; ✅   │
│ AuthContext.isAuthenticated = true ✅│
└──────────────────────────────────────┘
                    │
                    ▼ UI Updates
STEP 10: Frontend renders profile
┌──────────────────────────────────────┐
│ Modal shows:                         │
│                                      │
│ 👤 Your Profile                      │
│                                      │
│ Name: Test User                      │
│ Email: user@example.com              │
│ Software Background:                 │
│   Python expert               ✅ SHOWN│
│ Hardware Background:                 │
│   Arduino user                ✅ SHOWN│
│                                      │
│ [Signout Button]                     │
└──────────────────────────────────────┘

✅ SIGNUP COMPLETE - USER HAS PROFILE WITH BACKGROUND INFO
```

---

## 💬 Personalized Chat Flow (Detailed)

```
STEP 1: User sends chat message
┌──────────────────────────────────┐
│ ChatBot Component                │
│ (Frontend: localhost:3000)        │
│                                  │
│ User types:                      │
│ "What is a robot?"               │
│                                  │
│ Retrieves from AuthContext:      │
│ user?.id = "user_123..."   ✅    │
│ user?.name = "Test User"   ✅    │
│ user?.software_background =      │
│   "Python expert"          ✅    │
│ user?.hardware_background =      │
│   "Arduino user"           ✅    │
│                                  │
│ [SEND Button] → sendMessage()    │
└──────────────────────────────────┘
                    │
                    ▼ POST to Python Backend
STEP 2: Frontend sends request
┌──────────────────────────────────────┐
│ POST http://127.0.0.1:8000/chat  ✅  │
│                                      │
│ Body:                                │
│ {                                    │
│   query: "What is a robot?",         │
│   conversation_id: "conv_abc...",    │
│   user_id: "user_123..."        ✅   │
│ }                                    │
│                                      │
│ Note: user_id passed! (line 81)      │
└──────────────────────────────────────┘
                    │
                    ▼ Python Backend receives
STEP 3: FastAPI processes request
┌──────────────────────────────────────┐
│ backend/main.py: /chat endpoint  ✅  │
│                                      │
│ 1. Validate query           ✅       │
│    "What is a robot?" ok              │
│                                      │
│ 2. Get conversation ID      ✅       │
│    Create new if needed              │
│                                      │
│ 3. Search Qdrant            ✅       │
│    query: "What is a robot?"         │
│    context_chunks = [...]            │
│    "Robot is a mechanical...",       │
│    "Robotics involves...", etc       │
│                                      │
│ 4. ⭐ Fetch user background ✅       │
│    await get_user_background(        │
│      user_id="user_123..."           │
│    )                                 │
└──────────────────────────────────────┘
                    │
                    ▼ Query Neon for user
STEP 4: Python queries auth database
┌──────────────────────────────────────┐
│ SQL Query (asyncpg):                 │
│                                      │
│ SELECT                               │
│   software_background,       ✅      │
│   hardware_background        ✅      │
│ FROM "user"                          │
│ WHERE id = 'user_123...'             │
│                                      │
│ Execution:                           │
│ 1. Connect to Neon (same as auth)    │
│ 2. Query "user" table (same table)   │
│ 3. Find row by id (indexed!)         │
│ 4. Get background fields             │
│                                      │
│ Result:                              │
│ {                                    │
│   software_background:               │
│     "Python expert"       ✅ FOUND   │
│   hardware_background:               │
│     "Arduino user"        ✅ FOUND   │
│ }                                    │
└──────────────────────────────────────┘
                    │
                    ▼ Build personalized prompt
STEP 5: Python builds system message
┌──────────────────────────────────────┐
│ Base system message:                 │
│ "You are a helpful assistant for     │
│  a Physical AI robotics book.        │
│  Use the provided book excerpts      │
│  to answer questions..."             │
│                                      │
│ ⭐ Add personalization:  ✅          │
│                                      │
│ system_message +=                    │
│   "User's Background:\n"             │
│   "- Software: Python expert\n"  ✅  │
│   "- Hardware: Arduino user\n"   ✅  │
│   "Tailor explanations to match"     │
│   "the user's experience level."     │
│                                      │
│ Final system message:                │
│ "You are a helpful assistant for     │
│  a Physical AI robotics book.        │
│  Use the provided book excerpts...   │
│                                      │
│  User's Background:                  │
│  - Software: Python expert           │
│  - Hardware: Arduino user            │
│  Tailor explanations to match the"   │
│  user's experience level."           │
│                                      │
│ ✅ PERSONALIZED!                     │
└──────────────────────────────────────┘
                    │
                    ▼ Call OpenAI API
STEP 6: Python calls GPT-4
┌──────────────────────────────────────┐
│ openai_client.chat.completions.      │
│   create(                            │
│     model="gpt-4-turbo",             │
│     messages=[                       │
│       {                              │
│         role: "system",              │
│         content: personalized_msg✅  │
│       },                             │
│       {                              │
│         role: "user",                │
│         content:                     │
│           "Based on excerpts:\n"     │
│           "[context_chunks]\n\n"     │
│           "Question: What is a       │
│            robot?"                   │
│       }                              │
│     ],                               │
│     max_tokens=1000,                 │
│     temperature=0.7                  │
│   )                                  │
└──────────────────────────────────────┘
                    │
                    ▼ OpenAI responds
STEP 7: Get response from OpenAI
┌──────────────────────────────────────┐
│ Response:                            │
│                                      │
│ "Based on your Python and Arduino   │
│  background, here's what a robot    │
│  is:                                 │
│                                      │
│  A robot is a programmable          │
│  mechanical or electrochemical      │
│  device...                           │
│                                      │
│  Since you know Python, you can     │
│  program robots with Python using   │
│  libraries like...                  │
│                                      │
│  With your Arduino experience,      │
│  you can control robot motors       │
│  by..."                              │
│                                      │
│ ✅ PERSONALIZED TO USER!            │
└──────────────────────────────────────┘
                    │
                    ▼ Save to database
STEP 8: Python saves conversation
┌──────────────────────────────────────┐
│ INSERT INTO messages:                │
│ - conversation_id: "conv_abc..."     │
│ - role: "user"                       │
│ - content: "What is a robot?"        │
│ - sources: [...]                     │
│                                      │
│ INSERT INTO messages:                │
│ - conversation_id: "conv_abc..."     │
│ - role: "assistant"                  │
│ - content: "Based on your Python..." │
│ - sources: [...]                     │
└──────────────────────────────────────┘
                    │
                    ▼ Return to frontend
STEP 9: Python returns response
┌──────────────────────────────────────┐
│ 200 OK                               │
│                                      │
│ {                                    │
│   response: "Based on your Python   │
│     and Arduino background, here's   │
│     what a robot is: ...",       ✅  │
│   sources: [                         │
│     {filename: "ch1.md",             │
│      score: 0.92}                    │
│   ],                                 │
│   conversation_id: "conv_abc..."     │
│ }                                    │
└──────────────────────────────────────┘
                    │
                    ▼ Frontend displays
STEP 10: ChatBot renders response
┌──────────────────────────────────────┐
│ Message:                             │
│ 🤖 "Based on your Python and        │
│     Arduino background, here's what  │
│     a robot is:                      │
│                                      │
│     A robot is a programmable       │
│     mechanical or                    │
│     electrochemical device..."       │
│                                      │
│ 📖 Sources:                          │
│   • chapter1.md                      │
│     Relevance: 92%                   │
│                                      │
│ ✅ USER SEES PERSONALIZED ANSWER!   │
└──────────────────────────────────────┘

✅ CHAT FLOW COMPLETE - PERSONALIZED TO USER'S BACKGROUND
```

---

## 🔗 Database Schema Visualization

```
NEON POSTGRES Database
│
├── "user" Table
│   ├── id (TEXT, PRIMARY KEY)
│   ├── name (TEXT)
│   ├── email (TEXT, UNIQUE)
│   ├── password_hash (TEXT)
│   ├── email_verified (BOOLEAN)
│   ├── image (TEXT)
│   ├── software_background (TEXT) ✅ CUSTOM
│   │   ├─ "Beginner"
│   │   ├─ "Python expert"
│   │   ├─ "JavaScript developer"
│   │   ├─ "Full-stack developer"
│   │   └─ "Other"
│   ├── hardware_background (TEXT) ✅ CUSTOM
│   │   ├─ "None"
│   │   ├─ "Arduino user"
│   │   ├─ "Raspberry Pi user"
│   │   ├─ "PCB designer"
│   │   ├─ "Robotics enthusiast"
│   │   └─ "Other"
│   ├── created_at (TIMESTAMP)
│   └── updated_at (TIMESTAMP)
│
├── "session" Table
│   ├── id (TEXT, PRIMARY KEY)
│   ├── user_id (TEXT, FOREIGN KEY → "user".id)
│   ├── expires_at (TIMESTAMP)
│   └── created_at (TIMESTAMP)
│
├── "account" Table (For OAuth)
│   ├── id (TEXT, PRIMARY KEY)
│   ├── user_id (TEXT, FOREIGN KEY → "user".id)
│   ├── account_type (TEXT)
│   ├── provider_id (TEXT)
│   ├── provider_account_id (TEXT)
│   └── created_at (TIMESTAMP)
│
├── "verification" Table (For emails)
│   ├── id (TEXT, PRIMARY KEY)
│   ├── identifier (TEXT)
│   ├── value (TEXT)
│   ├── expires_at (TIMESTAMP)
│   └── created_at (TIMESTAMP)
│
└── Indices (for performance)
    ├── idx_session_user_id ✅
    ├── idx_account_user_id ✅
    └── idx_verification_identifier ✅
```

---

## 🎯 CORS Configuration Matrix

```
┌──────────────────┬───────────────┬──────────────┬───────────────┐
│ Request From     │ Auth Server   │ Py Backend   │ Status        │
│                  │ (Port 4000)   │ (Port 8000)  │               │
├──────────────────┼───────────────┼──────────────┼───────────────┤
│ Frontend         │ ✅ ALLOWED    │ ✅ ALLOWED   │ Works ✅      │
│ localhost:3000   │ Origin check  │ Allow all    │               │
│                  │ (explicit)    │ (wildcard)   │               │
├──────────────────┼───────────────┼──────────────┼───────────────┤
│ Auth Server      │ N/A           │ ✅ ALLOWED   │ Works ✅      │
│ localhost:4000   │               │ Allow all    │               │
│                  │               │ (wildcard)   │               │
├──────────────────┼───────────────┼──────────────┼───────────────┤
│ Python Backend   │ ✅ ALLOWED    │ N/A          │ Works ✅      │
│ localhost:8000   │ (explicit)    │              │               │
│                  │               │              │               │
├──────────────────┼───────────────┼──────────────┼───────────────┤
│ Other            │ ❌ BLOCKED    │ ✅ ALLOWED   │ Partial       │
│ (unknown)        │ (explicit list)│ (wildcard)   │               │
└──────────────────┴───────────────┴──────────────┴───────────────┘
```

---

## ⏱️ Request Timeline

```
User clicks [SEND] on ChatBot
    │
    ├─ T+0ms: Frontend retrieves user?.id from AuthContext
    │
    ├─ T+10ms: POST /chat sent to Python Backend
    │          Body: {query, conversation_id, user_id}
    │
    ├─ T+50ms: Python receives request
    │
    ├─ T+100ms: Search Qdrant (parallel)
    │           Fetch user background from Neon (parallel)
    │
    ├─ T+300ms: User background fetched
    │           Context chunks received
    │           Personalized prompt built
    │
    ├─ T+400ms: POST to OpenAI API
    │           (waiting for response...)
    │
    ├─ T+2000ms: OpenAI responds with answer
    │            Python builds response JSON
    │
    ├─ T+2100ms: Save conversation to Neon
    │
    ├─ T+2150ms: Return response to Frontend
    │            Frontend displays personalized answer
    │
    └─ T+2200ms: ✅ User sees personalized response
```

---

**Status:** ✅ VISUAL ARCHITECTURE COMPLETE
**Next Step:** Follow QUICK_DEPLOY.md to deploy

