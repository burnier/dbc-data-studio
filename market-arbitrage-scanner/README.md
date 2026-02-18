# 🔍 Market Arbitrage Scanner

A Python tool that identifies market gaps between English and Brazilian Portuguese (PT-BR) utility tool markets using Google Trends and SerpAPI.

## 🎯 What It Does

Analyzes keywords to find tools with:
- ✅ High US demand (proven market exists)
- ✅ Low Brazilian saturation (untapped market)
- ✅ Weak Brazilian competition (easy to compete)

**Result**: Ranked list of opportunities (0-100 score) showing what to build next.

---

## 🚀 Quick Start

### 1. Installation (2 minutes)

```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/market-arbitrage-scanner
./setup.sh
source venv/bin/activate
```

### 2. Configure SerpAPI (2 minutes)

**Get free API key** (250 searches/month): [https://serpapi.com](https://serpapi.com)

Create `.env` file:
```bash
cat > .env << 'EOF'
USE_SERPAPI=true
SERPAPI_KEY=your_api_key_here
LOG_LEVEL=INFO
EOF
```

### 3. Test (30 seconds)

```bash
python src/main.py status
python src/main.py scan "Video Compressor"
```

### 4. Scan Keywords (30-90 minutes)

```bash
# Scan top 50 keywords (uses 100 SerpAPI credits)
head -50 data/keywords.txt > data/top50.txt
python src/main.py batch data/top50.txt

# Or scan all 137 keywords (uses 274 credits - need paid plan)
python src/main.py batch data/keywords.txt
```

---

## 📊 Sample Output

```
🏆 TOP 5 OPPORTUNITIES:

1. 🔥 Invoice Generator
   Gap Score: 87.3 | US: 85 | BR: 25 | Quality: 30.0
   → BUILD THIS! High US demand, weak BR competition

2. 🔥 QR Code Generator  
   Gap Score: 84.2 | US: 78 | BR: 28 | Quality: 35.0

3. ✅ Resume Builder
   Gap Score: 72.3 | US: 70 | BR: 45 | Quality: 40.0

📊 Full report saved to: data/results/gap_analysis_20260218.md
```

---

## 🏗️ How It Works

```
1. Translate keyword (English → Portuguese)
2. Get US/BR search interest (Google Trends)
3. Scrape top 3 URLs (SerpAPI)
4. Analyze BR competitor quality
5. Calculate gap score (0-100)
6. Generate ranked report
```

### Gap Score Formula

```
Gap Score = 
  (US Interest × 40%) +           # Higher demand = better
  ((100 - BR Interest) × 30%) +   # Less saturation = better
  ((100 - BR Quality) × 30%)      # Weaker competition = better

Bonuses:
  +10 for "Golden Opportunities" (US≥70, BR≤30, Quality≤40)
  +5 for "Strong Opportunities" (US≥60, Quality≤30)
```

### Quality Scoring (BR Competitors)

| Metric | Weight | What It Checks |
|--------|--------|----------------|
| **Is Web App?** | 40% | Dedicated tool vs blog |
| **Is Responsive?** | 25% | Mobile-friendly |
| **Is Recent?** | 20% | Updated within 2 years |
| **Has HTTPS?** | 10% | Secure connection |
| **Loads?** | 5% | Page accessibility |

---

## 📁 Project Structure

```
market-arbitrage-scanner/
├── src/
│   ├── main.py                    # CLI entry point
│   ├── config.py                  # Settings
│   ├── models.py                  # Data structures
│   ├── services/
│   │   ├── translator.py          # deep-translator (free)
│   │   ├── search_volume.py       # Google Trends (free)
│   │   ├── serpapi_service.py     # SerpAPI (250 free/month)
│   │   ├── serp_scraper.py        # Free scraper (fallback)
│   │   └── quality_analyzer.py    # Competitor analysis
│   ├── scoring/
│   │   └── gap_scorer.py          # Gap calculation
│   └── output/
│       └── markdown_generator.py  # Report generation
├── data/
│   ├── keywords.txt               # 137 sample keywords
│   └── results/                   # Generated reports
├── tests/                         # Test suite
├── .env                          # Your API keys (gitignored)
├── requirements.txt              # Dependencies
└── README.md                     # This file
```

---

## 🎯 CLI Commands

```bash
# Check SerpAPI status
python src/main.py status

# Scan single keyword
python src/main.py scan "PDF to Excel"

# Scan from file
python src/main.py batch data/keywords.txt

# Scan with custom output
python src/main.py batch my_keywords.txt -o my_report.md

# Interactive mode
python src/main.py interactive

# Show help
python src/main.py --help
```

---

## 💰 SerpAPI Pricing

**Free Tier** (recommended for testing):
- 250 searches/month
- ~125 keywords per month
- No credit card required
- Sign up: [https://serpapi.com](https://serpapi.com)

**Paid Tiers** (for scaling):
- Starter ($25/mo): 1,000 searches = ~500 keywords
- Developer ($75/mo): 5,000 searches = ~2,500 keywords
- See: [https://serpapi.com/pricing](https://serpapi.com/pricing)

**Free Scraper Fallback**:
- If no API key, uses free scraper
- Less reliable (~20% success rate)
- Good for testing architecture

---

## 📊 Understanding Results

### Gap Score Categories

| Score | Category | Action |
|-------|----------|--------|
| 80-100 | 🔥 EXCELLENT | Build immediately! |
| 65-79 | ✅ STRONG | High priority |
| 50-64 | ⚠️ MODERATE | Research further |
| 35-49 | ⚡ WEAK | Low priority |
| 0-34 | ❌ POOR | Skip |

### Example Analysis

**Good Opportunity:**
```
English: Invoice Generator
Portuguese: Gerador de Nota Fiscal
US Interest: 85/100      ← High demand ✅
BR Interest: 25/100      ← Untapped ✅
BR Quality: 30.0/100     ← Weak competition ✅
Gap Score: 87.3/100      ← BUILD THIS! 🔥
```

**Poor Opportunity:**
```
English: Video Compressor
Portuguese: Compressor de Vídeo
US Interest: 50/100      ← Moderate demand
BR Interest: 16/100      ← Untapped ✅
BR Quality: 86.7/100     ← Strong competition ❌
Gap Score: 49.2/100      ← Skip this one
```

---

## 🔧 Tech Stack

| Component | Tool | Cost |
|-----------|------|------|
| **Translation** | deep-translator | Free |
| **Search Volume** | Google Trends (pytrends) | Free |
| **SERP Data** | SerpAPI | 250 free/month |
| **Scraper Fallback** | BeautifulSoup4 | Free |
| **Quality Analysis** | Custom heuristics | Free |
| **CLI** | click | Free |
| **Testing** | pytest | Free |

---

## 🐛 Troubleshooting

### SSL Certificate Errors

**macOS users**: SSL verification is already disabled in the code.

If you see SSL errors:
```bash
# Install certificates (optional)
/Applications/Python\ 3.9/Install\ Certificates.command

# Or upgrade certifi
pip install --upgrade certifi
```

### SerpAPI Not Working

```bash
# Check configuration
python src/main.py status

# Verify .env file exists
cat .env

# Should show:
# SERPAPI_KEY=your_actual_key_here
```

### No URLs Found

- **With SerpAPI**: Check your credits (`python src/main.py status`)
- **Without SerpAPI**: Expected behavior, free scraper often fails
- **Solution**: Use SerpAPI free tier (250 searches/month)

### Google Trends No Data

- Keyword might be too niche
- Try broader terms (e.g., "PDF Converter" vs "PDF to Excel Converter Online Free")

---

## 📚 Sample Keywords Included

137 pre-loaded keywords across categories:
- Document Tools (PDF to Excel, Word to PDF, etc.)
- Video Tools (Compressor, Editor, Downloader, etc.)
- Image Tools (PNG to JPG, Background Remover, etc.)
- Productivity (QR Code, Resume Builder, Invoice Generator, etc.)
- Social Media (Instagram Viewer, TikTok Downloader, etc.)
- And 10+ more categories...

Located in: `data/keywords.txt`

---

## 🎓 Best Practices

### 1. Start Small
```bash
# Test with 5-10 keywords first
head -10 data/keywords.txt > data/test.txt
python src/main.py batch data/test.txt
```

### 2. Prioritize High-Value Keywords
Focus on tools you're capable of building:
- Simple converters (PDF, images)
- Generators (QR codes, invoices)
- Basic editors (video compression, image resize)

### 3. Validate Manually
For top opportunities (score ≥80):
1. Google the BR keyword yourself
2. Check actual competitor quality
3. Estimate build difficulty
4. Calculate potential revenue

### 4. Monitor Your Credits
```bash
# Check before large scans
python src/main.py status
```

### 5. Batch Strategically
- Free tier: 250 searches = ~125 keywords
- Scan 50 keywords (100 credits)
- Save 150 for validation/re-scans

---

## 📖 Expected Results

From 137 sample keywords, expect:
- **~15-20 EXCELLENT** opportunities (≥80)
- **~20-25 STRONG** opportunities (65-79)
- **~30-40 MODERATE** opportunities (50-64)
- **~50-60 Weak/Poor** (<50)

**Focus on the top 15-20 for best ROI!** 🏆

---

## 🚀 Next Steps

1. ✅ **Install**: Run `./setup.sh`
2. ✅ **Configure SerpAPI**: Get free key, create `.env`
3. ✅ **Test**: `python src/main.py status`
4. ✅ **Scan**: Start with top 50 keywords
5. ✅ **Validate**: Check top 10 opportunities manually
6. ✅ **Build**: Create MVP for #1 opportunity
7. ✅ **Launch**: Deploy to Brazilian market! 🇧🇷

---

## 📄 License

MIT License - Free to use and modify

---

## 🤝 Contributing

This is a personal tool, but feel free to fork and adapt!

---

## 💡 Tips

- **Google Trends gives relative scores (0-100)**, not absolute volumes
- Use as a filter, validate top opportunities with Google Keyword Planner
- **Manual verification is crucial** - scanner finds opportunities, you validate them
- Focus on tools you can realistically build (start simple!)

---

**Built to find your next SaaS opportunity! 🔍**

Questions? Check the logs in `scanner.log`

Happy scanning! 🚀
