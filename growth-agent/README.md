# Growth Agent

A Python service that uses **CrewAI + Claude claude-sonnet-4-5** to automatically analyze traffic for [calculadora.dbcdatastudio.com](https://calculadora.dbcdatastudio.com) and draft targeted outreach content in Brazilian Portuguese.

> **Safety**: The agent never auto-posts to Reddit or YouTube. All output is a draft for human review.

---

## What it does

| Command | Agents | Output |
|---|---|---|
| `python main.py daily-report` | `TrafficAnalystAgent` | `output/daily_report_YYYY-MM-DD.md` |
| `python main.py outreach` | `TrafficAnalystAgent` + `ContentOutreachAgent` | `output/daily_report_*.md` + `output/outreach_*.md` |

### TrafficAnalystAgent
- Fetches GA4 metrics via the internal `/api/analytics/summary` endpoint (or direct GA4 API)
- Produces a Markdown report with:
  - Key metrics (sessions, users, bounce rate, funnel)
  - Traffic source analysis
  - Mobile vs desktop comparison
  - 3–5 prioritized, concrete growth recommendations

### ContentOutreachAgent
- Searches Reddit and YouTube for high-intent Brazilian seller conversations
- Drafts one helpful, non-spammy comment per thread/video (in pt-BR)
- Saves targets + drafts as a Markdown digest for manual approval

---

## Project Structure

```
growth-agent/
├── main.py          # CLI entrypoint (daily-report | outreach)
├── agents.py        # CrewAI Agent definitions
├── tools.py         # CrewAI Tool definitions (analytics, Reddit, YouTube)
├── config.py        # Configuration from env vars
├── requirements.txt # Python dependencies
├── .env.example     # Template for env vars
├── Dockerfile       # Production container (multi-stage)
├── start.sh         # Container CMD wrapper
└── output/          # Generated reports (gitignored)
```

---

## Setup — Local

### 1. Prerequisites

- Python **3.10–3.13** (CrewAI does not yet support 3.14+)
- `pip`

### 2. Create and activate the virtual environment

```bash
cd growth-agent

# Use python3.13 explicitly — CrewAI requires Python <3.14
python3.13 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in at minimum:

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Claude API key from [console.anthropic.com](https://console.anthropic.com) |
| `ANALYTICS_SECRET` | ✅ | Must match `ANALYTICS_SECRET` in Vercel project settings |
| `APP_BASE_URL` | ✅ | `https://calculadora.dbcdatastudio.com` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | ✅* | Service account JSON with GA4 Viewer access |
| `REDDIT_CLIENT_ID` | ☐ | Reddit app credentials (optional, improves rate limits) |
| `REDDIT_CLIENT_SECRET` | ☐ | Reddit app credentials (optional) |
| `YOUTUBE_API_KEY` | ☐ | YouTube Data API v3 key (optional) |

\* Required if the internal endpoint is not reachable (e.g., local development without a deployed app).

#### Setting up GOOGLE_SERVICE_ACCOUNT_JSON

1. Go to [Google Cloud Console](https://console.cloud.google.com) → IAM → Service Accounts
2. Create a service account (or reuse the existing one for `dbc-data-studio`)
3. Grant it **GA4 Viewer** access in the [GA4 Admin panel](https://analytics.google.com)
4. Download a JSON key for the service account
5. Inline the entire JSON as a single-line string in `.env`:
   ```
   GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"dbc-data-studio",...}
   ```

### 5. Run locally

```bash
# Traffic analysis report (last 30 days)
python main.py daily-report

# Outreach drafts (both agents)
python main.py outreach

# Custom look-back window
python main.py daily-report --days 7
```

Reports are saved to `./output/`.

---

## Setup — Vercel Environment Variables

Add the following to the **calculadora-lucro** Vercel project (Settings → Environment Variables):

| Name | Value |
|---|---|
| `ANALYTICS_SECRET` | A strong random string (e.g., `openssl rand -hex 32`) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | The service account JSON (same as above, single line) |

The `ANALYTICS_SECRET` is the shared secret between Vercel and this Python agent.

---

## Deployment — Container (Fly.io / Render / Railway)

### Option A: Fly.io (recommended for scheduled jobs)

```bash
# Install flyctl: https://fly.io/docs/flyctl/install/
fly auth login

# Launch (one time)
cd growth-agent
fly launch --name growth-agent --no-deploy

# Set secrets
fly secrets set \
  ANTHROPIC_API_KEY=sk-ant-... \
  ANALYTICS_SECRET=your-secret \
  APP_BASE_URL=https://calculadora.dbcdatastudio.com \
  GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# Deploy
fly deploy
```

**Add a scheduled job** in `fly.toml`:
```toml
[[statics]]
# (no static files needed)

[processes]
  app = "sh start.sh"   # on-demand / manual
```

Or use **Fly Machines** with a cron trigger via the Fly API:
```bash
# Daily report every day at 07:00 UTC
fly machine run . \
  --schedule daily \
  --env AGENT_COMMAND=daily-report \
  --env AGENT_DAYS=30
```

### Option B: Render (cron job service)

1. Connect this folder as a new **Cron Job** service on [render.com](https://render.com)
2. Build command: `pip install -r requirements.txt`
3. Start command: `sh start.sh`
4. Add environment variables in the Render dashboard
5. Set schedule (cron):
   - Daily report: `0 7 * * *` (07:00 UTC daily)
   - Outreach:     `0 8 * * 1` (Monday 08:00 UTC)

### Option C: Railway

1. Create a new Railway project and connect this folder
2. Add environment variables in Railway settings
3. Set the start command to `sh start.sh`
4. Use Railway's **Cron** feature with the same schedule as above

### Output persistence

By default, output files are written to `/app/output/` inside the container.
To persist between runs, mount a volume:

```bash
# Fly.io — attach a volume
fly volumes create growth_output --size 1
# Add to fly.toml:
# [mounts]
#   source = "growth_output"
#   destination = "/app/output"
```

---

## Recommended Schedule

| Job | Cron | Command |
|---|---|---|
| Daily traffic report | `0 7 * * *` | `python main.py daily-report` |
| Weekly outreach | `0 8 * * 1` | `python main.py outreach` |

---

## Future Extensions

The codebase is designed for easy extension:

### Email/Telegram notifications
Add a `notifiers.py` module and call it after `crew.kickoff()` in `main.py`:
```python
from notifiers import send_telegram
send_telegram(result.raw, chat_id=config.TELEGRAM_CHAT_ID)
```

### Approve-and-post flow
Add a `poster.py` module that reads the outreach Markdown, presents each draft interactively, and posts approved comments via PRAW / YouTube API.

### Additional agents
- `SEOAuditAgent` — checks page metadata, Core Web Vitals via PageSpeed API
- `CompetitorWatchAgent` — monitors competitor pages for new content or fee changes
- `AdPerformanceAgent` — analyzes future Google Ads performance once ads are live

---

## Dependencies

| Package | Purpose |
|---|---|
| `crewai` | Multi-agent orchestration framework |
| `anthropic` | Claude claude-sonnet-4-5 LLM (via LiteLLM in CrewAI) |
| `httpx` | Async-friendly HTTP client for API calls |
| `python-dotenv` | `.env` file loading |
| `praw` | Reddit API wrapper (optional) |
| `google-api-python-client` | YouTube Data API v3 (optional) |
| `cryptography` | RSA signing for Google Service Account JWT (used in tools.py) |
