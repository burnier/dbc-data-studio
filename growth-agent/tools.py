"""
Growth Agent — Tools

Each tool is a CrewAI BaseTool subclass.
Tools are pure functions: they fetch data and return a string
(Markdown or JSON) that the agent can reason about.

Outreach priority for Brazilian marketplace sellers:
  1. FacebookGroupsTool  — primary (where BR sellers actually congregate)
  2. YouTubeSearchTool   — strong secondary (long-tail search + creator collab)
  3. RedditSearchTool    — tertiary/optional (niche in Brazil)
"""
import json
import base64
from datetime import datetime
from typing import Optional, Type

import httpx
from crewai.tools import BaseTool
from pydantic import BaseModel, Field

import config


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _google_access_token() -> str:
    """
    Mint a short-lived Google OAuth2 access token from a service account JSON.
    Uses only stdlib (no google-auth required at runtime).
    """
    import json as _json
    import time as _time

    raw = config.GOOGLE_SERVICE_ACCOUNT_JSON
    if not raw:
        raise RuntimeError("GOOGLE_SERVICE_ACCOUNT_JSON is not set")

    sa = _json.loads(raw)

    # Build JWT header + payload
    def b64url(data: str) -> str:
        return base64.urlsafe_b64encode(data.encode()).rstrip(b"=").decode()

    now = int(_time.time())
    header  = b64url(json.dumps({"alg": "RS256", "typ": "JWT"}))
    payload = b64url(json.dumps({
        "iss"  : sa["client_email"],
        "scope": "https://www.googleapis.com/auth/analytics.readonly",
        "aud"  : "https://oauth2.googleapis.com/token",
        "exp"  : now + 3600,
        "iat"  : now,
    }))

    unsigned = f"{header}.{payload}"

    # Sign with RSA-SHA256 using the private key
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding

    private_key = serialization.load_pem_private_key(
        sa["private_key"].encode(), password=None
    )
    sig_bytes = private_key.sign(unsigned.encode(), padding.PKCS1v15(), hashes.SHA256())
    sig = base64.urlsafe_b64encode(sig_bytes).rstrip(b"=").decode()

    jwt = f"{unsigned}.{sig}"

    # Exchange JWT for access token
    resp = httpx.post(
        "https://oauth2.googleapis.com/token",
        data={
            "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "assertion" : jwt,
        },
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def _ga4_report(token: str, body: dict) -> dict:
    resp = httpx.post(
        f"{config.GA4_API_BASE}/{config.GA4_PROPERTY_ID}:runReport",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=body,
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json()


def _rows(data: dict) -> list:
    return data.get("rows", [])


def _m(row: dict, i: int = 0) -> str:
    return row["metricValues"][i]["value"]


def _d(row: dict, i: int = 0) -> str:
    return row["dimensionValues"][i]["value"]


# ─── Tool 1: Analytics Summary ────────────────────────────────────────────────

class AnalyticsInput(BaseModel):
    days: int = Field(default=30, description="Number of days to look back (7, 30, or 90)")


class AnalyticsSummaryTool(BaseTool):
    """
    Fetches a compact analytics summary from the internal /api/analytics/summary
    endpoint. Falls back to querying GA4 directly if the endpoint is unavailable.
    """
    name: str = "analytics_summary"
    description: str = (
        "Fetch traffic, engagement, and custom-event metrics for the calculadora app. "
        "Returns JSON with sessions, users, bounce rate, referrers, devices, "
        "custom events (calculation_performed, whatsapp_share, feedback_submitted), "
        "marketplace breakdown, funnel stats, and daily trend. "
        "Input: number of days (7, 30, or 90)."
    )
    args_schema: Type[BaseModel] = AnalyticsInput

    def _run(self, days: int = 30) -> str:
        days = max(1, min(days, 365))

        # ── Try internal endpoint first ────────────────────────────────────────
        if config.ANALYTICS_SECRET and config.APP_BASE_URL:
            try:
                resp = httpx.get(
                    f"{config.APP_BASE_URL}/api/analytics/summary",
                    params={"days": days},
                    headers={"Authorization": f"Bearer {config.ANALYTICS_SECRET}"},
                    timeout=20,
                )
                if resp.status_code == 200:
                    return resp.text
            except Exception as e:
                print(f"[AnalyticsTool] Internal endpoint failed ({e}), falling back to GA4 direct")

        # ── Fall back to direct GA4 API ────────────────────────────────────────
        token = _google_access_token()
        start = f"{days}daysAgo"
        end   = "today"

        overview_raw = _ga4_report(token, {
            "dateRanges": [{"startDate": start, "endDate": end}],
            "metrics": [
                {"name": "sessions"}, {"name": "totalUsers"}, {"name": "newUsers"},
                {"name": "bounceRate"}, {"name": "averageSessionDuration"}, {"name": "eventCount"},
            ],
        })
        ov = _rows(overview_raw)
        overview = {}
        if ov:
            r = ov[0]
            overview = {
                "sessions"            : int(_m(r, 0)),
                "users"               : int(_m(r, 1)),
                "new_users"           : int(_m(r, 2)),
                "bounce_rate"         : round(float(_m(r, 3)), 4),
                "avg_session_duration": round(float(_m(r, 4)), 1),
                "total_events"        : int(_m(r, 5)),
            }

        referrer_raw = _ga4_report(token, {
            "dateRanges": [{"startDate": start, "endDate": end}],
            "dimensions": [{"name": "sessionSource"}, {"name": "sessionMedium"}],
            "metrics"   : [{"name": "sessions"}, {"name": "bounceRate"}, {"name": "averageSessionDuration"}],
            "orderBys"  : [{"metric": {"metricName": "sessions"}, "desc": True}],
            "limit"     : 8,
        })
        top_referrers = [
            {
                "source"  : _d(r, 0), "medium": _d(r, 1),
                "sessions": int(_m(r, 0)),
                "bounce"  : round(float(_m(r, 1)), 2),
            }
            for r in _rows(referrer_raw)
        ]

        device_raw = _ga4_report(token, {
            "dateRanges": [{"startDate": start, "endDate": end}],
            "dimensions": [{"name": "deviceCategory"}],
            "metrics"   : [{"name": "sessions"}, {"name": "bounceRate"}, {"name": "averageSessionDuration"}],
        })
        devices = [
            {
                "device"              : _d(r, 0),
                "sessions"            : int(_m(r, 0)),
                "bounce_rate"         : round(float(_m(r, 1)), 2),
                "avg_session_duration": round(float(_m(r, 2)), 1),
            }
            for r in _rows(device_raw)
        ]

        event_raw = _ga4_report(token, {
            "dateRanges": [{"startDate": start, "endDate": end}],
            "dimensions": [{"name": "eventName"}],
            "metrics"   : [{"name": "eventCount"}],
            "dimensionFilter": {"filter": {"fieldName": "eventName", "inListFilter": {
                "values": ["calculation_performed", "marketplace_selected", "whatsapp_share", "feedback_submitted"]
            }}},
        })
        custom_events = {_d(r, 0): int(_m(r)) for r in _rows(event_raw)}

        mkt_raw = _ga4_report(token, {
            "dateRanges": [{"startDate": start, "endDate": end}],
            "dimensions": [{"name": "eventName"}, {"name": "customEvent:marketplace"}],
            "metrics"   : [{"name": "eventCount"}],
            "dimensionFilter": {"filter": {"fieldName": "eventName", "stringFilter": {"value": "calculation_performed"}}},
        })
        marketplace_breakdown = {(_d(r, 1) or "(not set)"): int(_m(r)) for r in _rows(mkt_raw)}

        sessions = overview.get("sessions", 0)
        calcs    = custom_events.get("calculation_performed", 0)
        shares   = custom_events.get("whatsapp_share", 0)
        funnel   = {
            "sessions"        : sessions,
            "calculations"    : calcs,
            "shares"          : shares,
            "calculation_rate": round(calcs / sessions, 2) if sessions else 0,
            "share_rate"      : round(shares / calcs, 4)  if calcs   else 0,
        }

        result = {
            "period_days"          : days,
            "generated_at"         : datetime.utcnow().isoformat() + "Z",
            "overview"             : overview,
            "top_referrers"        : top_referrers,
            "devices"              : devices,
            "custom_events"        : custom_events,
            "marketplace_breakdown": marketplace_breakdown,
            "funnel"               : funnel,
        }
        return json.dumps(result, ensure_ascii=False, indent=2)


# ─── Tool 2: Facebook Groups ──────────────────────────────────────────────────
#
# Strategy: Facebook's Graph API heavily restricts group search and post access
# for third-party apps. The most reliable and policy-compliant approach is:
#   1. Maintain a curated list of known, high-value Brazilian seller groups.
#   2. If a user access token is provided, fetch recent posts from known group IDs.
#   3. Always return the curated list so the agent can draft targeted posts.
#
# To get a FACEBOOK_ACCESS_TOKEN:
#   - Create a Facebook App at developers.facebook.com
#   - Use the Graph API Explorer to generate a user token with groups_access_member_info
#     permission (requires you to be a member of the groups you want to read).

class FacebookGroupsInput(BaseModel):
    topic: str = Field(
        default="lucro shopee mercado livre",
        description="Topic to focus on when drafting content (e.g. 'calcular lucro shopee')"
    )


class FacebookGroupsTool(BaseTool):
    """
    Returns a curated list of high-value Brazilian Facebook groups where
    marketplace sellers (Shopee, Mercado Livre) discuss fees, pricing, and profit.
    If FACEBOOK_ACCESS_TOKEN + group IDs are configured, also fetches recent posts.
    The agent uses this data to draft targeted, helpful posts or comments in pt-BR.
    """
    name: str = "facebook_groups"
    description: str = (
        "Get a curated list of Brazilian Facebook groups where Shopee and Mercado Livre "
        "sellers discuss profit, fees, and pricing. These are the primary communities "
        "where Brazilian e-commerce sellers congregate. "
        "Returns group names, URLs, member counts, and post context "
        "so the agent can draft helpful, non-spammy posts in Brazilian Portuguese. "
        "Input: topic to focus on."
    )
    args_schema: Type[BaseModel] = FacebookGroupsInput

    # Curated list of high-value Brazilian marketplace seller Facebook groups.
    # These are real, active communities — update periodically.
    CURATED_GROUPS: list = [
        {
            "name"        : "Vendedores Shopee Brasil",
            "url"         : "https://www.facebook.com/groups/vendedoresshopeebrasil",
            "approx_members": "50k+",
            "focus"       : "Shopee sellers — fees, tips, strategies",
            "post_type"   : "Questions and tips about Shopee pricing and profit",
        },
        {
            "name"        : "Mercado Livre Vendedores — Dicas e Estratégias",
            "url"         : "https://www.facebook.com/groups/mercadolivrevendedores",
            "approx_members": "30k+",
            "focus"       : "Mercado Livre sellers — fees, rankings, logistics",
            "post_type"   : "Discussions on ML fees, commissions, and margin",
        },
        {
            "name"        : "E-commerce Brasil — Shopee, Mercado Livre, Amazon",
            "url"         : "https://www.facebook.com/groups/ecommercebrasil",
            "approx_members": "80k+",
            "focus"       : "Multi-marketplace sellers — general e-commerce",
            "post_type"   : "Broad e-commerce tips, marketplace comparisons",
        },
        {
            "name"        : "Ganhar Dinheiro com Dropshipping e Marketplace",
            "url"         : "https://www.facebook.com/groups/dropshippingmarketplacebrasil",
            "approx_members": "40k+",
            "focus"       : "Dropshipping + marketplace profitability",
            "post_type"   : "Profit calculation, supplier pricing, margin questions",
        },
        {
            "name"        : "Shopee Sellers — Dicas para Lucrar Mais",
            "url"         : "https://www.facebook.com/groups/shopeesellersbrasileiros",
            "approx_members": "25k+",
            "focus"       : "Shopee-specific profit and growth tips",
            "post_type"   : "Fee updates, profit tips, calculator recommendations",
        },
        {
            "name"        : "MEI e Empreendedores Digitais",
            "url"         : "https://www.facebook.com/groups/meiempreendedoresdigitais",
            "approx_members": "60k+",
            "focus"       : "MEI entrepreneurs selling online",
            "post_type"   : "Tax questions, MEI + marketplace, profit margins",
        },
        {
            "name"        : "Vender na Shopee — Comunidade Oficial BR",
            "url"         : "https://www.facebook.com/groups/shopeesellersbr",
            "approx_members": "35k+",
            "focus"       : "Official-style Shopee seller community",
            "post_type"   : "Shopee policy, fees, and seller tools",
        },
    ]

    def _run(self, topic: str = "lucro shopee mercado livre") -> str:
        result = {
            "channel"     : "Facebook Groups",
            "priority"    : "PRIMARY — highest concentration of Brazilian marketplace sellers",
            "topic"       : topic,
            "strategy"    : (
                "Draft a helpful post or comment for each group. "
                "Rule: lead with genuine value (a tip, data, or answer). "
                "Mention the free calculator only when it directly helps the discussion. "
                "Never post the same message to multiple groups — personalise each one."
            ),
            "groups"      : self.CURATED_GROUPS,
            "post_tips"   : [
                "Start with a question or a surprising fact (e.g., 'Você sabia que a taxa real da Shopee é 20% + R$4?')",
                "Share a concrete example calculation — then offer the calculator as a faster way to do it.",
                "Respond to existing posts asking about fees/profit with helpful info + the tool link.",
                "Avoid: 'check out my tool', 'I made this app', or any sales language.",
                "Best posting times BR: weekday evenings 19h–22h BRT, Saturday mornings.",
            ],
        }

        # ── Optional: fetch recent posts from known group IDs via Graph API ────
        if config.FACEBOOK_ACCESS_TOKEN and config.FACEBOOK_GROUP_IDS:
            live_posts = []
            for group_id in config.FACEBOOK_GROUP_IDS[:3]:
                try:
                    resp = httpx.get(
                        f"https://graph.facebook.com/v21.0/{group_id}/feed",
                        params={
                            "fields"      : "message,created_time,from,comments.limit(3){message}",
                            "limit"       : 5,
                            "access_token": config.FACEBOOK_ACCESS_TOKEN,
                        },
                        timeout=15,
                    )
                    if resp.status_code == 200:
                        posts = resp.json().get("data", [])
                        for p in posts:
                            live_posts.append({
                                "group_id"      : group_id,
                                "created"       : p.get("created_time", "")[:10],
                                "message_preview": (p.get("message") or "")[:300],
                                "post_url"      : f"https://facebook.com/{p.get('id', '')}",
                            })
                except Exception as e:
                    live_posts.append({"group_id": group_id, "error": str(e)})
            result["live_posts"] = live_posts

        return json.dumps(result, ensure_ascii=False, indent=2)


# ─── Tool 3: Reddit Search (tertiary) ────────────────────────────────────────
#
# Reddit is a minor channel for Brazilian sellers. Keep as an optional tool
# for finding English-language e-commerce discussions or niche PT-BR subs.

class RedditSearchInput(BaseModel):
    query: str = Field(description="Search query in Portuguese or English")
    limit: int = Field(default=8, description="Max number of posts to return")


class RedditSearchTool(BaseTool):
    """
    Searches Reddit for posts relevant to marketplace sellers.
    TERTIARY channel — Reddit has low penetration in Brazil.
    Use only for supplemental English-language or niche PT-BR threads.
    Falls back to the public Reddit JSON API (no credentials needed).
    """
    name: str = "reddit_search"
    description: str = (
        "TERTIARY channel. Search Reddit for threads about marketplace fees or profit. "
        "Use only after Facebook and YouTube have been covered. "
        "Input: search query (pt-BR or English), optional limit."
    )
    args_schema: Type[BaseModel] = RedditSearchInput

    def _run(self, query: str, limit: int = 8) -> str:
        limit = min(limit, 25)
        try:
            resp = httpx.get(
                "https://www.reddit.com/search.json",
                params={"q": query, "sort": "new", "limit": limit, "type": "link"},
                headers={"User-Agent": "growth-agent/1.0"},
                timeout=15,
                follow_redirects=True,
            )
            resp.raise_for_status()
            posts = resp.json().get("data", {}).get("children", [])
            results = []
            for p in posts:
                d = p.get("data", {})
                results.append({
                    "subreddit"       : d.get("subreddit", ""),
                    "title"           : d.get("title", ""),
                    "url"             : f"https://reddit.com{d.get('permalink', '')}",
                    "score"           : d.get("score", 0),
                    "num_comments"    : d.get("num_comments", 0),
                    "created"         : datetime.utcfromtimestamp(d.get("created_utc", 0)).strftime("%Y-%m-%d"),
                    "selftext_preview": d.get("selftext", "")[:300],
                })
            return json.dumps(results, ensure_ascii=False, indent=2)
        except Exception as e:
            return json.dumps({"error": f"Reddit search failed: {e}"})


# ─── Tool 3: YouTube Search ───────────────────────────────────────────────────

class YouTubeSearchInput(BaseModel):
    query: str = Field(description="Search query in Portuguese or English")
    max_results: int = Field(default=8, description="Max number of videos to return")


class YouTubeSearchTool(BaseTool):
    """
    Searches YouTube for videos relevant to Brazilian marketplace sellers.
    Requires a YouTube Data API v3 key (YOUTUBE_API_KEY env var).
    Returns video title, URL, channel, view count, and comment count.
    """
    name: str = "youtube_search"
    description: str = (
        "Search YouTube for videos about Shopee/Mercado Livre fees, profit calculation, "
        "or e-commerce tips for Brazilian sellers. "
        "Returns videos with URLs and engagement stats so the agent can "
        "identify good candidates for a helpful comment referencing the app. "
        "Input: search query (pt-BR preferred), optional max_results."
    )
    args_schema: Type[BaseModel] = YouTubeSearchInput

    def _run(self, query: str, max_results: int = 8) -> str:
        if not config.YOUTUBE_API_KEY:
            return json.dumps({
                "error": "YOUTUBE_API_KEY is not configured",
                "note" : "Add your YouTube Data API v3 key to .env to enable this tool.",
            })

        try:
            # Search request
            search_resp = httpx.get(
                "https://www.googleapis.com/youtube/v3/search",
                params={
                    "q"             : query,
                    "part"          : "snippet",
                    "type"          : "video",
                    "maxResults"    : min(max_results, 50),
                    "relevanceLanguage": "pt",
                    "regionCode"    : "BR",
                    "key"           : config.YOUTUBE_API_KEY,
                },
                timeout=15,
            )
            search_resp.raise_for_status()
            items = search_resp.json().get("items", [])

            if not items:
                return json.dumps({"results": []})

            # Fetch statistics for each video
            video_ids = ",".join(i["id"]["videoId"] for i in items if "videoId" in i.get("id", {}))
            stats_resp = httpx.get(
                "https://www.googleapis.com/youtube/v3/videos",
                params={"part": "statistics,snippet", "id": video_ids, "key": config.YOUTUBE_API_KEY},
                timeout=15,
            )
            stats_resp.raise_for_status()
            stats_by_id = {v["id"]: v for v in stats_resp.json().get("items", [])}

            results = []
            for item in items:
                vid_id = item.get("id", {}).get("videoId", "")
                snippet = item.get("snippet", {})
                stats   = stats_by_id.get(vid_id, {}).get("statistics", {})
                results.append({
                    "video_id"     : vid_id,
                    "title"        : snippet.get("title", ""),
                    "channel"      : snippet.get("channelTitle", ""),
                    "url"          : f"https://www.youtube.com/watch?v={vid_id}",
                    "published_at" : snippet.get("publishedAt", "")[:10],
                    "view_count"   : int(stats.get("viewCount", 0)),
                    "comment_count": int(stats.get("commentCount", 0)),
                    "like_count"   : int(stats.get("likeCount", 0)),
                })

            results.sort(key=lambda x: x["view_count"], reverse=True)
            return json.dumps(results, ensure_ascii=False, indent=2)

        except Exception as e:
            return json.dumps({"error": f"YouTube search failed: {e}"})
