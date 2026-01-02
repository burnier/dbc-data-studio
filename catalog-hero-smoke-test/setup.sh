#!/bin/bash
# Setup script for CatalogHero Smoke Test

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

echo "✅ Setup complete! Virtual environment is activated."
echo "To run the app: python main.py"
echo "To deactivate venv later: deactivate"

