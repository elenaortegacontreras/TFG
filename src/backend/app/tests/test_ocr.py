import pytest
from ocr_clean import get_shop_name, get_payment_method, get_date, get_total_amount


text = ["", "01_ikea.txt", "02_nogales.txt", "03_casa_del_libro.txt", "04_lidl.txt", "05_lefties.txt",
                "06_primor.txt", "07_costa_cabria.txt", "08_mercadona_efectivo.txt", "09_mc_donalds.txt", 
                "10_carrefour.txt", "", "12_mercadona_tarjeta.txt", "13_casa_del_libro_2.txt", 
                "14_margaritas.txt", "", "16_ticket_girado_horizontal.txt", "17_corte_ingles.txt", 
                "18_mundys.txt", "19_kfc.txt", "", ""]

# OCR Space tickets
# text = ["","/ocr_space_text/01_ikea.txt","/ocr_space_text/02_nogales.txt","/ocr_space_text/03_casa_del_libro.txt","/ocr_space_text/04_lidl.txt","/ocr_space_text/05_lefties.txt",
#                "/ocr_space_text/06_primor.txt","/ocr_space_text/07_costa_cabria.txt","/ocr_space_text/08_mercadona_efectivo.txt","/ocr_space_text/09_mc_donalds.txt", 
#                "/ocr_space_text/10_carrefour.txt","/ocr_space_text/","/ocr_space_text/12_mercadona_tarjeta.txt","/ocr_space_text/13_casa_del_libro_2.txt", 
#                "/ocr_space_text/14_margaritas.txt","/ocr_space_text/","/ocr_space_text/16_ticket_girado_horizontal.txt","/ocr_space_text/17_corte_ingles.txt", 
#                "/ocr_space_text/18_mundys.txt","19_kfc.txt"]

###########################################################################################
# Nombre de la tienda
# def test_get_shop_name():
#     text = "Tienda Ejemplo\nDirección\nOtra línea"
#     expected = "Tienda Ejemplo Dirección"
#     assert get_shop_name(text) == expected

###########################################################################################
# Método de pago
def test_get_payment_method_tarjeta():
    expected = "tarjeta"
    tickets_tarjeta = [text[1], text[3], text[5], text[6], text[12], text[13] ]
    for ticket in tickets_tarjeta:
        with open(f'./tickets_text/{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_payment_method(ticket_str) == expected

def test_get_payment_method_efectivo():
    expected = "efectivo"
    tickets_efectivo = [text[4], text[8], text[14], text[17], text[18] ]
    for ticket in tickets_efectivo:
        with open(f'./tickets_text/{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_payment_method(ticket_str) == expected

def test_get_payment_method_desconocido():
    expected = "desconocido"
    tickets_desconocido = [text[2], text[7], text[9], text[10], text[16], text[19] ]
    for ticket in tickets_desconocido:
        assert get_payment_method(f'./tickets_text/{ticket}') == expected

def test_get_date_not_verified():
    expected = "desconocido"
    tickets_not_verified = [text[1]]
    for ticket in tickets_not_verified:
        assert get_date(f'./tickets_text/{ticket}') == expected

###########################################################################################
# Fecha
def test_get_date_dd_mm_yyyy():
    # on ticket: 16(05-06-2024)
    expected = ["desconocido", "09/08/2024", "01/02/2024", "desconocido", "15/07/2024", "17/06/2024", "27/04/2024", "05/06/2024", "desconocido"]
    tickets_dd_mm_yyyy = [text[1], text[2], text[5], text[8], text[9], text[12], text[14], text[16], text[17]]
    i = 0
    for ticket in tickets_dd_mm_yyyy:
        with open(f'./tickets_text/{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_date(f'./tickets_text/{ticket_str}') == expected[i]
            i += 1

def test_get_date_dd_mm_yy():
    expected = ["desconocido", "12/06/2024", "desconocido", "desconocido", "desconocido", "16/08/2024"]
    tickets_dd_mm_yy = [text[4], text[6], text[7], text[10], text[18], text[19]]
    i = 0
    for ticket in tickets_dd_mm_yy:
        with open(f'./tickets_text/{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_date(f'./tickets_text/{ticket_str}') == expected[i]
            i += 1

def test_get_date_yyyy_mm_dd():
    # on ticket: 3(2024-04-23)
    expected = ["23/04/2024", "desconocido"]
    tickets_yyyy_mm_dd = [text[3], text[13]]
    i = 0
    for ticket in tickets_yyyy_mm_dd:
        with open(f'./tickets_text/{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_date(f'./tickets_text/{ticket_str}') == expected[i]
            i += 1

def test_get_date_mix():
    # on: (09/05/21) -> solo fechas de 2024 en adelante
    expected = ["01/01/2024", "02/02/2024", "03/03/2024", 
                "04/04/2024", "05/05/2024", "06/06/2024", 
                "07/07/2024", "08/08/2024", "09/09/2024","desconocido"]
    dates_mix = ["srd01/01/2024", "rtnjs 02-02-2024", "rtrju 03.03.2024", 
                 "03948n 04/04/24", "asff05-05-24", "06.06.24dvgsd", 
                 "2024-07-07", "2024/08/08 sdr", "2024.09.09 999", "09/05/21"]
    i = 0
    for date in dates_mix:
        assert get_date(date) == expected[i]
        i += 1


###########################################################################################
# Total
# ###### 

def test_get_total_amount_desconocido():
    expected = "desconocido"
    tickets_desconocido = [text[1], text[4], text[7], text[8], text[9], text[10], text[13], text[16]]
    for ticket in tickets_desconocido:
        assert get_total_amount(f'./tickets_text/{ticket}') == expected

def test_get_total_amount():
    expected = ["2.99", "9.85", "17.99", "4.3", "11.0", "6.5", "17.5", "6.2", "4.02"]    
    tickets_total = [text[1], text[3], text[5], text[6], text[12], text[14], text[17], text[18], text[19]]
    i = 0
    for ticket in tickets_total:
        with open(f'./tickets_text/{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_total_amount(f'./tickets_text/{ticket_str}') == expected[i]
            i += 1