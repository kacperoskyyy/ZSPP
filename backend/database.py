import sqlalchemy as _sql
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as _orm
from dotenv import load_dotenv
import os as _os

# Ładowanie zmiennych z config.env
load_dotenv()

# Tworzenie silnika bazy danych
DATABASE_URL = _os.getenv("DATABASE_URL")

engine = _sql.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = _orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = _declarative.declarative_base()
