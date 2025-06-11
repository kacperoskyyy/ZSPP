import secrets

import fastapi as _fastapi
import fastapi.security as _security
from typing import List
import sqlalchemy.orm as _orm
from fastapi import BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
import datetime as _dt
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from contextlib import asynccontextmanager

import services as _services
import schemas as _schemas
import auth as _auth
import models as _models

# -------------------------
# Uruchamianie aktualizacji wypożyczeń raz na dzień
# -------------------------


@asynccontextmanager
async def lifespan(app: _fastapi.FastAPI):
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        _services.expire_reservations,
        CronTrigger(hour=0, minute=5),
    )
    scheduler.start()

    yield
    scheduler.shutdown()

app = _fastapi.FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",  # adres Twojej aplikacji React
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

password_reset_tokens = {}

UPLOAD_DIR = "public/uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


# -------------------------
# Publiczne endpointy
# -------------------------
@app.get("/api/test")
async def test_endpoint():
    return {"message": "API działa poprawnie"}


@app.get("/api/equipment", response_model=List[_schemas.EquipmentRead])
async def public_get_equipment(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_all_equipment(db)


@app.get("/api/categories", response_model=List[_schemas.CategoryRead])
async def public_get_categories(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_categories(db)


@app.get("/api/locations", response_model=List[_schemas.LocationRead])
async def public_get_locations(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    # Funkcja get_all_locations powinna zwracać wszystkie lokalizacje
    return await _services.get_all_locations(db)


@app.post("/api/register")
async def register(
        user: _schemas.UserCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    print(user)
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(
            status_code=400, detail="Email already in use")

    new_user = await _services.create_user(user, db)
    token = _auth.create_access_token(data={"sub": str(new_user.id)})

    # Przygotowanie danych użytkownika do zwrócenia na front-end
    user_data = {
        "id": new_user.id,
        "email": new_user.email,
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "phone_number": new_user.phone_number,
        "role": new_user.role,
        "profile_image": new_user.profile_image,
        "created_at": str(new_user.created_at)
    }

    return {"access_token": token, "token_type": "bearer", "user": user_data}


@app.post("/api/login")
async def login(
        form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.get_user_by_email(form_data.username, db)
    if not user or not user.verify_password(form_data.password):
        raise _fastapi.HTTPException(
            status_code=400, detail="Invalid credentials")
    token = _auth.create_access_token(data={"sub": str(user.id)})

    user_data = {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "profile_image": user.profile_image
    }
    return {"access_token": token, "token_type": "bearer", "user": user_data}


@app.post("/api/password-reset")
async def request_password_reset(
        payload: _schemas.PasswordResetRequest,
        background_tasks: BackgroundTasks,
        db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    user = db.query(_models.User).filter(
        _models.User.email == payload.email).first()
    # Zawsze zwracamy tę samą wiadomość, aby nie ujawniać, czy konto istnieje.
    if user:
        token = secrets.token_hex(16)  # generujemy unikalny token
        password_reset_tokens[token] = {
            "email": payload.email, "created_at": _dt.datetime.now()}
        reset_link = f"http://localhost:3000/reset-password?token={token}"
        background_tasks.add_task(
            _services.send_reset_email, payload.email, reset_link)
    return {"message": "Jeśli konto istnieje, wkrótce otrzymasz e-mail z instrukcjami resetu hasła."}


# Endpoint potwierdzający reset hasła – zmiana hasła
@app.post("/api/password-reset/confirm")
async def confirm_password_reset(
        payload: _schemas.PasswordResetConfirm,
        db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    token_data = password_reset_tokens.get(payload.token)
    if not token_data:
        raise _fastapi.HTTPException(
            status_code=400, detail="Nieprawidłowy lub wygasły token.")

    # Przyjmijmy, że token jest ważny 1 godzinę (3600 sekund)
    if (_dt.datetime.now() - token_data["created_at"]).total_seconds() > 3600:
        del password_reset_tokens[payload.token]
        raise _fastapi.HTTPException(status_code=400, detail="Token wygasł.")

    user = db.query(_models.User).filter(
        _models.User.email == token_data["email"]).first()
    if not user:
        raise _fastapi.HTTPException(
            status_code=400, detail="Użytkownik nie istnieje.")

    import passlib.hash as _hash
    user.password_hash = _hash.bcrypt.hash(payload.new_password)
    db.add(user)
    db.commit()
    # Usuwamy token, aby nie można było go ponownie użyć
    del password_reset_tokens[payload.token]
    return {"message": "Hasło zostało pomyślnie zresetowane."}


# -------------------------
# Endpointy dla użytkowników (zalogowanych)
# -------------------------

@app.get("/api/users/me", response_model=_schemas.UserRead)
async def read_current_user(
        current_user: _models.User = _fastapi.Depends(_auth.get_current_user),
):
    return current_user


@app.get("/api/users/{user_id}", response_model=_schemas.UserRead)
async def get_specific_user(
        user_id: int,
        admin_user: _models.User = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_user_by_id(user_id, db)


@app.put("/api/users/", status_code=200)
async def update_user(
        user_update: _schemas.UserUpdate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        current_user: _schemas.UserRead = _fastapi.Depends(
            _auth.get_current_user),
):
    updated_user = await _services.update_user(user_update, db, current_user)
    return {"detail": "User updated", "user": updated_user}


@app.post("/api/users/me/upload-profile-image", response_model=_schemas.UserRead)
async def upload_profile_image(
        file: _fastapi.UploadFile = _fastapi.File(...),
        current_user: _models.User = _fastapi.Depends(_auth.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    allowed_extensions = ['jpg', 'jpeg', 'png', 'gif']
    ext = file.filename.split(".")[-1].lower()
    if ext not in allowed_extensions:
        raise _fastapi.HTTPException(
            status_code=400, detail="Invalid file extension")

    file_name = f"user_{current_user.id}_{file.filename}"
    file_location = os.path.join(UPLOAD_DIR, file_name)

    with open(file_location, "wb") as buffer:
        _orm.shutil.copyfileobj(file.file, buffer)

    relative_path = os.path.join("uploads", file_name)

    current_user.profile_image = relative_path
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user


# -------------------------
# Endpointy dla rezerwacji (dla zalogowanych użytkowników)
# -------------------------
@app.post("/api/reservations", response_model=_schemas.ReservationRead)
async def create_reservation(
        reservation: _schemas.ReservationCreate,
        current_user: _schemas.UserRead = _fastapi.Depends(
            _auth.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_reservation(reservation, current_user.id, db)


@app.get("/api/reservations/{reservation_id}", response_model=_schemas.ReservationRead)
async def get_reservation(
        reservation_id: int,
        current_user: _schemas.UserRead = _fastapi.Depends(
            _auth.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_reservation(reservation_id, current_user.id, db)


@app.get("/api/reservations", response_model=List[_schemas.ReservationRead])
async def get_all_user_reservations(
        current_user: _schemas.UserRead = _fastapi.Depends(
            _auth.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_user_reservations(current_user.id, db)


@app.delete("/api/reservations/{reservation_id}", status_code=204)
async def delete_reservations(
        reservation_id: int,
        current_user: _schemas.UserRead = _fastapi.Depends(
            _auth.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.delete_reservations(reservation_id, current_user.id, db)


# -------------------------
# Endpointy dla sprzętu
# -------------------------
@app.get("/api/equipment/{equipment_id}", response_model=_schemas.EquipmentRead)
async def get_specific_equipment(
        equipment_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_equipment(equipment_id, db)


# -------------------------
# Endpointy dla kategorii
# -------------------------
@app.get("/api/category", response_model=List[_schemas.CategoryRead])
async def get_categories(
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_categories(db)


@app.get("/api/category/{category_id}", response_model=_schemas.CategoryRead)
async def get_category(
        category_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_category_by_id(category_id, db)


@app.delete("/api/category/{category_id}", status_code=204)
async def delete_category(
        category_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
):
    await _services.delete_category(category_id, db)


# -------------------------
# Endpointy dla płatności
# -------------------------
@app.get("/api/payments")
async def get_all_payments(
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_all_payments(db)


@app.post("/api/payments")
async def create_payment(
        payment: _schemas.PaymentCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_payment(payment, db)


# -------------------------
# Endpointy dla opinii
# -------------------------
@app.get("/api/reviews")
async def get_all_reviews(
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_all_reviews(db)


@app.post("/api/reviews")
async def create_review(
        review: _schemas.ReviewCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_review(review, db)


# -------------------------
# Endpointy dla zgłoszeń supportowych
# -------------------------

@app.post("/api/support_tickets")
async def create_ticket(
        ticket: _schemas.SupportTicketCreate,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_ticket(ticket, db)


# -------------------------
# Endpointy dla pracowników
# -------------------------
@app.get("/api/employee/reservations", response_model=List[_schemas.ReservationRead])
async def employee_get_reservations(
        current_employee: _models.User = _fastapi.Depends(
            _auth.get_employee_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_all_reservations(db)


@app.get("/api/employee/support_tickets", response_model=List[_schemas.SupportTicketRead])
async def employee_get_support_tickets(
        current_employee: _models.User = _fastapi.Depends(
            _auth.get_employee_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_all_tickets(db)


# -------------------------
# Endpointy dla administratora
# -------------------------
@app.get("/api/admin/users", response_model=List[_schemas.UserRead])
async def admin_get_all_users(
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
):
    return await _services.get_users(db)


@app.delete("/api/admin/users/{user_id}")
async def admin_delete_user(
        user_id: int,
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    await _services.delete_user(user_id, db)
    return {"detail": "User successfully deleted"}


@app.post("/api/admin/equipment", response_model=_schemas.EquipmentRead)
async def admin_create_equipment(
        equipment: _schemas.EquipmentCreate,
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_equipment(equipment, db)


@app.post("/api/admin/categories", response_model=_schemas.CategoryRead)
async def admin_create_category(
        category: _schemas.CategoryCreate,
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_category(category, db)


@app.post("/api/admin/locations", response_model=_schemas.LocationRead)
async def admin_create_location(
        location: _schemas.LocationCreate,
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_location(location, db)


@app.get("/api/admin/locations/{location_id}", response_model=_schemas.LocationRead)
async def admin_get_location(
        location_id: int,
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
):
    return await _services.get_location(location_id, db)


@app.post("/api/admin/equipment_transport", response_model=_schemas.EquipmentTransportRead)
async def admin_create_equipment_transport(
        transport: _schemas.EquipmentTransportCreate,
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_equipment_transport(transport, db)


@app.post("/api/admin/equipment_transport_items", response_model=_schemas.EquipmentTransportItemRead)
async def admin_create_transport_item(
        item: _schemas.EquipmentTransportItemCreate,
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_equipment_transport_item(item, db)


@app.get("/api/admin/reservations/all", response_model=List[_schemas.ReservationRead])
async def admin_get_all_reservations(
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
):
    return await _services.get_all_reservations(db)


@app.get("/api/admin/reports")
async def admin_get_all_reports(
        db: _orm.Session = _fastapi.Depends(_services.get_db),
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
):
    return await _services.get_all_reports(db)


@app.post("/api/admin/reports")
async def admin_create_report(
        report: _schemas.AdminReportCreate,
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_report(report, db)

@app.get("/api/admin/generate-report/{reportType}")
async def admin_generate_report(
        reportType: str,
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    print("dupa")
    return await _services.generate_report(reportType, db)

@app.delete("/api/admin/locations/{location_id}")
async def admin_delete_location(
        location_id: int,
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.delete_location(location_id, db)


@app.post("/api/admin/equipment/{equipment_id}/upload-image", response_model=_schemas.EquipmentImageRead)
async def upload_equipment_image(
        equipment_id: int,
        file: _fastapi.UploadFile = _fastapi.File(...),
        admin_user: _schemas.UserRead = _fastapi.Depends(_auth.get_admin_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    allowed_extensions = ['jpg', 'jpeg', 'png', 'gif']
    ext = file.filename.split(".")[-1].lower()
    if ext not in allowed_extensions:
        raise _fastapi.HTTPException(
            status_code=400, detail="Invalid file extension")

    file_name = f"equipment_{equipment_id}_{file.filename}"
    file_location = os.path.join(UPLOAD_DIR, file_name)

    with open(file_location, "wb") as buffer:
        _orm.shutil.copyfileobj(file.file, buffer)

    relative_path = os.path.join("uploads", file_name)

    image_data = _schemas.EquipmentImageCreate(
        equipment_id=equipment_id, image_path=relative_path)
    new_image = await _services.create_equipment_image(image_data, db)

    return _schemas.EquipmentImageRead.model_validate(new_image)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
