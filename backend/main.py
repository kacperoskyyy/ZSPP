import fastapi as _fastapi
import fastapi.security as _security
from typing import List
import sqlalchemy.orm as _orm

import services as _services, schemas as _schemas, auth as _auth, models as _models

app = _fastapi.FastAPI()

## TEST ##


# Test to see if api is working fine
@app.get("/api/test")
async def root():
    return {"message": "Success"}


## USERS ##


# Rejestracja nowego użytkownika
@app.post("/api/register")
async def register(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    pass


# Logowanie użytkownika i generowanie tokena JWT
@app.post("/api/login")
async def login(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.get_user_by_email(form_data.username, db)

    if not user or not _models.User.verify_password(user, form_data.password):
        raise _fastapi.HTTPException(status_code=400, detail="Invalid credentials")

    token = _auth.create_access_token(data={"sub": str(user.id)})

    return {"access_token": token, "token_type": "bearer"}


# Pobieranie danych zalogowanego użytkownika
@app.get("/api/users/me", response_model=_schemas.UserRead)
async def get_current_user(
    user: _schemas.UserRead = _fastapi.Depends(_auth.get_current_user),
):
    return user


# Pobieranie informacji o konkretnym użytkowniku (tylko dla admina)
@app.get("/api/users/{id}", response_model=_schemas.UserRead)
async def get_specific_user(
    user_id: int,
    admin_user: _schemas.UserCreate = _fastapi.Depends(_auth.get_admin_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_user_by_id(user_id, db)


# Tworzenie nowego użytkownika i automatyczne generowanie tokena
@app.post("/api/users")
async def create_user(
    user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    user = await _services.create_user(user, db)
    token = _auth.create_access_token(data={"sub": str(user.id)})

    return {"access_token": token, "token_type": "bearer"}


# Usuwanie użytkownika
@app.delete("/api/users/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    admin_user: _schemas.UserCreate = _fastapi.Depends(_auth.get_admin_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.delete_user(user_id, db)


# Aktualizacja danych użytkownika
@app.put("/api/users/{user_id}", status_code=200)
async def update_user(
    user_id: int,
    user_data: _schemas.UserUpdate,
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.update_user(user_id, user_data, db)


## RESERVATIONS ##


# Tworzenie nowej rezerwacji
@app.post("/api/reservations")
async def create_reservation(
    reservation: _schemas.ReservationCreate,
    user: _schemas.UserRead = _fastapi.Depends(_auth.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_reservation(reservation, user.id, db)


# Pobieranie informacji o konkretnej rezerwacji
@app.get("/api/reservations/{reservation_id}")
async def get_reservation(
    reservation_id: int,
    user: _schemas.UserRead = _fastapi.Depends(_auth.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_reservation(reservation_id, user.id, db)


# Pobieranie wszystkich rezerwacji użytkownika
@app.get("/api/reservations")
async def get_all_reservations(
    user: _schemas.UserRead = _fastapi.Depends(_auth.get_current_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_user_reservations(user.id, db)


## EQUIPMENT ##


# Pobieranie listy sprzętu
@app.get("/api/equipment")
async def get_equipment(
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_all_equipment(db)


# Pobieranie konkretnego sprzętu
@app.get("/api/equipment/{equipment_id}")
async def get_specific_equipment(
    equipment_id: int,
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_equipment(equipment_id, db)


# Tworzenie nowego sprzętu (tylko dla administratorów)
@app.post("/api/equipment")
async def create_equipment(
    equipment: _schemas.EquipmentCreate,
    admin_user: _schemas.UserCreate = _fastapi.Depends(_auth.get_admin_user),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_equipment(equipment, db)


## ADMIN ##


# Pobieranie wszystkich użytkowników (dla administratorów)
@app.get("/api/admin/users", response_model=List[_schemas.UserRead])
async def get_users(
    db: _orm.Session = _fastapi.Depends(_services.get_db),
    admin_user: _schemas.UserCreate = _fastapi.Depends(_auth.get_admin_user),
):
    return await _services.get_users(db=db)


# Pobieranie wszystkich rezerwacji w systemie (dla administratorów)
@app.get("/api/admin/reservations/all")
async def get_all_reservations(
    db: _orm.Session = _fastapi.Depends(_services.get_db),
    admin_user: _schemas.UserCreate = _fastapi.Depends(_auth.get_admin_user),
):
    return await _services.get_all_reservations(db)
