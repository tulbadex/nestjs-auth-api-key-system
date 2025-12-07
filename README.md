# Task 3: Mini Authentication + API Key System

A complete NestJS backend service that supports:
- User authentication via JWT (signup/login)
- Service-to-Service access via API keys
- Flexible authentication middleware (accepts both JWT and API keys)
- Protected routes based on access type

## Features

### User Authentication (JWT)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user (requires JWT)

### API Key Management
- `POST /keys/create` - Generate API keys (requires JWT)
- `GET /keys` - List all API keys (requires JWT)
- `DELETE /keys/:id` - Revoke API key (requires JWT)

### Protected Routes
- `GET /protected/user-only` - Accessible only with JWT Bearer token
- `GET /protected/service-only` - Accessible only with API key
- `GET /protected/flexible` - Accessible with both JWT and API key

### Key Features
- JWT token generation with refresh tokens
- API key generation with expiration support
- API key revocation
- Last used tracking for API keys
- Flexible authentication middleware
- Swagger documentation

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=auth_api_key_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

3. Create PostgreSQL database:
```sql
CREATE DATABASE auth_api_key_db;
```

4. Start the application:
```bash
npm run start:dev
```

The application will run on `http://localhost:3000`

## API Documentation

Swagger documentation is available at: `http://localhost:3000/api/docs`

## Usage Examples

### 1. Register a User
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "name": "John Doe"
  }'
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

### 3. Create API Key
```bash
curl -X POST http://localhost:3000/keys/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "My Service API Key",
    "expiresAt": "2025-12-31T23:59:59Z"
  }'
```

Response:
```json
{
  "id": "uuid",
  "key": "sk_64characterhexstring...",
  "name": "My Service API Key",
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### 4. Access Protected Route with JWT
```bash
curl -X GET http://localhost:3000/protected/user-only \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Access Protected Route with API Key
```bash
curl -X GET http://localhost:3000/protected/service-only \
  -H "x-api-key: sk_your_api_key_here"
```

### 6. Access Flexible Route (Both JWT and API Key)
```bash
# With JWT
curl -X GET http://localhost:3000/protected/flexible \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# With API Key
curl -X GET http://localhost:3000/protected/flexible \
  -H "x-api-key: sk_your_api_key_here"
```

### 7. List API Keys
```bash
curl -X GET http://localhost:3000/keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Revoke API Key
```bash
curl -X DELETE http://localhost:3000/keys/KEY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Architecture

### Database Schema

**Users Table:**
- id (UUID, Primary Key)
- email (Unique)
- password (Hashed)
- name
- isActive
- refreshToken
- createdAt
- updatedAt

**API Keys Table:**
- id (UUID, Primary Key)
- key (Unique, Format: sk_64chars)
- name
- userId (Foreign Key)
- isActive
- expiresAt
- lastUsedAt
- createdAt
- updatedAt

### Authentication Flow

**User Authentication (JWT):**
1. User signs up or logs in
2. Server generates JWT access token and refresh token
3. Client stores tokens
4. Client sends Bearer token in Authorization header
5. Server validates JWT and grants access

**Service Authentication (API Key):**
1. User creates API key via authenticated endpoint
2. Server generates unique API key (sk_prefix + 64 hex chars)
3. Service stores API key securely
4. Service sends API key in x-api-key header
5. Server validates API key and grants access

### Guards

- **JwtAuthGuard**: Validates JWT Bearer tokens (user access)
- **ApiKeyAuthGuard**: Validates API keys (service access)
- **FlexibleAuthGuard**: Accepts both JWT and API keys

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- API keys with optional expiration
- API key revocation support
- Last used tracking for API keys
- Inactive user/key blocking
- Secure API key generation (crypto.randomBytes)

## Project Structure

```
src/
├── auth/
│   ├── dto/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── api-keys/
│   ├── dto/
│   ├── api-keys.controller.ts
│   ├── api-keys.service.ts
│   └── api-keys.module.ts
├── users/
│   ├── users.service.ts
│   └── users.module.ts
├── common/
│   ├── guards/
│   └── decorators/
├── database/
│   ├── entities/
│   └── data-source.ts
├── app.controller.ts
├── app.module.ts
└── main.ts
```

## Testing

Use the Swagger UI at `http://localhost:3000/api/docs` to test all endpoints interactively.

## Production Considerations

1. Change JWT secrets in production
2. Set `synchronize: false` in TypeORM config
3. Use migrations for database schema changes
4. Implement rate limiting
5. Add request logging
6. Use HTTPS
7. Implement refresh token rotation
8. Add API key usage analytics
9. Implement API key rate limits per key
10. Add webhook support for key events

## License

MIT
