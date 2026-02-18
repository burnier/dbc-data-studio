"""
SERP (Search Engine Results Page) scraper
Scrapes Google search results to get top URLs for keywords
"""
import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import time
import logging
from typing import List
from urllib.parse import quote_plus

logger = logging.getLogger(__name__)


class SerpScraper:
    """Free Google SERP scraper using requests + BeautifulSoup"""
    
    def __init__(self, rate_limit: float = 3.0):
        """
        Initialize SERP scraper
        
        Args:
            rate_limit: Delay between requests in seconds (default: 3s)
        """
        self.rate_limit = rate_limit
        self.ua = UserAgent()
        self.session = requests.Session()
        # Disable SSL warnings
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    def _get_headers(self) -> dict:
        """Generate request headers with rotating user agent"""
        return {
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
    
    def _build_google_url(self, keyword: str, geo: str, num_results: int = 10) -> str:
        """
        Build Google search URL with geo-targeting
        
        Args:
            keyword: Search keyword
            geo: Country code ('US', 'BR')
            num_results: Number of results to fetch
            
        Returns:
            Google search URL
        """
        encoded_keyword = quote_plus(keyword)
        
        # Map country codes to Google domains
        domain_map = {
            'US': 'google.com',
            'BR': 'google.com.br'
        }
        
        domain = domain_map.get(geo, 'google.com')
        
        # Use gl parameter for geo-location
        url = f"https://www.{domain}/search?q={encoded_keyword}&gl={geo}&num={num_results}"
        
        return url
    
    def get_top_urls(self, keyword: str, geo: str, top_n: int = 3) -> List[str]:
        """
        Get top N organic search results for a keyword
        
        Args:
            keyword: Search keyword
            geo: Country code ('US', 'BR')
            top_n: Number of top results to return (default: 3)
            
        Returns:
            List of top URLs
        """
        try:
            # Rate limiting
            time.sleep(self.rate_limit)
            
            # Build search URL
            url = self._build_google_url(keyword, geo, num_results=top_n * 2)
            logger.info(f"Fetching SERP for '{keyword}' in {geo}")
            
            # Make request (with SSL verification disabled for macOS compatibility)
            response = self.session.get(
                url,
                headers=self._get_headers(),
                timeout=10,
                verify=False  # Disable SSL verification to avoid certificate errors
            )
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.text, 'lxml')
            
            # Extract organic result URLs
            urls = []
            
            # Look for result divs (Google's structure may change)
            # Try multiple selectors and methods
            selectors = [
                'div.yuRUbf > a',           # Standard result link
                'a[jsname="UWckNb"]',       # Alternative selector
                'div.g a[href^="http"]',    # Fallback 1
                'div#search a[href^="http"]', # Fallback 2
                'a[href^="http"]'           # Last resort
            ]
            
            for selector in selectors:
                links = soup.select(selector)
                for link in links:
                    href = link.get('href')
                    if href and href.startswith('http'):
                        # Filter out Google's own URLs and irrelevant ones
                        skip_domains = ['google.com', 'google.com.br', 'youtube.com', 
                                       'support.google', 'accounts.google', 'maps.google',
                                       'play.google', 'policies.google']
                        if not any(domain in href for domain in skip_domains):
                            if href not in urls:
                                urls.append(href)
                                if len(urls) >= top_n * 2:  # Get extra in case some are filtered
                                    break
                
                if len(urls) >= top_n:
                    break
            
            # If still no results, try finding any anchor tags in main content
            if not urls:
                logger.warning(f"Standard selectors failed, trying alternative extraction")
                all_links = soup.find_all('a', href=True)
                for link in all_links:
                    href = link['href']
                    if href.startswith('http') and 'google' not in href:
                        if href not in urls:
                            urls.append(href)
                            if len(urls) >= top_n:
                                break
            
            # Return top N
            result_urls = urls[:top_n]
            logger.info(f"Found {len(result_urls)} URLs for '{keyword}' in {geo}")
            
            return result_urls
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error for '{keyword}' in {geo}: {e}")
            return []
        except Exception as e:
            logger.error(f"Parsing error for '{keyword}' in {geo}: {e}")
            return []
    
    def get_urls_for_both_markets(self, keyword_us: str, keyword_br: str, top_n: int = 3) -> dict:
        """
        Get top URLs for both US and BR markets
        
        Args:
            keyword_us: English keyword
            keyword_br: Portuguese keyword
            top_n: Number of top results per market
            
        Returns:
            Dict with 'US' and 'BR' URL lists
        """
        results = {
            'US': self.get_top_urls(keyword_us, 'US', top_n),
            'BR': self.get_top_urls(keyword_br, 'BR', top_n)
        }
        
        return results

