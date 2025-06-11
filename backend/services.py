import passlib.hash as _hash
import sqlalchemy.orm as _orm
import database as _database
import models as _models
import schemas as _schemas
import datetime as _dt
import fastapi as _fastapi
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
from dotenv import load_dotenv

load_dotenv()

# --- Konfiguracja Maila ---
mail_conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),  # np. "your_email@gmail.com"
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),  # hasło lub app password
    MAIL_FROM=os.getenv("MAIL_FROM"),  # np. "your_email@gmail.com"
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),  # domyślnie 587 dla TLS
    MAIL_SERVER=os.getenv("MAIL_SERVER"),  # np. "smtp.gmail.com"
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


async def send_reset_email(email: str, reset_link: str):
    message = MessageSchema(
        subject="Reset hasła - Twoja aplikacja",
        recipients=[email],
        body=f"""
        <html>
          <body>
            <p>Cześć,</p>
            <p>Aby zresetować swoje hasło, kliknij w poniższy link:</p>
            <p><a href="{reset_link}">{reset_link}</a></p>
            <p>Jeśli nie zamawiałeś resetu hasła, zignoruj tę wiadomość.</p>
          </body>
        </html>
        """,
        subtype="html"
    )
    fm = FastMail(mail_conf)
    await fm.send_message(message)


# --- Inicjalizacja bazy danych ---
def create_database():
    _database.Base.metadata.create_all(bind=_database.engine)

    db = _database.SessionLocal()
    try:
        # Sprawdź, czy istnieje admin
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


# --- Dependency do sesji bazy ---
def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def expire_reservations() -> None:
    db = _database.SessionLocal()
    try:
        now = _dt.datetime.now()
        # wybieramy te, które trzeba zakończyć
        to_expire = (
            db.query(_models.Reservation)
              .filter(_models.Reservation.end_date < now)
              .filter(_models.Reservation.status.in_(["pending", "active"]))
              .all()
        )
        for res in to_expire:
            res.status = "completed"
        if to_expire:
            db.commit()
    finally:
        db.close()


# --- USER SERVICES ---
async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()


async def get_user_by_id(user_id: int, db: _orm.Session):
    user = db.query(_models.User).filter(_models.User.id == user_id).first()
    if not user:
        raise _fastapi.HTTPException(status_code=404, detail="User not found")
    return user


async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        email=user.email,
        password_hash=_hash.bcrypt.hash(user.password),
        gender=user.gender,
        birth_date=user.birth_date,
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def get_users(db: _orm.Session):
    users = db.query(_models.User).all()
    return [_schemas.UserRead.model_validate(u) for u in users]


async def delete_user(user_id: int, db: _orm.Session):
    user = db.query(_models.User).filter(_models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()


async def update_user(
        user_update: _schemas.UserUpdate, db: _orm.Session, current_user: _schemas.UserRead
):
    # Sprawdź uprawnienia
    if current_user.role != "admin" and user_update.id != current_user.id:
        raise _fastapi.HTTPException(
            status_code=403, detail="Permission denied")

    user = db.query(_models.User).filter(
        _models.User.id == user_update.id).first()
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


# --- RESERVATIONS ---
async def create_reservation(
        reservation: _schemas.ReservationCreate, user_id: int, db: _orm.Session
):
    reservation_obj = _models.Reservation(
        user_id=user_id,
        start_date=reservation.start_date,
        end_date=reservation.end_date,
        status=reservation.status or "pending",
    )
    db.add(reservation_obj)
    db.commit()
    db.refresh(reservation_obj)
    return reservation_obj


async def get_reservation(reservation_id: int, user_id: int, db: _orm.Session):
    return (
        db.query(_models.Reservation)
        .filter(_models.Reservation.id == reservation_id, _models.Reservation.user_id == user_id)
        .first()
    )


async def get_user_reservations(user_id: int, db: _orm.Session):
    return db.query(_models.Reservation).filter(_models.Reservation.user_id == user_id).all()


async def get_all_reservations(db: _orm.Session):
    return db.query(_models.Reservation).all()


async def delete_reservations(reservation_id: int, user_id: int, db: _orm.Session):
    reservation = db.query(_models.Reservation).filter_by(
        id=reservation_id, user_id=user_id).first()

    if not reservation:
        raise _fastapi.HTTPException(
            status_code=404, detail="Rezerwacja nie znaleziona.")

    db.delete(reservation)
    db.commit()


# --- CATEGORIES ---
async def get_categories(db: _orm.Session):
    categories = db.query(_models.Category).all()
    return [_schemas.CategoryRead.model_validate(c) for c in categories]


async def get_category_by_id(category_id: int, db: _orm.Session):
    category = db.query(_models.Category).filter(
        _models.Category.id == category_id).first()
    if not category:
        raise _fastapi.HTTPException(
            status_code=404, detail="Category not found")
    return _schemas.CategoryRead.model_validate(category)


async def create_category(category: _schemas.CategoryCreate, db: _orm.Session):
    cat_obj = _models.Category(
        name=category.name,
        description=category.description,
        image_path=category.image_path or "uploads/default_category.jpg"
    )
    print(cat_obj)
    db.add(cat_obj)
    db.commit()
    db.refresh(cat_obj)
    print(cat_obj)
    return cat_obj


async def delete_category(category_id: int, db: _orm.Session):
    cat = db.query(_models.Category).filter(
        _models.Category.id == category_id).first()
    if not cat:
        raise _fastapi.HTTPException(
            status_code=404, detail="Category not found")

    db.delete(cat)
    db.commit()


# --- EQUIPMENT ---
async def get_all_equipment(db: _orm.Session):
    equipment_list = db.query(_models.Equipment).all()
    return [_schemas.EquipmentRead.model_validate(eq) for eq in equipment_list]


async def create_equipment_image(image_data: _schemas.EquipmentImageCreate, db: _orm.Session):
    new_image = _models.EquipmentImage(
        equipment_id=image_data.equipment_id,
        image_path=image_data.image_path
    )
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    return new_image


async def get_equipment(equipment_id: int, db: _orm.Session):
    eq = db.query(_models.Equipment).filter(
        _models.Equipment.id == equipment_id).first()
    if not eq:
        raise _fastapi.HTTPException(
            status_code=404, detail="Equipment not found")
    return _schemas.EquipmentRead.model_validate(eq)


async def create_equipment(equipment_data: _schemas.EquipmentCreate, db: _orm.Session):
    new_equipment = _models.Equipment(
        name=equipment_data.name,
        description=equipment_data.description,
        category_id=equipment_data.category_id,
        price_per_day=equipment_data.price_per_day,
        available_quantity=equipment_data.available_quantity,
    )
    db.add(new_equipment)
    db.commit()
    db.refresh(new_equipment)
    return new_equipment


# --- PAYMENTS ---
async def get_all_payments(db: _orm.Session):
    payments = db.query(_models.Payment).all()
    return [_schemas.PaymentRead.model_validate(p) for p in payments]


async def create_payment(payment_data: _schemas.PaymentCreate, db: _orm.Session):
    new_payment = _models.Payment(
        reservation_id=payment_data.reservation_id,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method,
        status=payment_data.status or "pending",
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return _schemas.PaymentRead.model_validate(new_payment)


# --- REVIEWS ---
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


# --- SUPPORT TICKETS ---
async def get_all_tickets(db: _orm.Session):
    tickets = db.query(_models.SupportTicket).all()
    return [_schemas.SupportTicketRead.model_validate(t) for t in tickets]


async def create_ticket(ticket_data: _schemas.SupportTicketCreate, db: _orm.Session):
    new_ticket = _models.SupportTicket(
        user_id=ticket_data.user_id,
        issue_description=ticket_data.issue_description,
        status=ticket_data.status or "open",
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return _schemas.SupportTicketRead.model_validate(new_ticket)


# --- ADMIN REPORTS ---
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


# --- LOCATION & EQUIPMENT TRANSPORT ---

async def create_location(location_data: _schemas.LocationCreate, db: _orm.Session):
    loc = _models.Location(
        contact_number=location_data.contact_number,
        street=location_data.street,
        house_number=location_data.house_number,
        city=location_data.city
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return _schemas.LocationRead.model_validate(loc)


async def get_location(location_id: int, db: _orm.Session):
    loc = db.query(_models.Location).filter(
        _models.Location.id == location_id).first()
    if not loc:
        raise _fastapi.HTTPException(
            status_code=404, detail="Location not found")
    return _schemas.LocationRead.model_validate(loc)


async def get_all_locations(db: _orm.Session):
    locations = db.query(_models.Location).all()
    return [_schemas.LocationRead.from_orm(loc) for loc in locations]


async def create_equipment_transport(et_data: _schemas.EquipmentTransportCreate, db: _orm.Session):
    et = _models.EquipmentTransport(
        reservation_id=et_data.reservation_id,
        equipment_id=et_data.equipment_id,
        current_location_id=et_data.current_location_id,
        destination_id=et_data.destination_id
    )
    db.add(et)
    db.commit()
    db.refresh(et)
    return _schemas.EquipmentTransportRead.model_validate(et)


async def create_equipment_transport_item(item_data: _schemas.EquipmentTransportItemCreate, db: _orm.Session):
    new_item = _models.EquipmentTransportItem(
        transport_id=item_data.transport_id,
        equipment_id=item_data.equipment_id,
        quantity=item_data.quantity
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return _schemas.EquipmentTransportItemRead.from_orm(new_item)


async def delete_location(location_id: int, db: _orm.Session):
    location = db.query(_models.Location).filter(
        _models.Location.id == location_id).first()
    if location:
        db.delete(location)
        db.commit()
