import re
import json
import os

source_path = 'c:/Users/ADMIN/Desktop/Miscel/Sindhi_Website/js/services/data.js'
target_path = 'c:/Users/ADMIN/Desktop/Miscel/Sindhi_Website/sindhi-react/src/data/products.js'

with open(source_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CATEGORIES
cat_match = re.search(r'const CATEGORIES = ({[\s\S]*?});', content)
if not cat_match:
    print("Could not find CATEGORIES")
    exit(1)

categories_raw = cat_match.group(1)

# Extract REAL_PRODUCTS
prod_match = re.search(r'const REAL_PRODUCTS = (\[[\s\S]*?\]);', content)
if not prod_match:
    print("Could not find REAL_PRODUCTS")
    exit(1)

products_raw = prod_match.group(1)

# Parse JS object syntax to Python dict/list to ensure valid JSON (or just regex replace keys)
# Since the source is valid JS, we can try to just write it out, but let's formatting it as named exports.

output_content = f"""// Imported Product Data
// Source: Legacy data.js (Version 1.6)

export const CATEGORIES = {categories_raw};

export const PRODUCTS = {products_raw};
"""

# Ensure directory exists
os.makedirs(os.path.dirname(target_path), exist_ok=True)

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(output_content)

print(f"Data migrated successfully to {target_path}")
