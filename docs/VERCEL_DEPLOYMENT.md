# Vercel Deployment Guide

## Prerequisites

- GitHub account with your code pushed
- Vercel account (free tier available)
- Supabase project with API credentials

## Step 1: Prepare Your Code

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Create Vercel Project

1. Visit [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository (`study-schedule-to-do-list`)
4. Click **"Import"**

## Step 3: Configure Environment Variables

In the Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Click **"Save"**

## Step 4: Deploy

1. Click **"Deploy"** in the Vercel dashboard
2. Wait for the deployment to complete (usually 2-5 minutes)
3. Once complete, you'll get a deployment URL: `https://your-project-name.vercel.app`

## Step 5: Verify Deployment

1. Visit your deployment URL
2. Test creating an account
3. Create a few todos to verify functionality
4. Check that data persists after refresh

## Automatic Deployments

By default, every push to `main` branch will trigger a new deployment:

1. Edit code locally
2. Commit and push to GitHub
3. Vercel automatically builds and deploys
4. Check the build status in the Vercel dashboard

## Setting Up CI/CD with GitHub Actions

The `.github/workflows/deploy.yml` file is included for automated testing and deployment.

To enable it:

1. Go to **GitHub Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `VERCEL_TOKEN`: Get from [Vercel Tokens](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID`: Found in Vercel account settings
   - `VERCEL_PROJECT_ID`: Found in Vercel project settings

## Monitoring and Logs

### View Deployment Logs

1. Go to Vercel dashboard
2. Click on the project
3. Go to **Deployments** tab
4. Click on any deployment to see logs

### Runtime Logs

1. Click on the **Logs** tab
2. View real-time application logs

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatic

## Performance Optimization

Vercel includes:
- **Automatic code splitting**
- **Image optimization** (via Next.js Image)
- **Caching headers**
- **CDN distribution**

The app is automatically optimized for fast load times.

## Scaling and Limits

### Free Tier
- 100GB bandwidth/month
- 1 concurrent build
- Regional deployments

### Paid Plans
- More bandwidth
- Parallel builds
- Better performance
- Priority support

## Troubleshooting

### "Build Failed"
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify TypeScript has no errors: `npm run type-check`

### "Environment Variables Not Loading"
- Redeploy after adding variables
- Clear Vercel cache (Settings → Git → Clear Cache)

### "Database Connection Errors"
- Verify Supabase URL and key are correct
- Ensure Supabase project is active
- Check RLS policies are configured

## Rollback

To revert to a previous deployment:

1. Go to **Deployments**
2. Find the previous working deployment
3. Click the three dots menu
4. Select **"Promote to Production"**

## Resource Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)
