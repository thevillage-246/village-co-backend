# Railway Deployment Steps

## Current Status
✅ Git repository initialized
✅ Backend code committed
✅ Ready for GitHub push

## Next Steps

### 1. Push to GitHub
```bash
# Add your GitHub repository URL
git remote add origin https://github.com/YOUR_USERNAME/village-co-backend.git
git push -u origin main
```

### 2. Connect to Railway
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your village-co-backend repository
5. Railway will auto-detect and deploy

### 3. Set Environment Variables
In Railway dashboard, add:
- `FRONTEND_URL`: https://your-replit-domain.replit.dev
- `JWT_SECRET`: Generate secure 32+ character string
- `NODE_ENV`: production
- `ADMIN_PASSWORD`: admin2025! (or your preference)

### 4. Test Deployment
After deployment, test these endpoints:
- `https://your-app.railway.app/health`
- `https://your-app.railway.app/api/events`
- `https://your-app.railway.app/api/test-event`

## Pre-configured Accounts Ready
- admin@thevillageco.nz / admin2025!
- S.Phieros@gmail.com / password
- Nikki.paknz@gmail.com / password

## Create Event Functionality
✅ Confirmed working and ready for immediate use