import pytest
from app.scripts.ocr_ticket_extraction import get_payment_method, get_date, get_total_amount, get_cif_nif, get_postal_code


text = ["", "01_ikea.txt", "02_nogales.txt", "03_casa_del_libro.txt", "04_lidl.txt", "05_lefties.txt",
        "06_primor.txt", "07_costa_cabria.txt", "08_mercadona_efectivo.txt", "09_mc_donalds.txt", 
        "10_carrefour.txt", "", "12_mercadona_tarjeta.txt", "13_yanomami.txt", 
        "14_margaritas.txt", "", "16_ticket_girado_horizontal.txt", "17_corte_ingles.txt", 
        "18_mundys.txt", "19_kfc.txt", "20_mercadona_digital.txt", "21_hym_digital.txt", 
        "22_hym_descuento_mayoratotal.txt", "23_ikea_digital.txt", "24_enjoy_it.txt", "25_ecu.txt",
        "26_gallaghers.jpg"
        ]

# generar txt: python3 other_files/ocrtest_v2.py x > ./ocr_pytesseract/tickets_text/x_nombre.txt

base_path = "/app/app/tests//tickets_text/"


#------------------------------------------------------------------------------------------
# Método de pago
def test_get_payment_method_tarjeta():
    expected = "tarjeta"
    tickets_tarjeta = [text[1], text[3], text[5], text[6], text[12], 
                       text[20], text[21], text[22], text[23] ]
    for ticket in tickets_tarjeta:
        with open(f'{base_path}{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_payment_method(ticket_str) == expected

def test_get_payment_method_efectivo():
    expected = "efectivo"
    tickets_efectivo = [text[8], text[14], text[17], text[18], text[25] ]
    for ticket in tickets_efectivo:
        with open(f'{base_path}{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_payment_method(ticket_str) == expected

def test_get_payment_method_desconocido():
    expected = "desconocido"
    tickets_desconocido = [text[2], text[4], text[7], text[9], text[10], text[16], 
                           text[19], text[24]
                           ]
    for ticket in tickets_desconocido:
        assert get_payment_method(f'{base_path}{ticket}') == expected


#------------------------------------------------------------------------------------------
# Fecha
def test_get_date_not_verified():
    expected = "desconocido"
    tickets_not_verified = [text[1]]
    for ticket in tickets_not_verified:
        assert get_date(f'{base_path}{ticket}') == expected

def test_get_date_dd_mm_yyyy():
    # on ticket: 16(05-06-2024)
    expected = ["desconocido", "09/08/2024", "01/02/2024", "desconocido", "15/07/2024", "17/06/2024", 
                "27/04/2024", "05/06/2024", "16/08/2024", "05/03/2024", "26/03/2024", "23/07/2024"]
    tickets_dd_mm_yyyy = [text[1], text[2], text[5], text[8], text[9], text[12], 
                          text[14], text[16], text[19], text[20], text[23], text[24]]
    i = 0
    for ticket in tickets_dd_mm_yyyy:
        with open(f'{base_path}{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_date(f'{base_path}{ticket_str}') == expected[i]
            i += 1

def test_get_date_dd_mm_yy():
    expected = ["desconocido", "12/06/2024", "desconocido", "desconocido", "desconocido", "16/08/2024",
                "15/06/2024", "24/06/2024"]
    tickets_dd_mm_yy = [text[4], text[6], text[7], text[10], text[18], text[19],
                        text[21], text[22]]
    i = 0
    for ticket in tickets_dd_mm_yy:
        with open(f'{base_path}{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_date(f'{base_path}{ticket_str}') == expected[i]
            i += 1

def test_get_date_yyyy_mm_dd():
    # on ticket: 3(2024-04-23)
    expected = ["23/04/2024", "desconocido"]
    tickets_yyyy_mm_dd = [text[3]]
    i = 0
    for ticket in tickets_yyyy_mm_dd:
        with open(f'{base_path}{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_date(f'{base_path}{ticket_str}') == expected[i]
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


#------------------------------------------------------------------------------------------
# Total
def test_get_total_amount_desconocido():
    expected = "desconocido"
    tickets_desconocido = [text[1], text[4], text[7], text[8], text[9], text[10], 
                           text[16]]
    for ticket in tickets_desconocido:
        assert get_total_amount(f'{base_path}{ticket}') == expected

def test_get_total_amount():
    expected = ["2.99", "9.85", "17.99", "4.3", "11.0", "6.5", 
                "17.5", "6.2", "4.02", "6.52", "29.96", "2.99",
                "103.0", "50.7", "22.3"]    
    tickets_total = [text[1], text[3], text[5], text[6], text[12], text[14], 
                     text[17], text[18], text[19], text[20], text[21], text[22],
                     text[23], text[24], text[25]
        ]
    i = 0
    for ticket in tickets_total:
        with open(f'{base_path}{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_total_amount(f'{base_path}{ticket_str}') == expected[i]
            i += 1


#------------------------------------------------------------------------------------------
# CIF/NIF
# def test_get_cif_nif_desconocido():
#     expected = "desconocido"
#     tickets_desconocido = [text[3], text[5], text[9], text[18], text[19], text[6], 
#                            text[24], text[25]
#                            ]
#     for ticket in tickets_desconocido:
#         assert get_cif_nif(f'{base_path}{ticket}') == expected

# def test_get_cif_nif():
#     expected = ["E19545508", "A46103834", "B19667500", "A28017896", 
#                 "A46103834", "B82356981", "B82356981", "A28812618"]    
#     tickets_total = [text[2], text[12], text[16], text[17], 
#                     text[20], text[21], text[22], text[23]
#                     ]
#     i = 0
#     for ticket in tickets_total:
#         with open(f'{base_path}{ticket}', 'r') as file:
#             ticket_str = file.read().lower()
#             assert get_cif_nif(f'{base_path}{ticket_str}') == expected[i]
#             i += 1

#------------------------------------------------------------------------------------------
# Código postal
def test_get_postal_code_desconocido():
    expected = "desconocido"
    tickets_desconocido = [text[2], text[3], text[5], text[9], text[14], text[16], text[17], text[19]]
    for ticket in tickets_desconocido:
        assert get_postal_code(f'{base_path}{ticket}') == expected

def test_get_postal_code_18100():
    expected = "18100"
    tickets_postal_code_18100 = [text[1], text[6], text[21], text[22], text[23], text[24]]
    for ticket in tickets_postal_code_18100:
       with open(f'{base_path}{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_postal_code(f'{base_path}{ticket_str}') == expected

def test_get_postal_code():
    expected = ["18016", "18003", "18016","18008"]    
    tickets_total = [text[12], text[18], text[20], text[25]
                    ]
    i = 0
    for ticket in tickets_total:
        with open(f'{base_path}{ticket}', 'r') as file:
            ticket_str = file.read().lower()
            assert get_postal_code(f'{base_path}{ticket_str}') == expected[i]
            i += 1