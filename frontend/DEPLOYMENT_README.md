# GITAM AI Policy Assistant - Frontend Deployment

## 🚀 Ready for Cloud Run Deployment

This frontend is configured and ready to deploy to Google Cloud Run.

## 📦 What's Included

- ✅ Next.js 14 with App Router
- ✅ API Route proxy for Discovery Engine (`/api/discovery`)
- ✅ Production Dockerfile (`Dockerfile.prod`)
- ✅ Standalone output configuration
- ✅ OAuth2 authentication handling
- ✅ All dependencies installed

## 🔧 Configuration

### Environment Variables (Set in Cloud Run)

```bash
DISCOVERY_ENGINE_PROJECT_ID=922876587313
DISCOVERY_ENGINE_LOCATION=global
DISCOVERY_ENGINE_COLLECTION=default_collection
DISCOVERY_ENGINE_ENGINE_ID=ai-policy-assistant_1763955939617
```

### Service Account Required

Service account: `frontend-cloud-run@922876587313.iam.gserviceaccount.com`
Roles needed:
- Discovery Engine Admin
- Cloud Run Invoker

## 🚀 Deploy to Cloud Run

### Method 1: Using gcloud CLI

```bash
gcloud run deploy gitam-ai-policy-frontend \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --service-account frontend-cloud-run@922876587313.iam.gserviceaccount.com \
  --set-env-vars DISCOVERY_ENGINE_PROJECT_ID=922876587313,DISCOVERY_ENGINE_LOCATION=global,DISCOVERY_ENGINE_COLLECTION=default_collection,DISCOVERY_ENGINE_ENGINE_ID=ai-policy-assistant_1763955939617 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --port 8080
```

### Method 2: Using Cloud Console

1. Go to Cloud Run console
2. Click "Deploy container"
3. Select "Continuously deploy from repository"
4. Choose your Git repository
5. Set Dockerfile path: `Dockerfile.prod`
6. Configure as per guide in root DEPLOY_TO_CLOUD_RUN.md

## 📁 Important Files

- `Dockerfile.prod` - Production Docker configuration
- `next.config.js` - Next.js configuration with standalone output
- `app/api/discovery/route.ts` - API route for Discovery Engine
- `lib/discovery-engine-api.ts` - Discovery Engine client
- `.dockerignore` - Files excluded from Docker build
- `.gcloudignore` - Files excluded from Cloud Build

## 🧪 Testing

After deployment, test these endpoints:

1. Health check: `https://your-url.run.app/api/discovery`
2. Discovery page: `https://your-url.run.app/test-discovery`
3. Main chat: `https://your-url.run.app/chat`

## 📊 Expected Performance

- Cold start: ~3-5 seconds
- Warm requests: ~200-500ms
- Memory usage: ~300-500 MB
- Scales to zero when idle

## 💰 Cost Estimate

- Light usage (1,000 queries/month): FREE
- Medium usage (10,000 queries/month): ~$25/month
- Heavy usage (100,000 queries/month): ~$215/month

## 🔍 Troubleshooting

### Build Fails
- Check that `google-auth-library` is in package.json ✅
- Verify `next.config.js` has `output: 'standalone'` ✅
- Ensure `Dockerfile.prod` exists ✅

### Runtime Errors
- Verify service account is attached to Cloud Run
- Check that Discovery Engine API is enabled
- View logs: `gcloud run services logs read gitam-ai-policy-frontend --region asia-south1`

## 📚 Full Documentation

See root directory for complete guides:
- `DEPLOY_TO_CLOUD_RUN.md` - Complete deployment guide
- `CLOUD_RUN_QUICKSTART.md` - Quick start guide
- `SIMPLE_DEPLOYMENT_STEPS.md` - Minimal steps

## ✅ Deployment Checklist

Before deploying:
- [ ] Service account created
- [ ] Discovery Engine API enabled
- [ ] Cloud Run API enabled
- [ ] Cloud Build API enabled
- [ ] Code committed to Git

Ready to deploy! 🚀
