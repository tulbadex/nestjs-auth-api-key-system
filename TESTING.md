# Testing Guide

## Quick Start Testing

### 1. Start the Application
```bash
npm run start:dev
```

### 2. Test Flow

#### Step 1: Register a User
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

Save the `accessToken` from the response.

#### Step 2: Create an API Key
```bash
curl -X POST http://localhost:3000/keys/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Test Service Key",
    "expiresAt": "2025-12-31T23:59:59Z"
  }'
```

Save the `key` from the response.

#### Step 3: Test User-Only Route (JWT)
```bash
curl -X GET http://localhost:3000/protected/user-only \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Expected: Success with user info

#### Step 4: Test Service-Only Route (API Key)
```bash
curl -X GET http://localhost:3000/protected/service-only \
  -H "x-api-key: YOUR_API_KEY"
```

Expected: Success with service info

#### Step 5: Test Flexible Route (Both)
```bash
# With JWT
curl -X GET http://localhost:3000/protected/flexible \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# With API Key
curl -X GET http://localhost:3000/protected/flexible \
  -H "x-api-key: YOUR_API_KEY"
```

Expected: Both should succeed

#### Step 6: List API Keys
```bash
curl -X GET http://localhost:3000/keys \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Step 7: Revoke API Key
```bash
curl -X DELETE http://localhost:3000/keys/KEY_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Step 8: Test Revoked Key (Should Fail)
```bash
curl -X GET http://localhost:3000/protected/service-only \
  -H "x-api-key: YOUR_REVOKED_API_KEY"
```

Expected: 401 Unauthorized

## Swagger UI Testing

Visit `http://localhost:3000/api/docs` for interactive testing.

1. Click "Authorize" button
2. Enter your JWT token or API key
3. Test all endpoints interactively

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Auth + API Key System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"test@example.com\",\"password\":\"Test123!\",\"name\":\"Test User\"}"
            },
            "url": {"raw": "http://localhost:3000/auth/signup"}
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"test@example.com\",\"password\":\"Test123!\"}"
            },
            "url": {"raw": "http://localhost:3000/auth/login"}
          }
        }
      ]
    },
    {
      "name": "API Keys",
      "item": [
        {
          "name": "Create API Key",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Content-Type", "value": "application/json"},
              {"key": "Authorization", "value": "Bearer {{accessToken}}"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"Test Key\",\"expiresAt\":\"2025-12-31T23:59:59Z\"}"
            },
            "url": {"raw": "http://localhost:3000/keys/create"}
          }
        },
        {
          "name": "List API Keys",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{accessToken}}"}],
            "url": {"raw": "http://localhost:3000/keys"}
          }
        }
      ]
    },
    {
      "name": "Protected Routes",
      "item": [
        {
          "name": "User Only (JWT)",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{accessToken}}"}],
            "url": {"raw": "http://localhost:3000/protected/user-only"}
          }
        },
        {
          "name": "Service Only (API Key)",
          "request": {
            "method": "GET",
            "header": [{"key": "x-api-key", "value": "{{apiKey}}"}],
            "url": {"raw": "http://localhost:3000/protected/service-only"}
          }
        },
        {
          "name": "Flexible (Both)",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{accessToken}}"}],
            "url": {"raw": "http://localhost:3000/protected/flexible"}
          }
        }
      ]
    }
  ]
}
```

## Expected Behaviors

### Success Cases
- ✅ User can signup with valid email/password
- ✅ User can login with correct credentials
- ✅ Authenticated user can create API keys
- ✅ JWT token grants access to user-only routes
- ✅ API key grants access to service-only routes
- ✅ Both JWT and API key work on flexible routes
- ✅ User can list their API keys
- ✅ User can revoke API keys

### Error Cases
- ❌ Signup with existing email returns 409 Conflict
- ❌ Login with wrong password returns 401 Unauthorized
- ❌ Access protected route without auth returns 401
- ❌ Use revoked API key returns 401
- ❌ Use expired API key returns 401
- ❌ Invalid JWT token returns 401
- ❌ Invalid API key format returns 401

## Database Verification

Connect to PostgreSQL and verify:

```sql
-- Check users
SELECT id, email, name, "isActive", "createdAt" FROM users;

-- Check API keys
SELECT id, name, "userId", "isActive", "expiresAt", "lastUsedAt", "createdAt" 
FROM api_keys;

-- Verify relationships
SELECT u.email, ak.name, ak.key, ak."isActive"
FROM users u
JOIN api_keys ak ON u.id = ak."userId";
```

## Performance Testing

Use Apache Bench or similar:

```bash
# Test signup endpoint
ab -n 100 -c 10 -p signup.json -T application/json http://localhost:3000/auth/signup

# Test protected endpoint with API key
ab -n 1000 -c 50 -H "x-api-key: YOUR_KEY" http://localhost:3000/protected/service-only
```

## Security Testing

1. **Test expired tokens**: Wait for JWT expiration and verify rejection
2. **Test revoked keys**: Revoke a key and verify it's rejected
3. **Test SQL injection**: Try malicious inputs in email/password
4. **Test XSS**: Try script tags in name field
5. **Test rate limiting**: Make rapid requests (if implemented)

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Create database if missing
psql -U postgres -c "CREATE DATABASE auth_api_key_db;"
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```
