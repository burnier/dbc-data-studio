#!/usr/bin/env python3
"""
Market Arbitrage Scanner - Main CLI Application

Identifies market gaps between English and Brazilian Portuguese utility tool markets.
"""
import click
import logging
import sys
import os
from pathlib import Path
from typing import List
from dataclasses import asdict

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

from config import Config
from models import GapAnalysis
from services.translator import TranslationService
from services.search_volume import SearchVolumeService
from services.serp_scraper import SerpScraper
from services.serpapi_service import SerpApiService
from services.quality_analyzer import QualityAnalyzer
from scoring.gap_scorer import GapScorer
from output.markdown_generator import MarkdownGenerator


# Configure logging
def setup_logging(verbose: bool = False):
    """Setup logging configuration"""
    level = logging.DEBUG if verbose else logging.INFO
    
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(Config.LOG_FILE),
            logging.StreamHandler()
        ]
    )


logger = logging.getLogger(__name__)


class MarketScanner:
    """Main scanner orchestrator"""
    
    def __init__(self):
        """Initialize all services"""
        self.translator = TranslationService()
        self.search_volume = SearchVolumeService(timeframe=Config.TRENDS_TIMEFRAME)
        
        # Try SerpAPI first, fall back to free scraper
        self.serpapi = SerpApiService(api_key=Config.SERPAPI_KEY)
        self.serp_scraper = SerpScraper(rate_limit=Config.SERP_RATE_LIMIT)
        self.use_serpapi = Config.USE_SERPAPI and self.serpapi.enabled
        
        if self.use_serpapi:
            logger.info("🚀 Using SerpAPI for reliable SERP data")
            # Show account info
            account = self.serpapi.get_account_info()
            if 'plan' in account:
                logger.info(
                    f"   Plan: {account['plan']} | "
                    f"Used: {account.get('this_month_usage', 0)}/{account.get('searches_per_month', 0)}"
                )
        else:
            logger.info("🔧 Using free scraper (SerpAPI not configured)")
        
        self.quality_analyzer = QualityAnalyzer(timeout=Config.REQUEST_TIMEOUT)
        self.gap_scorer = GapScorer()
        self.markdown_gen = MarkdownGenerator(output_dir=Config.RESULTS_DIR)
    
    def scan_keyword(self, keyword: str) -> GapAnalysis:
        """
        Scan a single keyword for market gaps
        
        Args:
            keyword: English keyword to analyze
            
        Returns:
            GapAnalysis object with results
        """
        logger.info(f"📊 Scanning: {keyword}")
        
        # Step 1: Translate to Portuguese
        pt_keyword = self.translator.translate_to_portuguese(keyword)
        logger.info(f"   Translated: {keyword} → {pt_keyword}")
        
        # Step 2: Get search volumes (interest scores)
        logger.info("   Fetching search volumes...")
        volumes = self.search_volume.compare_markets(keyword, pt_keyword)
        us_volume = volumes['US']
        br_volume = volumes['BR']
        
        # Step 3: Get top URLs for both markets
        logger.info("   Fetching top URLs...")
        if self.use_serpapi:
            urls = self.serpapi.get_urls_for_both_markets(keyword, pt_keyword, top_n=Config.TOP_N_RESULTS)
        else:
            urls = self.serp_scraper.get_urls_for_both_markets(keyword, pt_keyword, top_n=Config.TOP_N_RESULTS)
        
        us_urls = urls['US']
        br_urls = urls['BR']
        
        # Step 4: Analyze BR competitor quality
        logger.info("   Analyzing BR competitors...")
        br_analysis = self.quality_analyzer.analyze_competitors(br_urls)
        br_avg_quality = br_analysis['average_quality']
        
        # Step 5: Calculate gap score
        gap_score = self.gap_scorer.calculate_gap_score(
            us_volume_score=us_volume,
            br_volume_score=br_volume,
            br_avg_quality=br_avg_quality
        )
        
        # Create result
        result = GapAnalysis(
            english_keyword=keyword,
            brazilian_keyword=pt_keyword,
            us_volume_score=us_volume,
            br_volume_score=br_volume,
            us_top_urls=us_urls,
            br_top_urls=br_urls,
            br_avg_quality=br_avg_quality,
            gap_score=gap_score
        )
        
        # Log insights
        insights = self.gap_scorer.get_insights(us_volume, br_volume, br_avg_quality, gap_score)
        logger.info(f"   {insights}\n")
        
        return result
    
    def scan_keywords(self, keywords: List[str]) -> List[GapAnalysis]:
        """
        Scan multiple keywords
        
        Args:
            keywords: List of English keywords
            
        Returns:
            List of GapAnalysis results
        """
        results = []
        total = len(keywords)
        
        logger.info(f"🚀 Starting scan of {total} keywords...\n")
        
        for i, keyword in enumerate(keywords, 1):
            try:
                logger.info(f"[{i}/{total}] Processing: {keyword}")
                result = self.scan_keyword(keyword)
                results.append(result)
            except Exception as e:
                logger.error(f"❌ Failed to scan '{keyword}': {e}")
                continue
        
        logger.info(f"\n✅ Scan complete! Analyzed {len(results)}/{total} keywords successfully")
        
        return results


@click.group()
def cli():
    """Market Arbitrage Scanner - Find utility tool market gaps"""
    pass


@cli.command()
@click.argument('keyword')
@click.option('-v', '--verbose', is_flag=True, help='Enable verbose logging')
def scan(keyword: str, verbose: bool):
    """Scan a single keyword"""
    setup_logging(verbose)
    
    scanner = MarketScanner()
    result = scanner.scan_keyword(keyword)
    
    # Print result
    click.echo(f"\n{'='*80}")
    click.echo(f"Results for: {keyword}")
    click.echo(f"{'='*80}")
    click.echo(f"Portuguese Translation: {result.brazilian_keyword}")
    click.echo(f"US Interest Score: {result.us_volume_score}/100")
    click.echo(f"BR Interest Score: {result.br_volume_score}/100")
    click.echo(f"BR Competitor Quality: {result.br_avg_quality:.1f}/100")
    click.echo(f"Gap Score: {result.gap_score:.1f}/100")
    click.echo(f"{'='*80}\n")


@cli.command()
@click.argument('input_file', type=click.Path(exists=True))
@click.option('-o', '--output', help='Output filename (optional)')
@click.option('-v', '--verbose', is_flag=True, help='Enable verbose logging')
def batch(input_file: str, output: str, verbose: bool):
    """Scan keywords from a text file (one per line)"""
    setup_logging(verbose)
    
    # Read keywords
    with open(input_file, 'r', encoding='utf-8') as f:
        keywords = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    
    if not keywords:
        click.echo("❌ No keywords found in file")
        return
    
    click.echo(f"📄 Loaded {len(keywords)} keywords from {input_file}\n")
    
    # Scan
    scanner = MarketScanner()
    results = scanner.scan_keywords(keywords)
    
    if not results:
        click.echo("❌ No results to report")
        return
    
    # Convert to dicts for markdown generator
    results_dicts = [asdict(r) for r in results]
    
    # Generate report
    report_path = scanner.markdown_gen.generate_report(results_dicts, filename=output)
    
    # Print summary
    scanner.markdown_gen.print_summary(results_dicts)
    
    click.echo(f"\n📊 Full report saved to: {report_path}")


@cli.command()
def interactive():
    """Interactive mode - paste keywords one by one"""
    setup_logging(verbose=False)
    
    click.echo("🔍 Market Arbitrage Scanner - Interactive Mode")
    click.echo("=" * 80)
    click.echo("Enter keywords one per line. Type 'done' when finished, 'quit' to exit.\n")
    
    keywords = []
    
    while True:
        keyword = click.prompt("Enter keyword", default='', show_default=False)
        
        if keyword.lower() in ['done', 'quit', 'exit', '']:
            break
        
        keywords.append(keyword)
        click.echo(f"  ✓ Added: {keyword}")
    
    if not keywords:
        click.echo("No keywords entered. Exiting.")
        return
    
    click.echo(f"\n📊 Scanning {len(keywords)} keywords...\n")
    
    # Scan
    scanner = MarketScanner()
    results = scanner.scan_keywords(keywords)
    
    if not results:
        click.echo("❌ No results to report")
        return
    
    # Convert to dicts
    results_dicts = [asdict(r) for r in results]
    
    # Generate report
    report_path = scanner.markdown_gen.generate_report(results_dicts)
    
    # Print summary
    scanner.markdown_gen.print_summary(results_dicts)
    
    click.echo(f"\n📊 Full report saved to: {report_path}")


@cli.command()
def version():
    """Show version information"""
    click.echo("Market Arbitrage Scanner v1.0.0")
    click.echo("Built with: Python, Google Trends, BeautifulSoup")


@cli.command()
def status():
    """Check SerpAPI status and remaining credits"""
    setup_logging(verbose=False)
    
    serpapi = SerpApiService()
    
    if not serpapi.enabled:
        click.echo("❌ SerpAPI is not configured")
        click.echo("\nTo enable SerpAPI:")
        click.echo("1. Sign up at https://serpapi.com (free tier: 250 searches/month)")
        click.echo("2. Get your API key")
        click.echo("3. Create .env file with: SERPAPI_KEY=your_key_here")
        click.echo("\nSee SERPAPI_SETUP.md for detailed instructions")
        return
    
    click.echo("🔍 Checking SerpAPI status...\n")
    
    account = serpapi.get_account_info()
    
    if 'error' in account:
        click.echo(f"❌ Error: {account['error']}")
        return
    
    click.echo("✅ SerpAPI is configured and working!\n")
    click.echo(f"📊 Account Details:")
    click.echo(f"   Plan: {account.get('plan', 'Unknown')}")
    click.echo(f"   Monthly Limit: {account.get('searches_per_month', 'Unknown')} searches")
    click.echo(f"   Used This Month: {account.get('this_month_usage', 0)}")
    click.echo(f"   Remaining: {account.get('total_searches_left', 'Unknown')}")
    
    remaining = account.get('total_searches_left', 0)
    if remaining:
        keywords_remaining = remaining // 2
        click.echo(f"\n💡 You can scan ~{keywords_remaining} more keywords this month")
    
    click.echo(f"\n🔗 Manage your account: https://serpapi.com/account")


if __name__ == '__main__':
    cli()

