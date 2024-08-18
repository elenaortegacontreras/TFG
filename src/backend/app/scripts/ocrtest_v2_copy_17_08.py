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
    
def purge_dates_match(match, case):
    valid_dates = []
    for date_str in match:
        if verify_date(date_str, case):
            valid_dates.append(date_str)
    return valid_dates

def get_date(text):
    date = 'desconocido'

    match = re.findall(r'\d{2}[./-]\d{2}[./-]\d{4}', text) # dd/mm/aaaa, dd-mm-aaaa, dd.mm.aaaa
    match = purge_dates_match(match, 1)
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
            match = purge_dates_match(match, 2)
            if verify_unique_date(match):
                date_str = match[0]
                date = date_str[0:2] + '/' + date_str[3:5] + '/20' + date_str[6:8]
        
        if date == 'desconocido':
            match = re.findall(r'\d{4}[./-]\d{2}[./-]\d{2}\D?', text) # aaaa-mm-dd, aaaa/mm/dd, aaaa.mm.dd
            if match:
                match = [date[:10] for date in match]
                match = purge_dates_match(match, 3)
                if verify_unique_date(match):
                    date_str = match[0]
                    date = date_str[8:10] + '/' + date_str[5:7] + '/' + date_str[0:4]  

    return date

###########################################################################################
# Total
######
# para averiguar el total tenemos que buscar la palabra 'total' y luego buscar el número que le sigue
# def get_total_amount(text):
#     total_found = False
#     total_amount = 0

#     match = re.search(r'total.*\d+[.,]\s*\d?\d[e\s€]', text)

#     if not match:
#         text = text.replace('\n', ' ').replace('\r', ' ')
#         match = re.search(r'tot.*\d+[.,]\s*\d?\d[e\s€]', text)
#         if not match:
#             match = re.search(r'importe.*\d+[.,]\s*\d?\d[e\s€]', text)
#             if not match:
#                 match = re.search(r'venta.*\d+[.,]\s*\d?\d[e\s€]', text)

#     if match:
#         total_str = match.group(0)
#         total_match = re.search(r'\d+[.,]\s*\d?\d[e\s€]', total_str)
#         if total_match:
#             total_str = total_match.group(0).replace(',', '.').replace('€', '').replace(' ', '').replace('e', '')
#             total = float(total_str)
#             print('       Total (1st try):', total)
#             total_found = True

#             # Comprobación validez resultado (obtener otro precio y verificar que es menor que el total)
#             if total > 0:
#                 #Primero, para reducir la búsqueda, como los precios suelen venir seguidos,
#                 # para reducir la magnitud del texto cojo una sección del ticket que empieza 
#                 # en el primer precio y acaba en el último encontrados
#                 other_prices_match = re.search(r'\d+[.,]\s*\d?\d[e\s€]+.*\d+[.,]\s*\d?\d[e\s€]', text)
#                 # CAMBIOOOOOOOOOO : other_str = other_prices_match.group(0).replace('\n', ' ').replace('\r', ' ')
#                 other_str = other_prices_match.group(0)
#                 print('       Other prices:', other_str)
#                 if other_prices_match:
                    
#                     #versión antigua
#                     # other_str = other_str.replace(total_str, ' ')
#                     # other_match = re.search(r'\s\d+[.,]\d{2}', other_str)
#                     # if other_match:
#                     #     other_price = float(other_match.group(0).replace(',', '.').replace('€', '').replace(' ', '').replace('e', ''))
#                     #     print('       Other price:', other_price)
#                     #     if other_price > total:
#                     #         total_found = False
#                     # else:
#                     #     print('       Other price: desconocido')

#                     #versión nueva
#                     # other_str = other_str.replace(total_str, ' ')
#                     # other_match = re.findall(r'\d+[.,]\s*\d?\d[e\s€]', other_str)
#                     # print('       Other prices MAAATCH:', other_match)
#                     # if other_match:
#                     #     other_price = [float(price.replace(',', '.').replace('€', '').replace(' ', '').replace('e', '')) for price in other_match]
#                     #     print('       Other prices:', other_price)
#                     #     if any(price > total for price in other_price):
#                     #         total_found = False

#                     #versión nueva (\n) no me saca el string como quiero, aparco por ahora
#                     print('string_repr')
#                     print(repr(text))
#                     other_match = re.findall(r'\d+[.,]\s*\d?\d[e\s€]', other_str)
#                     print('       Other prices MAAATCH:', other_match)
#                     if other_match:
#                         other_price = [float(price.replace(',', '.').replace('€', '').replace(' ', '').replace('e', '')) for price in other_match]
#                         print('       Other prices:', other_price)
#                         if any(price > total for price in other_price):
#                             total_found = False
#             else:
#                 total_found = False

#     if total_found:
#         print('+ Total:', total)
#         total_amount = total
#     else:
#         print('+ Total: desconocido')

#     return total_amount

def get_iva_prices(text):
    percentage_prices = []

    match_x_iva = re.findall(r'[\n\s]iva.*\d+[.,]\s*\d?\d', text)
    match_iva_x = re.findall(r'iva[\n\s].*\d+[.,]\s*\d?\d', text)
    match_iva_perc = re.findall(r'%.*\d+[.,]\s*\d?\d', text)
    
    match_iva_prices = match_x_iva + match_iva_x + match_iva_perc

    for i in range(len(match_iva_prices)):
        match_iva_prices[i] = re.search(r'\d+[.,]\s*\d?\d', match_iva_prices[i])
        if match_iva_prices[i]:
            match_iva_prices[i] = match_iva_prices[i].group(0)
    if match_iva_prices:
        percentage_prices = [float(price.replace('\n', '').replace(',', '.').replace('€', '').replace(' ', '').replace('e', '').replace('%', '')) for price in match_iva_prices]

    match_percentage_prices = re.findall(r'\d+[.,]\s*\d?\d\s*%', text)
    if match_percentage_prices:
        all_perc = [float(price.replace('\n', '').replace(',', '.').replace('€', '').replace(' ', '').replace('e', '').replace('%', '')) for price in match_percentage_prices]
        percentage_prices += all_perc
    print(repr(text))
    print('       IVA prices:', percentage_prices)

    return percentage_prices

def get_total_amount(text):
    total_found = False
    total_amount = "desconocido"
    total_from_all_prices = 0
    total_from_candidates = 0
    percentage_prices = get_iva_prices(text)

    match_all_eol = re.findall(r'\d+[.,]\s*\d?\d[e\s€]?\n', text)
    match_all_eol_eur = re.findall(r'\d+[.,]\s*\d?\d\s*eur?\n', text)

    match_all_eol_prices = match_all_eol + match_all_eol_eur

    if match_all_eol_prices:
        all_prices = [float(price.replace('\n', '').replace(',', '.').replace('eur','').replace('€', '').replace(' ', '').replace('e', '')) for price in match_all_eol_prices]

        if percentage_prices:
            all_prices = [price for price in all_prices if price not in percentage_prices]
            
        if all_prices:
            total_from_all_prices = max(all_prices)
            print('       Total (1st try):', total_from_all_prices)
            print('              From prices at the end of line:', all_prices)
        else:
            print('       Total (1st try): desconocido')

        # for price in all_prices:
        #     regex = r'total[\s\S]*?' + re.escape(str(price))
        #     regex = regex.replace('\.', r',')
        #     print('       Searching for:', regex)
        #     match = re.search(regex, text)
        #     if match:
        #         print('       100% (total):', price)



    match_total = re.findall(r'total[\s\S]*?\d+[.,]\s*\d?\d[e\s€]?\n', text)
    text = text.replace('\n', ' ').replace('\r', ' ')
    match_tot = re.findall(r'tot[\s\S]*?\d+[.,]\s*\d?\d[e\s€]', text)
    match_tot_eur = re.findall(r'tot[\s\S]*?\d+[.,]\s*\d?\d\s*eur', text)
    match_importe = re.findall(r'porte[\s\S]*?\d+[.,]\s*\d?\d[e\s€]', text)
    match_importe_eur = re.findall(r'porte[\s\S]*?\d+[.,]\s*\d?\d\s*eur', text)
    match_venta = re.findall(r'venta[\s\S]*?\d+[.,]\s*\d?\d[e\s€]', text)
    match_venta_eur = re.findall(r'venta[\s\S]*?\d+[.,]\s*\d?\d\s*eur', text)

    match_total_prices = match_total + match_tot + match_tot_eur + match_importe + match_importe_eur + match_venta + match_venta_eur

    if match_total_prices: 
        for i in range(len(match_total_prices)):
            match_total_prices[i] = re.search(r'\d+[.,]\s*\d+[e\s€]', match_total_prices[i])
            if match_total_prices[i]:
                match_total_prices[i] = match_total_prices[i].group(0)
        if match_total_prices:
            total_str = [float(price.replace(',', '.').replace('€', '').replace(' ', '').replace('e', '')) for price in match_total_prices]
            if percentage_prices:
                total_str = [price for price in total_str if price not in percentage_prices]
                
            if total_str:
                total_from_candidates = max(total_str)
                print('       Total (2nd try):', total_from_candidates)
                print('              From total candidates:', total_str)
                total_found = True
            else:
                print('       Total (2nd try): desconocido')           
    
    if total_found:
        if total_from_candidates >= total_from_all_prices:
            total_amount = str(total_from_candidates)
        else:
            print('+ Total: desconocido, pero se ha encontrado otro precio', total_from_all_prices)

    return total_amount





if len(sys.argv) < 2:
    print("Uso: python ocr.py <número_de_ticket>")
    sys.exit(1)

###### leer de imagen (OCR local)
tickets_list = ["", "01_ikea.jpg", "02_nogales.jpg", "03_casa_del_libro.jpg", "04_lidl.jpg", "05_lefties.jpg",
                "06_primor.jpg", "07_costa_cabria.jpg", "08_mercadona_efectivo.jpg", "09_mc_donalds.jpg", "10_carrefour.jpg", 
                "11_hym_devolucion.jpg", "12_mercadona_tarjeta.jpg", "13_casa_del_libro_2.jpg", "14_margaritas.jpg", "15_bus.jpg",
                "16_ticket_girado_horizontal.jpg", "17_corte_ingles.jpg", "18_mundys.jpg", "19_mucha_miga.jpg", "20_lidl_mejor_q.jpg", 
                "21_mc_donalds_mejor_q.jpg", "22_kfc.jpg", "23_just_eat.jpg"# , "ticket23.jpg", "ticket24.jpg", 
                ] 

# Asumiendo que el argumento es un nombre de archivo de imagen para procesar
image_jpg = Image.open(f'./tickets/{tickets_list[int(sys.argv[1])]}')
text = pytesseract.image_to_string(image_jpg)
#######


# ####### leer de texto analizado por OCR Space (OCR API externa)
# tickets_list = ["", "01_ikea.txt", "02_nogales.txt", "03_casa_del_libro.txt", "04_lidl.txt", "05_lefties.txt",
#                 "06_primor.txt", "07_costa_cabria.txt", "08_mercadona_efectivo.txt", "09_mc_donalds.txt", "10_carrefour.txt", 
#                 "11_hym_devolucion.txt", "12_mercadona_tarjeta.txt", "13_casa_del_libro_2.txt", "14_margaritas.txt", "15_bus.txt",
#                 "16_ticket_girado_horizontal.txt", "17_corte_ingles.txt", "18_mundys.txt", "19_mucha_miga.txt", "20_lidl_mejor_q.txt", 
#                 "21_mc_donalds_mejor_q.txt"# , "ticket21.txt", "ticket22.txt", "ticket23.txt", "ticket24.txt", 
#                 ] 

# text = open(f'./ocr_space/tickets/{tickets_list[int(sys.argv[1])]}').read()
# #######

# Imprime el texto extraído
# print(text)
# print(repr(text))
print('---------------------------------------------')

print('+ Nombre de la tienda:', get_shop_name(text))

text = text.lower()

print('+ Método de pago:',get_payment_method(text))
print('+ Total:', get_total_amount(text))
print('+ Fecha:', get_date(text))


# Procesamos el texto extraído para obtener los datos que necesitamos
# Nombre de la tienda 
# Total --> hecho
# Fecha --> hecho
# Ubicación
# método de pago  --> hecho


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
match = re.search(r'\s\d{5}\s', text)

if match:
    print('+ Código postal:', match.group(0).replace(' ', ''))
else:
    print('+ Código postal: desconocido')


# Ciudad (primera palabra después del código postal)
match = re.search(r'\s\d{5}\s\w+', text)

if match:
    print('+ Ciudad:', (match.group(0)[6:]).replace(' ', ''))
else:
    print('+ Ciudad: desconocido')