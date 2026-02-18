"""
Basic tests for Market Arbitrage Scanner services
Run with: pytest tests/
"""
import pytest
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from services.translator import TranslationService
from scoring.gap_scorer import GapScorer


class TestTranslator:
    """Test translation service"""
    
    def test_translation_basic(self):
        """Test basic translation"""
        translator = TranslationService()
        result = translator.translate_to_portuguese("PDF to Excel")
        
        # Should contain "PDF" and some Portuguese words
        assert "PDF" in result or "pdf" in result.lower()
        assert len(result) > 0
    
    def test_translation_cache(self):
        """Test translation caching"""
        translator = TranslationService()
        
        # First call
        result1 = translator.translate_to_portuguese("Hello")
        
        # Second call (should use cache)
        result2 = translator.translate_to_portuguese("Hello")
        
        assert result1 == result2


class TestGapScorer:
    """Test gap scoring algorithm"""
    
    def test_perfect_opportunity(self):
        """Test scoring for perfect opportunity"""
        scorer = GapScorer()
        
        # High US, low BR, low quality = high score
        score = scorer.calculate_gap_score(
            us_volume_score=90,
            br_volume_score=10,
            br_avg_quality=20
        )
        
        assert score >= 80  # Should be EXCELLENT
    
    def test_poor_opportunity(self):
        """Test scoring for poor opportunity"""
        scorer = GapScorer()
        
        # Low US, high BR, high quality = low score
        score = scorer.calculate_gap_score(
            us_volume_score=10,
            br_volume_score=90,
            br_avg_quality=90
        )
        
        assert score <= 35  # Should be POOR
    
    def test_moderate_opportunity(self):
        """Test scoring for moderate opportunity"""
        scorer = GapScorer()
        
        # Medium across the board
        score = scorer.calculate_gap_score(
            us_volume_score=50,
            br_volume_score=50,
            br_avg_quality=50
        )
        
        assert 35 <= score <= 65  # Should be WEAK to MODERATE
    
    def test_score_bounds(self):
        """Test that scores are always 0-100"""
        scorer = GapScorer()
        
        # Extreme values
        score1 = scorer.calculate_gap_score(100, 0, 0)
        score2 = scorer.calculate_gap_score(0, 100, 100)
        
        assert 0 <= score1 <= 100
        assert 0 <= score2 <= 100
    
    def test_categorization(self):
        """Test opportunity categorization"""
        scorer = GapScorer()
        
        # Test each category
        cat_excellent = scorer.categorize_opportunity(85)
        cat_strong = scorer.categorize_opportunity(70)
        cat_moderate = scorer.categorize_opportunity(55)
        cat_weak = scorer.categorize_opportunity(40)
        cat_poor = scorer.categorize_opportunity(25)
        
        assert "EXCELLENT" in cat_excellent['category']
        assert "STRONG" in cat_strong['category']
        assert "MODERATE" in cat_moderate['category']
        assert "WEAK" in cat_weak['category']
        assert "POOR" in cat_poor['category']


# Run tests with: pytest tests/test_services.py -v

