# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Setup (One-time)

```bash
cd /Users/dburnier/Documents/my_repos/dbc-data-studio/market-arbitrage-scanner
./setup.sh
```

### Step 2: Activate Environment

```bash
source venv/bin/activate
```

### Step 3: Run Scanner

**Test with a single keyword:**
```bash
python src/main.py scan "PDF to Excel"
```

**Scan all 100+ sample keywords:**
```bash
python src/main.py batch data/keywords.txt
```

**Interactive mode (paste your own keywords):**
```bash
python src/main.py interactive
```

---

## 📊 Expected Output

The scanner will:
1. Translate each keyword to Portuguese
2. Fetch search interest scores (US vs Brazil)
3. Scrape top 3 URLs from Google
4. Analyze Brazilian competitor quality
5. Calculate gap scores (0-100)
6. Generate a markdown report in `data/results/`

**Example Console Output:**
```
[1/100] Processing: PDF to Excel
📊 Scanning: PDF to Excel
   Translated: PDF to Excel → PDF para Excel
   Fetching search volumes...
   Scraping top URLs...
   Analyzing BR competitors...
   🔥 EXCELLENT: Strong US demand, very weak BR competitors, untapped BR market

✅ Scan complete! Analyzed 100/100 keywords successfully

🏆 TOP 5 OPPORTUNITIES:
1. 🔥 PDF to Excel
   Gap Score: 89.5 | US: 85 | BR: 25 | Quality: 30.0
```

---

## ⏱️ Performance

- **Single keyword**: ~30-45 seconds
- **100 keywords**: ~50-75 minutes (with rate limiting)

Rate limiting prevents IP blocks from Google.

---

## 🎯 Understanding Gap Scores

| Score | Category | Action |
|-------|----------|--------|
| 80-100 | 🔥 EXCELLENT | **Build immediately** - High US demand, weak BR competition |
| 65-79 | ✅ STRONG | **High priority** - Good opportunity |
| 50-64 | ⚠️ MODERATE | **Research further** - Validate market |
| 35-49 | ⚡ WEAK | **Low priority** - Competition exists |
| 0-34 | ❌ POOR | **Skip** - Saturated or low demand |

---

## 📁 Using Your Own Keywords

Create a text file with keywords (one per line):

```bash
# my_keywords.txt
Video Compressor
Resume Builder
URL Shortener
```

Then run:
```bash
python src/main.py batch my_keywords.txt -o my_report.md
```

---

## 🔧 Tips

1. **Start small**: Test with 5-10 keywords first
2. **Check logs**: Use `-v` flag for verbose output
3. **Rate limiting**: Scanner includes delays to avoid blocks
4. **Results**: Find reports in `data/results/`

---

## 📞 Help

```bash
# Show all commands
python src/main.py --help

# Help for specific command
python src/main.py batch --help
```

---

## 🐛 Troubleshooting

**"ModuleNotFoundError"**
→ Activate venv: `source venv/bin/activate`

**"No data from Google Trends"**
→ Keyword too niche, try broader terms

**"Rate limited"**
→ Normal! Scanner will retry automatically

---

**Happy scanning! 🔍**

