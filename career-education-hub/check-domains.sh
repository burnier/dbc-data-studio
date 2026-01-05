#!/bin/bash
# Domain Availability Checker for .ai domains
# Uses whois to check if domains are available

echo "🔍 Checking .ai domain availability..."
echo ""

# Array of domains to check (from Byron's permutation matrix + specific suggestions)
domains=(
  # Byron's specific suggestions
  "OrchestrateFlow.ai"
  "AgenticPillar.ai"
  "ShipLogic.ai"
  "KineticAgent.ai"
  "SimplyStack.ai"
  
  # From Permutation Matrix - Action Stack
  "DeployAgent.ai"
  "DeployLogic.ai"
  "DeployStack.ai"
  "DeployNode.ai"
  "DeployCore.ai"
  "RunAgent.ai"
  "RunLogic.ai"
  "RunStack.ai"
  "RunNode.ai"
  "RunCore.ai"
  "OrchestrateAgent.ai"
  "OrchestrateLogic.ai"
  "OrchestrateStack.ai"
  "OrchestrateNode.ai"
  "OrchestrateCore.ai"
  "ShipAgent.ai"
  "ShipLogic.ai"
  "ShipStack.ai"
  "ShipNode.ai"
  "ShipCore.ai"
  "KineticAgent.ai"
  "KineticLogic.ai"
  "KineticStack.ai"
  "KineticNode.ai"
  "KineticCore.ai"
  
  # From Permutation Matrix - Authority Stack
  "PureAutomation.ai"
  "PureAgentic.ai"
  "PureLogic.ai"
  "PrimeAutomation.ai"
  "PrimeAgentic.ai"
  "PrimeLogic.ai"
  "SolidAutomation.ai"
  "SolidAgentic.ai"
  "SolidLogic.ai"
  "RealAutomation.ai"
  "RealAgentic.ai"
  "RealLogic.ai"
  "TrueAutomation.ai"
  "TrueAgentic.ai"
  "TrueLogic.ai"
  "PureLayer.ai"
  "PureHub.ai"
  "PurePath.ai"
  "PrimeLayer.ai"
  "PrimeHub.ai"
  "PrimePath.ai"
  
  # From Permutation Matrix - Utility Stack
  "MyAgentic.ai"
  "MyWorkflow.ai"
  "MyLogic.ai"
  "GetAgentic.ai"
  "GetWorkflow.ai"
  "GetLogic.ai"
  "TryAgentic.ai"
  "TryWorkflow.ai"
  "TryLogic.ai"
  "UseAgentic.ai"
  "UseWorkflow.ai"
  "UseLogic.ai"
  "SimplyAgentic.ai"
  "SimplyWorkflow.ai"
  "SimplyLogic.ai"
  "MyBridge.ai"
  "MyPillar.ai"
  "MyVault.ai"
  "GetBridge.ai"
  "GetPillar.ai"
  "GetVault.ai"
  "SimplyBridge.ai"
  "SimplyPillar.ai"
  "SimplyVault.ai"
)

available_domains=()
checked=0

for domain in "${domains[@]}"; do
  # Convert to lowercase for whois lookup
  domain_lower=$(echo "$domain" | tr '[:upper:]' '[:lower:]')
  
  # Check if whois command exists
  if ! command -v whois &> /dev/null; then
    echo "❌ Error: 'whois' command not found. Please install it first."
    echo "   On macOS: brew install whois"
    exit 1
  fi
  
  # Query whois for .ai domain
  # .ai domains are managed by AI Registry, so we check for "No match" or similar
  whois_result=$(whois "$domain_lower" 2>/dev/null)
  
  # Check if domain is available
  # .ai domains typically return "No match" or "Status: Available" when available
  if echo "$whois_result" | grep -qiE "(no match|not found|status: available|domain not found|no entries found)" || \
     [ -z "$whois_result" ] || \
     echo "$whois_result" | grep -qiE "(query status:.*available|domain status:.*available)"; then
    available_domains+=("$domain")
    echo "✅ AVAILABLE: $domain"
  else
    # Check if it's registered (has registrar info, status, etc.)
    if echo "$whois_result" | grep -qiE "(registrar|status:.*active|domain name:|registry)" && \
       ! echo "$whois_result" | grep -qiE "(no match|not found|status: available)"; then
      echo "❌ TAKEN: $domain"
    else
      # If we can't determine, mark as uncertain
      echo "⚠️  UNCERTAIN: $domain (check manually)"
    fi
  fi
  
  checked=$((checked + 1))
  
  # Rate limiting - small delay to avoid being blocked
  sleep 0.5
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total domains checked: $checked"
echo "Available domains found: ${#available_domains[@]}"
echo ""

if [ ${#available_domains[@]} -gt 0 ]; then
  echo "✅ AVAILABLE DOMAINS (Top 5 for Daniel):"
  echo ""
  count=0
  for domain in "${available_domains[@]}"; do
    if [ $count -lt 5 ]; then
      echo "   $((count + 1)). $domain"
      count=$((count + 1))
    fi
  done
  
  if [ ${#available_domains[@]} -gt 5 ]; then
    echo ""
    echo "   ... and ${#available_domains[@]} more available domains"
  fi
else
  echo "❌ No available domains found in this batch."
  echo "   Try running with different combinations or check manually."
fi

echo ""
echo "💡 Next step: Purchase on Spaceship.com"

