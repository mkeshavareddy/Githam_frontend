# ✅ Pre-Deployment Checklist - Cloud Run

## 📦 Codebase Ready ✅

All files are configured and ready for deployment!

### Required Files (All Present ✅)

- [x] `Dockerfile.prod` - Production Docker configuration
- [x] `next.config.js` - Standalone output configured
- [x] `package.json` - All dependencies included
- [x] `.dockerignore` - Excludes dev files from build
- [x] `.gcloudignore` - Excludes unnecessary files from upload
- [x] `app/api/discovery/route.ts` - API proxy for Discovery Engine
- [x] `lib/discovery-engine-api.ts` - Updated to use API route

### Configuration Files (All Set ✅)

- [x] `next.config.js` has `output: 'standalone'`
- [x] `google-auth-library` installed in package.json
- [x] API route handles OAuth2 authentication
- [x] Environment variables configured in deployment command

---

## 🔐 Google Cloud Prerequisites

Before deploying, complete these in Google Cloud Console:

### 1. Service Account

- [ ] Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=922876587313
- [ ] Create service account: `frontend-cloud-run`
- [ ] Grant roles:
  - [ ] Discovery Engine Admin
  - [ ] Cloud Run Invoker

**Service account email**: `frontend-cloud-run@922876587313.iam.gserviceaccount.com`

### 2. Enable APIs

Click "ENABLE" on each:

- [ ] **Discovery Engine API**: https://console.cloud.google.com/apis/library/discoveryengine.googleapis.com?project=922876587313
- [ ] **Cloud Run API**: https://console.cloud.google.com/apis/library/run.googleapis.com?project=922876587313
- [ ] **Cloud Build API**: https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com?project=922876587313
- [ ] **Artifact Registry API**: https://console.cloud.google.com/apis/library/artifactregistry.googleapis.com?project=922876587313

---

## 🚀 Ready to Deploy!

Once the above checkboxes are completed, you're ready to deploy.

### Deploy Command

```bash
cd "C:\Users\M.Keshava Reddy\Desktop\GitamAi\AI_policy_frontend\frontend"

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

### Or Deploy via Cloud Console

Follow the steps in: `../../DEPLOY_TO_CLOUD_RUN.md`

---

## 🧪 Post-Deployment Testing

After deployment completes:

- [ ] Health check: `https://your-url.run.app/api/discovery`
  - Should return JSON with `"status": "ok"`

- [ ] Test page: `https://your-url.run.app/test-discovery`
  - Try query: "What are education policies in Andhra Pradesh?"
  - Should show answer with citations

- [ ] Main chat: `https://your-url.run.app/chat`
  - Test any education policy question

---

## 📊 What to Expect

### Build Time
- First build: ~5-10 minutes
- Subsequent builds: ~3-5 minutes

### Performance
- Cold start: ~3-5 seconds
- Warm response: ~200-500ms
- Memory usage: ~300-500 MB

### Cost
- Free tier: First 1,000 queries/month
- Medium usage (10,000 queries): ~$25/month
- Heavy usage (100,000 queries): ~$215/month

---

## 🔍 Common Issues & Solutions

### Issue: "Service account not found"
**Solution**: Complete step 1 above (Create service account)

### Issue: "API not enabled"
**Solution**: Complete step 2 above (Enable all 4 APIs)

### Issue: "Build failed"
**Solution**: Check build logs. Most common cause is missing dependencies (already fixed ✅)

### Issue: "Runtime error: Authentication failed"
**Solution**: Verify service account is attached to Cloud Run service

---

## 📚 Additional Resources

- **Full deployment guide**: `../../DEPLOY_TO_CLOUD_RUN.md`
- **Quick start**: `../../CLOUD_RUN_QUICKSTART.md`
- **Minimal steps**: `../../SIMPLE_DEPLOYMENT_STEPS.md`
- **Deployment summary**: `../../DEPLOYMENT_SUMMARY.md`

---

## ✅ Summary

**Codebase Status**: ✅ READY
**Next Step**: Complete Google Cloud prerequisites above
**Time to Deploy**: ~20 minutes total (15 min setup + 5 min build)

Good luck with your deployment! 🚀
