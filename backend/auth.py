from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
import jwt as _jwt
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os as _os
import database as _database
import models as _models
import services as _services
from fastapi.security import OAuth2PasswordBearer
import models

load_dotenv()

SECRET_KEY = _os.getenv("JWT_SECRET", "testsecret")
ALGORITHM = _os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(_os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return _jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(_services.get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = _jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except _jwt.PyJWTError:
        raise credentials_exception

    user = db.query(_models.User).filter(_models.User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user


def get_employee_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ["employee", "admin"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return current_user


def get_admin_user(current_user: _models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="You don't have enough permissions")
    return current_user
