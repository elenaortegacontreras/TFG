# make file_to_text file_name=01_ikea.jpg

import sys
import re
from PIL import Image
import pytesseract
import pdfplumber


if len(sys.argv) < 2:
    print("Uso: python ocr.py <nombre_imagen_pdf>")
    sys.exit(1)


text = ""

file_name = sys.argv[1]
name = re.search(r'(?P<name>.*).jpg', file_name).group('name')

if name == None:
    name = re.search(r'(?P<name>.*).pdf', file_name).group('name')
    if name == None:
        print("Error al extraer el nombre del archivo")
        sys.exit(1)
    
    with pdfplumber.open(f'app/tests/tickets_PDFs/{file_name}') as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + '\n' 
else:
    image_jpg = Image.open(f'app/tests/tickets_images/{file_name}')
    text = pytesseract.image_to_string(image_jpg)


print(text)

# with open(f'app/tests/tickets_text/{name}.txt', 'w') as file:
#         file.write(text)

# with open(f'app/scripts/{name}.txt', 'w') as file:
#     file.write(text)



