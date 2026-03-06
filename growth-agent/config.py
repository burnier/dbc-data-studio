"""
Growth Agent — Configuration

Loads all settings from environment variables.
Copy .env.example → .env and fill in your values before running.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ─── Paths ────────────────────────────────────────────────────────────────────

ROOT_DIR = Path(__file__).parent
OUTPUT_DIR = ROOT_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

# ─── LLM ─────────────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")  # free tier — gemini-1.5-flash

# Model selection priority: OpenAI → Anthropic → Gemini (free).
# Override by setting LLM_MODEL in .env if you want a specific model.
LLM_MODEL = os.getenv(
    "LLM_MODEL",
    (
        "gpt-4o-mini"
        if OPENAI_API_KEY
        else (
            "claude-haiku-4-5-20251001"
            if ANTHROPIC_API_KEY
            else (
                "gemini/gemini-1.5-flash"
                if GOOGLE_API_KEY
                else "claude-haiku-4-5-20251001"
            )
        )
    ),
)

# ─── Analytics ────────────────────────────────────────────────────────────────

APP_BASE_URL = os.getenv("APP_BASE_URL", "https://calculadora.dbcdatastudio.com")
ANALYTICS_SECRET = os.getenv("ANALYTICS_SECRET", "")

# GA4 direct access (used when internal endpoint is unavailable)
GOOGLE_SERVICE_ACCOUNT_JSON = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "")
GA4_PROPERTY_ID = os.getenv("GA4_PROPERTY_ID", "properties/525217735")
GA4_API_BASE = "https://analyticsdata.googleapis.com/v1beta"

# Default reporting window — 7 days rolling is ideal for daily cron runs:
# short enough to show this week's impact, long enough to smooth daily noise.
DEFAULT_DAYS = int(os.getenv("DEFAULT_DAYS", "7"))

# ─── Facebook (primary outreach channel for Brazilian sellers) ────────────────
#
# To enable live post fetching from known groups:
#   1. Create a Facebook App at developers.facebook.com
#   2. Get a User Access Token with groups_access_member_info permission
#   3. Add comma-separated group numeric IDs in FACEBOOK_GROUP_IDS
#
# Without these, the tool still returns the full curated group list — enough
# for the agent to draft targeted posts without API access.

FACEBOOK_ACCESS_TOKEN = os.getenv("FACEBOOK_ACCESS_TOKEN", "")
FACEBOOK_GROUP_IDS = [
    gid.strip() for gid in os.getenv("FACEBOOK_GROUP_IDS", "").split(",") if gid.strip()
]

# ─── YouTube (strong secondary channel) ──────────────────────────────────────

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

# Search queries for finding relevant YouTube content
YOUTUBE_QUERIES = [
    "como calcular lucro shopee",
    "taxas mercado livre 2026",
    "como precificar produto shopee",
    "simulador de custos mercado livre",
    "margem de lucro ecommerce brasil",
]

# ─── App metadata (static, for agent context) ─────────────────────────────────

APP_METADATA = {
    "name": "Calculadora de Lucro — Shopee e Mercado Livre",
    "url": "https://calculadora.dbcdatastudio.com",
    "description": (
        "Free profit calculator for Brazilian marketplace sellers. "
        "Calculates net profit, break-even, and margin accounting for "
        "Shopee (20% + R$4), Mercado Livre Clássico/Premium, Pix fees, "
        "and Brazilian taxes (MEI / Simples Nacional)."
    ),
    "target_audience": "Brazilian e-commerce sellers on Shopee and Mercado Livre",
    "language": "pt-BR",
    "monetization": "future Google Ads",
}
