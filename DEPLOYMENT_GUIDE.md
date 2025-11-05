# MERN Stack Deployment Guide for Vercel

## Overview
This guide will help you deploy your MERN stack application to Vercel with separate deployments for frontend and backend.

## Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free tier)

## Step 1: Backend Deployment (Server)

### 1.1 Prepare Backend for Deployment

1. **Set up MongoDB Atlas:**
   - Create a free MongoDB Atlas account
   - Create a new cluster
   - Get your connection string (replace `<password>` with your actual password)
   - Whitelist all IP addresses (0.0.0.0/0) for Vercel

2. **Update Environment Variables:**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cmis?retryWrites=true&w=majority
   JWT_SECRET=your-strong-secret-key-here
   CORS_ORIGIN=https://your-frontend.vercel.app
   PORT=5000
   ```

### 1.2 Deploy Backend to Vercel

1. **Connect GitHub Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `server` folder as root directory

2. **Configure Backend Deployment:**
   - Framework: Node.js
   - Build Command: (leave empty - Vercel will auto-detect)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

3. **Set Environment Variables:**
   - Add the environment variables from step 1.1
   - Click "Deploy"

4. **Get Backend URL:**
   - After deployment, note your backend URL (e.g., `https://your-backend.vercel.app`)

## Step 2: Frontend Deployment (Client)

### 2.1 Update Frontend Configuration

1. **Update API URL:**
   - In your frontend code, update the API base URL to point to your deployed backend
   - The frontend is already configured to use `VITE_API_URL` environment variable

### 2.2 Deploy Frontend to Vercel

1. **Create New Project:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import the same GitHub repository
   - Select the `client` folder as root directory

2. **Configure Frontend Deployment:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables:**
   ```bash
   VITE_API_URL=https://your-backend.vercel.app
   ```

4. **Deploy:**
   - Click "Deploy"

## Step 3: Post-Deployment Configuration

### 3.1 Update CORS Settings

After both deployments are complete:

1. **Update Backend CORS:**
   - Go to your backend Vercel dashboard
   - Update the `CORS_ORIGIN` environment variable to your frontend URL
   - Redeploy the backend

### 3.2 Test the Application

1. **Test Registration:**
   - Go to your frontend URL
   - Try registering a new user
   - Check browser console for any errors

2. **Test Authentication:**
   - Login with your credentials
   - Access protected routes
   - Verify JWT tokens are working

## Step 4: Production Considerations

### 4.1 Security

1. **Use Strong JWT Secret:**
   - Generate a strong random secret for production
   - Store it securely in environment variables

2. **HTTPS:**
   - Both frontend and backend will automatically use HTTPS on Vercel

3. **MongoDB Security:**
   - Use MongoDB Atlas with proper authentication
   - Restrict database access to specific IP ranges if needed

### 4.2 Performance

1. **Caching:**
   - Vercel provides automatic caching for static assets
   - Consider implementing Redis caching for API responses

2. **Database Optimization:**
   - Create appropriate indexes in MongoDB
   - Use database connection pooling

### 4.3 Monitoring

1. **Vercel Analytics:**
   - Enable Vercel Analytics for performance monitoring
   - Set up custom error tracking

2. **Database Monitoring:**
   - Use MongoDB Atlas monitoring tools
   - Set up alerts for database issues

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure `CORS_ORIGIN` matches your frontend URL exactly
   - Check for trailing slashes in URLs

2. **Database Connection Issues:**
   - Verify MongoDB Atlas whitelist includes Vercel IPs
   - Check connection string format

3. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

4. **Environment Variables:**
   - Ensure all required environment variables are set
   - Check for typos in variable names

### Getting Help

- Check Vercel deployment logs for specific error messages
- Review MongoDB Atlas connection logs
- Test API endpoints using tools like Postman

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend environment variables set correctly
- [ ] Backend deployed and accessible
- [ ] Frontend environment variables set correctly
- [ ] Frontend deployed and accessible
- [ ] CORS settings updated for production
- [ ] Registration/login functionality tested
- [ ] Protected routes working correctly
- [ ] Database operations working properly

## Next Steps

After successful deployment, consider:
- Setting up custom domains
- Implementing email verification
- Adding rate limiting
- Setting up automated backups
- Implementing monitoring and alerting