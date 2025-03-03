import fastapi as _fastapi
import fastapi.security as _security
from typing import List
import sqlalchemy.orm as _orm

import services as _services, schemas as _schemas, auth as _auth, models as _models

app = _fastapi.FastAPI()


@app.get("/api/test")
async def root():
    return {"message": "Success"}


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


@app.get("/api/users/me", response_model=_schemas.UserRead)
async def get_current_user(
    user: _schemas.UserRead = _fastapi.Depends(_auth.get_current_user),
):
    return user


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


@app.get("/api/admin/users", response_model=List[_schemas.UserRead])
async def get_users(
    db: _orm.Session = _fastapi.Depends(_services.get_db),
    admin_user: _schemas.UserCreate = _fastapi.Depends(_auth.get_admin_user),
):
    return await _services.get_users(db=db)
