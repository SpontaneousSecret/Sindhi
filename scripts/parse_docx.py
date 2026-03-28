import zipfile
import re
import json
import html

def parse_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml').decode('utf-8')
    except Exception as e:
        print(f"Error reading docx: {e}")
        return {}
    
    # regex for paragraphs
    paragraphs = re.findall(r'<w:p .*?>(.*?)</w:p>', xml_content)
    
    lines = []
    for p in paragraphs:
        texts = re.findall(r'<w:t.*?>(.*?)</w:t>', p)
        if texts:
            line_text = "".join(texts).strip()
            if line_text:
                lines.append(html.unescape(line_text))

    categories = {}
    current_category = "Uncategorized"
    
    total_products_found = 0

    for i, line in enumerate(lines):
        clean_line = line.strip()
        
        # Check for Category (Folder Icon)
        if '📁' in clean_line:
            cat_name = clean_line.replace('📁', '').strip()
            if cat_name:
                current_category = cat_name
                if current_category not in categories:
                    categories[current_category] = []
            continue

        # Split line by '•' to handle multiple items in one line
        # Use regex to split by bullet point variation if needed, but '•' seems consistent in dump
        
        # NOTE: Some lines might START with •, so filter empty splits
        parts = [p.strip() for p in clean_line.split('•') if p.strip()]
        
        # If no bullets found, treat whole line as one part (if it has price)
        if not parts and '₹' in clean_line:
            parts = [clean_line]
        
        for part in parts:
            if '₹' in part:
                 # Process this part as a product
                 # Format: Name — Weight — ₹Price
                 
                 # Normalize separators
                 content = part.replace('—', '-').replace('–', '-').replace('−', '-')
                 
                 product_segments = [s.strip() for s in content.split('-')]
                 
                 # Price extraction
                 price_str = product_segments[-1]
                 price = 0
                 try:
                     # Remove non-numeric except dot ? Actually just extract digits
                     # "₹ 250" -> 250
                     matches = re.findall(r'\d+', price_str)
                     if matches:
                         price = int(matches[0])
                 except:
                     price = 0
                 
                 final_name = content # fallback
                 
                 if len(product_segments) >= 3:
                     # Name - Weight - Price
                     weight = product_segments[-2]
                     name = " - ".join(product_segments[:-2])
                     final_name = f"{name} ({weight})"
                 elif len(product_segments) == 2:
                     # Name - Price
                     name = product_segments[0]
                     final_name = name
                 
                 # Image Logic
                 cat_lower = current_category.lower()
                 image_path = "assets/namkeen.png"
                 
                 if any(x in cat_lower for x in ['dry', 'nut', 'almond', 'kaju', 'pista']):
                    image_path = "assets/dryfruits.png"
                 elif 'chocolate' in cat_lower:
                    image_path = "assets/chocolates.png"
                 elif 'cookie' in cat_lower or 'rusk' in cat_lower:
                    image_path = "assets/cookies.png" # Assuming existing or generic

                 product = {
                    "name": final_name,
                    "category": current_category,
                    "price": price,
                    "image": image_path
                 }
                 
                 if current_category not in categories:
                     categories[current_category] = []
                 categories[current_category].append(product)
                 total_products_found += 1

    return categories, total_products_found

docx_path = r'c:\Users\ADMIN\Desktop\Miscel\Sindhi_Website\Digitized products.docx'
data, count = parse_docx(docx_path)

print(f"Total Products Found: {count}")
for cat, items in data.items():
    print(f"{cat}: {len(items)}")

# Flatten
full_list = []
for cat, items in data.items():
    full_list.extend(items)

with open('parsed_products.json', 'w', encoding='utf-8') as f:
    json.dump(full_list, f, indent=4)
