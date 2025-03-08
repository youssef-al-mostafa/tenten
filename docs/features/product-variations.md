# Product Variations

## Overview
The product variation system allows products to have multiple attributes (like color, size) with different combinations, prices, and inventory levels.

## Key Features

### Variation Combinations
- Products can have multiple variation types (e.g., color, size)
- System automatically generates all possible combinations (e.g., 3 colors × 3 sizes = 9 combinations)
- Each combination can have its own:
  - Price (defaults to original product price if not specified)
  - Quantity/inventory (defaults to original product quantity if not specified)
  - SKU
  - Images

### URL Persistence
- When a user selects specific variations (e.g., black pants, size L), those selections are stored in the URL
- This enables direct sharing of specific product variations via URL

## Implementation Details

### Database Implementation
  id - Primary key
  product_id - Foreign key to products table
  name - Combined name (e.g., "Small / Red", "Medium / Blue")
  variation_type_option_ids - JSON array of option IDs (e.g., [1, 4], [2, 5])
  quantity - Available stock for this specific variation
  price - Price specific to this variation
  created_at - Timestamp
  updated_at - Timestamp

  #### This approach uses:
   A composite naming convention (Size / Color)
   JSON arrays to store related option IDs
   Independent pricing and inventory for each variation

### Frontend Implementation
- Dynamic URL updates using History API when variations are selected
- JavaScript handlers to update product details based on selected combination
- SEO considerations for variation URLs

### Technical Considerations
- Efficient query patterns for retrieving variations
- Cache strategies for popular variations
- Inventory management across variations

### Implementation Notes

Based on the database schema implementation, the system:

1. **Uses JSON Arrays for Option Storage**: The `variation_type_option_ids` column stores option IDs as a JSON array (e.g., `[1, 4]` represents Size ID 1 and Color ID 4)

2. **Naming Convention**: Combines attributes with a separator (e.g., "Small / Red")

3. **Product-Specific Pricing**: Each variation can have its own price, allowing for pricing differences between variations (note the price difference between Small/Red at 25.0000 and other variations at 29.0000)

4. **Variation-Specific Inventory**: Each variation tracks its own quantity separately

5. **Uses Laravel's JSON Column Capabilities**: To query and manage the `variation_type_option_ids` field 
