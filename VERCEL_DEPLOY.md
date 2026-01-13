# Vercel Deployment Guide

## Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Vercel account

## Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
pnpm add -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Configure Environment Variables
Go to Vercel Dashboard → Project → Settings → Environment Variables

Add the following:
```
NUXT_PUBLIC_API_BASE=https://dummyjson.com
NODE_ENV=production
```

### 4. Deploy
```bash
# First time
vercel

# Production deployment
vercel --prod
```

### 5. Auto Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Every push to `main` branch will auto-deploy

## Vercel Project Settings

### Build & Development Settings
- **Framework Preset:** Nuxt.js
- **Build Command:** `pnpm build` (auto-detected)
- **Output Directory:** `.output/public` (auto-detected)
- **Install Command:** `pnpm install` (auto-detected)
- **Node.js Version:** 18.x (specified in package.json)

### Root Directory
- Leave as `/` (project root)

### Environment Variables
Make sure to add in Vercel Dashboard:
- `NUXT_PUBLIC_API_BASE`: Your API endpoint
- Any other required env vars

## Troubleshooting

### "Reliability" Error
If you see "Reliability" error:
1. Check build logs in Vercel dashboard
2. Ensure Node.js version is >= 18
3. Verify `.output/server` directory exists after build
4. Check serverless function logs

### Build Fails
1. Run `pnpm build` locally to test
2. Check for TypeScript errors
3. Ensure all dependencies are installed
4. Clear Vercel cache and redeploy

### SSR Errors
1. Check serverless function logs
2. Verify `nitro.preset: 'vercel'` in nuxt.config.ts
3. Ensure no dynamic imports breaking SSR

## Performance Optimization

### Edge Caching
Configured in `vercel.json`:
- Static assets: 1 year cache
- CSS/JS: immutable cache
- Security headers enabled

### Compression
- Brotli compression enabled
- Assets minified
- CSS code-split by route

## Monitoring
- Use Vercel Analytics for performance
- Enable Error Tracking in Vercel
- Set up Web Vitals monitoring
