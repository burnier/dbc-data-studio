#!/usr/bin/env python3
# Fix SSL certificate verification for Homebrew Python on macOS.
# truststore patches ssl.SSLContext to use the native macOS keychain,
# which covers httpx, openai SDK, and any other SSL connection.
# Must run before any network library is imported.
try:
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    pass  # not on macOS or truststore not installed — no-op

"""
Growth Agent — Entrypoint

Usage:
    python main.py daily-report          # TrafficAnalystAgent only
    python main.py outreach              # Both agents sequentially
    python main.py daily-report --days 7 # Override look-back window

Output files are written to ./output/
"""
import argparse
import os
import sys
from datetime import date
from pathlib import Path

import httpx
from crewai import Crew, Process, Task

import config
from agents import build_traffic_analyst, build_content_outreach_agent


# ─── Email Delivery ───────────────────────────────────────────────────────────

def _send_email(subject: str, body_md: str) -> None:
    """Send a Markdown report via Resend. No-op if RESEND_API_KEY is not set."""
    api_key  = os.getenv("RESEND_API_KEY", "")
    to_email = os.getenv("NOTIFY_EMAIL", "")
    if not api_key or not to_email:
        return

    # Convert basic Markdown to HTML (headings, bold, code, line breaks)
    lines: list[str] = []
    for line in body_md.splitlines():
        if line.startswith("### "):
            lines.append(f"<h3>{line[4:]}</h3>")
        elif line.startswith("## "):
            lines.append(f"<h2>{line[3:]}</h2>")
        elif line.startswith("# "):
            lines.append(f"<h1>{line[2:]}</h1>")
        elif line.startswith("---"):
            lines.append("<hr>")
        elif line.startswith("> "):
            lines.append(f"<blockquote>{line[2:]}</blockquote>")
        else:
            html_line = line.replace("**", "<strong>", 1)
            while "**" in html_line:
                html_line = html_line.replace("**", "</strong>", 1)
            lines.append(html_line + "<br>")
    html_body = (
        "<html><body style='font-family:sans-serif;max-width:720px;margin:auto'>"
        + "\n".join(lines)
        + "</body></html>"
    )

    try:
        resp = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from":    os.getenv("NOTIFY_FROM", "Growth Agent <onboarding@resend.dev>"),
                "to":      [to_email],
                "subject": subject,
                "html":    html_body,
                "text":    body_md,
            },
            timeout=30,
        )
        if resp.status_code in (200, 201):
            print(f"📧  Report emailed → {to_email}")
        else:
            print(f"⚠️  Resend error {resp.status_code}: {resp.text}")
    except Exception as exc:  # noqa: BLE001
        print(f"⚠️  Could not send email: {exc}")


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
Produce a complete outreach draft digest for Brazilian marketplace seller communities.
Follow this PRIORITY ORDER:

## PRIORITY 1 — Facebook Groups (primary)

Use the facebook_groups tool to get the curated list of Brazilian seller communities.
For each group, draft ONE personalised post in Brazilian Portuguese that:
- Leads with genuine value: a tip, a surprising fact, or a concrete example
  (e.g., "A taxa real da Shopee é 20% + R$4 — muita gente não inclui os R$4 no cálculo...")
- Mentions the free calculator (https://calculadora.dbcdatastudio.com) only as
  a natural "ferramenta que pode ajudar", not as an advertisement
- Is under 200 words
- Ends with an open question to invite discussion

## PRIORITY 2 — YouTube (secondary)

Use the youtube_search tool with these queries:
- "como calcular lucro shopee 2026"
- "taxas mercado livre 2026"
- "simulador de custos mercado livre"

Select 3–5 videos where viewers are likely asking pricing/fee questions in the comments.
Draft ONE helpful comment per video in pt-BR (under 120 words).

## OUTPUT FORMAT

### [Group name / Video title]
**Platform**: Facebook Group | YouTube
**URL**: <url>
**Why relevant**: <one sentence>
**Draft content** (pt-BR):
> <the draft post or comment>

---

Today's date: {today}
""",
        expected_output=(
            "A Markdown digest with:\n"
            "- 5–7 Facebook Group draft posts (personalised per group)\n"
            "- 3–5 YouTube comment drafts\n"
            "All content in Brazilian Portuguese, genuinely helpful, non-spammy. "
            "Each entry must have platform, URL, relevance note, and draft content."
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
    result   = crew.kickoff()
    today    = date.today().isoformat()
    out_path = config.OUTPUT_DIR / f"daily_report_{today}.md"

    # CrewAI's output_file is unreliable in CI — write manually as fallback.
    content = out_path.read_text() if out_path.exists() else ""
    if not content:
        tasks_output = getattr(result, "tasks_output", [])
        content = tasks_output[0].raw if tasks_output else getattr(result, "raw", "")
        if content:
            out_path.write_text(content)

    print(f"\n✅ Daily report saved to: {out_path}")
    if content:
        _send_email(
            subject=f"📊 Calculadora — Daily Report {today}",
            body_md=content,
        )
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
    result        = crew.kickoff()
    today         = date.today().isoformat()
    report_path   = config.OUTPUT_DIR / f"daily_report_{today}.md"
    outreach_path = config.OUTPUT_DIR / f"outreach_{today}.md"

    # CrewAI's output_file is unreliable in CI — write manually as fallback.
    tasks_output  = getattr(result, "tasks_output", [])

    report_content = report_path.read_text() if report_path.exists() else ""
    if not report_content and len(tasks_output) >= 1:
        report_content = tasks_output[0].raw or ""
        if report_content:
            report_path.write_text(report_content)

    outreach_content = outreach_path.read_text() if outreach_path.exists() else ""
    if not outreach_content:
        if len(tasks_output) >= 2:
            outreach_content = tasks_output[1].raw or ""
        elif not outreach_content:
            outreach_content = getattr(result, "raw", "") or ""
        if outreach_content:
            outreach_path.write_text(outreach_content)

    print(f"\n✅ Report saved to:   {report_path}")
    print(f"✅ Outreach saved to: {outreach_path}")

    combined = ""
    if report_content:
        combined += report_content
    if outreach_content:
        combined += "\n\n---\n\n" + outreach_content
    if combined:
        _send_email(
            subject=f"🚀 Calculadora — Growth Digest {today}",
            body_md=combined,
        )
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
