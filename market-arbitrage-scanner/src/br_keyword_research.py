#!/usr/bin/env python3
"""
Brazil Keyword Research Tool

Researches keywords directly in the Brazilian market (no US comparison).
Designed for Brazil-specific tools like Shopee/Mercado Livre calculators.

Usage:
    python src/br_keyword_research.py data/br_keywords.txt
    python src/br_keyword_research.py data/br_keywords.txt -o my_report.md
"""
import click
import logging
import sys
import time
from pathlib import Path
from dataclasses import dataclass
from typing import List, Optional
import os

sys.path.insert(0, str(Path(__file__).parent))

from config import Config
from services.serpapi_service import SerpApiService
from services.quality_analyzer import QualityAnalyzer

try:
    from pytrends.request import TrendReq
    PYTRENDS_AVAILABLE = True
except ImportError:
    PYTRENDS_AVAILABLE = False

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)


@dataclass
class BRKeywordResult:
    keyword: str
    br_interest: int           # Google Trends score 0-100 in Brazil
    top_urls: List[str]        # Top ranking URLs in Brazil
    avg_competitor_quality: float  # 0-100 (higher = stronger competition)
    opportunity_score: float   # Our composite score (higher = better for us)
    verdict: str


def get_br_trends_interest(keyword: str) -> int:
    """Get Google Trends interest score for a keyword in Brazil."""
    if not PYTRENDS_AVAILABLE:
        logger.warning("pytrends not available, skipping Trends data")
        return 0

    try:
        pt = TrendReq(hl='pt-BR', tz=-180)
        pt.build_payload([keyword], geo='BR', timeframe='today 12-m')
        data = pt.interest_over_time()

        if data.empty or keyword not in data.columns:
            logger.warning(f"No Trends data for '{keyword}' in BR")
            return 0

        score = int(data[keyword].mean())
        logger.info(f"  Trends BR interest for '{keyword}': {score}/100")
        return score

    except Exception as e:
        logger.warning(f"  Trends error for '{keyword}': {e}")
        return 0


def calculate_opportunity_score(br_interest: int, avg_quality: float) -> float:
    """
    Score = demand × (1 - competitor_strength)
    
    High demand + weak competitors = high score (good opportunity to rank)
    Low demand OR strong competitors = low score
    """
    demand = br_interest / 100.0
    competitor_weakness = 1.0 - (avg_quality / 100.0)

    # Weighted: 50% demand, 50% competitor weakness
    score = ((demand * 0.5) + (competitor_weakness * 0.5)) * 100

    # Bonus for golden combos
    if br_interest >= 40 and avg_quality <= 50:
        score += 15  # High demand + weak competition
    if br_interest >= 60:
        score += 10  # High-volume keyword

    return round(min(score, 100), 1)


def get_verdict(score: float, br_interest: int, quality: float) -> str:
    if score >= 70:
        return "🔥 TARGET THIS — High demand, weak competition"
    elif score >= 55:
        return "✅ STRONG — Good opportunity to rank"
    elif score >= 40:
        if br_interest < 20:
            return "⚠️ LOW VOLUME — Niche keyword, consider long-tail"
        else:
            return "⚠️ MODERATE — Strong competitors, needs great content"
    else:
        if quality >= 70:
            return "❌ HARD — Dominant competitors, avoid for now"
        else:
            return "❌ LOW VALUE — Low demand, not worth targeting"


def scan_keyword(keyword: str, serpapi: SerpApiService, analyzer: QualityAnalyzer) -> BRKeywordResult:
    logger.info(f"\n{'─'*60}")
    logger.info(f"🔍 Keyword: '{keyword}'")

    # Step 1: Google Trends interest in Brazil
    br_interest = get_br_trends_interest(keyword)
    time.sleep(3)  # Rate limit respect

    # Step 2: Top ranking URLs in Brazil via SerpAPI
    logger.info(f"  Fetching BR SERP results...")
    try:
        top_urls = serpapi.get_top_urls(keyword, 'BR', top_n=5)
        logger.info(f"  Found {len(top_urls)} ranking URLs")
    except Exception as e:
        logger.warning(f"  SerpAPI error: {e}")
        top_urls = []

    # Step 3: Analyze competitor quality
    avg_quality = 0.0
    if top_urls:
        logger.info(f"  Analyzing {len(top_urls)} competitors...")
        analysis = analyzer.analyze_competitors(top_urls[:3])
        avg_quality = analysis.get('average_quality', 0)
        logger.info(f"  Avg competitor quality: {avg_quality:.0f}/100")

    # Step 4: Score
    opportunity_score = calculate_opportunity_score(br_interest, avg_quality)
    verdict = get_verdict(opportunity_score, br_interest, avg_quality)
    logger.info(f"  → Opportunity score: {opportunity_score}/100 | {verdict}")

    return BRKeywordResult(
        keyword=keyword,
        br_interest=br_interest,
        top_urls=top_urls,
        avg_competitor_quality=avg_quality,
        opportunity_score=opportunity_score,
        verdict=verdict,
    )


def generate_report(results: List[BRKeywordResult], output_path: str):
    """Generate a markdown report sorted by opportunity score."""
    sorted_results = sorted(results, key=lambda r: r.opportunity_score, reverse=True)

    lines = [
        "# 🇧🇷 Brazil Keyword Research Report",
        "",
        "Keywords ranked by opportunity score (demand × competitor weakness).",
        "",
        "---",
        "",
        "## 🏆 Rankings",
        "",
        "| Rank | Keyword | BR Demand | Competitor Strength | Opportunity | Verdict |",
        "|------|---------|-----------|---------------------|-------------|---------|",
    ]

    for i, r in enumerate(sorted_results, 1):
        lines.append(
            f"| {i} | **{r.keyword}** | {r.br_interest}/100 | "
            f"{r.avg_competitor_quality:.0f}/100 | **{r.opportunity_score}/100** | {r.verdict} |"
        )

    lines += ["", "---", "", "## 📋 Detailed Results", ""]

    for r in sorted_results:
        lines += [
            f"### {r.verdict[:2]} {r.keyword}",
            "",
            f"- **Opportunity Score:** {r.opportunity_score}/100",
            f"- **BR Search Interest (Trends):** {r.br_interest}/100",
            f"- **Avg Competitor Quality:** {r.avg_competitor_quality:.0f}/100",
            f"- **Verdict:** {r.verdict}",
            "",
        ]
        if r.top_urls:
            lines.append("**Top ranking pages:**")
            for url in r.top_urls[:3]:
                lines.append(f"- {url}")
            lines.append("")
        lines.append("---")
        lines.append("")

    report = "\n".join(lines)
    Path(output_path).write_text(report, encoding="utf-8")
    logger.info(f"\n📊 Report saved to: {output_path}")


def print_summary(results: List[BRKeywordResult]):
    sorted_results = sorted(results, key=lambda r: r.opportunity_score, reverse=True)

    print(f"\n{'='*70}")
    print("🏆 BRAZIL KEYWORD RESEARCH — TOP OPPORTUNITIES")
    print(f"{'='*70}\n")

    for i, r in enumerate(sorted_results, 1):
        print(f"{i:2}. {r.verdict}")
        print(f"    Keyword:        \"{r.keyword}\"")
        print(f"    BR Interest:    {r.br_interest}/100")
        print(f"    Competition:    {r.avg_competitor_quality:.0f}/100")
        print(f"    Opportunity:    {r.opportunity_score}/100")
        if r.top_urls:
            print(f"    #1 Ranking:     {r.top_urls[0]}")
        print()


@click.command()
@click.argument('input_file', type=click.Path(exists=True))
@click.option('-o', '--output', default=None, help='Output markdown filename')
def main(input_file: str, output: str):
    """Scan Brazilian keywords for SEO opportunity."""

    # Load keywords
    with open(input_file, 'r', encoding='utf-8') as f:
        keywords = [
            line.strip() for line in f
            if line.strip() and not line.startswith('#')
        ]

    if not keywords:
        click.echo("❌ No keywords found in file")
        return

    click.echo(f"📄 Loaded {len(keywords)} keywords\n")

    # Init services
    serpapi = SerpApiService(api_key=Config.SERPAPI_KEY)
    analyzer = QualityAnalyzer(timeout=Config.REQUEST_TIMEOUT)

    if not serpapi.enabled:
        click.echo("⚠️  SerpAPI not configured — competitor URLs will be empty")

    # Scan
    results = []
    for i, keyword in enumerate(keywords, 1):
        click.echo(f"[{i}/{len(keywords)}] {keyword}")
        try:
            result = scan_keyword(keyword, serpapi, analyzer)
            results.append(result)
        except Exception as e:
            logger.error(f"Failed on '{keyword}': {e}")
            continue

    if not results:
        click.echo("❌ No results")
        return

    # Output
    print_summary(results)

    output_path = output or str(
        Path(Config.RESULTS_DIR) / "br_keyword_research.md"
    )
    Path(Config.RESULTS_DIR).mkdir(parents=True, exist_ok=True)
    generate_report(results, output_path)


if __name__ == '__main__':
    main()
