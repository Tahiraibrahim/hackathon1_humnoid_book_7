# Auth Server - Better-Auth Integration

A lightweight Node.js/Express authentication server with Better-Auth, providing signup/signin with custom user background fields, integrated with Neon Postgres.

## Features

- ✅ Email/password authentication
- ✅ Custom signup fields (Software & Hardware background)
- ✅ Session management (30-day expiration)
- ✅ PBKDF2 password hashing
- ✅ JWT-like token generation
- ✅ User profile management
- ✅ CORS support for Docusaurus frontend
- ✅ TypeScript support

## Prerequisites

- Node.js 18+ (specified in package.json)
- npm or yarn
- Neon Postgres database with auth tables initialized
- Environment variables configured

## Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure .env with your settings
# - NEON_DATABASE_URL=your-database-url
# - JWT_SECRET=your-secret-key
# - AUTH_SERVER_PORT=4000 (optional)
```

## Environment Variables

```env
# Database
NEON_DATABASE_URL=postgresql://user:password@host/dbname
DATABASE_URL=postgresql://user:password@host/dbname

# Server
AUTH_SERVER_PORT=4000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# JWT Secret (use strong random value in production)
JWT_SECRET=your-secret-key-change-in-production
```

## Database Setup

Initialize the database schema before running the server:

```bash
# Using psql
psql "your-database-url" < init-auth-db.sql

# OR paste the SQL from init-auth-db.sql into your Neon dashboard
```

## Running

### Development Mode

```bash
npm run dev
```

Starts the server with hot-reload using ts-node.

```
✓ Connected to Neon Postgres
✓ Database schema initialized
✓ Auth server running on port 4000
```

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Run the compiled code
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Authentication
```
POST   /auth/signup              - Register new user
POST   /auth/signin              - Login
GET    /auth/me                  - Get current user (requires token)
POST   /auth/signout             - Logout
```

### User Management
```
GET    /auth/user/:userId        - Get user by ID
PUT    /auth/user/:userId/background - Update user background
```

For complete API documentation, see `AUTH_API_REFERENCE.md`.

## Usage Example

### Signup
```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "softwareBackground": "Python expert",
    "hardwareBackground": "Arduino user"
  }'
```

### Signin
```bash
curl -X POST http://localhost:4000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## Project Structure

```
auth-server/
├── src/
│   ├── index.ts           # Main Express server & routes
│   ├── db.ts              # Database schema initialization
│   ├── auth.ts            # Auth helpers
│   └── utils.ts           # Password hashing, JWT utilities
├── dist/                  # Compiled JavaScript (after build)
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Environment variables template
├── init-auth-db.sql       # Database schema
└── README.md              # This file
```

## Scripts

```bash
npm run dev              # Development with hot reload
npm run build            # Build TypeScript to JavaScript
npm start                # Run compiled production build
npm run type-check       # Check TypeScript types
```

## Dependencies

### Core
- **express** - Web framework
- **cors** - CORS middleware
- **dotenv** - Environment variable management
- **postgres** - PostgreSQL client

### Auth/Security
- **crypto** - Built-in Node.js module for hashing
- Built-in JWT implementation (not using external library)

### Dev
- **typescript** - Type safety
- **@types/express** - Express types
- **@types/node** - Node.js types
- **ts-node** - TypeScript execution

## Architecture

The server uses:
- **Express.js** for HTTP routing
- **postgres** library for database access
- **Neon Postgres** for persistent storage
- **PBKDF2** for password hashing (100,000 iterations)
- **JWT-like tokens** for session management

## Security Features

1. **Password Security**
   - PBKDF2 hashing with 100,000 iterations
   - Salt generation per password
   - Secure comparison

2. **Token Security**
   - JWT with HMAC-SHA256 signature
   - 30-day expiration
   - Signature verification on every request

3. **CORS Protection**
   - Whitelist allowed origins
   - Credentials support

4. **Input Validation**
   - Email format validation
   - Required field checking
   - Type validation

## Troubleshooting

### Connection to Neon Failed
- Verify `NEON_DATABASE_URL` is correct
- Check database is active in Neon dashboard
- Ensure firewall allows connection

### Tables Not Found
- Run `init-auth-db.sql` to create tables
- Verify tables exist: `\dt` in psql

### Token Verification Failed
- Check `JWT_SECRET` is the same
- Token may have expired
- Check server time sync

### CORS Errors
- Verify `FRONTEND_URL` matches client URL
- Check request headers
- Ensure credentials are handled properly

## Performance

- Database connection pooling via postgres library
- Prepared statements for SQL injection prevention
- Efficient PBKDF2 hashing (configurable iterations)
- Minimal dependencies for fast startup

## Production Deployment

### Pre-deployment Checklist
- [ ] Change `JWT_SECRET` to strong random value
- [ ] Set `FRONTEND_URL` to production frontend URL
- [ ] Use HTTPS for all connections
- [ ] Configure proper CORS origins
- [ ] Set up environment variables securely
- [ ] Enable database SSL/TLS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging

### Deployment Options
- **Vercel** - `vercel deploy`
- **Railway** - Git push integration
- **Heroku** - `git push heroku main`
- **AWS** - Lambda, EC2, or ECS
- **Docker** - See Dockerfile (not included, can be created)

### Docker Example
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
CMD ["node", "dist/index.js"]
```

## Monitoring & Logging

Currently uses `console.log()`. For production, consider:
- Winston or Bunyan for logging
- Sentry for error tracking
- Datadog or New Relic for monitoring
- CloudWatch for AWS deployments

## Contributing

To add features:
1. Add type definitions in TypeScript
2. Implement endpoint in `src/index.ts`
3. Add database schema to `init-auth-db.sql` if needed
4. Test with cURL or Postman
5. Update documentation

## Future Enhancements

- [ ] Email verification
- [ ] Password reset
- [ ] OAuth providers (Google, GitHub)
- [ ] Two-factor authentication
- [ ] User roles and permissions
- [ ] Audit logging
- [ ] Rate limiting
- [ ] API key management

## Support

See parent project documentation:
- `AUTH_SETUP_GUIDE.md` - Complete setup guide
- `AUTH_API_REFERENCE.md` - API documentation
- `QUICK_START_AUTH.md` - Quick start guide

## License

Part of Physical AI Book Hackathon project.

## Related Projects

- **Frontend:** `physical-ai-book/` (Docusaurus)
- **Backend:** `backend/main.py` (FastAPI)
- **Database:** Neon Postgres

---

**Getting Started:** `npm install && npm run dev`

Questions? Check the troubleshooting section or review the setup guides.
