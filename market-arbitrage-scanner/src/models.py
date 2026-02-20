"""
Data models for Market Arbitrage Scanner
"""
from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime


@dataclass
class SearchResult:
    """Search result data for a keyword in a specific market"""
    keyword: str
    market: str  # 'US' or 'BR'
    volume_score: int  # 0-100 relative score from Google Trends
    top_urls: List[str] = field(default_factory=list)
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class CompetitorAnalysis:
    """Quality analysis of a competitor website"""
    url: str
    quality_score: float  # 0-100
    is_web_app: bool = False
    is_responsive: bool = False
    has_https: bool = False
    is_recent: bool = False  # Updated within last 2 years
    page_load_success: bool = True
    error_message: Optional[str] = None


@dataclass
class GapAnalysis:
    """Complete gap analysis for a keyword pair"""
    english_keyword: str
    brazilian_keyword: str
    us_volume_score: int  # 0-100 from Google Trends
    br_volume_score: int  # 0-100 from Google Trends
    us_top_urls: List[str] = field(default_factory=list)
    br_top_urls: List[str] = field(default_factory=list)
    br_avg_quality: float = 0.0  # Average quality of BR top 3
    gap_score: float = 0.0  # Final gap score 0-100
    timestamp: datetime = field(default_factory=datetime.now)
    
    def __str__(self):
        return (
            f"'{self.english_keyword}' -> '{self.brazilian_keyword}' | "
            f"Gap Score: {self.gap_score:.1f} | "
            f"US Vol: {self.us_volume_score} | BR Vol: {self.br_volume_score} | "
            f"BR Quality: {self.br_avg_quality:.1f}"
        )


@dataclass
class ScannerConfig:
    """Configuration for the scanner"""
    rate_limit_delay: float = 2.0  # Seconds between requests
    max_retries: int = 3
    timeout: int = 10  # Request timeout in seconds
    trends_timeframe: str = 'today 12-m'  # Google Trends timeframe
    us_geo: str = 'US'
    br_geo: str = 'BR'
    results_dir: str = 'data/results'



