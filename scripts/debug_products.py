import zipfile
import re
import html

def analyze_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml').decode('utf-8')
    except Exception as e:
        print(f"Error: {e}")
        return

    paragraphs = re.findall(r'<w:p .*?>(.*?)</w:p>', xml_content)
    
    all_lines = []
    for p in paragraphs:
        texts = re.findall(r'<w:t.*?>(.*?)</w:t>', p)
        if texts:
            line_text = "".join(texts).strip()
            if line_text:
                all_lines.append(html.unescape(line_text))

    print(f"Total non-empty lines found: {len(all_lines)}")
    
    potential_misses = []
    captured_count = 0
    
    for line in all_lines:
        clean = line.strip()
        # My previous logic: if '₹' in clean
        if '₹' in clean:
            captured_count += 1
        elif '📁' in clean:
            pass # Category
        elif len(clean) > 3 and any(char.isdigit() for char in clean): 
            # If it has numbers but no ₹, it might be a missed price
            # or it might just be text like "Since 1990"
            potential_misses.append(clean)
            
    print(f"Lines with '₹' (Captured): {captured_count}")
    print(f"Potential Misses (Has digits, no '₹'): {len(potential_misses)}")
    
    print("\n--- Potential Missed Items (First 20) ---")
    for l in potential_misses[:20]:
        print(l)
        
    print("\n--- Potential Missed Items (Last 20) ---")
    for l in potential_misses[-20:]:
        print(l)

analyze_docx(r'c:\Users\ADMIN\Desktop\Miscel\Sindhi_Website\Digitized products.docx')
