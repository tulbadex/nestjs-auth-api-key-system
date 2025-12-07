# API Examples

Complete examples for all endpoints with expected responses.

## Base URL
```
http://localhost:3000
```

---

## 1. User Signup

**Endpoint:** `POST /auth/signup`

**Request:**
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

**Response (201):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (409 - User exists):**
```json
{
  "statusCode": 409,
  "message": "User already exists"
}
```

---

## 2. User Login

**Endpoint:** `POST /auth/login`

**Request:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401 - Invalid credentials):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

## 3. Create API Key

**Endpoint:** `POST /keys/create`

**Authentication:** Bearer Token (JWT)

**Request:**
```bash
curl -X POST http://localhost:3000/keys/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Production Service Key",
    "expiresAt": "2025-12-31T23:59:59Z"
  }'
```

**Request (without expiration):**
```bash
curl -X POST http://localhost:3000/keys/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Development Service Key"
  }'
```

**Response (201):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "key": "sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "name": "Production Service Key",
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**⚠️ Important:** Save the `key` value immediately. It won't be shown again!

---

## 4. List API Keys

**Endpoint:** `GET /keys`

**Authentication:** Bearer Token (JWT)

**Request:**
```bash
curl -X GET http://localhost:3000/keys \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Production Service Key",
    "isActive": true,
    "expiresAt": "2025-12-31T23:59:59.000Z",
    "lastUsedAt": "2025-01-15T12:45:00.000Z",
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Development Service Key",
    "isActive": true,
    "expiresAt": null,
    "lastUsedAt": null,
    "createdAt": "2025-01-15T11:00:00.000Z"
  }
]
```

**Note:** The actual `key` value is NOT returned for security reasons.

---

## 5. Revoke API Key

**Endpoint:** `DELETE /keys/:id`

**Authentication:** Bearer Token (JWT)

**Request:**
```bash
curl -X DELETE http://localhost:3000/keys/660e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "message": "API key revoked successfully"
}
```

**Error (404 - Key not found):**
```json
{
  "statusCode": 404,
  "message": "API key not found"
}
```

---

## 6. Protected Route - User Only (JWT)

**Endpoint:** `GET /protected/user-only`

**Authentication:** Bearer Token (JWT)

**Request:**
```bash
curl -X GET http://localhost:3000/protected/user-only \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "message": "This route is accessible only with user JWT token",
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com"
  },
  "accessType": "user"
}
```

**Error (401 - No token):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## 7. Protected Route - Service Only (API Key)

**Endpoint:** `GET /protected/service-only`

**Authentication:** API Key (x-api-key header)

**Request:**
```bash
curl -X GET http://localhost:3000/protected/service-only \
  -H "x-api-key: sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
```

**Response (200):**
```json
{
  "message": "This route is accessible only with API key",
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "type": "service"
  },
  "accessType": "service"
}
```

**Error (401 - Invalid key):**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired API key"
}
```

---

## 8. Protected Route - Flexible (Both JWT and API Key)

**Endpoint:** `GET /protected/flexible`

**Authentication:** Bearer Token OR API Key

**Request with JWT:**
```bash
curl -X GET http://localhost:3000/protected/flexible \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Request with API Key:**
```bash
curl -X GET http://localhost:3000/protected/flexible \
  -H "x-api-key: sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
```

**Response (200) - JWT:**
```json
{
  "message": "This route accepts both user JWT and API key",
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "type": "user"
  },
  "accessType": "user"
}
```

**Response (200) - API Key:**
```json
{
  "message": "This route accepts both user JWT and API key",
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "type": "service"
  },
  "accessType": "service"
}
```

---

## 9. Logout

**Endpoint:** `POST /auth/logout`

**Authentication:** Bearer Token (JWT)

**Request:**
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 10. Health Check

**Endpoint:** `GET /health`

**Authentication:** None (Public)

**Request:**
```bash
curl -X GET http://localhost:3000/health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Complete Workflow Example

### Scenario: User creates account, generates API key, and accesses protected resources

```bash
# 1. Signup
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Demo123!","name":"Demo User"}')

# Extract access token
ACCESS_TOKEN=$(echo $SIGNUP_RESPONSE | jq -r '.accessToken')

# 2. Create API Key
API_KEY_RESPONSE=$(curl -s -X POST http://localhost:3000/keys/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"name":"Demo Service Key"}')

# Extract API key
API_KEY=$(echo $API_KEY_RESPONSE | jq -r '.key')

# 3. Access user-only route with JWT
curl -X GET http://localhost:3000/protected/user-only \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 4. Access service-only route with API key
curl -X GET http://localhost:3000/protected/service-only \
  -H "x-api-key: $API_KEY"

# 5. Access flexible route with JWT
curl -X GET http://localhost:3000/protected/flexible \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 6. Access flexible route with API key
curl -X GET http://localhost:3000/protected/flexible \
  -H "x-api-key: $API_KEY"

# 7. List all API keys
curl -X GET http://localhost:3000/keys \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be longer than or equal to 6 characters"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "API key not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "User already exists"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Tips

1. **Save API keys immediately** - They're only shown once during creation
2. **Use environment variables** - Store tokens and keys securely
3. **Check expiration** - API keys can have expiration dates
4. **Revoke unused keys** - Keep your account secure
5. **Use flexible routes** - When you need both user and service access
6. **Monitor lastUsedAt** - Track API key usage
7. **Test with Swagger** - Easiest way to test all endpoints
