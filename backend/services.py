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
        existing_admin = db.query(_models.User).filter(_models.User.email == "admin@admin.com").first()
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

