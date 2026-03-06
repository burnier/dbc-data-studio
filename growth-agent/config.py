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

ROOT_DIR   = Path(__file__).parent
OUTPUT_DIR = ROOT_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

# ─── LLM ─────────────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY: str = os.environ["ANTHROPIC_API_KEY"]
LLM_MODEL         = "anthropic/claude-sonnet-4-5"      # CrewAI LiteLLM identifier

# ─── Analytics ────────────────────────────────────────────────────────────────

APP_BASE_URL      = os.getenv("APP_BASE_URL", "https://calculadora.dbcdatastudio.com")
ANALYTICS_SECRET  = os.getenv("ANALYTICS_SECRET", "")

# GA4 direct access (used when internal endpoint is unavailable)
GOOGLE_SERVICE_ACCOUNT_JSON = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "")
GA4_PROPERTY_ID             = os.getenv("GA4_PROPERTY_ID", "properties/525217735")
GA4_API_BASE                = "https://analyticsdata.googleapis.com/v1beta"

# Default reporting window
DEFAULT_DAYS = int(os.getenv("DEFAULT_DAYS", "30"))

# ─── Reddit ──────────────────────────────────────────────────────────────────

REDDIT_CLIENT_ID     = os.getenv("REDDIT_CLIENT_ID", "")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET", "")
REDDIT_USER_AGENT    = os.getenv("REDDIT_USER_AGENT", "growth-agent/1.0")

# Subreddits relevant to Brazilian marketplace sellers
REDDIT_SUBREDDITS = [
    "shopee",
    "mercadolivre",
    "ecommercebrasil",
    "empreendedorismo",
    "brasil",
    "financaspessoais",
    "pequenaempresa",
]

# ─── YouTube ─────────────────────────────────────────────────────────────────

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
    "name"       : "Calculadora de Lucro — Shopee e Mercado Livre",
    "url"        : "https://calculadora.dbcdatastudio.com",
    "description": (
        "Free profit calculator for Brazilian marketplace sellers. "
        "Calculates net profit, break-even, and margin accounting for "
        "Shopee (20% + R$4), Mercado Livre Clássico/Premium, Pix fees, "
        "and Brazilian taxes (MEI / Simples Nacional)."
    ),
    "target_audience": "Brazilian e-commerce sellers on Shopee and Mercado Livre",
    "language"       : "pt-BR",
    "monetization"   : "future Google Ads",
}
