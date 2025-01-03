import webview
import os
import hashlib
import mysql.connector
import string
import random
import datetime
def close():
    os._exit(0)

def rotate(T,d):
    if d==1:
        return [[T[3 - j][i] for j in range(4)] for i in range(4)]
    elif d==-1:
        return [[T[j][3 - i] for j in range(4)] for i in range(4)]

#funkcja umieszcza figure(piece-tablica 4x4) na planszy(board(20x20) w kolumnie(column)
def apply_piece_to_board(board, piece, column):
    rows, cols = len(board), len(board[0])
#stworzenie listy ze wspolrzendnymi i kolorem figury 
    piece_shape = []
    for i in range(4):
        for j in range(4):
            if piece[i][j] != []:
                piece_shape.append((i, j, piece[i][j]))
#wyszukiwanie najnizszej pozycji do umieszczenia figury 
    lowest_row = rows - 1
    for r in range(rows):
        for row_piece, col_piece, color in piece_shape:
            board_row = r + row_piece
            board_col = column + col_piece

            if board_row >= rows or board[board_row][board_col] != []:
                lowest_row = r - 1
                break
        else:
            continue
        break
#wypisanie game over jesli figura sie nie miesci 
    if lowest_row < 0:
        return "Game Over"

    new_board = [row[:] for row in board]
#dodanie figury do nowej kopii planszy
    for row_piece, col_piece, color in piece_shape:
        new_board[lowest_row + row_piece][column + col_piece] = color

    return new_board

def hashowanie_hasla(password):
    #haszuje hasło przy użyciu algorytmu SHA-256.
    hash_object = hashlib.sha256()
    hash_object.update(password.encode()) #zamiana hasła na ciąg bajtów
    return hash_object.hexdigest() #zwraca hasło jako ciąg znaków

def ping_domena(domena):
    return os.system(f"ping -c 1 {domena} > /dev/null 2>&1") == 0 #jesli zwraca 0 to znaczy ze domena istnieje

#sprawdzenie czy email zawiera jedna "@" i co najmniej jedna "." po "@"
def is_valid_email(email):
    has_at = False
    has_dot_after_at = False
    at_index = -1

    for i, char in enumerate(email):
        if char == "@":
            if has_at:  #więcej niż jedno '@'
                return False
            has_at = True
            at_index = i
        elif char == "." and has_at:  # czy zawiera '.' po '@'
            has_dot_after_at = True
    return has_at and has_dot_after_at and at_index < len(email) - 1
    
#warunki do możliwości wprowadzenia hasła: min. jedna duża,mała litera;min. jedna cyfra;min. 5 znaków
def is_valid_password(password):
    has_low_ch= False
    has_up_ch=False
    has_digit=False
    if len(password)<5:
        return False
    for char in password:
        if char.islower():
            has_low_ch=True
        elif char.isupper():
            has_up_ch=True
        elif char.isdigit():
            has_digit=True
    return has_digit and has_up_ch and has_low_ch
    
#sprawdzanie czy login jest dostępny
def is_login_available(login):
    try:
        # łączenie z bazą danych
        db_connection = mysql.connector.connect(
            host="srv1628.hstgr.io",
            user="u335644235_sqlAdmin",
            password="bZ6sCKAU3E",
            database="u335644235_tetris",
            port=3306
        )
        cursor = db_connection.cursor()
        query = "SELECT COUNT(*) FROM users WHERE LOWER(login) = LOWER(%s);"
        cursor.execute(query,(login,))
        result=cursor.fetchone()
        cursor.close()
        db_connection.close()
        if result[0]>0: #jeśli jest jakiś wynik inny niż 0 to znaczy że już jest zajęty
            return False
        else:
            return True
    except mysql.connector.Error:
        return Exception("Błąd bazy danych.")

def register(login,password,email):
    # sprawdzenie poprawnosci maila
    domena=email.split("@")[-1]

    if not is_valid_email(email):
        return "Nieprawidłowy adres e-mail."

    #sprawdzenie czy mail istnieje za pomoca pingowania
    if not ping_domena(domena):
        return "Nieprawidłowy adres e-mail"

    #sprawdzenie czy login jest alfanumeryczny i czy nie zawiera innych znaków specjalnych oprócz "_"
    for char in login:
        if not (char.isalnum() or char == "_"):
            return "Login może zawierać tylko litery, cyfry i znak '_'."
    #sprawdzenie czy login jest dostępny
        if not is_login_available(login):
            return "Login jest już zajęty."
    #haszowanie hasla
    if is_valid_password(password):
        hashed_password=hashowanie_hasla(password)
    else:
        return "Hasło musi zawierać minimum 5 znaków, jedną małą i jedną dużą literę oraz jedną cyfrę"

    try:
        #łączenie z bazą danych
        db_connection = mysql.connector.connect(
            host="srv1628.hstgr.io",
            user="u335644235_sqlAdmin",
            password="bZ6sCKAU3E",
            database="u335644235_tetris",
            port=3306
        )
        cursor = db_connection.cursor()

        #zapisywanie danych użytkownika podanych przy rejestracji w bazie danych
        query = "INSERT INTO users (login, password, email) VALUES (%s, %s, %s)"
        cursor.execute(query, (login, hashed_password, email)) #przesłanie zapytania sql do bazy danych
        #zatwierdzenie zmian w bazie danych
        db_connection.commit()

        # zamknięcie połączenia
        cursor.close()
        db_connection.close()
        return 0

    except mysql.connector.Error:
        return Exception("Błąd bazy danych.")

    
def log(login,password):
#haszowanie hasła
    hashed_password=hashowanie_hasla(password)
    
    try:
        #łączenie z bazą danych
        db_connection = mysql.connector.connect(
            host="srv1628.hstgr.io",
            user="u335644235_sqlAdmin",
            password="bZ6sCKAU3E",
            database="u335644235_tetris",
            port=3306
        )
        cursor = db_connection.cursor()
        query = "SELECT password FROM users WHERE login = %s" #pobranie hasła przypisanego do podanego loginu
        cursor.execute(query,(login,))
        result=cursor.fetchone()
        #nieprawidłowy login
        if result is None:
            return "Nie znaleziono nazwy użytkownika."
        saved_password=result[0]
        #zamkniecie połączenia
        cursor.close()
        db_connection.close()
        #porównanie pobranego hasła z bazy z podanym przy logowaniu
        if hashed_password==saved_password:
            return "Zalogowano."
        else:
            return "Nieprawidłowe hasło."

    except mysql.connector.Error:
        return "Błąd bazy danych."
        
def save(login,xp):
    try:
        db_connection = mysql.connector.connect(
            host="srv1628.hstgr.io",
            user="u335644235_sqlAdmin",
            password="bZ6sCKAU3E",
            database="u335644235_tetris",
            port=3306
        )
        cursor = db_connection.cursor()
        #sprawdzenie czy użytkownik o tej nazwie istnieje w bazie danych
        cursor.execute("SELECT COUNT(*) FROM users WHERE login = %s", (login,))
        result = cursor.fetchone()
        if result[0]==0:
            cursor.close()
            db_connection.close()
            return "Użytkownik o podanej nazwie nie istnieje"
        #aktualizacja xp
        query = "UPDATE users SET xp = %s WHERE login = %s"
        cursor.execute(query,(xp,login))
        db_connection.commit()
        cursor.close()
        db_connection.close()
        return "Zaktualizowano XP użytkownika"
    except mysql.connector.Error:
        return "Błąd bazy danych."

#pobranie xp użytkownika z bazy
def loadxp(login):
    try:
        db_connection = mysql.connector.connect(
            host="srv1628.hstgr.io",
            user="u335644235_sqlAdmin",
            password="bZ6sCKAU3E",
            database="u335644235_tetris",
            port=3306
        )
        cursor = db_connection.cursor()
        cursor.execute("SELECT xp FROM users WHERE login = %s",(login,)) #pobranie xp
        result=cursor.fetchone()
        #sprawdzenie czy użytkownik istnieje
        if result:
            xp =result[0]
            cursor.close()
            db_connection.close()
            return xp #wypisanie xp
        else:
            cursor.close()
            db_connection.close()
            return "Użytkownik o podanej nazwie nie istnieje"
    except mysql.connector.Error:
        return "Błąd bazy danych"

#zwracanie loginow użytkownikow wraz z xp posortowanych malejąco według xp
def leaderboard():
    try:
        db_connection = mysql.connector.connect(
            host="srv1628.hstgr.io",
            user="u335644235_sqlAdmin",
            password="bZ6sCKAU3E",
            database="u335644235_tetris",
            port=3306
        )
        cursor = db_connection.cursor()
        cursor.execute("SELECT login, xp FROM users ORDER BY xp DESC")
        result=cursor.fetchall()
        ranking=[[login,xp] for login,xp in result]
        cursor.close()
        db_connection.close()
        return ranking
    except mysql.connector.Error:
        return "Błąd bazy danych"

#generowanie nowego hasła

def generate_new_password(length=5): #na wstępie ustalamy długość 5 aby była zgodna z wymaganiami
#tworzenie nowego hasła zgodnie z wymaganiami
    password = (
        random.choice(string.ascii_lowercase) +  # conajmniej 1 mała litera
        random.choice(string.ascii_uppercase) +  # conajmniej 1 duża litera
        random.choice(string.digits) +          # conajmniej 1 cyfra
        ''.join(random.choices(string.ascii_letters + string.digits, k=length - 3)) #wybieranie dwóch dodatkowych znakow z liter i cyfr
    )

    #losowe mieszanie wszystkich znaków w długości hasła
    password = ''.join(random.sample(password, len(password)))
    return password

def reset_password(email):
    try:
        db_connection = mysql.connector.connect(
            host="srv1628.hstgr.io",
            user="u335644235_sqlAdmin",
            password="bZ6sCKAU3E",
            database="u335644235_tetris",
            port=3306
        )
        cursor = db_connection.cursor()
        #sprawdzenie czy email jest w bazie danych
        query = "SELECT last_password_change FROM users WHERE email = %s"
        cursor.execute(query,(email,))
        result = cursor.fetchone()
        if not result:
            return "Podany email nie jest zarejestrowany."
        last_change=result[0]
        now =datetime.now()
        #sprawdzenie czy od ostatniej zmiany hasła minęło 30 dni od czasu obecnego
        if (now-last_change).total_seconds()<2592000:
            return "Hasło można zmienić tylko raz na 30 dni"

        else:
            new_password=generate_new_password()
            hashed_password= hashowanie_hasla(new_password)
            #dodanie nowego zahashowanego hasła do bazy danych przy podanym emailu oraz obecnej daty przy ostatniej zmianie hasła
            update_query= "UPDATE users SET password = %s, last_password_change = %s WHERE email = %s"
            cursor.execute(update_query,(hashed_password,now,email))
            db_connection.commit()
            cursor.close()
            db_connection.close()
            return "Hasło zostało zresetowane"
    except mysql.connector.Error:
        return "Błąd bazy danych"
