"""
Translation service using free deep-translator library
"""
from deep_translator import GoogleTranslator
from typing import Dict
import time
import logging

logger = logging.getLogger(__name__)


class TranslationService:
    """Free translation service using deep-translator"""
    
    def __init__(self):
        self.translator = GoogleTranslator(source='en', target='pt')
        self._cache: Dict[str, str] = {}
    
    def translate_to_portuguese(self, text: str) -> str:
        """
        Translate English text to Brazilian Portuguese
        
        Args:
            text: English text to translate
            
        Returns:
            Portuguese translation
        """
        # Check cache first
        if text in self._cache:
            logger.debug(f"Cache hit for: {text}")
            return self._cache[text]
        
        try:
            # Add small delay to avoid rate limiting
            time.sleep(0.5)
            
            translation = self.translator.translate(text)
            
            # Cache the result
            self._cache[text] = translation
            logger.info(f"Translated: '{text}' -> '{translation}'")
            
            return translation
            
        except Exception as e:
            logger.error(f"Translation failed for '{text}': {e}")
            # Fallback: return original text
            return text
    
    def translate_batch(self, texts: list[str]) -> Dict[str, str]:
        """
        Translate multiple texts
        
        Args:
            texts: List of English texts
            
        Returns:
            Dictionary mapping original -> translated
        """
        results = {}
        for text in texts:
            results[text] = self.translate_to_portuguese(text)
        return results
    
    def clear_cache(self):
        """Clear translation cache"""
        self._cache.clear()
        logger.info("Translation cache cleared")


