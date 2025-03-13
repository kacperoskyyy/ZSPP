import passlib.hash as _hash
import sqlalchemy.orm as _orm
import database as _database
import models as _models
import schemas as _schemas
import datetime as _dt
import fastapi as _fastapi


# --- Inicjalizacja bazy danych z konsoli (py import services services.create_database())---
def create_database():
    _database.Base.metadata.create_all(bind=_database.engine)

    db = _database.SessionLocal()

    try:
        existing_admin = (
            db.query(_models.User)
            .filter(_models.User.email == "admin@admin.com")
            .first()
        )
        if not existing_admin:
            admin_data = _models.User(
                first_name="Admin",
                last_name="User",
                phone_number="123456789",
                email="admin@admin.com",
                password_hash=_hash.bcrypt.hash("admin"),
                role="admin",
            )
            db.add(admin_data)
            db.commit()
            db.refresh(admin_data)

    finally:
        db.close()


# --- Generator sesji bazy danych ---
def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Pobieranie użytkownika po emailu ---
async def get_user_by_email(email: str, db: _orm.Session):
    user = db.query(_models.User).filter(_models.User.email == email).first()
    if user:
        return user
    # raise _fastapi.HTTPException(status_code=404, detail="User not found")


# --- Pobieranie użytkownika po id ---
async def get_user_by_id(id: int, db: _orm.Session):
    user = db.query(_models.User).filter(_models.User.id == id).first()
    if user:
        return user
    raise _fastapi.HTTPException(status_code=404, detail="User not found")


# --- Zmiana roli użytkownika ---
async def change_role(email: str, role: str, db: _orm.Session):
    user_db = db.query(_models.User).filter(_models.User.email == email).first()

    if user_db:
        user_db.role = role
        user_db.updated_at = _dt.datetime.now()

        db.commit()
        db.refresh(user_db)


# Do implementacji tworzenie użytkownika po dodaniu weryfikacji maila


# --- Tworzenie nowego użytkownika ---
async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        email=user.email,
        password_hash=_hash.bcrypt.hash(user.hash_password),
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


# --- Pobieranie listy użytkowników ---
async def get_users(db: _orm.Session):
    users = db.query(_models.User).all()
    return [_schemas.UserRead.model_validate(user) for user in users]


# --- Usuwanie użytkownika ---
async def delete_user(user_id: int, db: _orm.Session):
    user = db.query(_models.User).filter(_models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()


# --- Aktualizacja użytkownika ---
async def update_user(
    user_update: _schemas.UserUpdate, db: _orm.Session, current_user: _schemas.UserRead
):
    if current_user.role != "admin" and user_update.id != current_user.id:
        raise _fastapi.HTTPException(status_code=403, detail="Permission denied")

    user = db.query(_models.User).filter(_models.User.id == user_update.id).first()
    if not user:
        raise _fastapi.HTTPException(status_code=404, detail="User not found")

    if user_update.first_name is not None:
        user.first_name = user_update.first_name
    if user_update.last_name is not None:
        user.last_name = user_update.last_name
    if user_update.phone_number is not None:
        user.phone_number = user_update.phone_number
    if user_update.email is not None:
        user.email = user_update.email

    user.updated_at = _dt.datetime.now()

    db.commit()
    db.refresh(user)
    return _schemas.UserRead.model_validate(user)


# --- Tworzenie rezerwacji ---
async def create_reservation(
    reservation: _schemas.ReservationCreate, user_id: int, db: _orm.Session
):
    reservation_obj = _models.Reservation(
        user_id=user_id,
        start_date=reservation.start_date,
        end_date=reservation.end_date,
        status="pending",
    )
    db.add(reservation_obj)
    db.commit()
    db.refresh(reservation_obj)
    return reservation_obj


# --- Pobieranie konkretnej rezerwacji ---
async def get_reservation(reservation_id: int, db: _orm.Session):
    return (
        db.query(_models.Reservation)
        .filter(_models.Reservation.id == reservation_id)
        .first()
    )


# --- Pobieranie wszystkich rezerwacji użytkownika ---
async def get_user_reservations(user_id: int, db: _orm.Session):
    return (
        db.query(_models.Reservation)
        .filter(_models.Reservation.user_id == user_id)
        .all()
    )


# --- Pobieranie wszystkich rezerwacji w systemie ---
async def get_all_reservations(db: _orm.Session):
    return db.query(_models.Reservation).all()


# --- Pobieranie wszystkich kategorii ---
async def get_categories(db: _orm.Session):
    categories = db.query(_models.Category).all()
    return [_schemas.CategoryRead.model_validate(category) for category in categories]


# --- Pobieranie kategorii po ID ---
async def get_category_by_id(category_id: int, db: _orm.Session):
    category = (
        db.query(_models.Category).filter(_models.Category.id == category_id).first()
    )
    if not category:
        raise _fastapi.HTTPException(status_code=404, detail="Category not found")
    return _schemas.CategoryRead.model_validate(category)


# --- Tworzenie nowej kategorii ---
async def create_category(category_data: _schemas.CategoryCreate, db: _orm.Session):
    category = _models.Category(
        name=category_data.name, description=category_data.description
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return _schemas.CategoryRead.model_validate(category)


# --- Aktualizacja kategorii ---
async def update_category(
    category_id: int, category_update: _schemas.CategoryUpdate, db: _orm.Session
):
    category = (
        db.query(_models.Category).filter(_models.Category.id == category_id).first()
    )
    if not category:
        raise _fastapi.HTTPException(status_code=404, detail="Category not found")

    if category_update.name is not None:
        category.name = category_update.name
    if category_update.description is not None:
        category.description = category_update.description
    category.updated_at = _dt.datetime.now()

    db.commit()
    db.refresh(category)
    return _schemas.CategoryRead.model_validate(category)


# --- Usuwanie kategorii ---
async def delete_category(category_id: int, db: _orm.Session):
    category = (
        db.query(_models.Category).filter(_models.Category.id == category_id).first()
    )
    if not category:
        raise _fastapi.HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()


# --- Pobieranie wszystkich sprzętów ---
async def get_all_equipment(db: _orm.Session):
    equipment_list = db.query(_models.Equipment).all()
    return [
        _schemas.EquipmentRead.model_validate(equipment) for equipment in equipment_list
    ]


# --- Pobieranie konkretnego sprzętu po ID ---
async def get_equipment(equipment_id: int, db: _orm.Session):
    equipment = (
        db.query(_models.Equipment).filter(_models.Equipment.id == equipment_id).first()
    )
    if not equipment:
        raise _fastapi.HTTPException(status_code=404, detail="Equipment not found")
    return _schemas.EquipmentRead.model_validate(equipment)


# --- Tworzenie nowego sprzętu ---
async def create_equipment(equipment_data: _schemas.EquipmentCreate, db: _orm.Session):
    new_equipment = _models.Equipment(
        name=equipment_data.name,
        description=equipment_data.description,
        category_id=equipment_data.category_id,  # Przypisanie do kategorii
        price_per_day=equipment_data.price_per_day,
        available_quantity=equipment_data.available_quantity,
    )
    db.add(new_equipment)
    db.commit()
    db.refresh(new_equipment)
    return _schemas.EquipmentRead.model_validate(new_equipment)


async def get_all_payments(db: _orm.Session):
    payments = db.query(_models.Payment).all()
    return [_schemas.PaymentRead.model_validate(p) for p in payments]


async def create_payment(payment_data: _schemas.PaymentCreate, db: _orm.Session):
    new_payment = _models.Payment(
        reservation_id=payment_data.reservation_id,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method,
        status="pending",
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return _schemas.PaymentRead.model_validate(new_payment)


# --- OPINIE ---
async def get_all_reviews(db: _orm.Session):
    reviews = db.query(_models.Review).all()
    return [_schemas.ReviewRead.model_validate(r) for r in reviews]


async def create_review(review_data: _schemas.ReviewCreate, db: _orm.Session):
    new_review = _models.Review(
        user_id=review_data.user_id,
        equipment_id=review_data.equipment_id,
        rating=review_data.rating,
        comment=review_data.comment,
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return _schemas.ReviewRead.model_validate(new_review)


# --- ZGŁOSZENIA SUPPORT ---
async def get_all_tickets(db: _orm.Session):
    tickets = db.query(_models.SupportTicket).all()
    return [_schemas.SupportTicketRead.model_validate(t) for t in tickets]


async def create_ticket(ticket_data: _schemas.SupportTicketCreate, db: _orm.Session):
    new_ticket = _models.SupportTicket(
        user_id=ticket_data.user_id,
        issue_description=ticket_data.issue_description,
        status="open",
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return _schemas.SupportTicketRead.model_validate(new_ticket)


# --- RAPORTY ADMINISTRACYJNE ---
async def get_all_reports(db: _orm.Session):
    reports = db.query(_models.AdminReport).all()
    return [_schemas.AdminReportRead.model_validate(r) for r in reports]


async def create_report(report_data: _schemas.AdminReportCreate, db: _orm.Session):
    new_report = _models.AdminReport(
        admin_id=report_data.admin_id,
        report_type=report_data.report_type,
        title=report_data.title,
        start_date=report_data.start_date,
        end_date=report_data.end_date,
        content=report_data.content,
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return _schemas.AdminReportRead.model_validate(new_report)
