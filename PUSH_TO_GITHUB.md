# Push Railway Backend to GitHub

## Quick Commands for GitHub Push

```bash
# Navigate to the railway-backend folder
cd railway-backend

# Add your GitHub repository (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/village-co-backend.git

# Push to GitHub
git push -u origin main
```

## If you need to create a new GitHub repository:

1. Go to https://github.com/new
2. Repository name: `village-co-backend`
3. Make it Public or Private (your choice)
4. Don't initialize with README (we already have files)
5. Click "Create repository"
6. Copy the repository URL and use it in the commands above

## After GitHub Push:

### Railway Deployment Steps:
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `village-co-backend` repository
5. Railway will auto-deploy (takes 2-3 minutes)

### Environment Variables to Set in Railway:
- `FRONTEND_URL`: https://your-replit-domain.replit.dev
- `JWT_SECRET`: Use a secure random string (32+ characters)
- `NODE_ENV`: production
- `ADMIN_PASSWORD`: admin2025!

## Test URLs After Deployment:
- Health: `https://your-app.railway.app/health`
- API: `https://your-app.railway.app/api/events`
- Test: `https://your-app.railway.app/api/test-event`

Your Create Event functionality will work immediately!