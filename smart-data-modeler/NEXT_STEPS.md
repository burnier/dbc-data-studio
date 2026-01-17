# Smart Data Modeler - Next Steps

## ✅ Completed
- [x] Application deployed and working
- [x] Vertex AI authentication fixed (using Google Auth Library)
- [x] Service account has proper IAM roles

## 🎯 Immediate Next Steps

### 1. Commit Latest Changes
```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio
git add smart-data-modeler/
git commit -m "fix: use Google Auth Library for Cloud Run authentication"
git push origin main
```

### 2. Set Up Google Analytics 4 (GA4)

#### Step 1: Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use existing)
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

#### Step 2: Create Secret in GCP
```bash
# Create the secret
echo -n "G-XXXXXXXXXX" | gcloud secrets create NEXT_PUBLIC_GA4_ID \
  --data-file=- \
  --project=dbc-data-studio

# Grant Cloud Run service account access to the secret
gcloud secrets add-iam-policy-binding NEXT_PUBLIC_GA4_ID \
  --member="serviceAccount:808273476096-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=dbc-data-studio
```

#### Step 3: Update Cloud Run Service
```bash
gcloud run services update smart-data-modeler \
  --set-secrets "NEXT_PUBLIC_GA4_ID=NEXT_PUBLIC_GA4_ID:latest" \
  --region us-central1 \
  --project dbc-data-studio
```

#### Step 4: Verify Analytics
- Upload a test file on the production site
- Check GA4 Real-Time reports to see events:
  - `file_upload_success`
  - `attributes_mapped`
  - `schema_downloaded` (primary conversion metric)

### 3. Set Up Custom Domain

#### Step 1: Add DNS Record in Cloudflare
1. Log into Cloudflare dashboard
2. Select `dbcdatastudio.com` domain
3. Go to DNS → Records
4. Add new CNAME record:
   - **Type**: CNAME
   - **Name**: `modeler`
   - **Target**: `ghs.googlehosted.com.`
   - **Proxy status**: DNS only (gray cloud)
   - **TTL**: Auto

#### Step 2: Create Domain Mapping in GCP
```bash
gcloud run domain-mappings create \
  --service=smart-data-modeler \
  --domain=modeler.dbcdatastudio.com \
  --region=us-central1 \
  --project=dbc-data-studio
```

#### Step 3: Verify SSL Certificate
- Wait 5-10 minutes for SSL certificate provisioning
- Check status: `gcloud run domain-mappings describe modeler.dbcdatastudio.com --region=us-central1`
- Test: https://modeler.dbcdatastudio.com

### 4. Final Testing Checklist

- [ ] Test file upload (CSV, JSON, XLSX)
- [ ] Verify AI analysis works
- [ ] Test attribute selection/deselection
- [ ] Verify schema download
- [ ] Check downloaded JSON has localized strings: `{ "en": "Value" }`
- [ ] Verify enum detection (<10 unique values)
- [ ] Check schema dry run summary displays correctly
- [ ] Test on mobile device
- [ ] Verify analytics events in GA4 dashboard

### 5. Monitoring & Optimization

#### Set Up Alerts (Optional)
```bash
# Create alert for high error rate
gcloud alpha monitoring policies create \
  --notification-channels=YOUR_CHANNEL_ID \
  --display-name="Smart Data Modeler - High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=300s
```

#### Monitor Key Metrics
- Cloud Run logs: `gcloud run logs read smart-data-modeler --region=us-central1`
- GA4 dashboard: Track conversion funnel
  - File uploads → Attribute mapping → Schema downloads
- Vertex AI quota: Monitor API usage in GCP Console

### 6. Documentation Updates

- [ ] Update README with production URL
- [ ] Add analytics setup instructions
- [ ] Document custom domain setup
- [ ] Create user guide (optional)

## 📊 Analytics Events Reference

The app tracks these custom events in GA4:

1. **file_upload_success**
   - Parameters: `file_extension`, `row_count`, `header_count`
   - Triggered: When file is successfully parsed

2. **attributes_mapped**
   - Parameters: `total_attributes`, `product_info_count`, `technical_metadata_count`
   - Triggered: After AI analysis completes

3. **schema_downloaded** ⭐ (Primary Conversion)
   - Parameters: `product_type_key`, `attribute_count`, `technical_metadata_ignored`
   - Triggered: When user downloads the schema JSON

## 🔧 Troubleshooting

### Analytics Not Working
- Verify secret is created and accessible
- Check browser console for GA4 errors
- Verify `NEXT_PUBLIC_GA4_ID` is set in Cloud Run environment
- Check GA4 Real-Time reports (events appear immediately)

### Custom Domain Issues
- Verify DNS record is correct (CNAME to `ghs.googlehosted.com.`)
- Wait 10-15 minutes for DNS propagation
- Check domain mapping status in GCP Console
- Verify SSL certificate is provisioned

### Vertex AI Errors
- Check service account IAM roles: `roles/aiplatform.user`
- Verify Vertex AI API is enabled
- Check Cloud Run logs for detailed error messages

## 🎉 Success Criteria

- ✅ Service accessible at custom domain
- ✅ Analytics tracking all three events
- ✅ Schema downloads working correctly
- ✅ All features tested and verified
- ✅ Documentation complete

