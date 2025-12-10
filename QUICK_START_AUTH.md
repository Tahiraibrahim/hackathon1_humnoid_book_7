# Quick Start - Authentication System

## 30 Second Setup

### 1. Initialize Database (One-time)

```bash
# Copy the SQL from auth-server/init-auth-db.sql and run in Neon dashboard
# OR use psql:
psql "postgresql://neondb_owner:npg_Y6VMRp0SjbiB@ep-soft-pine-ahb0d2tm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require" < auth-server/init-auth-db.sql
```

### 2. Setup Auth Server

```bash
cd auth-server
npm install

# Copy env template and update with your values
cp .env.example .env

# Start development server
npm run dev
# Runs on http://localhost:4000
```

### 3. Start Docusaurus Frontend

```bash
cd physical-ai-book
npm install  # if needed
npm run start
# Runs on http://localhost:3000
```

### 4. Start Python Backend

```bash
cd backend
python main.py
# Runs on http://localhost:8000
```

## Testing the Flow

1. **In browser**, go to `http://localhost:3000`
2. **Click** "🔐 Sign in" button in top right
3. **Click** "Create one" to signup
4. **Fill form:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPass123!`
   - Software: `Python expert`
   - Hardware: `Arduino user`
5. **Click** "Create Account"
6. **Ask chatbot:** "What is a servo motor?"
7. **Notice:** Response is personalized for "Python expert + Arduino user"

## Key Files

| File | Purpose |
|------|---------|
| `auth-server/src/index.ts` | Auth API server |
| `physical-ai-book/src/components/AuthContext.tsx` | Auth state management |
| `physical-ai-book/src/components/AuthModal.tsx` | Login/signup form |
| `physical-ai-book/src/components/AuthButton.tsx` | Navbar button |
| `backend/main.py` | Enhanced with personalization |

## Environment Files

### auth-server/.env

```env
AUTH_SERVER_PORT=4000
NEON_DATABASE_URL=postgresql://neondb_owner:npg_Y6VMRp0SjbiB@...
DATABASE_URL=postgresql://neondb_owner:npg_Y6VMRp0SjbiB@...
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

## Common Commands

```bash
# Run all services (open 3 terminals):
# Terminal 1: Auth Server
cd auth-server && npm run dev

# Terminal 2: Frontend
cd physical-ai-book && npm run start

# Terminal 3: Backend
cd backend && python main.py

# Build for production
cd auth-server && npm run build
cd physical-ai-book && npm run build
```

## API Quick Test

```bash
# Signup
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test","softwareBackground":"Beginner","hardwareBackground":"None"}'

# Signin
curl -X POST http://localhost:4000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

## Features Implemented

✅ User Signup with Software/Hardware Background
✅ User Signin with password validation
✅ Session management
✅ Personalized chatbot responses
✅ User profile display
✅ Signout functionality
✅ Token-based authentication

## 50 Bonus Points: Better-Auth Integration

This implementation includes:
- ✅ Better-Auth server on Node.js
- ✅ Custom signup fields (Software + Hardware background)
- ✅ Database schema with auth tables
- ✅ Frontend authentication UI
- ✅ Personalized responses based on user background
- ✅ Integration between all systems (Frontend → Auth → Python → OpenAI)

## Next (Optional): Production Deployment

See `AUTH_SETUP_GUIDE.md` for detailed production setup.
