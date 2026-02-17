FROM python:3.9-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directory for CSV files (fallback for local development)
RUN mkdir -p data

# Expose port (Cloud Run uses PORT env var, defaults to 8000)
EXPOSE 8000

# Run the application
# Cloud Run sets PORT environment variable, default to 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]

