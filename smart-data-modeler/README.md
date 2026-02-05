# Smart Data Modeler

Transform your raw product data into commercetools-ready schemas with AI-powered mapping. Free utility for Solution Architects and Developers migrating legacy data into commercetools.

## Features

- 📁 **Multi-format Support**: Upload CSV, JSON, or XLSX files (max 4MB)
- 🤖 **AI-Powered Analysis**: Uses Google Gemini 2.0 Pro via Vertex AI with specialized SDM prompts
- 🎯 **80% Similarity Grouping**: Automatically groups attributes by similarity to propose optimal Product Types
- ✏️ **Three-Bucket Verification**: 
  - **Auto-Mapped**: Direct commercetools product entity fields (name, description, price)
  - **Product Info**: Customer-facing attributes (default ON)
  - **Technical Metadata**: Internal IDs and system references (default OFF)
- 🔄 **Toggle All**: Quick select/deselect for long attribute lists
- 📥 **API Playground Ready**: Download commercetools Product Type JSON schemas ready for direct use in API Playground
- 🎨 **Premium UI**: Modern, Bento-style interface optimized for conversion

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **File Parsing**: PapaParse (CSV), XLSX (Excel), native JSON
- **Deployment**: Google Cloud Run

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Add your GEMINI_API_KEY to .env.local
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

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

### Vertex AI Configuration (Recommended)
- `GOOGLE_CLOUD_PROJECT`: Your Google Cloud Project ID (e.g., `dbc-data-studio`)
- `GOOGLE_CLOUD_LOCATION`: Vertex AI location (default: `us-central1`)
- `GOOGLE_GENAI_USE_VERTEXAI`: Set to `true` to use Vertex AI (Gemini 2.0 Pro)

### Alternative: AI Studio (Development)
- `GEMINI_API_KEY`: Your Google Gemini API key (for AI Studio)
- `GOOGLE_GENAI_USE_VERTEXAI`: Set to `false` to use AI Studio

### Optional
- `ENABLE_TELEMETRY`: Enable usage logging (default: `true`)

## Architecture

1. **File Upload**: Client-side parsing of CSV/JSON/XLSX files (4MB limit)
2. **AI Analysis**: Server-side Vertex AI (Gemini 2.0 Pro) call with specialized SDM prompts
   - Identifies all attributes and their types
   - Groups attributes by 80% similarity threshold
   - Categorizes into buckets (auto-mapped, product-info, technical-metadata)
3. **Verification Step**: Three-bucket UI for users to review and customize mappings
   - Auto-mapped fields shown for reference (not selectable)
   - Product info attributes default ON
   - Technical metadata default OFF
4. **Schema Generation**: Server-side generation of commercetools-compatible JSON
5. **API Playground Format**: Output formatted for direct use in commercetools API Playground
6. **Download**: Client-side download of API Playground-ready schema file

## API Routes

- `POST /api/analyze`: Analyzes uploaded data and generates schema proposal
- `POST /api/download-schema`: Generates final commercetools schema JSON

## License

Private - DBC Data Studio

