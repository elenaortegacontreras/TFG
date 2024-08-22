import sys
import re
from PIL import Image
import pytesseract
import pdfplumber
import pgeocode
import math
# import pandas as pd
import spacy #búsqueda de ciudades en texto con su load
from flashtext import KeywordProcessor # búsqueda sobre el fichero de ciudades que tenemos metido
from geopy.geocoders import Nominatim


CITIES_FILE_PATH = "./geographical_points/ES_city_names.txt"

tickets_list = ["", "01_ikea.jpg", "02_nogales.jpg", "03_casa_del_libro.jpg", "04_lidl.jpg", "05_lefties.jpg",
                "06_primor.jpg", "07_costa_cabria.jpg", "08_mercadona_efectivo.jpg", "09_mc_donalds.jpg", "10_carrefour.jpg", 
                "11_hym_devolucion.jpg", "12_mercadona_tarjeta.jpg", "13_casa_del_libro_2.jpg", "14_margaritas.jpg", "15_bus.jpg",
                "16_ticket_girado_horizontal.jpg", "17_corte_ingles.jpg", "18_mundys.jpg", "19_kfc.jpg", "20_mercadona_digital.jpg",
                 "21_hym_digital.jpg", "22_hym_descuento_mayoratotal.jpg", "23_ikea_digital.jpg", "24_enjoy_it.jpg",
                 "25_ecu.jpg", "26_carre_pamplona.jpg"
                ] 

#------------------------------------------------------------------------------------------
# Método de pago
# ---->  returns 'tarjeta', 'efectivo' or 'desconocido' if not found
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
        keywords_tarjeta = ['visa', 'mastercard', 'debito', 'debit', 'crédito', 'crédito', 'credit', 'contactless', 'nfc', 'cuenta','caixabank', 'bbva', 'trj', 'jeta', 'tarj', 'tanjeta', 'credito']
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


#------------------------------------------------------------------------------------------
# Fecha
# ----> returns date with dd/mm/aaaa format o 'desconocido' if not found
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
        #  only dates from 2024 onwards
        if not re.match(r'20[2-9][0-9]', date_str[6:10]) or (int(date_str[6:10]) < 2024):
            return False 
    elif case == 2: # dd/mm/aa, dd-mm-aa, dd.mm.aa
        if not re.match(r'(0[1-9]|[12][0-9]|3[01])', date_str[0:2]):
            return False
        if not re.match(r'(0[1-9]|1[0-2])', date_str[3:5]):
            return False
        # only dates from 2024 onwards
        if not re.match(r'[2-9][0-9]', date_str[6:8]) or (int(date_str[6:8]) < 24):
            return False
    elif case == 3:  # aaaa-mm-dd, aaaa/mm/dd, aaaa.mm.dd
        # only dates from 2024 onwards
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

def get_date_dd_mm_yyyy(text):
    date = 'desconocido'

    match = re.findall(r'\d{2}[./-]\d{2}[./-]\d{4}', text) # dd/mm/aaaa, dd-mm-aaaa, dd.mm.aaaa
    match = purge_dates_match(text, match, 1)
    if match:
        if verify_unique_date(match):
            date_str = match[0]
            date = date_str[0:2] + '/' + date_str[3:5] + '/' + date_str[6:10]

    return date

def get_date_dd_mm_yy(text):
    date = 'desconocido'
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

    return date

def get_date_yyyy_mm_dd(text):
    date = 'desconocido'

    match = re.findall(r'\d{4}[./-]\d{2}[./-]\d{2}\D?', text) # aaaa-mm-dd, aaaa/mm/dd, aaaa.mm.dd
    if match:
        match = [date[:10] for date in match]
        match = purge_dates_match(text, match, 3)
        if verify_unique_date(match):
            date_str = match[0]
            date = date_str[8:10] + '/' + date_str[5:7] + '/' + date_str[0:4] 

    return date

def get_date(text):
    date = 'desconocido'

    text = text.replace(' ', '')

    date = get_date_dd_mm_yyyy(text) # case 1
    if date == 'desconocido':
        date = get_date_dd_mm_yy(text) # case 2   
        if date == 'desconocido':
            date = get_date_yyyy_mm_dd(text) # case 3

    return date

#------------------------------------------------------------------------------------------
# Total
# ----> returns total amount or 'desconocido' if not found
def get_iva_prices(text):
    percentage_prices = []

    match_x_iva = re.findall(r'[\n\s]iva[\s\S]*?\d+[.,]\s*\d?\d', text)
    match_iva_x = re.findall(r'iva[\n\s][\s\S]*?\d+[.,]\s*\d?\d', text)
    match_iva_perc = re.findall(r'%[\s\S]*?\d+[.,]\s*\d?\d', text)
    
    match_iva_prices = match_x_iva + match_iva_x + match_iva_perc

    #eliminar de match_iva_prices los que incluyan la palabra total
    match_iva_prices = [price for price in match_iva_prices if not re.search(r'total[^\n]', price)]

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

    match_desc_prices = re.findall(r'desc[\s\S]*?\d+[.,]\s*\d?\d', text)
    match_cupon_prices = re.findall(r'cupon[\s\S]*?-[\s\S]*?\d+[.,]\s*\d?\d', text)

    match_discount_prices = match_desc_prices + match_cupon_prices

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

def get_total_prices_in_match(match_total_prices, percentage_prices):
    all_prices = []

    for i in range(len(match_total_prices)):
        match = re.search(r'\d+[.,]\s*\d+[e\s€\n]', match_total_prices[i])
        match_total_prices[i] = match.group(0) if match else None

    match_total_prices = [price for price in match_total_prices if price is not None]

    if match_total_prices:
        all_prices = [float(price.replace(',', '.').replace('€', '').replace(' ', '').replace('e', '').replace('\n','')) for price in match_total_prices]
        if percentage_prices:
            all_prices = [price for price in all_prices if price not in percentage_prices]

    return all_prices

def get_total_prices(text, percentage_prices):
    all_prices = []

    match_total_prices = re.findall(r'(?:tot|total)[\s\S]*?\d+[.,]\s*\d?\d(?:e|\s*|€|eur?|\n)+\n', text)
    if match_total_prices: 
        all_prices = get_total_prices_in_match(match_total_prices, percentage_prices)

    if not all_prices:
        match_total_prices = re.findall(r'(?:porte|venta)[\s\S]*?\d+[.,]\s*\d?\d(?:e|\s*|€|eur?|\n)+\n', text)
        if match_total_prices: 
            all_prices = get_total_prices_in_match(match_total_prices, percentage_prices)

    if not all_prices:
        match_total_prices = re.findall(r'(?:tot|total).*\d+[.,]\s*\d?\d(?:e|\s*|€|eur?|\n)+\n', text)
        if match_total_prices: 
            all_prices = get_total_prices_in_match(match_total_prices, percentage_prices)

    if not all_prices:
        match_total_prices = re.findall(r'(?:porte|venta).*\d+[.,]\s*\d?\d(?:e|\s*|€|eur?|\n)+\n', text)
        if match_total_prices: 
            all_prices = get_total_prices_in_match(match_total_prices, percentage_prices)
    
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
    
    total_prices = get_total_prices(text, invalid_prices)

    if total_prices:
        total_found = True
        total_from_candidates = max(total_prices)      
    
    if total_found:
        if total_from_candidates >= total_from_eol_prices:
            total_amount = str(total_from_candidates)

    return total_amount


#------------------------------------------------------------------------------------------
# CIF/NIF
# ----> returns cif/nif or 'desconocido' if not found
def get_cif_nif_match(text):
    match_cif = re.findall(r'\n[a-z]*(?:cif|nif|C\.I\.F|N\.I\.F)?\s*:?\s*[a-z][-\s\.,]?\d{8}[^0-9]', text)
    if not match_cif:
        match_cif = re.findall(r'(?:cif|nif|C\.I\.F|N\.I\.F)?\s*:?\s*[a-z][-\s\.,]?(?:\d[\s\.]*?){8}[^0-9]', text)
    if not match_cif:
        match_cif = re.findall(r'\n[a-z]?[-\s\.]?(?:\d[-\s\.,]*?){8}\D', text) # example: \n\npbb\n\n: 6785501\ns

    return match_cif

def get_cif_nif(text):
    # si llega a hacer falta, como último paso comprobar con API si es válido
    cif_nif = 'desconocido'
    
    match_cif = get_cif_nif_match(text)
   
    if match_cif:
        for match in match_cif:
            match = match.replace('\n', '').replace('\r', '').replace(' ', '').replace(':', '').replace('.', '').replace(',', '').replace('-', '')
            letter = re.findall(r'[a-z]', match)
            if letter: # last letter found (closest to number)
                letter = letter[-1] 
            number = re.search(r'\d{8}', match)

            if letter and number:
                cif_nif = letter.upper() + number.group(0)

    return cif_nif


#------------------------------------------------------------------------------------------
# Código postal
# ----> returns postal code or 'desconocido' if not found
def get_postal_code(text):
    postal_code = 'desconocido'

    match = re.search(r'\n[\s\n]*\d{5}[\s\n.-]', text)
    if match:
        match_postal_code = re.search(r'\d{5}', match.group(0))
        postal_code = match_postal_code.group(0)

    return postal_code


#------------------------------------------------------------------------------------------
# Ciudad
# ----> returns array of city candidates
def get_city_candidates_from_file(text):

    text = text.lower()

    # Cargar la lista de ciudades desde un archivo de texto
    with open(f'{CITIES_FILE_PATH}', 'r', encoding='utf-8') as file:
        ciudades = file.read().splitlines()

    # # Convertir la lista en un conjunto para búsquedas rápidas
    # ciudades_set = set(ciudades)
    # # Normalizar texto a minúsculas para una búsqueda insensible a mayúsculas
    # text = text.lower()

    # # Buscar ciudades en el texto
    # ciudades_encontradas = [ciudad for ciudad in ciudades_set if ciudad.lower() in text and ciudad != '']
    # print('ciudades_file_encontradas:', ciudades_encontradas)

    # return ciudades_encontradas


    # Configurar FlashText
    keyword_processor = KeywordProcessor()

    # Añadir todas las ciudades al KeywordProcessor
    keyword_processor.add_keywords_from_list(ciudades)

   # Normalizar las ciudades a minúsculas
    ciudades_min = [ciudad.lower() for ciudad in ciudades]

    # Crear un nuevo KeywordProcessor con las ciudades en minúsculas
    keyword_processor = KeywordProcessor()
    keyword_processor.add_keywords_from_list(ciudades_min)

    # Buscar coincidencias en el texto normalizado
    ciudades_encontradas = keyword_processor.extract_keywords(text)

    print("Ciudades encontradas:", ciudades_encontradas)

    return ciudades_encontradas

#------------------------------------------------------------------------------------------
# Ciudad
# ----> returns array of city candidates
def get_city_candidates(text, postal_code):
    city_candidates = []
    text = text[:int(len(text)/2)]
    text = re.sub(r'[\r;(){}|-]+', ' ', text)

    # candidates close to postal code
    if postal_code != 'desconocido': 
        match = re.search(rf'{postal_code}.*', text)
        if match:
            city = (match.group(0)[6:]).replace('.', '')
            city_candidates.append(city)
            if re.search(r'\s', city):
                city_candidates = city_candidates + city.split()
            
            print('city_candidates:', city_candidates)
    
    
    # candidates from text using spacy library
    text = text[:int(len(text)/2)]
    text = text.replace('\n', ' ').replace('\r', ' ').replace('-', ' ')
    
    nlp = spacy.load('es_core_news_md')

    doc = nlp(text)
    # for token in doc:
    #     print(token.text, token.pos_)

    other_city_candidates = [ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC"]]
    print('othqer_city_candidates:', other_city_candidates)
    city_candidates = city_candidates + other_city_candidates

    other_city_candidates = [word for candidate in other_city_candidates for word in candidate.split()]
    city_candidates = city_candidates + other_city_candidates

    print('othqer_city_candidates:', other_city_candidates)
    
    return city_candidates    



#------------------------------------------------------------------------------------------
# Calle
# ----> returns street or 'desconocido' if not found
def get_street(text, postal_code):
    street = 'desconocido'

    text = text.replace('\r', ' ').replace(';', ' ').replace('(', ' ').replace(')', ' ').replace('-', '-')

    match = re.search(r'(?:c\/|calle|avd|vda)(?:[a-zá-ú]|\s|,|\.)+(?:s\/n|\d+)', text) # calle, avenida + número o s/n
    if not match:
        match = re.search(r'(?:\/cc|c.c|aven|parque|centro|paseo)(?:[a-zá-ú]|\s|,|\.)+(?:s\/n|\d+)', text) # c.comercial, parque, centro + número o s/n

    if not match:
        match = re.search(r'[a-zá-ú].*\s[,]?\d+', text) # nombre dirección + número   

    if not match:
        if postal_code != 'desconocido':
            match_pc_ref = re.search(rf'(.*\n){postal_code}', text)
            if match_pc_ref:
                street = (match_pc_ref.group(0)[:-6])

    if match:
        match = re.search(r'.*\n?', match.group(0))
        if match:
            street = match.group(0).replace('\n', ' ').replace('\r', ' ')

    return street


#------------------------------------------------------------------------------------------
# Nombre de la tienda
# ----> returns shop name or 'desconocido' if not found
def get_shop_name(text, street):
    shop_name = 'desconocido'

    text = text.replace('\r', ' ').replace(';', ' ').replace('(', ' ').replace(')', ' ').replace('-', '-')

    match = re.search(r'[a-zá-ú]+.*[sS]\.[aAlL]\.+', text) # S.A. (Sociedad Anónima) // S.L. (Sociedad Limitada)

    if not match:
        match = re.search(r'[a-zá-ú].+\n.*\n', text) # first two lines

    if match:
        shop_name = match.group(0).replace('\n', ' ').replace('\r', ' ')
        if street in shop_name:
            shop_name = shop_name.replace(f'{street}', '')

    return shop_name


#------------------------------------------------------------------------------------------
# Información del comercio
# ----> returns a dictionary with shop data
def get_shop_data(text):

    cif_nif = get_cif_nif(text)
    postal_code = get_postal_code(text)
    
    # if postal_code != 'desconocido':
    city = get_city_candidates(text, postal_code) # por ahora solo lo sé sacar con el CP
    
    street = get_street(text, postal_code)
    
    # se obtiene cogiendo las primeras líneas
    shop_name = get_shop_name(text, street)

    shop_data = {
        'shop_name': shop_name,
        'cif_nif': cif_nif,
        'postal_code': postal_code,
        'city': city,
        'street': street
    }

    return shop_data



# ------------------------------------------------------------------------------------------
# Coordenadas
# ----> returns latitude and longitude or 'desconocido' if not found
def get_location_from_postal_code(postal_code):

    print('>>>>>>>> trying to get location from postal_code:', postal_code)

    if postal_code == 'desconocido':
        return 'desconocido', 'desconocido', 'desconocido', 'desconocido'
    
    nomi = pgeocode.Nominatim('es')
    location = nomi.query_postal_code(postal_code)
    if math.isnan(location.latitude) or math.isnan(location.longitude):
        return 'desconocido', 'desconocido', 'desconocido', 'desconocido'
    
    return location.latitude, location.longitude, postal_code, location.place_name


def get_location_from_city(text, city_candidates):
    location = {}
    geolocator = Nominatim(user_agent="geoapi")

    print('>>>>>>>> trying to get location from city:', city_candidates)

    if city_candidates:
        for city in city_candidates:
            city_str = city + ', Spain'
            location = geolocator.geocode(city_str)  
            if location:
                if 'address' in location.raw:
                    address = location.raw['address']
                    postal_code = address.get('postcode', 'desconocido')
                    return location.latitude, location.longitude, postal_code, city
    
    # if not location:
    #     # esta op se realiza aquí y no antes en get_city_candidates para evitar procesamiento
    #     city_candidates = get_city_candidates_from_file(text)
    #     if city_candidates:
    #         for city in city_candidates:
    #             city_str = city + ', Spain'
    #             location = geolocator.geocode(city_str)  
    #             if location:
    #                 if 'address' in location.raw:
    #                     address = location.raw['address']
    #                     postal_code = address.get('postcode', 'desconocido')
    #                     return location.latitude, location.longitude, postal_code, city
    #                 return location.latitude, location.longitude, 'desconocido', city
        
    return 'desconocido', 'desconocido', 'desconocido', 'desconocido'


def get_location(text, postal_code, city_candidates):

    latitude, longitude, code, city = get_location_from_postal_code(postal_code)
    
    if latitude == 'desconocido': # or longitude == 'desconocido':
        latitude, longitude, code, city = get_location_from_city(text, city_candidates)

    return latitude, longitude, code, city

#------------------------------------------------------------------------------------------
# Datos del ticket
# ----> returns a dictionary with ticket data
def get_data(text):
    text = text.lower()

    # print(repr(text))

    print('---------------------------------------------')

    payment_method = get_payment_method(text)
    total_amount = get_total_amount(text)
    date = get_date(text)
    shop_data = get_shop_data(text)

    latitude, longitude, selected_postal_code, selected_city = get_location(text, shop_data['postal_code'], shop_data['city'])

    ticket_data = {
        'shop_name': shop_data['shop_name'],
        'shop_cif_nif': shop_data['cif_nif'],
        'shop_postal_code': selected_postal_code,
        'shop_city': selected_city,
        'shop_street': shop_data['street'],
        'latitude': latitude,
        'longitude': longitude,
        'date': date,
        'payment_method': payment_method,
        'total_amount': total_amount,
    }

    return ticket_data




#------------------------------------------------------------------------------------------
# Extracción de datos
# ----> returns a dictionary with ticket data

def get_data_from_image_ticket(file_path):
    if file_path.isdigit():
        image_jpg = Image.open(f'./tickets/{tickets_list[int(file_path)]}')
    else:
        image_jpg = Image.open(file_path)

    text = pytesseract.image_to_string(image_jpg)

    return get_data(text)



def get_data_from_pdf_ticket(file_path):
    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + '\n'
    
    return get_data(text)



def get_data_from_path(file_path):
    if file_path.endswith('.pdf'):
        return get_data_from_pdf_ticket(file_path)
    else:
        return get_data_from_image_ticket(file_path)


#------------------------------------------------------------------------------------------
# Main
# ----> prints the data of the given ticket
if __name__ == '__main__':

    if len(sys.argv) < 2:
        print("Uso: python ocr.py <número_de_ticket> o python ocr.py <ruta_imagen>")
        sys.exit(1)

    ticket_extraction = get_data_from_path(sys.argv[1])

    print('+ Nombre del comercio:', ticket_extraction['shop_name'])
    print('     + CIF/NIF:', ticket_extraction['shop_cif_nif'])
    print('     + Código postal:', ticket_extraction['shop_postal_code'])
    print('          + Coordenadas:', ticket_extraction['latitude'],',',ticket_extraction['longitude'])
    print('     + Ciudad:', ticket_extraction['shop_city'])
    print('     + Calle:', ticket_extraction['shop_street']) 
    print('+ Fecha:', ticket_extraction['date'])
    print('+ Método de pago:', ticket_extraction['payment_method'])
    print('+ Total:', ticket_extraction['total_amount'])


    # ## lectura de todos los tickets
    # for i in range(1, len(tickets_list)):
    #     ticket_extraction = get_data_from_path(f'./tickets/{tickets_list[i]}')
    #     print('+ Nombre del comercio:', ticket_extraction['shop_name'])
    #     print('     + CIF/NIF:', ticket_extraction['shop_cif_nif'])
    #     print('     + Código postal:', ticket_extraction['shop_postal_code'])
    #     print('          + Coordenadas:', ticket_extraction['latitude'],',',ticket_extraction['longitude'])
    #     print('     + Ciudad:', ticket_extraction['shop_city'])
    #     print('     + Calle:', ticket_extraction['shop_street']) 
    #     print('+ Fecha:', ticket_extraction['date'])
    #     print('+ Método de pago:', ticket_extraction['payment_method'])
    #     print('+ Total:', ticket_extraction['total_amount'])


# print(text)

# Rutas PDFs
# PDFs/PDFs/20240409\ Mercadona\ 3\,50\ €.pdf
# PDFs/carrefour_pamplona.pdf
# PDFs/carrefour_pamplona_2.pdf