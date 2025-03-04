import passlib.hash as _hash
import sqlalchemy.orm as _orm
import database as _database
import models as _models
import schemas as _schemas
import datetime as _dt


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
    return db.query(_models.User).filter(_models.User.email == email).first()


# --- Zmiana roli użytkownika ---
async def change_role(email: str, role: str, db: _orm.Session):
    user_db = db.query(_models.User).filter(_models.User.email == email).first()

    if user_db:
        user_db.role = role
        user_db.updated_at = _dt.datetime.now()

        db.commit()
        db.refresh(user_db)


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
        return True
    return False


# --- Aktualizacja użytkownika ---
async def update_user(user_id: int, user_update: _schemas.UserCreate, db: _orm.Session):
    user = db.query(_models.User).filter(_models.User.id == user_id).first()
    if user:
        user.first_name = user_update.first_name
        user.last_name = user_update.last_name
        user.phone_number = user_update.phone_number
        user.email = user_update.email
        user.updated_at = _dt.datetime.now()
        db.commit()
        db.refresh(user)
        return user
    return None


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
