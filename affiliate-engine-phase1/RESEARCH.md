# Affiliate Engine Phase 1 - Research & Strategy

**Objective:** Build a Zero-Touch Automated Affiliate Machine for Passive Profit

**Status:** Research Phase  
**Date:** 2025-01-02

---

## Task A: Market & Niche API Research

### Affiliate Marketplace Analysis

#### PartnerStack
- **Focus:** B2B SaaS affiliate programs
- **Commission Structure:** Typically 20-30% recurring for SaaS
- **Approval Process:** Varies by program (some instant, some manual)
- **API Access:** REST API available for program management
- **Key Niches to Investigate:**
  1. **AI-Ops / DevOps Tools** - High recurring, low conflict with commercetools
  2. **Privacy/Security SaaS** - Growing market, high intent
  3. **Developer Productivity Tools** - Strong recurring commissions

#### Impact.com
- **Focus:** Large affiliate network with diverse programs
- **Commission Structure:** Varies widely (10-50% depending on program)
- **Approval Process:** Mix of instant and manual approval
- **API Access:** Impact Radius API available
- **Key Niches to Investigate:**
  1. **Cloud Infrastructure Tools** - High-value, recurring
  2. **Marketing Automation SaaS** - Strong affiliate programs
  3. **Data Analytics Tools** - High recurring commissions

### Recommended Niches (3 Safe Options)

#### 1. AI-Ops / DevOps Automation Tools
- **Why:** Zero overlap with commercetools, high recurring commissions (20-30%)
- **Example Programs:** Monitoring tools, CI/CD platforms, infrastructure automation
- **Search Intent:** "Best [tool type] for DevOps 2025", "Top AI-Ops tools"
- **Competition:** Medium (less saturated than general SaaS)

#### 2. Privacy & Security SaaS
- **Why:** Growing market, high-value customers, recurring revenue
- **Example Programs:** VPN services, password managers, security compliance tools
- **Search Intent:** "Best privacy tools 2025", "Top security software"
- **Competition:** Medium-High (but high conversion rates)

#### 3. Developer Productivity / Code Quality Tools
- **Why:** Strong recurring commissions, developer-focused (no commercetools conflict)
- **Example Programs:** Code review tools, testing platforms, documentation tools
- **Search Intent:** "Best developer tools 2025", "Top code quality tools"
- **Competition:** Medium (niche but high intent)

---

## Task B: Tech Stack Integration

### Landing Page Builders (API-Friendly)

#### Option 1: Carrd
- **API Status:** Limited native API, but supports Zapier/Make.com integration
- **Pros:** 
  - Very affordable ($9-19/year)
  - Fast page loads
  - Mobile-responsive templates
  - Easy to use
- **Cons:** 
  - Limited API for direct automation
  - Requires Zapier/Make.com for automation
- **Automation Path:** Carrd → Zapier/Make.com → Content Updates

#### Option 2: Webflow
- **API Status:** Full REST API available (CMS API, Webhooks)
- **Pros:**
  - Complete API control
  - Professional design capabilities
  - CMS API for dynamic content
  - Webhooks for real-time updates
- **Cons:**
  - More expensive ($12-35/month)
  - Steeper learning curve
- **Automation Path:** Direct API integration possible

#### Option 3: Framer
- **API Status:** Limited API, but supports integrations
- **Pros:**
  - Modern design capabilities
  - Good for visual content
- **Cons:**
  - Less API-friendly than Webflow
  - Higher cost

#### Recommendation: **Webflow** (for full API control) or **Carrd + Zapier** (for cost efficiency)

### AI Social Automation Tools

#### Option 1: Buffer AI
- **API Status:** Full REST API available
- **Features:**
  - AI content generation
  - Multi-platform posting (Twitter, LinkedIn, Facebook, Instagram)
  - Scheduling and automation
- **Pricing:** $6-120/month
- **API Access:** Yes, comprehensive API

#### Option 2: Hootsuite
- **API Status:** Full API available
- **Features:**
  - Social media management
  - Content scheduling
  - Analytics
- **Pricing:** $99-739/month
- **API Access:** Yes

#### Option 3: Predis.ai
- **API Status:** API available (check current status)
- **Features:**
  - AI-powered content creation
  - Instagram/TikTok focus
  - Visual content generation
- **Pricing:** Varies
- **API Access:** Limited (may require Zapier)

#### Option 4: Make.com (formerly Integromat)
- **API Status:** Platform for connecting APIs
- **Features:**
  - Connect multiple services
  - Automation workflows
  - AI integrations available
- **Pricing:** $9-299/month
- **Use Case:** Orchestration layer between services

#### Recommendation: **Buffer AI** (for direct API + AI content) or **Make.com** (for orchestration)

---

## Task C: Paid Traffic Blueprint

### Google Ads Strategy ($10-20/day Budget)

#### High-Intent Keyword Categories

**1. Comparison Keywords (High Intent)**
- "best [tool type] 2025"
- "top [tool type] for [use case]"
- "[tool type] comparison"
- "[tool type] vs [competitor]"

**2. Problem-Solving Keywords**
- "how to [solve problem]"
- "[problem] solution"
- "best tool for [problem]"

**3. Review Keywords**
- "[tool type] review"
- "[tool type] alternatives"
- "is [tool] worth it"

#### Budget Allocation Strategy

**Daily Budget: $15/day (middle of range)**
- **Search Campaign:** $12/day (80% - high intent)
- **Display/Remarketing:** $3/day (20% - awareness)

**Monthly Budget: ~$450**
- Allows for meaningful data collection
- "Fail Fast" approach - can scale or kill quickly

#### Campaign Structure

**Campaign 1: High-Intent Search**
- **Match Types:** Exact + Phrase match
- **Keywords:** 10-15 high-intent keywords per niche
- **Budget:** $10-12/day
- **Goal:** Direct conversions to affiliate links

**Campaign 2: Brand Awareness**
- **Match Types:** Broad match (carefully managed)
- **Keywords:** 20-30 broader terms
- **Budget:** $3-5/day
- **Goal:** Build awareness, retarget later

#### Landing Page Strategy

**Single Landing Page per Niche:**
- Comparison-style content
- "Best [Tool Type] 2025" format
- Multiple affiliate links (top 3-5 tools)
- Clear value proposition
- Zero human interaction needed

---

## Recommended Tech Stack

### Phase 1 Architecture

```
Byron (Strategy) 
  ↓
Content Generation (AI)
  ↓
Webflow API / Make.com
  ↓
Landing Pages (Automated Updates)
  ↓
Google Ads (Paid Traffic)
  ↓
Affiliate Links (Zero-Touch)
```

### Tools Selection

1. **Landing Pages:** Webflow (API-first approach)
2. **Automation:** Make.com (orchestration) + Buffer AI (social)
3. **Traffic:** Google Ads + Bing Ads
4. **Tracking:** Google Analytics 4 + UTM parameters
5. **Affiliate Management:** PartnerStack API + Impact.com API

---

## Next Steps

1. **Validate Affiliate Programs:** Sign up for PartnerStack/Impact.com accounts
2. **Test API Access:** Verify Webflow API and automation tools
3. **Create Landing Page Template:** Build first comparison page
4. **Set Up Automation Pipeline:** Connect Byron → Webflow → Social
5. **Launch Test Campaign:** $10/day Google Ads test

---

## Risk Mitigation

- **Professional Conflict:** All niches selected avoid commercetools overlap
- **Budget Control:** Start with $10/day, scale only on positive ROI
- **Automation First:** Zero human interaction required
- **Fail Fast:** 2-week test cycles, kill underperformers quickly

