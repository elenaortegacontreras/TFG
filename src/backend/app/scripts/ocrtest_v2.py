import sys
import re
from PIL import Image
import pytesseract

###########################################################################################
# Nombre de la tienda
###### returns shop name or 'desconocido' if not found
def get_shop_name(text):
    shop_name = 'desconocido'

    match = re.search(r'\S.+\n.*\n', text)

    if match:
        shop_name_str = match.group(0).replace('\n', ' ').replace('\r', ' ')

        if shop_name_str != ' ':
            shop_name = shop_name_str

    return shop_name

###########################################################################################
# Método de pago
###### returns 'tarjeta', 'efectivo' or 'desconocido' if not found
def get_payment_method(text):
    payment_method = 'desconocido'

    if 'tarjeta' in text:
        payment_method = 'tarjeta'
    elif 'efectivo' in text or 'contado' in text:
        payment_method = 'efectivo'
    else:
        count_tarjeta = 0
        count_efectivo = 0

    # Dicts of keywords
        keywords_tarjeta = ['visa', 'mastercard', 'debito', 'debit', 'crédito', 'crédito', 'credit', 'contactless', 'nfc', 'cuenta','trj', 'jeta', 'tarj', 'tanjeta', 'credito']
        keywords_efectivo = ['cambio', 'entrega', 'entregado', 'efect', 'ent'  ]

    # Counters
        count_tarjeta = sum(text.count(keyword) for keyword in keywords_tarjeta)
        count_efectivo = sum(text.count(keyword) for keyword in keywords_efectivo)

        if count_tarjeta >= 2 and count_tarjeta > count_efectivo:
            payment_method = 'tarjeta'
            # print('       Keywords found:', count_tarjeta)
        elif count_efectivo >= 2 and count_efectivo > count_tarjeta:
            payment_method = 'efectivo'
            # print('       Keywords found:', count_efectivo)
            
    return payment_method

###########################################################################################
# Fecha
###### returns date with dd/mm/aaaa format o 'desconocido' if not found
def verify_unique_date(dates_str):    
    # print('       Analizing Dates:', dates_str, '. Length:',len(dates_str))
    if len(dates_str) == 0:
        return False
    elif len(dates_str) > 1:
        if not all(date == dates_str[0] for date in dates_str):
            return False
    return True

def verify_date(date_str, case):
    if case == 1: # dd/mm/aaaa, dd-mm-aaaa, dd.mm.aaaa
        if not re.match(r'(0[1-9]|[12][0-9]|3[01])', date_str[0:2]):
            return False
        if not re.match(r'(0[1-9]|1[0-2])', date_str[3:5]):
            return False
        # solo fechas de 2024 en adelante
        if not re.match(r'20[2-9][0-9]', date_str[6:10]) or (int(date_str[6:10]) < 2024):
            return False 
    elif case == 2: # dd/mm/aa, dd-mm-aa, dd.mm.aa
        if not re.match(r'(0[1-9]|[12][0-9]|3[01])', date_str[0:2]):
            return False
        if not re.match(r'(0[1-9]|1[0-2])', date_str[3:5]):
            return False
        # solo fechas de 20 ->24<- en adelante
        if not re.match(r'[2-9][0-9]', date_str[6:8]) or (int(date_str[6:8]) < 24):
            return False
    elif case == 3:  # aaaa-mm-dd, aaaa/mm/dd, aaaa.mm.dd
        # solo fechas de 2024 en adelante
        if not re.match(r'20[2-9][0-9]', date_str[0:4]) or (int(date_str[0:4]) < 2024):
            return False
        if not re.match(r'(0[1-9]|1[0-2])', date_str[5:7]):
            return False
        if not re.match(r'(0[1-9]|[12][0-9]|3[01])', date_str[8:10]):
            return False
        
    return True
    
def purge_dates_match(text, match, case):
    valid_dates = []
    for date_str in match:
        if verify_date(date_str, case):
            if(case == 1):
                match_return_date = re.search(r'dev.*\d{2}[./-]\d{2}[./-]\d{4}', text) # fecha devolución
            elif(case == 2):
                match_return_date = re.search(r'dev.*\D?\d{2}[./-]\d{2}[./-]\d{2}\D?', text) # fecha devolución
            elif(case == 3):
                match_return_date = re.search(r'dev.*\d{4}[./-]\d{2}[./-]\d{2}\D?', text) # fecha devolución
                     
            if match_return_date:
                if date_str not in match_return_date.group(0):
                    valid_dates.append(date_str)
            else:
                valid_dates.append(date_str)

    return valid_dates

def get_date(text):
    date = 'desconocido'

    match = re.findall(r'\d{2}[./-]\d{2}[./-]\d{4}', text) # dd/mm/aaaa, dd-mm-aaaa, dd.mm.aaaa
    match = purge_dates_match(text, match, 1)
    if match:
        if verify_unique_date(match):
            date_str = match[0]
            date = date_str[0:2] + '/' + date_str[3:5] + '/' + date_str[6:10]

    if date == 'desconocido':
        starts_w_char = True
        ends_w_char = True
        match_start = re.findall(r'\D?\d{2}[./-]\d{2}[./-]\d{2}', text)
        if match_start:
            if len(match_start[0]) == 8: starts_w_char = False
        match_end = re.findall(r'\d{2}[./-]\d{2}[./-]\d{2}\D?', text)
        if match_end:
            if len(match_end[0]) == 8: ends_w_char = False

        match = re.findall(r'\D?\d{2}[./-]\d{2}[./-]\d{2}\D?', text) # dd/mm/aa, dd-mm-aa, dd.mm.aa
        if match and match_start and match_end:
            if (starts_w_char and ends_w_char) or (starts_w_char and not ends_w_char):
                match = [date[1:9] for date in match] 
            elif ends_w_char and not starts_w_char:    
                match = [date[0:8] for date in match]
            match = purge_dates_match(text, match, 2)
            if verify_unique_date(match):
                date_str = match[0]
                date = date_str[0:2] + '/' + date_str[3:5] + '/20' + date_str[6:8]
        
        if date == 'desconocido':
            match = re.findall(r'\d{4}[./-]\d{2}[./-]\d{2}\D?', text) # aaaa-mm-dd, aaaa/mm/dd, aaaa.mm.dd
            if match:
                match = [date[:10] for date in match]
                match = purge_dates_match(text, match, 3)
                if verify_unique_date(match):
                    date_str = match[0]
                    date = date_str[8:10] + '/' + date_str[5:7] + '/' + date_str[0:4]  

    return date

###########################################################################################
# Total
######
# para averiguar el total tenemos que buscar la palabra 'total' y luego buscar el número que le sigue
def get_iva_prices(text):
    percentage_prices = []

    match_x_iva = re.findall(r'[\n\s]iva[\s\S]*?\d+[.,]\s*\d?\d', text)
    match_iva_x = re.findall(r'iva[\n\s][\s\S]*?\d+[.,]\s*\d?\d', text)
    match_iva_perc = re.findall(r'%[\s\S]*?\d+[.,]\s*\d?\d', text)
    
    match_iva_prices = match_x_iva + match_iva_x + match_iva_perc

    print('       IVA candidates:', match_iva_prices)

    #eliminar de match_iva_prices los que incluyan la palabra total
    match_iva_prices = [price for price in match_iva_prices if not re.search(r'total[^\n]', price)]

    print('       IVA candidates:', match_iva_prices)
                        
    for i in range(len(match_iva_prices)):
        match = re.search(r'\d+[.,]\s*\d?\d', match_iva_prices[i])
        match_iva_prices[i] = match.group(0) if match else None

    match_iva_prices = [price for price in match_iva_prices if price is not None]

    if match_iva_prices:
        percentage_prices = [float(price.replace('\n', '').replace(',', '.').replace('€', '').replace(' ', '').replace('e', '').replace('%', '')) for price in match_iva_prices]
    
    match_percentage_prices = re.findall(r'\d+[.,]\s*\d?\d\s*%', text)
    if match_percentage_prices:
        all_perc = [float(price.replace('\n', '').replace(',', '.').replace('€', '').replace(' ', '').replace('e', '').replace('%', '')) for price in match_percentage_prices]
        percentage_prices += all_perc

    return percentage_prices

def get_discount_prices(text):
    discount_prices = []

    match_discount_prices = re.findall(r'desc[\s\S]*?\d+[.,]\s*\d?\d', text)

    for i in range(len(match_discount_prices)):
        match = re.search(r'\d+[.,]\s*\d?\d', match_discount_prices[i])
        match_discount_prices[i] = match.group(0) if match else None

    match_discount_prices = [price for price in match_discount_prices if price is not None]
    
    if match_discount_prices:
        discount_prices = [float(price.replace('\n', '').replace(',', '.').replace('€', '').replace(' ', '').replace('e', '').replace('%', '')) for price in match_discount_prices]

    return discount_prices

def get_eol_prices(text, percentage_prices):
    all_prices = []
    
    match_all_eol_prices = re.findall(r'\d+[.,]\s*\d?\d(?:\s*e\s*|€|eur?)?\n', text)

    if match_all_eol_prices:
        all_prices = [float(price.replace('\n', '').replace(',', '.').replace('eur','').replace('€', '').replace(' ', '').replace('e', '')) for price in match_all_eol_prices]

        if percentage_prices:
            all_prices = [price for price in all_prices if price not in percentage_prices]

    return all_prices

def get_total_prices(text, percentage_prices):
    all_prices = []

    match_total_prices = re.findall(r'(?:tot|total)[\s\S]*?\d+[.,]\s*\d?\d(?:e|\s*|€|eur?|\n)+\n', text)
    # match_total_prices = re.findall(r'(?:tot|total).*\d+[.,]\s*\d?\d(?:e|\s*|€|eur?|\n)+\n', text)

    if not match_total_prices:
        match_total_prices = re.findall(r'(?:porte|venta)[\s\S]*?\d+[.,]\s*\d?\d(?:e|\s*|€|eur?|\n)+\n', text)
        # match_total_prices = re.findall(r'(?:porte|venta).*\d+[.,]\s*\d?\d(?:e|\s*|€|eur?|\n)+\n', text)

    if match_total_prices: 
        for i in range(len(match_total_prices)):
            match = re.search(r'\d+[.,]\s*\d+[e\s€\n]', match_total_prices[i])
            match_total_prices[i] = match.group(0) if match else None

        match_total_prices = [price for price in match_total_prices if price is not None]

        if match_total_prices:
            all_prices = [float(price.replace(',', '.').replace('€', '').replace(' ', '').replace('e', '').replace('\n','')) for price in match_total_prices]
            if percentage_prices:
                all_prices = [price for price in all_prices if price not in percentage_prices]
    
    return all_prices

def get_total_amount(text):
    total_found = False
    total_amount = "desconocido"
    total_from_eol_prices = 0
    total_from_candidates = 0
    percentage_prices = get_iva_prices(text)
    discount_prices = get_discount_prices(text)

    invalid_prices = percentage_prices + discount_prices

    if not discount_prices:
        eol_prices = get_eol_prices(text, invalid_prices)
           
        if eol_prices:
            total_from_eol_prices = max(eol_prices)
            print('       Total (1st try):', total_from_eol_prices)
            print('              From prices at the end of line:', eol_prices)
        else:
            print('       Total (1st try): desconocido')

    
    total_prices = get_total_prices(text, invalid_prices)

    if total_prices:
        total_found = True
        total_from_candidates = max(total_prices)
        print('       Total (2nd try):', total_from_candidates)
        print('              From total candidates:', total_prices)
        
    else:
        print('       Total (2nd try): desconocido')           
    
    if total_found:
        if total_from_candidates >= total_from_eol_prices:
            total_amount = str(total_from_candidates)

    return total_amount


###########################################################################################
# CIF/NIF
######
def get_cif_nif(text):
    cif_nif = 'desconocido'

    print(repr(text))

    #entre cada número puede haber cualquier caracter excepto letras
    # match_cif = re.search(r'[a-zA-Z].*\D(?:[^a-zA-Z]\d){8}\D', text)
    # match_cif = re.search(r'[a-zA-Z].*(?:[^a-zA-Z]\d){8}\D', text)

    match_cif = re.search(r'[\n\s][a-zA-Z]\d{8}\D', text)

    print('       (1st try) Match candidates:', match_cif)

    if not match_cif:
        match_cif = re.search(r'[a-zA-Z].*\D\d{8}\D', text)
        # print('       (2nd try)Match candidates:', match_cif)

    if match_cif:
        # extraer solo el cif/nif
        letra = re.findall(r'[a-zA-Z]', match_cif.group(0))
        if letra: # me quedo con la última obtenida (más cercana al número)
            letra = letra[-1]
            # print('       Letra:', letra)
        numero = re.search(r'\d{8}', match_cif.group(0))
        # print('       Número:', numero)

        if letra and numero:
            cif_nif = letra.upper() + numero.group(0)

            # validar el cif/nif
            # if cif_nif:
            #     print("NIF/CIF válido: ", cif_nif)
            # else:
            #     print("NIF/CIF no válido: ", cif_nif)


    return cif_nif

###########################################################################################
# Ubicación

# Para ello obtendremos los siguientes datos
# - Dirección
# - Ciudad
# - Código postal
# - Provincia
# - País

# Utilizamos expresiones regulares para encontrar la coincidencia
# código postal (5 dígitos)
def get_postal_code(text):
    postal_code = 'desconocido'

    match = re.search(r'[\s\n]\d{5}[\s\n]', text)

    if match:
        match_postal_code = re.search(r'\d{5}', match.group(0))
        postal_code = match_postal_code.group(0)

    return postal_code


# # Ciudad (primera palabra después del código postal)
def get_city(text):
    city = 'desconocido'

    postal_code = get_postal_code(text)

    match = re.search(rf'\s{postal_code}\s\w+', text)

    if match:
        city = (match.group(0)[6:]).replace(' ', '')

    return city    


if len(sys.argv) < 2:
    print("Uso: python ocr.py <número_de_ticket>")
    sys.exit(1)

# ###### leer de imagen (OCR local)
tickets_list = ["", "01_ikea.jpg", "02_nogales.jpg", "03_casa_del_libro.jpg", "04_lidl.jpg", "05_lefties.jpg",
                "06_primor.jpg", "07_costa_cabria.jpg", "08_mercadona_efectivo.jpg", "09_mc_donalds.jpg", "10_carrefour.jpg", 
                "11_hym_devolucion.jpg", "12_mercadona_tarjeta.jpg", "13_casa_del_libro_2.jpg", "14_margaritas.jpg", "15_bus.jpg",
                "16_ticket_girado_horizontal.jpg", "17_corte_ingles.jpg", "18_mundys.jpg", "19_kfc.jpg", "20_mercadona_digital.jpg",
                 "21_hym_digital.jpg", "22_hym_descuento_mayoratotal.jpg"
                ] 

# Asumiendo que el argumento es un nombre de archivo de imagen para procesar
image_jpg = Image.open(f'./tickets/{tickets_list[int(sys.argv[1])]}')
text = pytesseract.image_to_string(image_jpg)
#######


# ####### leer de texto analizado por OCR Space (OCR API externa)
# tickets_list = ["", "01_ikea.txt", "02_nogales.txt", "03_casa_del_libro.txt", "04_lidl.txt", "05_lefties.txt",
#                 "06_primor.txt", "07_costa_cabria.txt", "08_mercadona_efectivo.txt", "09_mc_donalds.txt", "10_carrefour.txt", 
#                 "11_hym_devolucion.txt", "12_mercadona_tarjeta.txt", "13_casa_del_libro_2.txt", "14_margaritas.txt", "15_bus.txt",
#                 "16_ticket_girado_horizontal.txt", "17_corte_ingles.txt", "18_mundys.txt", "19_kfc.txt", "20_primor_recogidas.txt", ""
#                 ] 

# text = open(f'./ocr_space/tickets/{tickets_list[int(sys.argv[1])]}').read()
# # #######

# Imprime el texto extraído
# print(text)
# print(repr(text))
print('---------------------------------------------')

print('+ Nombre de la tienda:', get_shop_name(text))

text = text.lower()

print('+ Método de pago:',get_payment_method(text))
print('+ Total:', get_total_amount(text))
print('+ Fecha:', get_date(text))
print('+ CIF/NIF:', get_cif_nif(text))
print('+ Código postal:', get_postal_code(text))
print('+ Ciudad:', get_city(text))



# Procesamos el texto extraído para obtener los datos que necesitamos
# Nombre de la tienda 
# Total --> hecho
# Fecha --> hecho
# Ubicación
# método de pago  --> hecho



