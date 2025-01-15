import hashlib
import mysql.connector
import string
import random
import datetime
import os

# Wczytaj zmienne środowiskowe z pliku .env

db_host = 'srv1628.hstgr.io'
db_user = 'u335644235_sqlAdmin'
db_password = 'bZ6sCKAU3E'
db_name = 'u335644235_tetris'

def close():
    os._exit(0)

def connect_to_database():
    try:
        db_connection = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name,
            port=3306
        )
        return db_connection
    except mysql.connector.Error:
        return Exception("Błąd bazy danych.")

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
        db_connection = connect_to_database()
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
        
def is_email_available(email):
    try:
        db_connection=connect_to_database()
        cursor=db_connection.cursor()
        query="SELECT COUNT(*) FORM users WHERE LOWER(email) = LOWER(%s);"
        cursor.execute(query,(email,))
        result=cursor.fetchone()
        cursor.close()
        db_connection.close()
        if result[0]>0: #gdy wynik jest inny niz 0 to email jest juz zajety
            return False
        else:
            return True
    except mysql.connector.Error:
        return "Błąd bazy danych"

def register(login,password,email):
    # sprawdzenie poprawnosci maila
    domena=email.split("@")[-1]

    if not is_email_available(email):
        return "Użytkownik o podanym adresie email jest już zarejestrowany."

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
        db_connection = connect_to_database()
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

    
def log(identifier,password):
#haszowanie hasła
    hashed_password=hashowanie_hasla(password)
    
    try:
        #łączenie z bazą danych
        db_connection = connect_to_database()
        cursor = db_connection.cursor()
        if "@" in identifier:
            query = "SELECT password FROM users WHERE email = %s"  #pobranie hasła przypisanego do podanego emaila
        else:
            query = "SELECT password FROM users WHERE login = %s" #pobranie hasła przypisanego do podanego loginu
        cursor.execute(query,(identifier,))
        result=cursor.fetchone()
        #nieprawidłowy login lub email
        if result is None:
            return "Nieprawidłowe dane logowania."
        saved_password=result[0]
        #zamkniecie połączenia
        cursor.close()
        db_connection.close()
        #porównanie pobranego hasła z bazy z podanym przy logowaniu
        if hashed_password==saved_password:
            return 0
        else:
            return "Nieprawidłowe dane logowania."

    except mysql.connector.Error:
        return "Błąd bazy danych."
        
def save(login,xp):
    try:
        db_connection = connect_to_database()
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
        return 0
    except mysql.connector.Error:
        return "Błąd bazy danych."

#pobranie xp użytkownika z bazy
def loadxp(login):
    try:
        db_connection = connect_to_database()
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
        db_connection = connect_to_database()
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
        db_connection = connect_to_database()
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
            return 0
    except mysql.connector.Error:
        return "Błąd bazy danych"
def dodajXP(login, XP):
    obecne = loadxp(login)
    obecne += XP
    save(login,obecne)

def change_password(login, new_password, password):
    if log(login, password) != 0:
        return "Błędne hasło"
    #sprawdzenie poprawności hasła
    if not is_valid_password(new_password):
        return "Hasło musi zawierać minimum 5 znaków, jedną małą i jedną dużą literę oraz jedną cyfrę."
    
    hashed_password = hashowanie_hasla(new_password)
    try:
        db_connection = connect_to_database()
        cursor = db_connection.cursor()

        # sprawdzenie czy użytkownik istnieje i sprawdzenie daty ostatniej zmiany hasłą
        query = "SELECT last_password_change FROM users WHERE login = %s"
        cursor.execute(query, (login,))
        result = cursor.fetchone()

        #zmiana hasła i zaktualizowanie zmiany hasła na obecną datę
        query = "UPDATE users SET password = %s WHERE login = %s"
        cursor.execute(query, (hashed_password, login))
        db_connection.commit()
        cursor.close()
        db_connection.close()
        return 0
    except mysql.connector.Error:
        return "Błąd bazy danych."
def change_login(current_login, new_login, password):
    if log(current_login, password) != 0:
        return "Nieprawidłowe dane"    #sprawdzenie czy login jest dostępny
    if not is_login_available(new_login):
        return "Nazwa użytkownika jest już zajęta."
    #sprawdzenie czy login jest alfanumeryczny i czy znakiem jest "_"
    for char in new_login:
        if not (char.isalnum() or char == "_"):
            return "Login może zawierać tylko litery, cyfry i znak '_'."
    try:
        db_connection = connect_to_database()
        cursor =db_connection.cursor()
        #sprawdzenie czy użytkownik istnieje
        cursor.execute("SELECT COUNT(*) FROM users WHERE login = %s",(current_login,))
        result= cursor.fetchone()
        if result[0]==0:
            return "Użytkownik o podanej nazwie użytkownika nie istnieje."
        #zmiana loginu
        query= "UPDATE users SET  login = %s WHERE login = %s"
        cursor.execute(query,(new_login,current_login))
        db_connection.commit()
        cursor.close()
        db_connection.close()
        return 0
    except mysql.connector.Error:
        return "Błąd bazy danych"

def change_email(login,new_email, password):
    if log(login, password) != 0:
        return "Błędne hasło"
    if not is_valid_email(new_email):
        return "Nowy adres e-mail jest nieprawidłowy."
    if not is_email_available(new_email):
        return "Nowy adres e-mail jest już zajęty."
    try:
        db_connection=connect_to_database()
        cursor=db_connection.cursor()
        # sprawdzenie czy użytkownik istnieje
        cursor.execute("SELECT COUNT(*) FROM users WHERE login = %s", (login,))
        result = cursor.fetchone()
        if result[0] == 0:
            return "Użytkownik o podanej nazwie użytkownika nie istnieje."
        #zmiana email
        query= "UPDATE users SET email = %s WHERE login = %s"
        cursor.execute(query,(new_email,login))
        db_connection.commit()
        cursor.close()
        db_connection.close()
        return 0
    except mysql.connector.Error:
        return "Błąd bazy danych."

def get_login_by_email(email):
    try:
        db_connection=connect_to_database()
        cursor=db_connection.cursor()
        query= "SELECT login FROM users WHERE email = %s;"
        cursor.execute(query,(email,))
        result=cursor.fetchone()
        cursor.close()
        db_connection.close()
        if result:
            return result[0]
        else:
            return "Nie znaleziono użytkownika o podanym adresie email."
    except mysql.connector.Error:
        return "Błąd bazy danych"

#usuwanie użytkownika z bazy danych o podanym loginie
def delete_user_by_login(login):
    try:
        db_connection = connect_to_database()
        cursor = db_connection.cursor()
        # sprawdzenie czy login istnieje w bazie danych
        check_query = "SELECT COUNT(*) FROM users WHERE login = %s;"
        cursor.execute(check_query, (login,))
        result = cursor.fetchone()
        if result[0] == 0:
            cursor.close()
            db_connection.close()
            return "Użytkownik o podanym loginie nie istnieje."
        query = "DELETE FROM users WHERE login = %s;"
        cursor.execute(query,(login,))
        db_connection.commit()
        cursor.close()
        return 0
    except mysql.connector.Error():
        return "Błąd bazy danych."

class Cipher:
    def __init__(self, key_file="key.txt"):
#dodać wiecej znaków jak potrzeba idk jakie mogą występować
        self.chars = " " + string.punctuation + string.digits + string.ascii_letters
        self.chars = list(self.chars)
        self.key_file = key_file
        self.key = self.load_or_generate_key()
#generuje klucz według którego szyfruje lub go oddczytuje jeśli istnieje
    def load_or_generate_key(self):
        if os.path.exists(self.key_file):
            with open(self.key_file, "r") as f:
                return list(f.read().strip())
        else:
            key = self.chars.copy()
            random.shuffle(key)
            with open(self.key_file, "w") as f:
                f.write("".join(key))
            return key
    def encrypt(self, text):
        cipher_text = ""
        for letter in text:
            index = self.chars.index(letter)
            cipher_text += self.key[index]
        return cipher_text
    def decrypt(self, cipher_text):
        text = ""
        for letter in cipher_text:
            index = self.key.index(letter)
            text += self.chars[index]
        return text
cipher = Cipher()
#zapisanie loginu i hasła do pliku
def remember(login, password, filename="data.txt"):
    with open(filename, "w") as f:
        f.write(cipher.encrypt(login) + "\n")
        f.write(cipher.encrypt(password))
#próba automatycznego logowania
def autolog(filename="data.txt"):
    if not os.path.exists(filename):
        print("Brak pliku z zapisanymi danymi logowania.")
        return False
    with open(filename, "r") as f:
        lines = f.readlines()
        if len(lines) < 2:
            print("Plik nie zawiera wystarczających danych logowania.")
            return False
        login = cipher.decrypt(lines[0].strip())
        password = cipher.decrypt(lines[1].strip())
    if not log(login, password):
        return login
#zapisanie xp do pliku
def saveoffline(XP, filename="xp_data.txt"):
    with open(filename, "w") as f:
        f.write(cipher.encrypt(str(XP)))
