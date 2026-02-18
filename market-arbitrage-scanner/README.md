# 🔍 Market Arbitrage Scanner

A Python tool that identifies market gaps between English and Brazilian Portuguese (PT-BR) utility tool markets. Perfect for finding opportunities where US demand is high but Brazilian competition is weak.

## 🎯 What It Does

1. **Input**: List of English tool keywords (e.g., "PDF to Excel", "YouTube Thumbnail Downloader")
2. **Analysis**: For each keyword:
   - Fetches US search volume/interest via Google Trends
   - Translates keyword to PT-BR
   - Fetches Brazil search volume/interest
   - Scrapes top 3 Google results for both markets
   - Analyzes Brazilian competitor quality
3. **Output**: Markdown report with gap scores (0-100) ranking opportunities

## 🏗️ Architecture

```
market-arbitrage-scanner/
├── src/
│   ├── main.py                 # CLI entry point
│   ├── config.py              # Configuration
│   ├── models.py              # Data models
│   ├── services/              # Service layer
│   │   ├── translator.py      # Free translation (deep-translator)
│   │   ├── search_volume.py   # Google Trends integration
│   │   ├── serp_scraper.py    # Google SERP scraper
│   │   └── quality_analyzer.py # Competitor quality analysis
│   ├── scoring/
│   │   └── gap_scorer.py      # Gap scoring algorithm
│   └── output/
│       └── markdown_generator.py # Report generation
├── data/
│   ├── keywords.txt           # Sample input
│   └── results/               # Generated reports
└── requirements.txt
```

## 📦 Tech Stack (100% Free)

- **Translation**: `deep-translator` (free Google Translate API)
- **Search Volume**: `pytrends` (free Google Trends)
- **SERP Scraping**: `requests` + `BeautifulSoup4`
- **Quality Analysis**: Custom heuristics
- **CLI**: `click`

## 🚀 Installation

### Prerequisites
- Python 3.8+
- pip

### Setup

```bash
# Navigate to project directory
cd market-arbitrage-scanner

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create data directory
mkdir -p data/results
```

### Configuration (Optional)

```bash
cp .env.example .env
# Edit .env if you want to customize settings
```

## 📖 Usage

### 1. Single Keyword Scan

```bash
python src/main.py scan "PDF to Excel"
```

### 2. Batch Mode (Recommended for 100 keywords)

```bash
# Create a file with keywords (one per line)
python src/main.py batch data/keywords.txt

# With custom output filename
python src/main.py batch data/keywords.txt -o my_report.md

# Verbose mode (see detailed logs)
python src/main.py batch data/keywords.txt -v
```

### 3. Interactive Mode

```bash
python src/main.py interactive
```

Then paste keywords one by one:
```
Enter keyword: PDF to Excel
  ✓ Added: PDF to Excel
Enter keyword: YouTube Thumbnail Downloader
  ✓ Added: YouTube Thumbnail Downloader
Enter keyword: done
```

## 📊 Output Format

The scanner generates a markdown report with:

### Main Table
| # | English Tool | PT-BR Translation | US Vol | BR Vol | BR Quality | Gap Score | Category |
|---|-------------|------------------|--------|--------|------------|-----------|----------|
| 1 | PDF to Excel | PDF para Excel | 85 | 25 | 30.0 | **89.5** | 🔥 EXCELLENT |

### Gap Score Categories
- **🔥 EXCELLENT (80-100)**: High US demand, weak BR competition - top priority
- **✅ STRONG (65-79)**: Good opportunity with favorable conditions
- **⚠️ MODERATE (50-64)**: Moderate opportunity, requires validation
- **⚡ WEAK (35-49)**: Low opportunity, high competition or low demand
- **❌ POOR (0-34)**: Not recommended - saturated or low demand

### Scoring Algorithm

```
Gap Score = 
  (US Interest × 0.40) +           # Higher US demand = better
  ((100 - BR Interest) × 0.30) +   # Lower BR saturation = better
  ((100 - BR Quality) × 0.30)      # Weaker BR competitors = better
```

**Bonuses**:
- **Golden Opportunity** (+10): US ≥70, BR ≤30, Quality ≤40
- **Strong Opportunity** (+5): US ≥60, Quality ≤30

## 🎯 Quality Metrics

Brazilian competitor quality is scored based on:

| Metric | Weight | Description |
|--------|--------|-------------|
| **Is Web App?** | 40% | Dedicated tool vs blog post |
| **Is Responsive?** | 25% | Mobile-friendly design |
| **Is Recent?** | 20% | Updated within 2 years |
| **Has HTTPS?** | 10% | Secure connection |
| **Loads Successfully?** | 5% | Page accessibility |

## 📁 Sample Keywords File

Create `data/keywords.txt`:

```
PDF to Excel
YouTube Thumbnail Downloader
Video Compressor
PNG to JPG Converter
QR Code Generator
Resume Builder
Watermark Remover
# Comments start with #
Background Remover
Meme Generator
URL Shortener
```

## ⚙️ Rate Limiting

The scanner includes built-in rate limiting to avoid being blocked:

- **Google Trends**: 2 seconds between requests
- **SERP Scraping**: 3 seconds between requests  
- **Quality Analysis**: 1 second between requests

**Expected Time**: ~30-45 seconds per keyword (100 keywords ≈ 50-75 minutes)

## 🔧 Troubleshooting

### "No data from Google Trends"
- Keyword might be too niche
- Try broader terms
- Check your internet connection

### "Failed to scrape SERP"
- Rate limiting kicked in (normal, will retry)
- Google might have changed HTML structure
- Use `-v` flag to see detailed errors

### "Quality analyzer timeout"
- Some sites are slow or blocking requests
- Scanner will continue with remaining URLs

## 📝 Example Output

```
🏆 TOP 5 OPPORTUNITIES:

1. 🔥 PDF to Excel
   Gap Score: 89.5 | US: 85 | BR: 25 | Quality: 30.0

2. 🔥 Video Compressor
   Gap Score: 87.2 | US: 78 | BR: 30 | Quality: 35.0

3. ✅ Resume Builder
   Gap Score: 72.3 | US: 70 | BR: 45 | Quality: 40.0
```

Full report saved to: `data/results/gap_analysis_20260218_143022.md`

## 🤝 Contributing

This is a personal tool, but feel free to fork and adapt!

## 📄 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

- Google Trends for search volume data
- BeautifulSoup for HTML parsing
- deep-translator for free translation

---

**Built with ❤️ for finding market opportunities**

