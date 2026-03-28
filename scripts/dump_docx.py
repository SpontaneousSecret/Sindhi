import zipfile
import re
import html

def analyze_docx_verbose(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml').decode('utf-8')
    except Exception as e:
        print(f"Error: {e}")
        return

    # Extract all paragraphs
    # Paragraphs handle <w:p>
    paragraphs = re.findall(r'<w:p .*?>(.*?)</w:p>', xml_content)
    
    with open('docx_full_dump.txt', 'w', encoding='utf-8') as f:
        line_count = 0
        for p in paragraphs:
            texts = re.findall(r'<w:t.*?>(.*?)</w:t>', p)
            if texts:
                line_text = "".join(texts).strip()
                clean_text = html.unescape(line_text)
                if clean_text:
                    line_count += 1
                    f.write(f"{line_count}: {clean_text}\n")
    
    print(f"Dumped {line_count} lines to docx_full_dump.txt")

analyze_docx_verbose(r'c:\Users\ADMIN\Desktop\Miscel\Sindhi_Website\Digitized products.docx')
