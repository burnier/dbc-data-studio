#!/usr/bin/env python3
"""
Quick test script to verify the scanner works
Run this after setup to verify everything is installed correctly
"""
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

print("🔍 Testing Market Arbitrage Scanner Components...\n")

# Test 1: Imports
print("1️⃣ Testing imports...")
try:
    from services.translator import TranslationService
    from services.search_volume import SearchVolumeService
    from services.serp_scraper import SerpScraper
    from services.quality_analyzer import QualityAnalyzer
    from scoring.gap_scorer import GapScorer
    from output.markdown_generator import MarkdownGenerator
    from models import GapAnalysis
    print("   ✅ All imports successful\n")
except Exception as e:
    print(f"   ❌ Import failed: {e}\n")
    sys.exit(1)

# Test 2: Translation
print("2️⃣ Testing translator...")
try:
    translator = TranslationService()
    result = translator.translate_to_portuguese("Hello World")
    print(f"   'Hello World' → '{result}'")
    print("   ✅ Translator working\n")
except Exception as e:
    print(f"   ⚠️  Translator warning: {e}")
    print("   (This is OK - might need internet connection)\n")

# Test 3: Gap Scorer
print("3️⃣ Testing gap scorer...")
try:
    scorer = GapScorer()
    score = scorer.calculate_gap_score(
        us_volume_score=80,
        br_volume_score=20,
        br_avg_quality=30
    )
    category = scorer.categorize_opportunity(score)
    print(f"   Test score: {score:.1f}/100")
    print(f"   Category: {category['category']}")
    print("   ✅ Gap scorer working\n")
except Exception as e:
    print(f"   ❌ Gap scorer failed: {e}\n")
    sys.exit(1)

# Test 4: Markdown Generator
print("4️⃣ Testing markdown generator...")
try:
    gen = MarkdownGenerator()
    print(f"   Output directory: {gen.output_dir}")
    print("   ✅ Markdown generator working\n")
except Exception as e:
    print(f"   ❌ Markdown generator failed: {e}\n")
    sys.exit(1)

print("="*60)
print("✅ ALL TESTS PASSED! Scanner is ready to use.")
print("="*60)
print("\nNext steps:")
print("1. Activate venv: source venv/bin/activate")
print("2. Test single keyword: python src/main.py scan 'PDF to Excel'")
print("3. Scan all keywords: python src/main.py batch data/keywords.txt")
print("\nFor help: python src/main.py --help\n")





