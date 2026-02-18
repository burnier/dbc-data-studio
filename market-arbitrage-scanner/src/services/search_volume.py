"""
Search volume service using Google Trends (free)
Returns relative interest scores (0-100) instead of absolute volumes
"""
from pytrends.request import TrendReq
import time
import logging
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class SearchVolumeService:
    """Free search volume estimation using Google Trends"""
    
    def __init__(self, timeframe: str = 'today 12-m'):
        """
        Initialize Google Trends client
        
        Args:
            timeframe: Google Trends timeframe (default: last 12 months)
        """
        self.timeframe = timeframe
        self.pytrends = None
        self._init_client()
    
    def _init_client(self):
        """Initialize pytrends client"""
        try:
            self.pytrends = TrendReq(hl='en-US', tz=360)
            logger.info("Google Trends client initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Google Trends: {e}")
    
    def get_interest_score(self, keyword: str, geo: str) -> int:
        """
        Get relative interest score for a keyword in a specific geography
        
        Args:
            keyword: Search keyword
            geo: Geography code ('US', 'BR', etc.)
            
        Returns:
            Interest score 0-100 (relative popularity)
        """
        try:
            # Add delay to respect rate limits
            time.sleep(2)
            
            # Build payload
            self.pytrends.build_payload(
                [keyword],
                cat=0,
                timeframe=self.timeframe,
                geo=geo,
                gprop=''
            )
            
            # Get interest over time
            interest_df = self.pytrends.interest_over_time()
            
            if interest_df.empty or keyword not in interest_df.columns:
                logger.warning(f"No data for '{keyword}' in {geo}")
                return 0
            
            # Calculate average interest score
            avg_score = int(interest_df[keyword].mean())
            logger.info(f"'{keyword}' in {geo}: interest score = {avg_score}")
            
            return avg_score
            
        except Exception as e:
            logger.error(f"Error getting interest for '{keyword}' in {geo}: {e}")
            return 0
    
    def compare_markets(self, keyword_us: str, keyword_br: str) -> Dict[str, int]:
        """
        Compare interest scores for US and BR markets
        
        Args:
            keyword_us: English keyword
            keyword_br: Portuguese keyword
            
        Returns:
            Dict with 'US' and 'BR' scores
        """
        results = {
            'US': self.get_interest_score(keyword_us, 'US'),
            'BR': self.get_interest_score(keyword_br, 'BR')
        }
        
        logger.info(f"Market comparison: {keyword_us} (US: {results['US']}) vs {keyword_br} (BR: {results['BR']})")
        return results
    
    def get_related_queries(self, keyword: str, geo: str) -> Optional[Dict]:
        """
        Get related queries (bonus feature for additional insights)
        
        Args:
            keyword: Search keyword
            geo: Geography code
            
        Returns:
            Dict with related queries or None
        """
        try:
            time.sleep(2)
            
            self.pytrends.build_payload(
                [keyword],
                cat=0,
                timeframe=self.timeframe,
                geo=geo,
                gprop=''
            )
            
            related = self.pytrends.related_queries()
            return related
            
        except Exception as e:
            logger.error(f"Error getting related queries for '{keyword}': {e}")
            return None

