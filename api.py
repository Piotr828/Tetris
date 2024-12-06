import json


def send_to_js(value, name):
    name = str(name)

    # Sprawdzenie typu danych i konwersja
    if isinstance(value, (list, dict)):
        # Konwersja złożonych typów na JSON
        value = json.dumps(value)
    elif isinstance(value, str):
        # Stringi zapisujemy w formie tekstu, dodając cudzysłowy
        value = f'"{value}"'
    else:
        # Dla innych typów (liczby, boolean) konwersja na string
        value = str(value)

    # Dopisanie do pliku api.js
    with open('api.js', 'a') as file:
        file.write(f"pyvars['{name}'] = {value};\n")