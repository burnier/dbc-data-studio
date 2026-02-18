"""
Quality analyzer for competitor websites
Evaluates BR competitor quality to determine market gaps
"""
import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import time
import logging
from typing import List
from datetime import datetime
import re

logger = logging.getLogger(__name__)


class QualityAnalyzer:
    """Analyzes quality of competitor websites"""
    
    def __init__(self, timeout: int = 10):
        """
        Initialize quality analyzer
        
        Args:
            timeout: Request timeout in seconds
        """
        self.timeout = timeout
        self.ua = UserAgent()
        self.session = requests.Session()
        # Disable SSL warnings
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    def _get_headers(self) -> dict:
        """Generate request headers"""
        return {
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
    
    def analyze_url(self, url: str) -> dict:
        """
        Analyze a single URL for quality indicators
        
        Args:
            url: Website URL to analyze
            
        Returns:
            Dict with quality metrics
        """
        metrics = {
            'url': url,
            'has_https': False,
            'is_responsive': False,
            'is_web_app': False,
            'is_recent': False,
            'page_load_success': False,
            'quality_score': 0.0
        }
        
        try:
            # Check HTTPS
            metrics['has_https'] = url.startswith('https://')
            
            # Fetch page (with SSL verification disabled for macOS compatibility)
            time.sleep(1)  # Rate limiting
            response = self.session.get(
                url,
                headers=self._get_headers(),
                timeout=self.timeout,
                allow_redirects=True,
                verify=False  # Disable SSL verification to avoid certificate errors
            )
            
            if response.status_code == 200:
                metrics['page_load_success'] = True
                
                # Parse HTML
                soup = BeautifulSoup(response.text, 'lxml')
                
                # Check for responsive design (viewport meta tag)
                viewport = soup.find('meta', attrs={'name': 'viewport'})
                metrics['is_responsive'] = viewport is not None
                
                # Check if it's a web app (look for app-like indicators)
                metrics['is_web_app'] = self._is_web_app(soup, url)
                
                # Check recency (last modified or copyright year)
                metrics['is_recent'] = self._is_recent(soup, response.headers)
                
                # Calculate quality score
                metrics['quality_score'] = self._calculate_quality_score(metrics)
                
                logger.info(f"Analyzed {url}: quality={metrics['quality_score']:.1f}")
            else:
                logger.warning(f"Failed to load {url}: status {response.status_code}")
                
        except requests.exceptions.Timeout:
            logger.error(f"Timeout loading {url}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Error loading {url}: {e}")
        except Exception as e:
            logger.error(f"Unexpected error analyzing {url}: {e}")
        
        return metrics
    
    def _is_web_app(self, soup: BeautifulSoup, url: str) -> bool:
        """
        Determine if site is a dedicated web app vs blog/content site
        
        Indicators:
        - Has input/file upload elements
        - Has "tool", "converter", "generator" in title/description
        - Has interactive elements (buttons, forms)
        - Domain suggests tool (e.g., "converter", "tool", "online")
        """
        # Check title and description
        title = soup.find('title')
        title_text = title.get_text().lower() if title else ''
        
        description = soup.find('meta', attrs={'name': 'description'})
        desc_text = description.get('content', '').lower() if description else ''
        
        # Web app keywords
        app_keywords = ['tool', 'converter', 'generator', 'editor', 'maker', 'creator', 
                       'online', 'free', 'download', 'convert', 'transform']
        
        has_app_keywords = any(kw in title_text or kw in desc_text for kw in app_keywords)
        
        # Check for interactive elements
        has_file_input = soup.find('input', attrs={'type': 'file'}) is not None
        has_forms = len(soup.find_all('form')) > 0
        has_many_buttons = len(soup.find_all('button')) >= 2
        
        # Check URL
        url_suggests_tool = any(kw in url.lower() for kw in ['tool', 'convert', 'generator', 'online'])
        
        # Blog indicators (negative signal)
        blog_keywords = ['blog', 'article', 'post', 'author', 'published']
        is_blog = any(kw in title_text or kw in url.lower() for kw in blog_keywords)
        
        # Scoring
        score = 0
        if has_app_keywords: score += 2
        if has_file_input: score += 3
        if has_forms: score += 1
        if has_many_buttons: score += 1
        if url_suggests_tool: score += 2
        if is_blog: score -= 3
        
        return score >= 3
    
    def _is_recent(self, soup: BeautifulSoup, headers: dict) -> bool:
        """
        Check if content appears to be recent (within last 2 years)
        """
        current_year = datetime.now().year
        recent_threshold = current_year - 2
        
        # Check Last-Modified header
        last_modified = headers.get('Last-Modified', '')
        if last_modified:
            try:
                # Parse date (e.g., "Wed, 15 Nov 2023 12:45:26 GMT")
                year_match = re.search(r'\b(20\d{2})\b', last_modified)
                if year_match:
                    year = int(year_match.group(1))
                    if year >= recent_threshold:
                        return True
            except:
                pass
        
        # Check copyright year in footer
        text = soup.get_text()
        copyright_pattern = r'©\s*(\d{4})|copyright\s*(\d{4})'
        matches = re.findall(copyright_pattern, text, re.IGNORECASE)
        
        for match in matches:
            year = int(match[0] or match[1])
            if year >= recent_threshold:
                return True
        
        # Check meta tags
        date_meta = soup.find('meta', attrs={'property': 'article:modified_time'})
        if date_meta:
            date_str = date_meta.get('content', '')
            year_match = re.search(r'\b(20\d{2})\b', date_str)
            if year_match and int(year_match.group(1)) >= recent_threshold:
                return True
        
        return False
    
    def _calculate_quality_score(self, metrics: dict) -> float:
        """
        Calculate overall quality score (0-100)
        
        Weights:
        - is_web_app: 40% (most important)
        - is_responsive: 25%
        - is_recent: 20%
        - has_https: 10%
        - page_load_success: 5%
        """
        score = 0.0
        
        if metrics['is_web_app']:
            score += 40
        if metrics['is_responsive']:
            score += 25
        if metrics['is_recent']:
            score += 20
        if metrics['has_https']:
            score += 10
        if metrics['page_load_success']:
            score += 5
        
        return score
    
    def analyze_competitors(self, urls: List[str]) -> dict:
        """
        Analyze multiple competitor URLs and return aggregate metrics
        
        Args:
            urls: List of competitor URLs
            
        Returns:
            Dict with average quality and detailed analyses
        """
        if not urls:
            return {
                'average_quality': 0.0,
                'analyses': []
            }
        
        analyses = []
        for url in urls:
            analysis = self.analyze_url(url)
            analyses.append(analysis)
        
        # Calculate average quality
        quality_scores = [a['quality_score'] for a in analyses]
        avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 0.0
        
        return {
            'average_quality': avg_quality,
            'analyses': analyses,
            'web_app_count': sum(1 for a in analyses if a['is_web_app']),
            'responsive_count': sum(1 for a in analyses if a['is_responsive'])
        }

