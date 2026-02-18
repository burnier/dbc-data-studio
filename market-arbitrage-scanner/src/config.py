"""Configuration for Market Arbitrage Scanner"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Application configuration"""
    
    # Directories
    DATA_DIR = 'data'
    RESULTS_DIR = os.path.join(DATA_DIR, 'results')
    
    # Rate limiting (seconds)
    SERP_RATE_LIMIT = 3.0  # Delay between Google searches
    TRENDS_RATE_LIMIT = 2.0  # Delay between Trends requests
    QUALITY_RATE_LIMIT = 1.0  # Delay between quality checks
    
    # Timeouts
    REQUEST_TIMEOUT = 10  # seconds
    
    # Google Trends
    TRENDS_TIMEFRAME = 'today 12-m'  # Last 12 months
    US_GEO = 'US'
    BR_GEO = 'BR'
    
    # SERP settings
    TOP_N_RESULTS = 3  # Number of top URLs to analyze
    USE_SERPAPI = os.getenv('USE_SERPAPI', 'true').lower() == 'true'  # Use SerpAPI if available
    SERPAPI_KEY = os.getenv('SERPAPI_KEY')  # Get from https://serpapi.com
    
    # Retry settings
    MAX_RETRIES = 3
    RETRY_DELAY = 5  # seconds
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = 'scanner.log'
    
    # Output
    AUTO_OPEN_REPORT = os.getenv('AUTO_OPEN_REPORT', 'false').lower() == 'true'

