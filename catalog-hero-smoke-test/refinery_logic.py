"""
Refinery Logic for CatalogHero
Handles the transformation of commercetools JSON to Shopify CSV format.
"""


def flatten_ct_json(json_input, locale="en"):
    """
    Flatten commercetools JSON structure into a format suitable for Shopify CSV.

    Args:
        json_input: The commercetools JSON data (dict or list of dicts)
        locale: The locale code to use for localized fields (default: 'en')

    Returns:
        A flattened structure ready for CSV conversion

    Note: This is a mock implementation for the smoke test.
    The full implementation will handle:
    - Product attributes flattening
    - Localized field extraction
    - Variant expansion
    - Image URL extraction
    - Price formatting
    - Category mapping
    """
    # Mock implementation - to be fleshed out
    if isinstance(json_input, list):
        # Handle list of products
        return [flatten_single_product(item, locale) for item in json_input]
    elif isinstance(json_input, dict):
        # Handle single product
        return flatten_single_product(json_input, locale)
    else:
        raise ValueError("json_input must be a dict or list of dicts")


def flatten_single_product(product, locale="en"):
    """
    Flatten a single commercetools product.

    Args:
        product: A single commercetools product dict
        locale: The locale code to use

    Returns:
        A flattened dict with Shopify-compatible structure
    """
    # Mock structure - placeholder for actual implementation
    flattened = {
        "id": product.get("id", ""),
        "name": extract_localized_value(product.get("name", {}), locale),
        "description": extract_localized_value(product.get("description", {}), locale),
        "slug": extract_localized_value(product.get("slug", {}), locale),
        # Additional fields will be added in full implementation
    }
    return flattened


def extract_localized_value(localized_dict, locale="en"):
    """
    Extract a value from a commercetools localized field.

    Args:
        localized_dict: A dict with locale keys (e.g., {'en': 'Hello', 'de': 'Hallo'})
        locale: The locale code to extract

    Returns:
        The value for the specified locale, or empty string if not found
    """
    if isinstance(localized_dict, dict):
        return localized_dict.get(locale, localized_dict.get("en", ""))
    return str(localized_dict) if localized_dict else ""
