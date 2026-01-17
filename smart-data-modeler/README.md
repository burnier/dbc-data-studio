# Smart Data Modeler

**From Legacy Data to commercetools in 60 Seconds**

Transform your raw product data into commercetools-ready schemas with AI-powered mapping. Free utility for Solution Architects and Developers migrating legacy data into commercetools.

## Features

- 📁 **Multi-format Support**: Upload CSV, JSON, or XLSX files (max 4MB)
- 🤖 **AI-Powered Analysis**: Uses Google Gemini 2.0 Flash via Vertex AI with specialized SDM prompts
- 🎯 **80% Similarity Grouping**: Automatically groups attributes by similarity to propose optimal Product Types
- 🔍 **Smart Enum Detection**: Automatically detects attributes with <10 unique values and suggests Enum type
- 🌍 **Localized Strings**: All labels default to LocalizedString format `{ "en": "Value" }` for enterprise compatibility
- ✏️ **Three-Bucket Verification**: 
  - **Standard Fields**: Direct commercetools product entity fields (name, description, slug, sku) - shown for reference
  - **Product Info**: Customer-facing attributes (default ON)
  - **Technical Metadata**: Internal IDs and system references (default OFF)
- 🔄 **Toggle All**: Quick select/deselect for long attribute lists
- 📊 **Schema Dry Run**: Preview summary showing Product Types, Attributes, and ignored metadata fields
- 📥 **API Playground Ready**: Download commercetools Product Type JSON schemas ready for direct use in API Playground
- 📈 **Analytics**: GA4 integration with custom events (file_upload_success, attributes_mapped, schema_downloaded)
- 🎨 **Premium UI**: Modern, Bento-style interface optimized for conversion

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.0 Flash via Vertex AI (REST API) or AI Studio
- **File Parsing**: PapaParse (CSV), XLSX (Excel), native JSON
- **Analytics**: Google Analytics 4 (GA4)
- **Deployment**: Google Cloud Run

## Local Development

### Prerequisites

- Node.js 18+
- Google Cloud SDK (`gcloud`) installed
- Vertex AI access configured (recommended) OR Gemini API key for AI Studio

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Authenticate with Google Cloud (for Vertex AI):**
   ```bash
   gcloud auth application-default login
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   - **Vertex AI (Recommended)**: Already configured in `env.example`
   - **AI Studio (Alternative)**: Uncomment `GEMINI_API_KEY` and set `GOOGLE_GENAI_USE_VERTEXAI=false`

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Deployment

### Prerequisites

- Google Cloud SDK (`gcloud`) installed and authenticated
- Docker installed
- Project ID: `dbc-data-studio`

### Deploy to Cloud Run

```bash
./deploy-modeler.sh
```

### Set up Custom Domain

After deployment, map the custom domain:

```bash
gcloud beta run domain-mappings create \
  --service=smart-data-modeler \
  --domain=modeler.dbcdatastudio.com \
  --platform=managed \
  --region=us-central1 \
  --project=dbc-data-studio
```

Then add a CNAME record in Cloudflare:
- **Name**: `modeler`
- **Target**: `ghs.googlehosted.com.`
- **Proxy**: DNS only (gray cloud)

## Environment Variables

### Vertex AI Configuration (Recommended for Production)
- `GOOGLE_CLOUD_PROJECT`: Your Google Cloud Project ID (e.g., `dbc-data-studio`)
- `GOOGLE_CLOUD_LOCATION`: Vertex AI location (default: `us-central1`)
- `GOOGLE_GENAI_USE_VERTEXAI`: Set to `true` to use Vertex AI (Gemini 2.0 Flash)
- **Authentication**: Uses Application Default Credentials (run `gcloud auth application-default login`)

### Alternative: AI Studio (Development/Testing)
- `GEMINI_API_KEY`: Your Google Gemini API key from [AI Studio](https://makersuite.google.com/app/apikey)
- `GOOGLE_GENAI_USE_VERTEXAI`: Set to `false` to use AI Studio

### Optional
- `ENABLE_TELEMETRY`: Enable usage logging (default: `true`)
- `NEXT_PUBLIC_GA4_ID`: Google Analytics 4 Measurement ID (format: `G-XXXXXXXXXX`)

See [env.example](./env.example) for a complete configuration template.

## Architecture

1. **File Upload**: Client-side parsing of CSV/JSON/XLSX files (4MB limit)
   - Tracks `file_upload_success` event (GA4)
2. **AI Analysis**: Server-side Vertex AI (Gemini 2.0 Flash) REST API call with specialized SDM prompts
   - Identifies all attributes and their types
   - **Enum Detection**: Attributes with <10 unique values automatically classified as Enum
   - Groups attributes by 80% similarity threshold
   - Categorizes into buckets (standard, product-info, technical-metadata)
   - Tracks `attributes_mapped` event (GA4)
3. **Verification Step**: Three-bucket UI for users to review and customize mappings
   - **Standard Fields**: Shown for reference (name, description, slug, sku) - not selectable
   - **Product Info**: Customer-facing attributes (default ON)
   - **Technical Metadata**: Internal IDs and system references (default OFF)
   - Toggle All functionality for long lists
4. **Schema Generation**: Server-side generation of commercetools-compatible JSON
   - All labels use LocalizedString format: `{ "en": "Value" }`
   - Schema dry run summary shows counts before download
5. **API Playground Format**: Output formatted for direct use in commercetools API Playground
6. **Download**: Client-side download of API Playground-ready schema file
   - Tracks `schema_downloaded` event (GA4) - primary conversion metric

## API Routes

- `POST /api/analyze`: Analyzes uploaded data and generates schema proposal
- `POST /api/download-schema`: Generates final commercetools schema JSON

## Production

**Live URL**: https://modeler.dbcdatastudio.com  
**Cloud Run URL**: https://smart-data-modeler-7ul23r45va-uc.a.run.app

### Deployment

Deploy using the deployment script:
```bash
./deploy-modeler.sh
```

Or manually:
```bash
gcloud builds submit --tag gcr.io/dbc-data-studio/smart-data-modeler --project=dbc-data-studio
gcloud run deploy smart-data-modeler \
  --image gcr.io/dbc-data-studio/smart-data-modeler:latest \
  --platform managed \
  --region us-central1 \
  --project dbc-data-studio \
  --allow-unauthenticated \
  --set-env-vars "ENABLE_TELEMETRY=true,GOOGLE_CLOUD_PROJECT=dbc-data-studio,GOOGLE_CLOUD_LOCATION=us-central1,GOOGLE_GENAI_USE_VERTEXAI=true"
```

### Analytics

GA4 is configured and tracking:
- Measurement ID: `G-NMF51G1TX7`
- Custom events: `file_upload_success`, `attributes_mapped`, `schema_downloaded`

## Troubleshooting

### Vertex AI Connection Issues
- Verify authentication: `gcloud auth application-default login`
- Check IAM roles: `gcloud projects get-iam-policy dbc-data-studio`
- Verify Vertex AI API is enabled: `gcloud services enable aiplatform.googleapis.com`
- Ensure service account has `roles/aiplatform.user` role

### Model Not Found Errors
- Vertex AI uses REST API (SDK has issues with Vertex AI mode)
- Model name: `gemini-2.0-flash` (confirmed working)
- Alternative models: `gemini-2.5-flash`, `gemini-2.5-pro`

### File Upload Issues
- Maximum file size: 4MB
- Supported formats: CSV, JSON, XLSX
- For larger catalogs, split into product families

## License

Private - DBC Data Studio

---

**Built by DBC Data Studio – Accelerating Composable Commerce**

