import zipfile
import re
import sys

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as z:
            xml_content = z.read('word/document.xml').decode('utf-8')
            # Simple regex to remove xml tags
            text = re.sub('<[^<]+?>', '', xml_content)
            print(text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    read_docx(r"c:\Users\ADMIN\Desktop\Miscel\Sindhi_Website\Project Proposal.docx")
