"""
Pydantic models for API request and response schemas.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


class GenerateReadingRequest(BaseModel):
    """Request model for generating a card reading."""
    card_ids: List[int] = Field(
        ...,
        description="List of 3 card IDs (0-35) selected for the reading",
        min_length=3,
        max_length=3,
    )
    language: str = Field(
        ...,
        description="Language code for the reading (en, de, pt, hu)",
        pattern="^(en|de|pt|hu)$",
    )
    question: str = Field(
        ...,
        description="User's question or intention for the reading",
        min_length=1,
        max_length=500,
    )

    class Config:
        json_schema_extra = {
            "example": {
                "card_ids": [0, 15, 32],
                "language": "en",
                "question": "What does my future hold?",
            }
        }


class CardInfo(BaseModel):
    """Information about a single card."""
    id: int = Field(..., description="Card ID (0-35)")
    name_key: str = Field(..., description="Card name key for translation lookup")
    meaning: str = Field(..., description="Short meaning of the card in the requested language")


class GenerateReadingResponse(BaseModel):
    """Response model for a generated reading."""
    reading_text: str = Field(
        ..., description="The generated reading text synthesizing the 3 cards"
    )
    cards: List[CardInfo] = Field(
        ..., description="Information about the 3 cards used in the reading"
    )
    language: str = Field(..., description="Language code used for the reading")
    metadata: Optional[dict] = Field(
        default=None,
        description="Additional metadata (e.g., LLM model used, generation time)",
    )

    class Config:
        json_schema_extra = {
            "example": {
                "reading_text": "The cards have spoken. The first card reveals that...",
                "cards": [
                    {
                        "id": 0,
                        "name_key": "constancy",
                        "meaning": '"Eye of God", means work and obligations...',
                    }
                ],
                "language": "en",
                "metadata": {"generation_method": "template", "generation_time_ms": 5},
            }
        }



