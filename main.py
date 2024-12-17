zmienne = {}
zmienne[0] = 1
def multiply(x, y):
    global zmienne  # Deklaracja użycia zmiennej globalnej
    zmienne[0] += x * y
    return zmienne[0]  # Wypisanie wyniku