import fastapi as _fastapi
import fastapi.security as _security
from typing import List
import sqlalchemy.orm as _orm

import services as _services, schemas as _schemas

app = _fastapi.FastAPI()


@app.get("/api/test")
async def root():
    return {"message": "Success"}


@app.post("/api/user")
async def create_user(
    user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    user = await _services.create_user(user, db)

    # return await _services.create_token(user)
    return {"message": "Created User"}


@app.get("/api/users", response_model=List[_schemas.UserRead])
async def get_users(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_users(db=db)


# @app.get("/api/users", response_model=List[_schemas.UserRead])
# async def get_users(user: _schemas)
