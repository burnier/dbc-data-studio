# Usage Examples

## Complete Usage Examples for Market Arbitrage Scanner

---

## Example 1: Quick Test (Single Keyword)

Test the scanner with a single keyword to see how it works:

```bash
# Activate environment
source venv/bin/activate

# Scan one keyword
python src/main.py scan "PDF to Excel"
```

**Expected output:**
```
📊 Scanning: PDF to Excel
   Translated: PDF to Excel → PDF para Excel
   Fetching search volumes...
   Scraping top URLs...
   Analyzing BR competitors...
   🔥 EXCELLENT: Strong US demand, very weak BR competitors, untapped BR market

================================================================================
Results for: PDF to Excel
================================================================================
Portuguese Translation: PDF para Excel
US Interest Score: 85/100
BR Interest Score: 25/100
BR Competitor Quality: 32.5/100
Gap Score: 87.3/100
================================================================================
```

---

## Example 2: Batch Processing (Recommended)

Scan multiple keywords from a file:

```bash
# Use the provided sample keywords (100+ keywords)
python src/main.py batch data/keywords.txt

# Or use your own file
python src/main.py batch my_keywords.txt

# With custom output filename
python src/main.py batch data/keywords.txt -o february_2026_analysis.md

# Verbose mode (detailed logs)
python src/main.py batch data/keywords.txt -v
```

**Progress output:**
```
📄 Loaded 100 keywords from data/keywords.txt

🚀 Starting scan of 100 keywords...

[1/100] Processing: PDF to Excel
📊 Scanning: PDF to Excel
   Translated: PDF to Excel → PDF para Excel
   Fetching search volumes...
   Scraping top URLs...
   Analyzing BR competitors...
   🔥 EXCELLENT: Strong US demand, very weak BR competitors, untapped BR market

[2/100] Processing: YouTube Thumbnail Downloader
...

✅ Scan complete! Analyzed 98/100 keywords successfully
```

---

## Example 3: Interactive Mode

Enter keywords interactively:

```bash
python src/main.py interactive
```

**Interactive session:**
```
🔍 Market Arbitrage Scanner - Interactive Mode
================================================================================
Enter keywords one per line. Type 'done' when finished, 'quit' to exit.

Enter keyword: Video Compressor
  ✓ Added: Video Compressor
Enter keyword: Resume Builder
  ✓ Added: Resume Builder
Enter keyword: QR Code Generator
  ✓ Added: QR Code Generator
Enter keyword: done

📊 Scanning 3 keywords...
[Processing...]

🏆 TOP 3 OPPORTUNITIES:
1. 🔥 Video Compressor
   Gap Score: 84.2 | US: 78 | BR: 28 | Quality: 35.0
...
```

---

## Example 4: Creating Custom Keyword Lists

Create niche-specific keyword files:

### Video Tools (`video_tools.txt`)
```
Video Compressor
Video Editor Online
YouTube to MP3
GIF Maker
Screen Recorder
Video Merger
Subtitle Generator
```

Run:
```bash
python src/main.py batch video_tools.txt -o video_tools_report.md
```

### Design Tools (`design_tools.txt`)
```
Logo Maker
Background Remover
Poster Maker
Meme Generator
Banner Creator
```

Run:
```bash
python src/main.py batch design_tools.txt -o design_tools_report.md
```

---

## Example 5: Analyzing the Results

After scanning, you'll get a markdown report like this:

### Report Location
```
data/results/gap_analysis_20260218_143022.md
```

### Top of Report
```markdown
# 🔍 Market Arbitrage Scanner - Gap Analysis Report

**Generated:** 2026-02-18 14:30:22
**Total Keywords Analyzed:** 100

## 📊 Summary

- **Average Gap Score:** 64.3/100
- **Excellent Opportunities (≥80):** 15
- **Strong Opportunities (65-79):** 23

---

## 🎯 Top Opportunities

| # | English Tool | PT-BR Translation | US Vol | BR Vol | BR Quality | Gap Score | Category |
|---|-------------|------------------|--------|--------|------------|-----------|----------|
| 1 | PDF to Excel | PDF para Excel | 85 | 25 | 32.5 | **87.3** | 🔥 EXCELLENT |
| 2 | Video Compressor | Compressor de Vídeo | 78 | 28 | 35.0 | **84.2** | 🔥 EXCELLENT |
...
```

---

## Example 6: Prioritizing Opportunities

Use the gap scores to prioritize what to build:

### 🔥 EXCELLENT (80-100) - Build First
These are your **top priorities**. High US demand + weak BR competition.

### ✅ STRONG (65-79) - Build Second
Good opportunities, but validate the market first.

### ⚠️ MODERATE (50-64) - Research Further
Might be worth it, but requires deeper analysis.

### Skip the rest
Low scores mean either low demand or strong competition.

---

## Example 7: Real-World Workflow

Here's a complete workflow from scan to launch:

```bash
# Step 1: Scan all tools in your category
python src/main.py batch saas_ideas.txt -o saas_analysis.md

# Step 2: Review the report
open data/results/saas_analysis.md

# Step 3: Pick top 3 tools with score ≥80

# Step 4: Validate each one:
#   - Check the BR URLs manually
#   - Verify the quality assessment
#   - Research actual BR demand (Google Keyword Planner)
#   - Check if you can build it

# Step 5: Build MVP for #1 tool
#   - Create simple landing page in Portuguese
#   - Build core functionality
#   - Test with BR audience

# Step 6: Launch and measure
#   - SEO optimization for BR market
#   - Track conversions
#   - Iterate based on feedback
```

---

## Example 8: Combining with Manual Research

The scanner finds opportunities. You validate them:

```bash
# Scanner found: "Invoice Generator" - Score: 82

# Manual validation:
1. Check Google BR manually: google.com.br
   → Search "gerador de nota fiscal"
   → Are results really weak? ✓

2. Check competitor pricing:
   → Are they charging? How much?
   → Can you compete?

3. Estimate traffic potential:
   → Use Google Keyword Planner for exact volumes
   → Scanner gives relative scores (0-100)

4. Build MVP and test:
   → Create simple version
   → Run Google Ads test
   → Measure conversion rate

If validated → Build full version
If not → Try next opportunity
```

---

## Example 9: Troubleshooting Common Issues

### Issue: "No data from Google Trends"
```bash
# Some keywords are too niche
# Try broader terms:

❌ "PDF to Excel Converter Online Free"  # Too specific
✅ "PDF to Excel"                        # Better

❌ "Best YouTube Thumbnail Downloader"   # Too specific
✅ "YouTube Thumbnail Downloader"        # Better
```

### Issue: "Rate limited by Google"
```bash
# This is normal! The scanner has built-in delays

# If you see errors:
# - Scanner will retry automatically
# - Some failures are expected (10-20%)
# - Run again for failed keywords

# To reduce failures:
# - Use VPN (different IP)
# - Increase delays in config.py
# - Scan fewer keywords at once
```

### Issue: "Quality scores seem wrong"
```bash
# The analyzer uses heuristics
# Always manually verify top opportunities

# Check yourself:
# 1. Visit the BR URLs
# 2. Are they actually web apps? Or blogs?
# 3. Do they have the functionality?
# 4. Is the UX good?

# Use scanner for filtering, not final decisions
```

---

## Example 10: Advanced Usage

### Modify Scoring Weights

Edit `src/scoring/gap_scorer.py`:

```python
self.weights = {
    'us_demand': 0.50,      # Increase if you care more about US demand
    'br_saturation': 0.20,  # Decrease if competition doesn't matter
    'br_quality': 0.30      # Keep as is
}
```

### Change Rate Limits

Edit `src/config.py`:

```python
SERP_RATE_LIMIT = 5.0  # Increase delay (slower but safer)
TRENDS_RATE_LIMIT = 3.0
```

### Add More Markets

Modify `search_volume.py` and `serp_scraper.py` to support more countries:
- Argentina (AR)
- Mexico (MX)
- Spain (ES)
- Portugal (PT)

---

## Need Help?

```bash
# Show all commands
python src/main.py --help

# Help for specific command
python src/main.py batch --help

# Run tests
pytest tests/ -v

# Check setup
python test_setup.py
```

---

**Happy scanning! Find those market gaps! 🔍🚀**

