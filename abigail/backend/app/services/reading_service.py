"""
Reading generation service.
Handles the business logic for generating card readings.
"""
from typing import Dict
from app.data.cards import get_cards, Card
from app.core.config import settings


# Template strings for reading synthesis in different languages
SYNTHESIS_TEMPLATES: Dict[str, Dict[str, str]] = {
    "en": {
        "start": "The cards have spoken. The first card",
        "connector": "reveals that",
        "middle": "However, the second card",
        "warns": "warns of",
        "end": "Finally, the third card",
        "reveals": "reveals that",
        "conclusion": "These three cards together form a powerful message for your journey ahead.",
    },
    "de": {
        "start": "Die Karten haben gesprochen. Die erste Karte",
        "connector": "zeigt, dass",
        "middle": "Die zweite Karte",
        "warns": "warnt vor",
        "end": "Schließlich zeigt die dritte Karte",
        "reveals": "dass",
        "conclusion": "Diese drei Karten bilden zusammen eine kraftvolle Botschaft für deine Reise voraus.",
    },
    "pt": {
        "start": "As cartas falaram. A primeira carta",
        "connector": "revela que",
        "middle": "No entanto, a segunda carta",
        "warns": "adverte sobre",
        "end": "Finalmente, a terceira carta",
        "reveals": "revela que",
        "conclusion": "Essas três cartas juntas formam uma mensagem poderosa para sua jornada à frente.",
    },
    "hu": {
        "start": "A kártyák megszólaltak. Az első kártya",
        "connector": "azt mutatja, hogy",
        "middle": "A második kártya azonban",
        "warns": "figyelmeztet",
        "end": "Végül a harmadik kártya",
        "reveals": "azt mutatja, hogy",
        "conclusion": "Ez a három kártya együtt erős üzenetet alkot az előtted álló útra.",
    },
}


def generate_reading_template(
    cards: list[Card], language: str, question: str
) -> str:
    """
    Generate a reading using template-based synthesis.
    
    Args:
        cards: List of 3 Card objects
        language: Language code (en, de, pt, hu)
        question: User's question (currently not used in template, but reserved for LLM)
    
    Returns:
        Generated reading text
    """
    if len(cards) != 3:
        raise ValueError("Exactly 3 cards are required for a reading")

    templates = SYNTHESIS_TEMPLATES.get(language, SYNTHESIS_TEMPLATES["en"])
    card1, card2, card3 = cards
    meaning1 = card1.short_meaning.get(language, card1.short_meaning["en"])
    meaning2 = card2.short_meaning.get(language, card2.short_meaning["en"])
    meaning3 = card3.short_meaning.get(language, card3.short_meaning["en"])

    reading = (
        f"{templates['start']} {templates['connector']} {meaning1}. "
        f"{templates['middle']} {templates['warns']} {meaning2}. "
        f"{templates['end']} {templates['reveals']} {meaning3}. "
        f"{templates['conclusion']}"
    )
    return reading


def generate_reading_llm(cards: list[Card], language: str, question: str) -> str:
    """
    Generate a reading using LLM (placeholder for future implementation).
    
    Args:
        cards: List of 3 Card objects
        language: Language code
        question: User's question
    
    Returns:
        Generated reading text
    """
    # TODO: Implement LLM integration
    # For now, fall back to template-based generation
    return generate_reading_template(cards, language, question)


def generate_reading(card_ids: list[int], language: str, question: str) -> str:
    """
    Main function to generate a reading.
    Chooses between template and LLM based on configuration.
    
    Args:
        card_ids: List of 3 card IDs (0-35)
        language: Language code (en, de, pt, hu)
        question: User's question
    
    Returns:
        Generated reading text
    """
    cards = get_cards(card_ids)
    if len(cards) != 3:
        raise ValueError("Exactly 3 cards are required for a reading")

    if settings.LLM_ENABLED and settings.LLM_API_KEY:
        return generate_reading_llm(cards, language, question)
    else:
        return generate_reading_template(cards, language, question)

