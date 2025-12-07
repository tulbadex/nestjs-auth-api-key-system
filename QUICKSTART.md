# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- Database created: `auth_api_key_db`

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE auth_api_key_db;

# Exit
\q
```

### 3. Configure Environment
The `.env` file is already configured with defaults:
- Port: 3000
- Database: localhost:5432
- Database name: auth_api_key_db
- Username: postgres
- Password: password

**Update `.env` if your PostgreSQL credentials are different.**

### 4. Start Application
```bash
npm run start:dev
```

You should see:
```
🚀 Application is running on: http://localhost:3000
📚 Swagger documentation: http://localhost:3000/api/docs
```

## Test in 2 Minutes

### Option 1: Use Swagger UI (Easiest)
1. Open http://localhost:3000/api/docs
2. Click on `POST /auth/signup`
3. Click "Try it out"
4. Use this example:
```json
{
  "email": "test@example.com",
  "password": "Test123!",
  "name": "Test User"
}
```
5. Click "Execute"
6. Copy the `accessToken` from response
7. Click "Authorize" button at top
8. Paste token and click "Authorize"
9. Now test all other endpoints!

### Option 2: Use cURL

**Step 1: Signup**
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123!\",\"name\":\"Test User\"}"
```

**Step 2: Create API Key** (use token from step 1)
```bash
curl -X POST http://localhost:3000/keys/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"name\":\"My API Key\"}"
```

**Step 3: Test with API Key**
```bash
curl -X GET http://localhost:3000/protected/service-only \
  -H "x-api-key: YOUR_API_KEY_HERE"
```

## What's Included

✅ User signup/login with JWT
✅ API key generation
✅ API key revocation
✅ Protected routes (user-only, service-only, flexible)
✅ Swagger documentation
✅ PostgreSQL database with auto-sync
✅ Password hashing with bcrypt
✅ Token expiration handling

## Endpoints Summary

### Authentication
- `POST /auth/signup` - Register user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### API Keys
- `POST /keys/create` - Create API key (requires JWT)
- `GET /keys` - List API keys (requires JWT)
- `DELETE /keys/:id` - Revoke API key (requires JWT)

### Protected Routes
- `GET /protected/user-only` - JWT only
- `GET /protected/service-only` - API key only
- `GET /protected/flexible` - Both JWT and API key

### Health
- `GET /health` - Health check (public)

## Troubleshooting

**Database connection error?**
- Ensure PostgreSQL is running
- Check credentials in `.env`
- Create database: `CREATE DATABASE auth_api_key_db;`

**Port 3000 already in use?**
- Change `PORT=3001` in `.env`

**Module errors?**
- Run `npm install` again
- Delete `node_modules` and reinstall

## Next Steps

1. Read [README.md](README.md) for detailed documentation
2. Read [TESTING.md](TESTING.md) for comprehensive testing guide
3. Explore Swagger UI at http://localhost:3000/api/docs
4. Check database tables in PostgreSQL

## Production Deployment

Before deploying to production:
1. Change JWT secrets in `.env`
2. Set `synchronize: false` in `src/app.module.ts`
3. Use proper database migrations
4. Enable HTTPS
5. Add rate limiting
6. Set up monitoring

## Support

For issues or questions, check:
- README.md for full documentation
- TESTING.md for testing examples
- Swagger UI for API reference
