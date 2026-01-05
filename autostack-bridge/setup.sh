#!/bin/bash
# Setup script for DBC Data Studio - AI Career & Education Hub

echo "🚀 Setting up DBC Data Studio..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run data ingestion
echo "📊 Ingesting learning path data..."
npm run ingest

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update .env with your Impact.com affiliate links"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your Impact.com affiliate links"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "📋 Impact.com Setup:"
echo "   - Add verification file to public/ folder when provided"
echo "   - Set up professional email (daniel@yourdomain.com)"

