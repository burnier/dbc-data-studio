# Smart Data Modeler - Deployment Checklist

## ✅ Completed
- [x] Local development working
- [x] Vertex AI integration (REST API)
- [x] File parsing (CSV, JSON, XLSX)
- [x] AI schema generation
- [x] Attribute verification UI
- [x] Schema preview and download
- [x] Localized strings implementation
- [x] Enum detection logic
- [x] Schema dry run summary
- [x] Analytics integration (GA4)
- [x] Updated headline and footer

## 🚀 Next Steps

### 1. Final Testing (Local)
- [ ] Test full workflow with test-data.csv
- [ ] Verify enum detection (<10 unique values)
- [ ] Verify localized strings in downloaded JSON
- [ ] Test with different file types (CSV, JSON, XLSX)
- [ ] Verify analytics events fire (check browser console)

### 2. Code Cleanup
- [ ] Remove test scripts (test-vertex-ai.ts)
- [ ] Review and commit all changes
- [ ] Verify .gitignore excludes sensitive files

### 3. Google Analytics Setup
- [ ] Create GA4 property (if not exists)
- [ ] Get Measurement ID (format: G-XXXXXXXXXX)
- [ ] Create GCP secret:
  ```bash
  echo -n "G-XXXXXXXXXX" | gcloud secrets create NEXT_PUBLIC_GA4_ID --data-file=- --project=dbc-data-studio
  ```

### 4. Production Deployment
- [ ] Build Docker image:
  ```bash
  cd smart-data-modeler
  docker build -t gcr.io/dbc-data-studio/smart-data-modeler .
  ```
- [ ] Push to GCR:
  ```bash
  docker push gcr.io/dbc-data-studio/smart-data-modeler
  ```
- [ ] Deploy to Cloud Run:
  ```bash
  ./deploy-modeler.sh
  ```
- [ ] Verify deployment URL works

### 5. Custom Domain Setup
- [ ] Add DNS record in Cloudflare:
  - Type: CNAME
  - Name: modeler
  - Target: `ghs.googlehosted.com.`
- [ ] Create domain mapping in GCP:
  ```bash
  gcloud run domain-mappings create \
    --service=smart-data-modeler \
    --domain=modeler.dbcdatastudio.com \
    --region=us-central1 \
    --project=dbc-data-studio
  ```
- [ ] Verify SSL certificate provisioning (may take a few minutes)
- [ ] Test custom domain: https://modeler.dbcdatastudio.com

### 6. Post-Deployment Verification
- [ ] Test file upload on production
- [ ] Verify Vertex AI calls work
- [ ] Check analytics events in GA4 dashboard
- [ ] Test schema download
- [ ] Verify all UI elements render correctly
- [ ] Test on mobile device

### 7. Documentation
- [ ] Update README with production URL
- [ ] Document any environment-specific notes
- [ ] Create user guide (optional)

## 🔧 Environment Variables for Production

Make sure these are set in Cloud Run:
- `GOOGLE_CLOUD_PROJECT=dbc-data-studio`
- `GOOGLE_CLOUD_LOCATION=us-central1`
- `GOOGLE_GENAI_USE_VERTEXAI=true`
- `ENABLE_TELEMETRY=true`
- `NEXT_PUBLIC_GA4_ID` (from secret)

## 📊 Monitoring

After deployment, monitor:
- Cloud Run logs for errors
- GA4 dashboard for user events:
  - `file_upload_success`
  - `attributes_mapped`
  - `schema_downloaded` (primary conversion)
- Vertex AI API usage/quota

## 🐛 Troubleshooting

If issues arise:
1. Check Cloud Run logs: `gcloud run logs read smart-data-modeler --region=us-central1`
2. Verify Vertex AI IAM roles: `gcloud projects get-iam-policy dbc-data-studio`
3. Test Vertex AI connection: `npx tsx test-vertex-ai.ts`
4. Check environment variables in Cloud Run console

