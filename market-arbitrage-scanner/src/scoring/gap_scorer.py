"""
Gap scoring algorithm
Calculates opportunity score (0-100) based on market demand and competition quality
"""
import logging
from typing import Dict

logger = logging.getLogger(__name__)


class GapScorer:
    """
    Calculates gap scores to identify market opportunities
    
    High score = High US demand + Low BR competition quality + Low BR saturation
    """
    
    def __init__(self):
        """Initialize gap scorer with configurable weights"""
        self.weights = {
            'us_demand': 0.40,      # 40% - US market demand (interest score)
            'br_saturation': 0.30,  # 30% - BR market saturation (inverse of BR interest)
            'br_quality': 0.30      # 30% - BR competitor quality gap (inverse of quality)
        }
    
    def calculate_gap_score(
        self,
        us_volume_score: int,
        br_volume_score: int,
        br_avg_quality: float
    ) -> float:
        """
        Calculate gap score (0-100)
        
        Args:
            us_volume_score: US interest score from Google Trends (0-100)
            br_volume_score: BR interest score from Google Trends (0-100)
            br_avg_quality: Average quality of BR competitors (0-100)
            
        Returns:
            Gap score (0-100) where higher = better opportunity
        """
        # Component 1: US Demand Score
        # Higher US interest = better opportunity
        us_demand_component = us_volume_score * self.weights['us_demand']
        
        # Component 2: BR Saturation Score
        # Lower BR interest = less saturated market = better opportunity
        br_saturation_component = (100 - br_volume_score) * self.weights['br_saturation']
        
        # Component 3: BR Quality Gap Score
        # Lower BR quality = worse competitors = better opportunity
        br_quality_gap_component = (100 - br_avg_quality) * self.weights['br_quality']
        
        # Total gap score
        gap_score = (
            us_demand_component +
            br_saturation_component +
            br_quality_gap_component
        )
        
        # Apply bonus multiplier for exceptional opportunities
        gap_score = self._apply_bonus(
            gap_score,
            us_volume_score,
            br_volume_score,
            br_avg_quality
        )
        
        # Clamp to 0-100
        gap_score = max(0.0, min(100.0, gap_score))
        
        logger.debug(
            f"Gap Score Breakdown: "
            f"US_demand={us_demand_component:.1f}, "
            f"BR_saturation={br_saturation_component:.1f}, "
            f"BR_quality_gap={br_quality_gap_component:.1f}, "
            f"Total={gap_score:.1f}"
        )
        
        return round(gap_score, 1)
    
    def _apply_bonus(
        self,
        base_score: float,
        us_volume: int,
        br_volume: int,
        br_quality: float
    ) -> float:
        """
        Apply bonus multiplier for exceptional opportunities
        
        Conditions for bonus:
        - High US volume (>70) + Low BR volume (<30) + Low BR quality (<40)
        """
        bonus = 0.0
        
        # "Golden opportunity" bonus
        if us_volume >= 70 and br_volume <= 30 and br_quality <= 40:
            bonus = 10.0
            logger.info("🎯 GOLDEN OPPORTUNITY detected! (+10 bonus)")
        
        # "High demand, weak competition" bonus
        elif us_volume >= 60 and br_quality <= 30:
            bonus = 5.0
            logger.info("⭐ Strong opportunity detected! (+5 bonus)")
        
        return base_score + bonus
    
    def categorize_opportunity(self, gap_score: float) -> Dict[str, str]:
        """
        Categorize opportunity based on gap score
        
        Args:
            gap_score: Calculated gap score
            
        Returns:
            Dict with category and description
        """
        if gap_score >= 80:
            return {
                'category': '🔥 EXCELLENT',
                'description': 'High US demand, weak BR competition - top priority'
            }
        elif gap_score >= 65:
            return {
                'category': '✅ STRONG',
                'description': 'Good opportunity with favorable conditions'
            }
        elif gap_score >= 50:
            return {
                'category': '⚠️ MODERATE',
                'description': 'Moderate opportunity, requires validation'
            }
        elif gap_score >= 35:
            return {
                'category': '⚡ WEAK',
                'description': 'Low opportunity, high competition or low demand'
            }
        else:
            return {
                'category': '❌ POOR',
                'description': 'Not recommended - saturated or low demand'
            }
    
    def get_insights(
        self,
        us_volume: int,
        br_volume: int,
        br_quality: float,
        gap_score: float
    ) -> str:
        """
        Generate human-readable insights about the opportunity
        
        Args:
            us_volume: US interest score
            br_volume: BR interest score
            br_quality: BR competitor quality
            gap_score: Calculated gap score
            
        Returns:
            Insight string
        """
        insights = []
        
        # US market analysis
        if us_volume >= 70:
            insights.append("Strong US demand")
        elif us_volume >= 40:
            insights.append("Moderate US demand")
        else:
            insights.append("Low US demand")
        
        # BR competition analysis
        if br_quality < 30:
            insights.append("very weak BR competitors")
        elif br_quality < 50:
            insights.append("weak BR competitors")
        elif br_quality < 70:
            insights.append("moderate BR competitors")
        else:
            insights.append("strong BR competitors")
        
        # BR saturation
        if br_volume < 20:
            insights.append("untapped BR market")
        elif br_volume < 50:
            insights.append("growing BR market")
        else:
            insights.append("saturated BR market")
        
        category = self.categorize_opportunity(gap_score)
        
        return f"{category['category']}: {', '.join(insights)}"



