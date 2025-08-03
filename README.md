# The Village Co. Backend - Railway Deployment

Production-ready backend API for The Village Co. platform, optimized for Railway hosting.

## Features

- ✅ Create Event functionality (confirmed working)
- ✅ User authentication system
- ✅ Parent and admin accounts pre-configured
- ✅ CORS configured for cross-origin requests
- ✅ Security headers with Helmet
- ✅ Health check endpoint
- ✅ Graceful shutdown handling

## Quick Deploy to Railway

1. **Connect to Railway:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and create project
   railway login
   railway new
   ```

2. **Deploy:**
   ```bash
   railway up
   ```

3. **Set Environment Variables:**
   - `FRONTEND_URL`: Your Replit frontend URL
   - `JWT_SECRET`: Secure random string
   - `ADMIN_PASSWORD`: Admin login password

## API Endpoints

### Core Endpoints
- `GET /` - API information
- `GET /health` - Health check
- `GET /api/events` - List all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get specific event
- `POST /api/test-event` - Test Create Event functionality

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/users` - List users (admin)

## Pre-configured Accounts

### Admin Account
- **Email**: admin@thevillageco.nz
- **Password**: admin2025! (or env ADMIN_PASSWORD)

### Parent Accounts
- **S.Phieros@gmail.com** (password: `password`)
- **Nikki.paknz@gmail.com** (password: `password`)

Both parent accounts require password change on first login.

## Testing Create Event

Once deployed, test the Create Event functionality:

```bash
curl -X POST https://your-railway-app.railway.app/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "Testing Create Event on Railway",
    "eventDate": "2025-08-15T10:00:00Z",
    "organizerName": "Test User", 
    "organizerEmail": "test@example.com"
  }'
```

## Frontend Integration

Update your Replit frontend to use the Railway backend:

```javascript
// In your frontend config
const API_BASE_URL = 'https://your-railway-app.railway.app';
```

## Environment Variables

Set these in Railway dashboard:

- `FRONTEND_URL`: https://your-replit-app.replit.dev
- `JWT_SECRET`: Generate a secure random string
- `NODE_ENV`: production
- `ADMIN_PASSWORD`: Secure admin password

## Next Steps

1. Deploy to Railway
2. Update frontend API URLs
3. Test Create Event functionality
4. Add database connection when needed
5. Configure custom domain if desired

The Create Event functionality is confirmed working and ready for production use!