# Quick Deploy Checklist - Better-Auth Integration

**Status:** ✅ READY TO DEPLOY
**Time to Deploy:** ~15 minutes
**Risk Level:** 🟢 LOW

---

## ⏱️ 5-MINUTE SETUP

### 1. Database (2 min)
```bash
# Go to Neon Console → SQL Editor
# Copy ALL of this:
# auth-server/init-auth-db.sql

# Paste in SQL Editor and click Execute
```

✅ **Check:** Run this in Neon SQL Editor:
```sql
SELECT * FROM "user" LIMIT 1;
-- Should show: empty table with columns
```

---

### 2. Environment Files (1 min)

**Create `.env` in root:**
```
NEON_DATABASE_URL=postgresql://user:password@neon.tech/dbname
OPENAI_API_KEY=sk_...
QDRANT_URL=https://...qdrant.io
QDRANT_API_KEY=...
AUTH_SERVER_PORT=4000
```

**Create `auth-server/.env`:**
```
NEON_DATABASE_URL=postgresql://user:password@neon.tech/dbname
AUTH_SERVER_PORT=4000
FRONTEND_URL=http://localhost:3000
```

**Create `physical-ai-book/.env.local`:**
```
REACT_APP_AUTH_SERVER_URL=http://localhost:4000
```

---

### 3. Start Services (2 min)

**Terminal 1:**
```bash
cd auth-server
npm install
npm run dev
# Wait for: ✓ Auth server running on port 4000
```

**Terminal 2:**
```bash
cd backend
pip install -r requirements.txt  # or existing setup
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# Wait for: ✓ Connected to Neon Postgres
```

**Terminal 3:**
```bash
cd physical-ai-book
npm install
npm run start
# Wait for: localhost:3000
```

---

## ✅ VERIFICATION (2 min)

### Health Checks:
```bash
# Terminal 4:
curl http://localhost:4000/health
# Expected: {"status":"ok",...}

curl http://localhost:8000/health
# Expected: {"status":"healthy",...}
```

### Browser Test:
1. Open `http://localhost:3000`
2. Click "🔐 Sign in"
3. Click "Create one" → Fill signup form:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123!
   - Software: Python expert
   - Hardware: Arduino user
4. Click "Create Account"
5. Should see profile with your background info
6. Close modal → Click "💬" → Ask a question
7. Response should be personalized based on your background

---

## 🚨 QUICK TROUBLESHOOTING

### "Cannot connect to database"
```bash
# Check connection string
psql [YOUR_NEON_DATABASE_URL]

# If it fails, copy fresh URL from Neon dashboard
```

### "CORS Error"
```bash
# Check Auth Server is running on 4000
curl http://localhost:4000/health

# Check Python Backend is running on 8000
curl http://localhost:8000/health
```

### "Signup button does nothing"
```bash
# Check browser console (F12)
# Look for fetch errors
# Verify auth server is running: npm run dev in auth-server/
```

### "Chat not personalized"
```bash
# 1. Verify you signed up (check localStorage: auth_user)
# 2. Verify chat shows your user_id in request
# 3. Check python backend logs for user_id
```

---

## 📊 FINAL CHECKLIST

- [ ] Database schema created in Neon
- [ ] All `.env` files created and filled
- [ ] Auth server running (port 4000)
- [ ] Python backend running (port 8000)
- [ ] Frontend running (port 3000)
- [ ] Health checks pass
- [ ] Signup form works
- [ ] Profile shows background info
- [ ] Chat sends personalized response
- [ ] No console errors

---

## 🎉 SUCCESS INDICATORS

✅ **You're done when:**
1. Signup creates user with background fields
2. Login shows profile with custom fields
3. Chat responses mention your background
4. No errors in browser console
5. No errors in server logs

---

## 📚 FULL DOCUMENTATION

- `ARCHITECTURE_REVIEW.md` - Complete architectural analysis
- `IMPLEMENTATION_GUIDE.md` - Detailed step-by-step guide
- `CODE_AUDIT_REPORT.md` - Full code audit with evidence
- `README_RAG_CHATBOT.md` - Existing setup docs

---

## 🔄 RESET INSTRUCTIONS (if needed)

### Clean Database:
```sql
-- In Neon Console:
DROP TABLE IF EXISTS "verification" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Then re-run init-auth-db.sql
```

### Clear LocalStorage (Browser Console):
```javascript
localStorage.removeItem('auth_token');
localStorage.removeItem('auth_user');
localStorage.removeItem('auth_session_id');
```

---

**Status:** ✅ READY
**Next Step:** Run the 5-minute setup above
**Questions:** Check ARCHITECTURE_REVIEW.md

