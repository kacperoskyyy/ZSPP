import passlib.hash as _hash
import sqlalchemy.orm as _orm
import database as _database, models as _models, schemas as _schemas
import jwt as _jwt
import fastapi as _fastapi
import fastapi.security as _security
import datetime as _dt
from dotenv import load_dotenv
import os as _os

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

load_dotenv()

JWT_SECRET = _os.getenv("JWT_SECRET")


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()


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


async def get_users(db: _orm.Session):
    users = db.query(_models.User).all()
    return [_schemas.UserRead.model_validate(user) for user in users]


# Funkcja automatyzujaca dodawanie i odswiezanie zerknac pozniej na to
# T = TypeVar("T", bound=SQLModel)


# async def create_resource(
#         model: Type[T],
#         create_model: Type[T],
#         data: dict,
#         session: Session
# ) -> T:
#     obj = create_model.from_request(data)
#     resource = model(**obj.dict())
#     session.add(resource)
#     session.commit()
#     session.refresh(resource)
#     return resource
