import fastapi as _fastapi
import fastapi.security as _security
from typing import List
import sqlalchemy.orm as _orm

import services as _services
import schemas as _schemas
import auth as _auth
import models as _models

app = _fastapi.FastAPI()


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
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")
    new_user = await _services.create_user(user, db)
    token = _auth.create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/api/login")
async def login(
        form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.get_user_by_email(form_data.username, db)
    if not user or not user.verify_password(form_data.password):
        raise _fastapi.HTTPException(status_code=400, detail="Invalid credentials")
    token = _auth.create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


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
        current_user: _schemas.UserRead = _fastapi.Depends(_auth.get_current_user),
):
    updated_user = await _services.update_user(user_update, db, current_user)
    return {"detail": "User updated", "user": updated_user}


# -------------------------
# Endpointy dla rezerwacji (dla zalogowanych użytkowników)
# -------------------------
@app.post("/api/reservations", response_model=_schemas.ReservationRead)
async def create_reservation(
        reservation: _schemas.ReservationCreate,
        current_user: _schemas.UserRead = _fastapi.Depends(_auth.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.create_reservation(reservation, current_user.id, db)


@app.get("/api/reservations/{reservation_id}", response_model=_schemas.ReservationRead)
async def get_reservation(
        reservation_id: int,
        current_user: _schemas.UserRead = _fastapi.Depends(_auth.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_reservation(reservation_id, current_user.id, db)


@app.get("/api/reservations", response_model=List[_schemas.ReservationRead])
async def get_all_user_reservations(
        current_user: _schemas.UserRead = _fastapi.Depends(_auth.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_user_reservations(current_user.id, db)


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
        current_employee: _models.User = _fastapi.Depends(_auth.get_employee_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    return await _services.get_all_reservations(db)


@app.get("/api/employee/support_tickets", response_model=List[_schemas.SupportTicketRead])
async def employee_get_support_tickets(
        current_employee: _models.User = _fastapi.Depends(_auth.get_employee_user),
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
