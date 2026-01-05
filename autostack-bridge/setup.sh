#!/bin/bash
# Setup script for AutoStack Bridge

echo "🚀 Setting up AutoStack Bridge..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run data ingestion
echo "📊 Ingesting tool data..."
npm run ingest

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update .env with your actual affiliate links"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your affiliate links"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"

