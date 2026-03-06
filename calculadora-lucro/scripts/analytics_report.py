#!/usr/bin/env python3
"""
Calculadora de Lucro — GA4 Analytics Report

Pulls a comprehensive usage report from Google Analytics 4.
Requires: gcloud CLI authenticated with dbc.data.studio@gmail.com

Usage:
    python scripts/analytics_report.py              # last 30 days
    python scripts/analytics_report.py --days 7    # last 7 days
    python scripts/analytics_report.py --days 90   # last 90 days
    python scripts/analytics_report.py --save       # save to scripts/report.md
"""
import subprocess
import json
import sys
import argparse
from datetime import datetime, timedelta

# ─── Config ──────────────────────────────────────────────────────────────────

GA4_PROPERTY = "properties/525217735"
GCP_PROJECT   = "dbc-data-studio"
API_BASE      = "https://analyticsdata.googleapis.com/v1beta"

# ─── Helpers ─────────────────────────────────────────────────────────────────

def get_access_token() -> str:
    result = subprocess.run(
        ["gcloud", "auth", "application-default", "print-access-token"],
        capture_output=True, text=True
    )
    token = result.stdout.strip()
    if not token:
        print("❌  No access token. Run: gcloud auth application-default login")
        sys.exit(1)
    return token


def ga4_report(token: str, body: dict) -> dict:
    import urllib.request
    import urllib.error
    url = f"{API_BASE}/{GA4_PROPERTY}:runReport"
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {token}",
            "x-goog-user-project": GCP_PROJECT,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"\n❌  GA4 API error {e.code}: {error_body[:300]}")
        if e.code == 401:
            print("   → Token expired. Run: gcloud auth application-default login")
        elif e.code == 403:
            print("   → Permission denied. Check scopes or re-run:")
            print("     gcloud auth application-default login --scopes='https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform'")
        sys.exit(1)


def rows(data: dict):
    return data.get("rows", [])


def val(row, idx=0):
    return row["metricValues"][idx]["value"]


def dim(row, idx=0):
    return row["dimensionValues"][idx]["value"]


def fmt_dur(seconds: float) -> str:
    s = int(float(seconds))
    m, s = divmod(s, 60)
    h, m = divmod(m, 60)
    if h:
        return f"{h}h {m}m {s}s"
    if m:
        return f"{m}m {s}s"
    return f"{s}s"


def fmt_pct(rate: float) -> str:
    return f"{float(rate)*100:.1f}%"


def bar(value: int, max_value: int, width: int = 20) -> str:
    if max_value == 0:
        return "░" * width
    filled = round((value / max_value) * width)
    return "█" * filled + "░" * (width - filled)


def section(title: str):
    print(f"\n{'─'*60}")
    print(f"  {title}")
    print(f"{'─'*60}")


# ─── Report Sections ─────────────────────────────────────────────────────────

def overview(token, start, end):
    data = ga4_report(token, {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "metrics": [
            {"name": "sessions"},
            {"name": "totalUsers"},
            {"name": "newUsers"},
            {"name": "bounceRate"},
            {"name": "averageSessionDuration"},
            {"name": "screenPageViewsPerSession"},
            {"name": "eventCount"},
        ],
    })
    r = rows(data)
    if not r:
        print("  No data")
        return

    mv = r[0]["metricValues"]
    sessions        = int(mv[0]["value"])
    users           = int(mv[1]["value"])
    new_users       = int(mv[2]["value"])
    bounce          = float(mv[3]["value"])
    avg_dur         = float(mv[4]["value"])
    pages_per_sess  = float(mv[5]["value"])
    events          = int(mv[6]["value"])
    returning       = users - new_users

    print(f"  Sessions          {sessions:>8}")
    print(f"  Total Users       {users:>8}  (new: {new_users}, returning: {returning})")
    print(f"  Bounce Rate       {fmt_pct(bounce):>8}")
    print(f"  Avg Duration      {fmt_dur(avg_dur):>8}")
    print(f"  Pages / Session   {pages_per_sess:>8.2f}")
    print(f"  Total Events      {events:>8}")


def by_country(token, start, end):
    data = ga4_report(token, {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "dimensions": [{"name": "country"}],
        "metrics": [
            {"name": "sessions"},
            {"name": "bounceRate"},
            {"name": "averageSessionDuration"},
        ],
        "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
        "limit": 8,
    })
    total = sum(int(val(r)) for r in rows(data)) or 1
    print(f"  {'Country':<25} {'Sessions':>8}  {'Share':>6}  {'Bounce':>7}  {'Avg Time':>9}")
    print(f"  {'─'*25} {'─'*8}  {'─'*6}  {'─'*7}  {'─'*9}")
    for r in rows(data):
        country  = dim(r, 0)
        sessions = int(val(r, 0))
        bounce   = float(val(r, 1))
        dur      = float(val(r, 2))
        share    = sessions / total * 100
        print(f"  {country:<25} {sessions:>8}  {share:>5.1f}%  {fmt_pct(bounce):>7}  {fmt_dur(dur):>9}")


def by_device(token, start, end):
    data = ga4_report(token, {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "dimensions": [{"name": "deviceCategory"}],
        "metrics": [
            {"name": "sessions"},
            {"name": "bounceRate"},
            {"name": "averageSessionDuration"},
        ],
        "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
    })
    print(f"  {'Device':<12} {'Sessions':>8}  {'Bounce':>7}  {'Avg Time':>9}")
    print(f"  {'─'*12} {'─'*8}  {'─'*7}  {'─'*9}")
    for r in rows(data):
        device  = dim(r, 0).capitalize()
        sessions = int(val(r, 0))
        bounce   = float(val(r, 1))
        dur      = float(val(r, 2))
        flag = "⚠️ " if device == "Mobile" and float(val(r, 1)) > 0.8 else "   "
        print(f"  {flag}{device:<10} {sessions:>8}  {fmt_pct(bounce):>7}  {fmt_dur(dur):>9}")


def by_source(token, start, end):
    data = ga4_report(token, {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "dimensions": [{"name": "sessionSource"}, {"name": "sessionMedium"}],
        "metrics": [
            {"name": "sessions"},
            {"name": "bounceRate"},
            {"name": "averageSessionDuration"},
        ],
        "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
        "limit": 10,
    })
    print(f"  {'Source / Medium':<35} {'Sessions':>8}  {'Bounce':>7}  {'Avg Time':>9}")
    print(f"  {'─'*35} {'─'*8}  {'─'*7}  {'─'*9}")
    for r in rows(data):
        source   = dim(r, 0)
        medium   = dim(r, 1)
        label    = f"{source} / {medium}"
        sessions = int(val(r, 0))
        bounce   = float(val(r, 1))
        dur      = float(val(r, 2))
        print(f"  {label:<35} {sessions:>8}  {fmt_pct(bounce):>7}  {fmt_dur(dur):>9}")


def custom_events(token, start, end):
    data = ga4_report(token, {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "dimensions": [{"name": "eventName"}],
        "metrics": [{"name": "eventCount"}],
        "dimensionFilter": {
            "filter": {
                "fieldName": "eventName",
                "inListFilter": {
                    "values": [
                        "calculation_performed",
                        "marketplace_selected",
                        "whatsapp_share",
                        "feedback_submitted",
                    ]
                }
            }
        },
        "orderBys": [{"metric": {"metricName": "eventCount"}, "desc": True}],
    })
    total_events = sum(int(val(r)) for r in rows(data)) or 1
    print(f"  {'Event':<30} {'Count':>7}  Bar")
    print(f"  {'─'*30} {'─'*7}  {'─'*20}")
    max_count = max((int(val(r)) for r in rows(data)), default=1)
    for r in rows(data):
        event = dim(r, 0)
        count = int(val(r, 0))
        print(f"  {event:<30} {count:>7}  {bar(count, max_count)}")


def marketplace_breakdown(token, start, end):
    """Which marketplace are users calculating for most?"""
    data = ga4_report(token, {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "dimensions": [{"name": "eventName"}, {"name": "customEvent:marketplace"}],
        "metrics": [{"name": "eventCount"}],
        "dimensionFilter": {
            "filter": {
                "fieldName": "eventName",
                "stringFilter": {"value": "calculation_performed"},
            }
        },
        "orderBys": [{"metric": {"metricName": "eventCount"}, "desc": True}],
    })
    if not rows(data):
        print("  No marketplace data yet (custom dimensions may need 24-48h to populate)")
        return
    max_count = max((int(val(r)) for r in rows(data)), default=1)
    print(f"  {'Marketplace':<30} {'Calcs':>6}  Bar")
    print(f"  {'─'*30} {'─'*6}  {'─'*20}")
    for r in rows(data):
        marketplace = dim(r, 1) or "(not set)"
        count = int(val(r, 0))
        print(f"  {marketplace:<30} {count:>6}  {bar(count, max_count)}")


def feedback_details(token, start, end):
    """Show feedback breakdown and any comments."""
    # Positive vs negative
    data = ga4_report(token, {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "dimensions": [{"name": "customEvent:type"}],
        "metrics": [{"name": "eventCount"}],
        "dimensionFilter": {
            "filter": {
                "fieldName": "eventName",
                "stringFilter": {"value": "feedback_submitted"},
            }
        },
    })
    if not rows(data):
        print("  No feedback submitted yet in this period")
        return
    for r in rows(data):
        kind  = dim(r, 0) or "(not set)"
        count = int(val(r, 0))
        emoji = "👍" if kind == "positive" else "👎"
        print(f"  {emoji} {kind:<15} {count} response(s)")

    # Comments from negative feedback
    comments_data = ga4_report(token, {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "dimensions": [{"name": "customEvent:comment"}],
        "metrics": [{"name": "eventCount"}],
        "dimensionFilter": {
            "andGroup": {
                "expressions": [
                    {"filter": {"fieldName": "eventName", "stringFilter": {"value": "feedback_submitted"}}},
                    {"filter": {"fieldName": "customEvent:type", "stringFilter": {"value": "negative"}}},
                ]
            }
        },
    })
    comments = [
        dim(r, 0) for r in rows(comments_data)
        if dim(r, 0) and dim(r, 0) not in ("(not set)", "")
    ]
    if comments:
        print(f"\n  User comments ({len(comments)}):")
        for c in comments:
            print(f"    • \"{c}\"")
    else:
        print("  No written comments yet")


def daily_trend(token, start, end):
    data = ga4_report(token, {
        "dateRanges": [{"startDate": start, "endDate": end}],
        "dimensions": [{"name": "date"}],
        "metrics": [{"name": "sessions"}, {"name": "totalUsers"}],
        "orderBys": [{"dimension": {"dimensionName": "date"}}],
    })
    if not rows(data):
        print("  No data")
        return
    max_sessions = max(int(val(r)) for r in rows(data))
    print(f"  {'Date':<12} {'Sess':>5}  {'Users':>5}  Bar")
    print(f"  {'─'*12} {'─'*5}  {'─'*5}  {'─'*20}")
    for r in rows(data):
        raw_date = dim(r, 0)
        date_fmt = f"{raw_date[0:4]}-{raw_date[4:6]}-{raw_date[6:8]}"
        sessions = int(val(r, 0))
        users    = int(val(r, 1))
        print(f"  {date_fmt:<12} {sessions:>5}  {users:>5}  {bar(sessions, max_sessions)}")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Calculadora GA4 Analytics Report")
    parser.add_argument("--days", type=int, default=30, help="Number of days to report on (default: 30)")
    parser.add_argument("--save", action="store_true", help="Save report to scripts/report.md")
    args = parser.parse_args()

    end   = "today"
    start = f"{args.days}daysAgo"

    period_label = f"Last {args.days} days"

    print(f"\n{'='*60}")
    print(f"  📊 CALCULADORA DE LUCRO — ANALYTICS REPORT")
    print(f"  Period: {period_label}")
    print(f"  Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*60}")

    token = get_access_token()

    section("📈 OVERVIEW")
    overview(token, start, end)

    section("🌍 SESSIONS BY COUNTRY")
    by_country(token, start, end)

    section("📱 SESSIONS BY DEVICE")
    by_device(token, start, end)

    section("🔗 TRAFFIC SOURCES")
    by_source(token, start, end)

    section("⚡ CUSTOM EVENTS")
    custom_events(token, start, end)

    section("🛒 CALCULATIONS BY MARKETPLACE")
    marketplace_breakdown(token, start, end)

    section("💬 USER FEEDBACK")
    feedback_details(token, start, end)

    section(f"📅 DAILY TREND ({period_label})")
    daily_trend(token, start, end)

    print(f"\n{'='*60}\n")


if __name__ == "__main__":
    main()
