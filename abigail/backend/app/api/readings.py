"""
API endpoints for card readings.
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import GenerateReadingRequest, GenerateReadingResponse, CardInfo
from app.services.reading_service import generate_reading
from app.data.cards import CARDS
from app.core.config import settings
import time

router = APIRouter()


@router.post("/generate-reading", response_model=GenerateReadingResponse, summary="Generate a card reading")
async def generate_card_reading(request: GenerateReadingRequest):
    """
    Generate a card reading based on 3 selected cards.
    
    Args:
        request: GenerateReadingRequest with card_ids, language, and question
    
    Returns:
        GenerateReadingResponse with reading text, card info, and metadata
    """
    start_time = time.time()
    try:
        reading_text = generate_reading(
            request.card_ids, request.language, request.question
        )

        # Build card information list
        selected_card_details = []
        for card_id in request.card_ids:
            card = CARDS.get(card_id)
            if card:
                selected_card_details.append(
                    CardInfo(
                        id=card.id,
                        name_key=card.name_key,
                        meaning=card.short_meaning.get(
                            request.language, card.short_meaning["en"]
                        ),
                    )
                )
            else:
                # Handle case where card_id is not found (though validation should prevent this)
                selected_card_details.append(
                    CardInfo(id=card_id, name_key="unknown", meaning="Unknown card")
                )

        end_time = time.time()
        metadata = {
            "generation_method": "template" if not settings.LLM_ENABLED else "llm",
            "generation_time_ms": round((end_time - start_time) * 1000),
            "llm_enabled": settings.LLM_ENABLED,
        }

        return GenerateReadingResponse(
            reading_text=reading_text,
            cards=selected_card_details,
            language=request.language,
            metadata=metadata,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

