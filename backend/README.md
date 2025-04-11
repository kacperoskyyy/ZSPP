# FastAPI Application - Projekt Aplikacji Webowej

## Opis projektu

Ten projekt to przykładowa aplikacja webowa zbudowana przy użyciu FastAPI.  
Aplikacja obsługuje logowanie, rejestrację, reset hasła oraz inne endpointy związane z obsługą użytkowników, rezerwacji, płatności, zgłoszeń supportowych itp.  
Dodatkowo, projekt zawiera konfigurację wysyłki e-maili przy użyciu fastapi-mail.

## Wymagania

- Python 3.8+
- FastAPI
- Uvicorn
- SQLAlchemy
- passlib
- python-dotenv
- fastapi-mail
- Pydantic

## Instalacja

1. **Sklonuj repozytorium:**
```bash
git clone https://github.com/kacperoskyyy/ZSPP/
cd ZSPP
```

2. **Utwórz i aktywuj wirtualne środowisko (zalecane):**

   - **Windows:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

   - **Linux/MacOS:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Zainstaluj wymagane biblioteki:**
```bash
pip install -r requirements.txt
```

Przykładowa zawartość pliku `requirements.txt`:
```bash
fastapi==0.95.1
uvicorn==0.21.1
sqlalchemy==1.4.46
passlib==1.7.4
python-dotenv==1.0.0
fastapi-mail==1.0.5
pydantic==1.10.2
```

## Konfiguracja środowiska

Przed uruchomieniem aplikacji utwórz plik `.env` w głównym katalogu projektu i dodaj następujące zmienne środowiskowe (dostosuj wartości do swoich potrzeb):

```env
# Konfiguracja bazy danych
DATABASE_URL=sqlite:///./db.sqlite3

# Konfiguracja JWT
JWT_SECRET=testsecret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Konfiguracja e-maila (przykład dla Gmaila)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_email_password_or_app_password
MAIL_FROM=your_email@gmail.com
MAIL_FROM_NAME=TwojaAplikacja
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
```

## Tworzenie bazy danych

Aby utworzyć bazę danych, uruchom interpreter Pythona w katalogu projektu i wykonaj:

```python
import services
services.create_database()
```

Funkcja ta stworzy wszystkie tabele oraz zainicjuje domyślne dane (np. konto administratora), jeśli jeszcze nie istnieją.

## Uruchomienie aplikacji

Aby uruchomić serwer FastAPI, użyj komendy:

```bash
uvicorn main:app --reload
```

- `main` to nazwa pliku (bez rozszerzenia `.py`), w którym znajduje się obiekt `app` stworzony przez FastAPI.
- `--reload` umożliwia automatyczne przeładowanie serwera przy każdej zmianie w kodzie.

## Endpointy

- **Logowanie:**  
  `POST /api/login`  
  Dane przesyłane w formacie `application/x-www-form-urlencoded` (pola `username` i `password`).

- **Rejestracja:**  
  `POST /api/register`  
  Dane przesyłane jako JSON, np.:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password",
    "first_name": "Imię",
    "last_name": "Nazwisko",
    "phone_number": "123456789",
    "gender": true,
    "birth_date": "YYYY-MM-DD"
  }
  ```

- **Reset hasła:**  
  - Wysłanie żądania resetu hasła: `POST /api/password-reset` (JSON z kluczem `"email"`).
  - Potwierdzenie resetu hasła: `POST /api/password-reset/confirm` (JSON: `{"token": "...", "new_password": "..."}`).

- **Inne endpointy:**  
  Aplikacja zawiera także endpointy związane z rezerwacjami, płatnościami, opiniami użytkowników, zgłoszeniami do supportu itp.

## Wysyłka e-maili

Projekt wykorzystuje **fastapi-mail** do wysyłki wiadomości (np. resetujących hasło). Funkcja `send_reset_email` w pliku `services.py` korzysta z konfiguracji `ConnectionConfig`, która pobiera dane z pliku `.env`.

## Struktura projektu

```
.
├── main.py               # Główny plik aplikacji FastAPI
├── models.py             # Definicje modeli bazy danych (SQLAlchemy)
├── schemas.py            # Definicje schematów (Pydantic)
├── services.py           # Logika biznesowa, w tym wysyłanie e-maili i tworzenie bazy
├── database.py           # Konfiguracja bazy danych
├── requirements.txt      # Lista zależności
├── .env                  # Plik konfiguracji środowiskowej
└── README.md             # Ten plik
```

## Wkład / Kontrybucje

Jeżeli chcesz przyczynić się do rozwoju projektu:

- **Issues:** Zgłaszaj błędy lub sugestie jako issues na GitHub.
- **Pull requests:** Wysyłaj je z opisem wprowadzonych zmian.
- **Kontakt:** Jeśli masz pytania, możesz się skontaktować przez e-mail lub kanały społecznościowe.

## Licencja

Projekt jest dostępny na licencji MIT. Szczegóły znajdują się w pliku [LICENSE](LICENSE).
