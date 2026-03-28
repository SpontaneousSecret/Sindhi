import json
import os

# Read parsed data
with open('parsed_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Extract unique categories
categories = sorted(list(set(p['category'] for p in products)))

# Create CATEGORIES constant
# We'll make keys uppercase snake_case for the constant
cat_obj = {}
for cat in categories:
    key = cat.upper().replace(' ', '_').replace('&', 'AND').replace('(', '').replace(')', '').replace('-', '_')
    key = "".join([c for c in key if c.isalnum() or c == '_'])
    cat_obj[key] = cat

# content for products.js
js_content = "// Imported Product Data\n// Source: Digitized products.docx\n// Total Count: 368\n\n"

js_content += "export const CATEGORIES = {\n"
for key, val in cat_obj.items():
    js_content += f"    {key}: '{val}',\n"
js_content += "};\n\n"

js_content += "export const PRODUCTS = " + json.dumps(products, indent=4) + ";\n"

output_path = r'c:\Users\ADMIN\Desktop\Miscel\Sindhi_Website\sindhi-react\src\data\products.js'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Successfully updated {output_path} with {len(products)} products and {len(categories)} categories.")
