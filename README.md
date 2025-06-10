
# ZSPP – Aplikacja Webowa

## 📌 Opis projektu

**ZSPP** to kompleksowa aplikacja webowa wspierająca procesy rejestracji użytkowników, logowania, zarządzania rezerwacjami, płatnościami oraz obsługą klienta. Projekt składa się z:

- **Backendu** zbudowanego w oparciu o [FastAPI](https://fastapi.tiangolo.com/)
- **Frontendu** stworzonego z użyciem [React](https://react.dev/) i [Create React App](https://create-react-app.dev/)

---

## 🏗 Struktura projektu

```
ZSPP/
├── backend/            # Aplikacja backendowa (FastAPI)
│   ├── main.py
│   ├── auth.py
│   ├── services.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── .env
│   └── requirements.txt
├── frontend/           # Aplikacja frontendowa (React)
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md           # Ten plik
```

---

## ⚙️ Wymagania

### Backend (FastAPI):

- Python 3.8+
- FastAPI, Uvicorn
- SQLAlchemy
- passlib
- python-dotenv
- fastapi-mail
- Pydantic

### Frontend (React):

- Node.js (zalecane LTS)
- npm

---

## 🔧 Instalacja

### 1. Klonowanie repozytorium:

```bash
git clone https://github.com/kacperoskyyy/ZSPP/
cd ZSPP
```

---

## 🖥 Backend – FastAPI

### 🔨 Instalacja zależności:

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Linux / macOS
# lub
venv\Scripts\activate           # Windows

pip install -r requirements.txt
```

### 🔐 Konfiguracja `.env`:

Utwórz plik `.env` z zawartością:

```env
DATABASE_URL=sqlite:///./db.sqlite3
JWT_SECRET=testsecret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

MAIL_USERNAME=twoj_email@gmail.com
MAIL_PASSWORD=haslo_lub_app_password
MAIL_FROM=twoj_email@gmail.com
MAIL_FROM_NAME=TwojaAplikacja
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
```

### 🗄️ Tworzenie bazy danych:

```python
import services
services.create_database()
```

### 🚀 Uruchomienie aplikacji:

```bash
uvicorn main:app --reload
```

Aplikacja będzie dostępna pod adresem: [http://localhost:8000](http://localhost:8000)

### 📡 Główne endpointy:

- `POST /api/login` – logowanie
- `POST /api/register` – rejestracja
- `POST /api/password-reset` – żądanie resetu hasła
- `POST /api/password-reset/confirm` – potwierdzenie resetu
- Inne: rezerwacje, płatności, wsparcie itp.

---

## 🌐 Frontend – React

### 🔨 Instalacja zależności:

```bash
cd frontend
npm install
```

### 🚀 Uruchomienie aplikacji:

```bash
npm start
```

Domyślnie otworzy się przeglądarka z adresem: [http://localhost:3000](http://localhost:3000)

### 🛠 Dostępne skrypty:

- `npm start` – uruchamia aplikację w trybie developerskim
- `npm test` – uruchamia testy w trybie interaktywnym
- `npm run build` – buduje aplikację do folderu `build`
- `npm run eject` – (nieodwracalnie) wyodrębnia konfigurację CRA

Więcej: [Create React App – dokumentacja](https://create-react-app.dev/docs/getting-started)

---

## 🤝 Wkład i rozwój

Chcesz pomóc w rozwoju projektu?

- Zgłaszaj błędy jako **Issues**
- Przesyłaj poprawki jako **Pull Requests**
- Komentuj, oceniaj, proponuj

---

## 📄 Licencja

Projekt objęty licencją **MIT**. Szczegóły znajdziesz w pliku [LICENSE](LICENSE).
