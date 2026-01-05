#!/bin/bash
# Domain Availability Checker for .com domains
# Priority domains for DBC Data Studio

echo "🔍 Checking .com domain availability for DBC Data Studio..."
echo ""

domains=(
  "DBCDataStudio.com"
  "DBCDataAcademy.com"
  "DataCareerBridge.com"
  "AIPathLab.com"
  "EngCareerStack.com"
  "DBCSkillBridge.com"
)

available_domains=()
taken_domains=()

for domain in "${domains[@]}"; do
  # Convert to lowercase for whois lookup
  domain_lower=$(echo "$domain" | tr '[:upper:]' '[:lower:]')
  
  # Check if whois command exists
  if ! command -v whois &> /dev/null; then
    echo "❌ Error: 'whois' command not found. Please install it first."
    echo "   On macOS: brew install whois"
    exit 1
  fi
  
  # Query whois for .com domain
  whois_result=$(whois "$domain_lower" 2>/dev/null)
  
  # Check if domain is available
  # .com domains typically return "No match" or "NOT FOUND" when available
  if echo "$whois_result" | grep -qiE "(no match|not found|status: available|domain not found|no entries found|no data found|not registered)" || \
     [ -z "$whois_result" ]; then
    available_domains+=("$domain")
    echo "✅ AVAILABLE: $domain"
  else
    # Check if it's registered (has registrar info, status, etc.)
    if echo "$whois_result" | grep -qiE "(registrar|status:.*active|domain name:|registry|registrant|name server|nameserver)" && \
       ! echo "$whois_result" | grep -qiE "(no match|not found|status: available|not registered)"; then
      taken_domains+=("$domain")
      echo "❌ TAKEN: $domain"
    else
      # If we can't determine, mark as uncertain
      echo "⚠️  UNCERTAIN: $domain (check manually)"
    fi
  fi
  
  # Rate limiting - small delay to avoid being blocked
  sleep 0.5
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total domains checked: ${#domains[@]}"
echo "Available domains: ${#available_domains[@]}"
echo "Taken domains: ${#taken_domains[@]}"
echo ""

if [ ${#available_domains[@]} -gt 0 ]; then
  echo "✅ AVAILABLE DOMAINS (Ready for Purchase):"
  echo ""
  for i in "${!available_domains[@]}"; do
    domain="${available_domains[$i]}"
    if [ "$domain" == "DBCDataStudio.com" ]; then
      echo "   $((i + 1)). $domain ⭐ PRIMARY GOAL"
    else
      echo "   $((i + 1)). $domain"
    fi
  done
else
  echo "❌ No available domains found in this batch."
fi

if [ ${#taken_domains[@]} -gt 0 ]; then
  echo ""
  echo "❌ TAKEN DOMAINS:"
  for domain in "${taken_domains[@]}"; do
    echo "   - $domain"
  done
fi

echo ""
echo "💡 Next step: Purchase on preferred registrar (Namecheap, GoDaddy, etc.)"

