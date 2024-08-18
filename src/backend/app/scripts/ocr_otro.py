import sys
import re
from PIL import Image
import pytesseract

# vamos a extraer siempre la primera y segunda líneas con texto que aparezcan en el ticket
def get_shop_name(text):
    shop_name = 'desconocido'

    match = re.search(r'\S.+\n.*\n', text)

    if match:
        shop_name_str = match.group(0).replace('\n', ' ').replace('\r', ' ')

        if shop_name_str != ' ':
            shop_name = shop_name_str

    return shop_name


def get_payment_method(text):
    payment_method = 'desconocido'

    if 'tarjeta' in text:
        payment_method = 'tarjeta'
    elif 'efectivo' in text or 'contado' in text:
        payment_method = 'efectivo'
    else:
        count_tarjeta = 0
        count_efectivo = 0

    # Diccionarios de palabras clave
        keywords_tarjeta = ['visa', 'mastercard', 'debito', 'debit', 'crédito', 'credit', 'contactless', 'nfc', 'cuenta','trj', 'jeta', 'tarj', 'tanjeta', 'credito']
        keywords_efectivo = ['cambio', 'entrega', 'entregado', 'efect']

    # Contadores
        count_tarjeta = sum(text.count(keyword) for keyword in keywords_tarjeta)
        count_efectivo = sum(text.count(keyword) for keyword in keywords_efectivo)

        if count_tarjeta >= 2 and count_tarjeta > count_efectivo:
            payment_method = 'tarjeta'
            # print('       Número de keywords encontradas:', count_tarjeta)
        elif count_efectivo >= 2 and count_efectivo > count_tarjeta:
            payment_method = 'efectivo'
            # print('       Número de keywords encontradas:', count_efectivo)
            
    return payment_method

# returns date with dd/mm/aaaa format
def get_date(text):
    date = 'desconocido'

    match = re.search(r'\d{2}[./-]\d{2}[./-]\d{4}', text) # dd/mm/aaaa, dd-mm-aaaa, dd.mm.aaaa

    if match:
        date_str = match.group(0)
        date = date_str[:2] + '/' + date_str[3:5] + '/' + date_str[6:10]

    else:
        match = re.search(r'\d{2}[./-]\d{2}[./-]\d{2}', text) # dd/mm/aa, dd-mm-aa, dd.mm.aa
        if match:
            date_str = match.group(0)
            date = date_str[:2] + '/' + date_str[3:5] + '/20' + date_str[6:8]
        else:
            match = re.search(r'\d{4}[./-]\d{2}[./-]\d{2}', text) # aaaa-mm-dd
            if match:
                date_str = match.group(0)
                date = date_str[9:] + '/' + date_str[6:8] + '/' + date_str[1:5]

    return date

# para averiguar el total tenemos que buscar la palabra 'total' y luego buscar el número que le sigue
def get_total_amount(text):
    total_found = False
    total_amount = 0

    match = re.search(r'total.*\d+[.,]\s*\d+[e\s€]', text)

    if not match:
        text = text.replace('\n', ' ').replace('\r', ' ')
        match = re.search(r'tot.*\d+[.,]\s*\d+[e\s€]', text)
        if not match:
            match = re.search(r'importe.*\d+[.,]\s*\d+[e\s€]', text)
            if not match:
                match = re.search(r'venta.*\d+[.,]\s*\d+[e\s€]', text)

    if match:
        total_str = match.group(0)
        total_match = re.search(r'\d+[.,]\s*\d+[e\s€]', total_str)
        if total_match:
            total_str = total_match.group(0).replace(',', '.').replace('€', '').replace(' ', '').replace('e', '')
            total = float(total_str)
            print('       Total (1st try):', total)
            total_found = True

            # Comprobación validez resultado (obtener otro precio y verificar que es menor que el total)
            if total > 0:
                other_prices_match = re.search(r'\d+[.,]\s*\d+[e\s€]+.*\d+[.,]\s*\d+[e\s€]', text)
                other_str = other_prices_match.group(0).replace('\n', ' ').replace('\r', ' ')
                print('       Other prices:', other_str)
                if other_prices_match:
                    other_str = other_str.replace(total_str, ' ')
                    other_match = re.search(r'\s\d+[.,]\d{2}', other_str)
                    if other_match:
                        other_price = float(other_match.group(0).replace(',', '.').replace('€', '').replace(' ', '').replace('e', ''))
                        print('       Other price:', other_price)
                        if other_price > total:
                            total_found = False
                    else:
                        print('       Other price: desconocido')
            else:
                total_found = False

    if total_found:
        print('+ Total:', total)
        total_amount = total
    else:
        print('+ Total: desconocido')

    return total_amount


text = "nljknlsidnvgonl ñoaij fñoiajpiof oij añf 04.03.20 12:34:56 "

print('---------------------------------------------')

print('+ Nombre de la tienda:', get_shop_name(text))
print('+ Método de pago:',get_payment_method(text))
get_total_amount(text)
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