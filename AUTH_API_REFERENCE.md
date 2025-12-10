# Authentication API Reference

## Base URL

- **Development:** `http://localhost:4000`
- **Production:** `https://your-auth-domain.com`

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the auth server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-09T12:34:56.789Z"
}
```

---

### 2. Sign Up

**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "softwareBackground": "Python expert",
  "hardwareBackground": "Arduino user"
}
```

**Required Fields:**
- `email` (string, valid email format)
- `password` (string, min 6 chars recommended)
- `softwareBackground` (string, one of: Beginner, Python expert, JavaScript developer, Full-stack developer, Other)
- `hardwareBackground` (string, one of: None, Arduino user, Raspberry Pi user, PCB designer, Robotics enthusiast, Other)

**Optional Fields:**
- `name` (string, defaults to email prefix if not provided)

**Success Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "id": "user_1733747097123_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "software_background": "Python expert",
    "hardware_background": "Arduino user"
  },
  "session": {
    "id": "session_1733747097456_def456",
    "expiresAt": "2025-01-08T12:34:56.789Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzE3MzM3NDcwOTcxMjNfYWJjMTIzIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzMzNzQ3MDk3LCJleHAiOjE3MzY0MzEwOTd9...."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields: email, password, softwareBackground, hardwareBackground"
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "Email already registered"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe",
    "softwareBackground": "Python expert",
    "hardwareBackground": "Arduino user"
  }'
```

---

### 3. Sign In

**POST** `/auth/signin`

Authenticate and create a session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Required Fields:**
- `email` (string)
- `password` (string)

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "user_1733747097123_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "software_background": "Python expert",
    "hardware_background": "Arduino user"
  },
  "session": {
    "id": "session_1733747097456_def456",
    "expiresAt": "2025-01-08T12:34:56.789Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:4000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### 4. Get Current User

**GET** `/auth/me`

Get authenticated user information. Requires valid token.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "id": "user_1733747097123_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "software_background": "Python expert",
  "hardware_background": "Arduino user"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "No token provided"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
```

---

### 5. Get User by ID

**GET** `/auth/user/:userId`

Get user information by ID. Used by Python backend for personalization.

**Parameters:**
- `userId` (string, path parameter)

**Success Response (200 OK):**
```json
{
  "id": "user_1733747097123_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "software_background": "Python expert",
  "hardware_background": "Arduino user"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:4000/auth/user/user_1733747097123_abc123
```

---

### 6. Sign Out

**POST** `/auth/signout`

End user session.

**Request Body:**
```json
{
  "sessionId": "session_1733747097456_def456"
}
```

**Required Fields:**
- `sessionId` (string)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Session ID required"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:4000/auth/signout \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1733747097456_def456"
  }'
```

---

### 7. Update User Background

**PUT** `/auth/user/:userId/background`

Update user's software and hardware background.

**Parameters:**
- `userId` (string, path parameter)

**Request Body:**
```json
{
  "softwareBackground": "Full-stack developer",
  "hardwareBackground": "PCB designer"
}
```

**Required Fields:**
- `softwareBackground` (string)
- `hardwareBackground` (string)

**Success Response (200 OK):**
```json
{
  "id": "user_1733747097123_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "software_background": "Full-stack developer",
  "hardware_background": "PCB designer"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:4000/auth/user/user_1733747097123_abc123/background \
  -H "Content-Type: application/json" \
  -d '{
    "softwareBackground": "Full-stack developer",
    "hardwareBackground": "PCB designer"
  }'
```

---

## Background Options

### Software Background
- **Beginner** - No programming experience
- **Python expert** - Experienced Python developer
- **JavaScript developer** - Experienced JS/Node.js developer
- **Full-stack developer** - Both frontend and backend
- **Other** - Other programming background

### Hardware Background
- **None** - No hardware experience
- **Arduino user** - Familiar with Arduino
- **Raspberry Pi user** - Familiar with Raspberry Pi
- **PCB designer** - Can design circuit boards
- **Robotics enthusiast** - Builds and programs robots
- **Other** - Other hardware background

---

## Authentication

### Token Format

The server returns a JWT-like token with 30-day expiration:

```
Header.Payload.Signature

Payload contains:
{
  "userId": "user_...",
  "email": "user@example.com",
  "iat": 1733747097,
  "exp": 1741431097
}
```

### Using Token

Include token in `Authorization` header for protected endpoints:

```
Authorization: Bearer <token>
```

### Token Storage

Frontend stores token in localStorage:
```javascript
localStorage.setItem('auth_token', token);
localStorage.setItem('auth_user', JSON.stringify(user));
localStorage.setItem('auth_session_id', sessionId);
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid credentials |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Email already registered |
| 500 | Server Error - Internal error |

---

## Rate Limiting

Currently no built-in rate limiting. Recommended for production:
- 5 signup attempts per hour per IP
- 10 signin attempts per hour per IP
- 100 requests per hour per IP

---

## Security Considerations

1. **HTTPS Only** - Always use HTTPS in production
2. **Token Expiration** - Tokens expire in 30 days
3. **Password Hashing** - Uses PBKDF2 with 100,000 iterations
4. **CORS** - Configured for specific origins
5. **Input Validation** - All inputs validated

---

## Integration Examples

### Frontend (React)

```typescript
// Sign up
const response = await fetch('http://localhost:4000/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    softwareBackground: 'Python expert',
    hardwareBackground: 'Arduino user'
  })
});
const data = await response.json();

// Store token
localStorage.setItem('auth_token', data.token);

// Get current user
const userResponse = await fetch('http://localhost:4000/auth/me', {
  headers: { 'Authorization': `Bearer ${data.token}` }
});
const user = await userResponse.json();
```

### Python Backend

```python
import asyncpg

async def get_user_background(user_id: str):
    conn = await asyncpg.connect(DATABASE_URL)
    result = await conn.fetchrow(
        'SELECT software_background, hardware_background FROM "user" WHERE id = $1',
        user_id
    )
    return {
        "software": result['software_background'],
        "hardware": result['hardware_background']
    }
```

### cURL Scripts

```bash
#!/bin/bash

AUTH_BASE="http://localhost:4000"

# Signup
signup() {
  curl -X POST $AUTH_BASE/auth/signup \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"test@example.com\",
      \"password\": \"pass123\",
      \"name\": \"Test\",
      \"softwareBackground\": \"Beginner\",
      \"hardwareBackground\": \"None\"
    }"
}

# Signin
signin() {
  curl -X POST $AUTH_BASE/auth/signin \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"test@example.com\",
      \"password\": \"pass123\"
    }"
}

# Get current user
get_me() {
  local token=$1
  curl -X GET $AUTH_BASE/auth/me \
    -H "Authorization: Bearer $token"
}

signup
```

---

## Troubleshooting

### Token Verification Failed
- Token may have expired (30 days)
- Token signature may be invalid
- Re-login to get a new token

### Email Already Registered
- Use a different email address
- Try signing in with existing credentials
- Password reset not yet implemented (future feature)

### Invalid Background Field
- Check spelling matches options exactly
- Valid values listed in "Background Options" section

### Database Connection Error
- Verify `NEON_DATABASE_URL` is correct
- Check network connectivity to Neon
- Ensure database tables are created

---

## Changelog

### Version 1.0.0 (2025-12-09)
- Initial release
- Basic auth endpoints
- Custom background fields
- Session management

### Planned Features
- Email verification
- Password reset
- OAuth integration
- Two-factor authentication
- Rate limiting
- API key management

---

## Support

For issues:
1. Check error message in response
2. Review troubleshooting section
3. Check server logs
4. Verify environment variables
5. Check network connectivity

---

## License

This authentication system is part of the Physical AI Book Hackathon project.
