"""
SerpAPI service for reliable SERP data
Paid service but very reliable - use when free scraping fails
"""
import requests
import time
import logging
from typing import List, Optional
import os

logger = logging.getLogger(__name__)


class SerpApiService:
    """SerpAPI integration for reliable Google search results"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize SerpAPI service
        
        Args:
            api_key: SerpAPI key (get from https://serpapi.com)
        """
        self.api_key = api_key or os.getenv('SERPAPI_KEY')
        self.base_url = "https://serpapi.com/search"
        self.enabled = bool(self.api_key)
        
        # Disable SSL warnings for macOS compatibility
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        
        if self.enabled:
            logger.info("✅ SerpAPI enabled with API key")
        else:
            logger.warning("⚠️  SerpAPI not configured (will use free scraper)")
    
    def get_top_urls(self, keyword: str, geo: str, top_n: int = 3) -> List[str]:
        """
        Get top N organic search results using SerpAPI
        
        Args:
            keyword: Search keyword
            geo: Country code ('US', 'BR')
            top_n: Number of results to return
            
        Returns:
            List of top URLs
        """
        if not self.enabled:
            logger.warning("SerpAPI not configured, returning empty results")
            return []
        
        try:
            # Build parameters
            params = {
                'q': keyword,
                'location': self._get_location(geo),
                'gl': geo.lower(),
                'hl': 'en' if geo == 'US' else 'pt',
                'num': top_n * 2,  # Get extra in case some are filtered
                'api_key': self.api_key,
                'engine': 'google'
            }
            
            logger.info(f"📡 Fetching from SerpAPI: '{keyword}' in {geo}")
            
            # Make request (with SSL verification disabled for macOS compatibility)
            response = requests.get(self.base_url, params=params, timeout=15, verify=False)
            response.raise_for_status()
            
            data = response.json()
            
            # Extract organic results
            urls = []
            organic_results = data.get('organic_results', [])
            
            for result in organic_results:
                url = result.get('link')
                if url and url.startswith('http'):
                    # Filter out Google's own URLs
                    skip_domains = ['google.com', 'youtube.com', 'support.google']
                    if not any(domain in url for domain in skip_domains):
                        urls.append(url)
                        if len(urls) >= top_n:
                            break
            
            logger.info(f"✅ SerpAPI returned {len(urls)} URLs for '{keyword}' in {geo}")
            
            # Check credits remaining
            if 'search_metadata' in data:
                credits = data['search_metadata'].get('total_credits_used')
                if credits:
                    logger.debug(f"SerpAPI credits used: {credits}")
            
            return urls
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ SerpAPI request failed for '{keyword}': {e}")
            return []
        except Exception as e:
            logger.error(f"❌ SerpAPI error for '{keyword}': {e}")
            return []
    
    def get_urls_for_both_markets(self, keyword_us: str, keyword_br: str, top_n: int = 3) -> dict:
        """
        Get top URLs for both US and BR markets
        
        Args:
            keyword_us: English keyword
            keyword_br: Portuguese keyword
            top_n: Number of results per market
            
        Returns:
            Dict with 'US' and 'BR' URL lists
        """
        results = {
            'US': self.get_top_urls(keyword_us, 'US', top_n),
            'BR': self.get_top_urls(keyword_br, 'BR', top_n)
        }
        
        return results
    
    def _get_location(self, geo: str) -> str:
        """Map country code to SerpAPI location"""
        location_map = {
            'US': 'United States',
            'BR': 'Brazil'
        }
        return location_map.get(geo, 'United States')
    
    def get_account_info(self) -> dict:
        """
        Get SerpAPI account info (credits remaining, etc.)
        
        Returns:
            Dict with account information
        """
        if not self.enabled:
            return {'error': 'SerpAPI not configured'}
        
        try:
            url = "https://serpapi.com/account"
            params = {'api_key': self.api_key}
            
            response = requests.get(url, params=params, timeout=10, verify=False)
            response.raise_for_status()
            
            data = response.json()
            
            info = {
                'plan': data.get('plan', 'Unknown'),
                'searches_per_month': data.get('searches_per_month', 0),
                'this_month_usage': data.get('this_month_usage', 0),
                'total_searches_left': data.get('total_searches_left', 0),
            }
            
            logger.info(
                f"📊 SerpAPI Account: {info['plan']} plan, "
                f"{info['this_month_usage']}/{info['searches_per_month']} searches used"
            )
            
            return info
            
        except Exception as e:
            logger.error(f"Failed to get SerpAPI account info: {e}")
            return {'error': str(e)}

