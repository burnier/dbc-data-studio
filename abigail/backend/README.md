# Abigail Arts & Oracles - FastAPI Backend

FastAPI backend for generating card readings and managing business logic.

## Setup

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# OR
.\venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

## Running

```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Start the server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at:
- API: `http://localhost:8000`
- Health check: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

Create a `.env` file in the backend directory:

```bash
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
LLM_ENABLED=false
LLM_PROVIDER=openai
LLM_MODEL=gpt-4
LLM_API_KEY=
ENVIRONMENT=development
```

## API Endpoints

### POST `/api/generate-reading`

Generate a card reading from 3 selected cards.

**Request:**
```json
{
  "card_ids": [0, 15, 32],
  "language": "en",
  "question": "What does my future hold?"
}
```

**Response:**
```json
{
  "reading_text": "The cards have spoken...",
  "cards": [
    {
      "id": 0,
      "name_key": "constancy",
      "meaning": "..."
    }
  ],
  "language": "en",
  "metadata": {
    "generation_method": "template",
    "generation_time_ms": 5,
    "llm_enabled": false
  }
}
```

## Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt       # Python dependencies
├── app/
│   ├── api/
│   │   └── readings.py    # API endpoints
│   ├── core/
│   │   └── config.py     # Configuration & settings
│   ├── models/
│   │   └── schemas.py    # Pydantic request/response models
│   ├── services/
│   │   └── reading_service.py  # Business logic
│   └── data/
│       └── cards.py       # Card data definitions
```

## TODO

- [ ] Add all 36 cards to `app/data/cards.py` based on reference material
- [ ] Implement LLM integration in `generate_reading_llm()`
- [ ] Add database for storing readings (optional)
- [ ] Add authentication/rate limiting (optional)


