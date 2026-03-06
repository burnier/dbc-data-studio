#!/usr/bin/env python3
"""
Growth Agent — Entrypoint

Usage:
    python main.py daily-report          # TrafficAnalystAgent only
    python main.py outreach              # Both agents sequentially
    python main.py daily-report --days 7 # Override look-back window

Output files are written to ./output/
"""
import argparse
import sys
from datetime import date
from pathlib import Path

from crewai import Crew, Process, Task

import config
from agents import build_traffic_analyst, build_content_outreach_agent


# ─── Task Definitions ─────────────────────────────────────────────────────────

def make_daily_report_task(agent, days: int) -> Task:
    today = date.today().isoformat()
    return Task(
        description=f"""
Fetch the analytics summary for the last {days} days using the analytics_summary tool.

Then produce a Markdown report that includes:

## 1. Key Metrics (last {days} days)
A table with: Sessions, Users, Bounce Rate, Avg Session Duration, 
Total Events, Calculations performed, WhatsApp shares, Feedback submitted.

## 2. Traffic Sources Analysis
Which referrers are driving traffic? What is the quality (bounce rate, 
session duration) of each source? Any new or unexpected sources?

## 3. Device & Mobile Analysis
Compare desktop vs mobile performance. 
Flag any problematic bounce rate differences.

## 4. Funnel Analysis
Session → Calculation → Share → Feedback conversion rates.
Where are users dropping off?

## 5. Prioritized Growth Recommendations (3–5 items)
For each recommendation:
- **What**: one-sentence description
- **Why**: cite the specific metric that motivates this
- **How**: one concrete next action (code change, content addition, etc.)
- **Impact**: estimated effort (Low/Medium/High) and expected impact (Low/Medium/High)

Focus areas: organic SEO, mobile UX, user engagement, content quality.

Today's date: {today}
""",
        expected_output=(
            "A well-structured Markdown document with sections 1–5 as described above. "
            "All metrics must be cited from the analytics data. "
            "Recommendations must be concrete and actionable."
        ),
        agent=agent,
        output_file=str(config.OUTPUT_DIR / f"daily_report_{today}.md"),
    )


def make_outreach_task(agent, days: int) -> Task:
    today = date.today().isoformat()
    return Task(
        description=f"""
Search for 5–10 relevant YouTube videos and Reddit threads where Brazilian 
marketplace sellers (Shopee, Mercado Livre) are discussing:
- How to calculate profit or fees
- Pricing strategies for online products
- Tax questions (MEI, Simples Nacional) for e-commerce
- Comparisons between Shopee and Mercado Livre

For Reddit, search these queries in Portuguese:
- "calculadora lucro shopee"
- "taxa mercado livre"
- "como calcular margem shopee"
- "precificar produto mercado livre"

For YouTube, search:
- "como calcular lucro shopee 2026"
- "taxas mercado livre 2026"
- "simulador de custos mercado livre"

Selection criteria — prefer content where:
1. The post/video is recent (last 6 months)
2. There are comments/questions from other sellers
3. The app (https://calculadora.dbcdatastudio.com) would be a genuinely 
   useful resource to mention

For each selected link, draft ONE comment in Brazilian Portuguese (pt-BR) that:
- Directly addresses the post/video topic with useful information
- Mentions the app only if it is a natural and helpful addition
- Is friendly, non-spammy, and under 150 words
- Does NOT sound like an advertisement

Format output as:

### [Video/Thread Title]
**URL**: <url>
**Platform**: YouTube | Reddit
**Why it's relevant**: <one sentence>
**Draft comment** (pt-BR):
> <the draft comment>

---

Today's date: {today}
""",
        expected_output=(
            "A Markdown digest with 5–10 entries. "
            "Each entry must have the URL, platform, relevance note, "
            "and a draft comment in Brazilian Portuguese. "
            "Comments must be genuinely helpful and not spammy."
        ),
        agent=agent,
        output_file=str(config.OUTPUT_DIR / f"outreach_{today}.md"),
    )


# ─── Crew Builders ────────────────────────────────────────────────────────────

def run_daily_report(days: int):
    print(f"\n🚀 Running daily-report (last {days} days)...\n")
    analyst = build_traffic_analyst()
    task    = make_daily_report_task(analyst, days)

    crew = Crew(
        agents =[analyst],
        tasks  =[task],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff()
    out_path = config.OUTPUT_DIR / f"daily_report_{date.today().isoformat()}.md"
    print(f"\n✅ Daily report saved to: {out_path}")
    return result


def run_outreach(days: int):
    print(f"\n🚀 Running outreach (analytics window: last {days} days)...\n")

    # Step 1: analyst produces context (not saved as file, used internally)
    analyst  = build_traffic_analyst()
    outreach = build_content_outreach_agent()

    analyst_task  = make_daily_report_task(analyst, days)
    outreach_task = make_outreach_task(outreach, days)

    crew = Crew(
        agents =[analyst, outreach],
        tasks  =[analyst_task, outreach_task],
        process=Process.sequential,
        verbose=True,
    )
    result = crew.kickoff()
    today = date.today().isoformat()
    print(f"\n✅ Report saved to:   {config.OUTPUT_DIR}/daily_report_{today}.md")
    print(f"✅ Outreach saved to: {config.OUTPUT_DIR}/outreach_{today}.md")
    return result


# ─── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Calculadora Growth Agent — powered by CrewAI + Claude claude-sonnet-4-5"
    )
    parser.add_argument(
        "command",
        choices=["daily-report", "outreach"],
        help=(
            "daily-report: run TrafficAnalystAgent and save a Markdown growth report.\n"
            "outreach: run both agents — analyst + ContentOutreachAgent — and save "
            "a report + outreach draft."
        ),
    )
    parser.add_argument(
        "--days",
        type=int,
        default=config.DEFAULT_DAYS,
        help=f"Analytics look-back window in days (default: {config.DEFAULT_DAYS})",
    )
    args = parser.parse_args()

    if args.command == "daily-report":
        run_daily_report(args.days)
    elif args.command == "outreach":
        run_outreach(args.days)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
