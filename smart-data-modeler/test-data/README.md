# Test Data Files

This folder contains sample product data files for testing the Smart Data Modeler.

## Files

- **products.csv** - CSV format with 15 product records
- **products.json** - JSON format with 8 product records
- **products.xlsx** - Excel format with 9 product records (including header row)

## Data Structure

All files contain the following fields:

### Standard Fields (commercetools product entity)
- `name` - Product name
- `description` - Product description
- `sku` - Stock keeping unit
- `price` - Product price

### Product Info Attributes (default ON)
- `color` - Product color (enum: Blue, Red, Green, Black, White, Purple, Silver, Gray)
- `brand` - Brand name (enum: Nike, Dell, Logitech, Adidas, Lululemon, Apple, North Face)
- `size` - Size variant (enum: Medium, Large, Small, 15-inch, 17-inch, Standard, Size 10, Size 11, 42mm, 44mm, 30L, 40L)
- `material` - Material type (enum: Cotton, Aluminum, Plastic, Synthetic, TPE, Nylon)
- `category` - Product category (enum: Apparel, Electronics, Shoes, Fitness, Accessories)

### Technical Metadata (default OFF)
- `is_active` - Active status flag (boolean)
- `internal_id` - Internal identifier
- `legacy_code` - Legacy system code

## Testing Scenarios

These files are designed to test:

1. **Enum Detection**: Fields like `color`, `brand`, `category` have <10 unique values and should be detected as Enum types
2. **Attribute Bucketing**: Standard fields vs Product Info vs Technical Metadata
3. **80% Similarity Grouping**: Products share similar attributes within categories
4. **File Format Support**: CSV, JSON, and XLSX parsing

## Usage

Upload any of these files to the Smart Data Modeler at:
- https://modeler.dbcdatastudio.com
- https://smart-data-modeler-7ul23r45va-uc.a.run.app



