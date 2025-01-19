import hashlib
import mysql.connector
import string
import random
import datetime
import smtplib
from email.message import EmailMessage
from random import randint as losuj


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


import os
import platform


def ping_domena(domena):
    # Rozpoznanie systemu operacyjnego
    system = platform.system()

    # Wybór odpowiedniej komendy dla systemu
    if system == "Windows":
        cmd = f"ping -n 1 {domena} > nul"
    else:
        cmd = f"ping -c 1 {domena} > /dev/null 2>&1"

    # Wykonanie polecenia i sprawdzenie wyniku
    return os.system(cmd) == 0

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
        
def save(login, xp):
    print("Zapisuję dane do bazy danych...")
    try:
        db_connection = connect_to_database()
        cursor = db_connection.cursor()

        # Aktualizacja xp niezależnie od wartości best_score
        query_update_xp = "UPDATE users SET xp = %s WHERE login = %s"
        cursor.execute(query_update_xp, (xp, login))

        # Aktualizacja best_score tylko jeśli czy_rekord zwróci True
        if czy_rekord(xp, login):  # xp i login w odpowiedniej kolejności
            query_update_best_score = "UPDATE users SET best_score = %s WHERE login = %s"
            cursor.execute(query_update_best_score, (xp-8, login))

        db_connection.commit()
        cursor.close()
        db_connection.close()
        print("Zapisano dane do bazy danych.")
        return 0

    except mysql.connector.Error as e:
        print(f"Błąd bazy danych: {e}")
        return "Błąd bazy danych."


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

def dodajXP(login, XP):
    obecne = int(loadxp(login))
    obecne += int(XP)
    print(">>> Dodajemy ",XP," do ",login,"")
    return save(login,obecne)

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
    if not ping_domena(new_email.split("@")[-1]):
        return "Adres e-mail nie istnieje"
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
    with open(filename, "a") as f:  # "a" oznacza tryb dopisywania
        f.write(cipher.encrypt(str(XP)) + "\n")  # Dodanie nowej linii po każdej wartości

def send_password_change_email(new_password: str, email_address: str):
    
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SMTP_USER = "tetrissuport@gmail.com"  
    SMTP_PASSWORD = "eect bqew nxtf ltgr"

    subject = "Zmiana hasła - Powiadomienie"
    body = f"""
    Szanowny Użytkowniku,

    Informujemy, że Twoje hasło zostało pomyślnie zmienione.

    Nowe hasło to: {new_password}

    Jeśli to nie Ty inicjowałeś tę zmianę, prosimy o pilny kontakt z naszym zespołem wsparcia.

    Pozdrawiamy.
    Zespół wsparcia
    """

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = email_address
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
            return 0
    except Exception as e:
        return (f"Wystąpił błąd podczas wysyłania e-maila: {e}")


def verify_mail(code: str, email_address: str):
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SMTP_USER = "tetrissuport@gmail.com"
    SMTP_PASSWORD = "eect bqew nxtf ltgr"

    subject = "Weryfikacja - Tetris"
    body = f"""
    Szanowny Użytkowniku,

    Kod to: {code}

    """

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = email_address
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
            return 0
    except Exception as e:
        return (f"Wystąpił błąd podczas wysyłania e-maila: {e}")


def save_settings(eff_vol, msc_vol, fq, offsave):
    
    with open("settings.txt", "w") as file:
        file.write(f"{eff_vol}\n")
        file.write(f"{msc_vol}\n")
        file.write(f"{fq}\n")
        file.write(f"{offsave}\n")

def load_settings():
    try:
        with open("settings.txt", "r") as file:
            lines = file.readlines()
        # Spróbuj przekonwertować każdą linię na liczbę całkowitą
        return [int(line.strip()) for line in lines if line.strip()]
    except FileNotFoundError:
        print("Plik settings.txt nie istnieje.")
        return []
    except ValueError:
        print("Plik zawiera nieprawidłowe dane.")
        return []



def load_off_xp(filename="xp_data.txt"):
    if not ping_domena('google.com'):
        return 0
    if not os.path.exists(filename):
        return False
    
    total_xp = 0
    with open(filename, "r") as f:
        lines = f.readlines()
        for line in lines:
            if line.strip():  
                total_xp += int(cipher.decrypt(line.strip()))
    
    with open(filename, "w") as f:
        os.remove(filename)

    return total_xp


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
        now =datetime.datetime.now()
        #sprawdzenie czy od ostatniej zmiany hasła minęło 30 dni od czasu obecnego
        if (now-last_change).total_seconds()<2592000:
            return "Hasło można zmienić tylko raz na 30 dni"

        else:
            new_password=generate_new_password(7+losuj(0,3))
            hashed_password= hashowanie_hasla(new_password)
            #dodanie nowego zahashowanego hasła do bazy danych przy podanym emailu oraz obecnej daty przy ostatniej zmianie hasła
            update_query= "UPDATE users SET password = %s, last_password_change = %s WHERE email = %s"
            cursor.execute(update_query,(hashed_password,now,email))
            db_connection.commit()
            cursor.close()
            db_connection.close()
            return send_password_change_email(new_password, email)
            return 0
    except mysql.connector.Error:
        return "Błąd bazy danych"

def update_off_xp(login):
    dodajXP(login, load_off_xp())

def czy_rekord(login: str, xp: int) -> bool:
    print("Czy rekord?")
    try:
        # Połączenie z bazą danych
        db_connection = connect_to_database()
        cursor = db_connection.cursor()

        # Zapytanie SQL sprawdzające wartość best_score dla danego loginu
        query = "SELECT best_score FROM users WHERE login = %s"
        cursor.execute(query, (login,))
        result = cursor.fetchone()

        # Jeśli nie znaleziono wiersza, zwróć False
        if not result:
            cursor.close()
            db_connection.close()
            return False

        # Pobierz wartość best_score
        best_score = result[0]

        # Porównanie xp z best_score
        if xp > best_score:
            # Aktualizacja best_score w bazie danych
            update_query = "UPDATE users SET best_score = %s WHERE login = %s"
            cursor.execute(update_query, (xp, login))
            db_connection.commit()

            # Zamknij połączenie i zwróć True
            cursor.close()
            db_connection.close()
            return True

        # Jeśli xp nie jest większe, zwróć False
        cursor.close()
        db_connection.close()
        return False

    except mysql.connector.Error as e:
        print(f"Błąd bazy danych: {e}")
        return False