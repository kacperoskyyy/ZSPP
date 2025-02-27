from fastapi import FastAPI, Query, Depends
from typing import Optional, Annotated, List, Sequence, Type, TypeVar
from sqlmodel import Field, Session, SQLModel, create_engine, select, Relationship
from datetime import datetime, date
import uuid


class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    reservations: List["Reservation"] = Relationship(back_populates="user")
    reviews: List["Review"] = Relationship(back_populates="user")
    support_tickets: List["SupportTicket"] = Relationship(back_populates="user")
    admin_reports: List["AdminReport"] = Relationship(back_populates="admin")


class UserCreate(SQLModel):
    email: str
    password_hash: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @classmethod
    def from_request(cls, data: dict):
        return cls(**data)


class Category(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    description: Optional[str] = None

    equipment: List["Equipment"] = Relationship(back_populates="category")


class CategoryCreate(SQLModel):
    id: Optional[uuid.UUID] = None
    name: str
    description: Optional[str] = None

    @classmethod
    def from_request(cls, data: dict):
        """Convert string fields to the correct types"""
        return cls(
            id=uuid.UUID(data["id"]) if "id" in data and data["id"] else uuid.uuid4(),
            name=data["name"],
            description=data["description"],
        )


class Equipment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    category_id: uuid.UUID = Field(foreign_key="category.id")
    description: Optional[str] = None
    price_per_day: float
    available_quantity: int
    location: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    category: Category = Relationship(back_populates="equipment")
    reservations: List["Reservation"] = Relationship(back_populates="equipment")
    reviews: List["Review"] = Relationship(back_populates="equipment")


class EquipmentCreate(SQLModel):
    id: Optional[uuid.UUID] = None
    name: str
    category_id: uuid.UUID
    description: Optional[str] = None
    price_per_day: float
    available_quantity: int
    location: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @classmethod
    def from_request(cls, data: dict):
        """Convert string fields to the correct types"""
        return cls(
            id=uuid.UUID(data["id"]) if "id" in data and data["id"] else uuid.uuid4(),
            name=data["name"],
            category_id=data["category_id"],
            description=data["description"],
            available_quantity=data["available_quantity"],
            price_per_day=data["price_per_day"],
            location=data["location"],
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )


class Reservation(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    equipment_id: uuid.UUID = Field(foreign_key="equipment.id")
    start_date: date
    end_date: date
    total_price: float
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    user: User = Relationship(back_populates="reservations")
    equipment: Equipment = Relationship(back_populates="reservations")
    payment: "Payment" = Relationship(back_populates="reservation")
    insurance: "Insurance" = Relationship(back_populates="reservation")


class Payment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    reservation_id: uuid.UUID = Field(foreign_key="reservation.id")
    amount: float
    payment_method: str
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=datetime.now)

    reservation: Reservation = Relationship(back_populates="payment")


class Review(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    equipment_id: uuid.UUID = Field(foreign_key="equipment.id")
    rating: int
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

    user: User = Relationship(back_populates="reviews")
    equipment: Equipment = Relationship(back_populates="reviews")


class Insurance(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    reservation_id: uuid.UUID = Field(foreign_key="reservation.id")
    price: float
    status: str = Field(default="active")
    created_at: datetime = Field(default_factory=datetime.now)

    reservation: Reservation = Relationship(back_populates="insurance")


class Discount(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    code: str = Field(unique=True)
    discount_percentage: float
    valid_from: date
    valid_to: date


class AdminReport(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    admin_id: uuid.UUID = Field(foreign_key="user.id")
    report_type: str
    content: str
    created_at: datetime = Field(default_factory=datetime.now)

    admin: User = Relationship(back_populates="admin_reports")


class SupportTicket(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    issue_description: str
    status: str = Field(default="open")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    user: User = Relationship(back_populates="support_tickets")


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


T = TypeVar("T", bound=SQLModel)


async def create_resource(
        model: Type[T],
        create_model: Type[T],
        data: dict,
        session: Session
) -> T:
    obj = create_model.from_request(data)
    resource = model(**obj.dict())
    session.add(resource)
    session.commit()
    session.refresh(resource)
    return resource


SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/users")
def get_users(
        session: SessionDep,
        offset: int = 0,
        limit: Annotated[int, Query(le=100)] = 100,
) -> Sequence[User]:
    users = session.exec(select(User).offset(offset).limit(limit)).all()
    return users


@app.get("/equipment")
def get_equipment(
        session: SessionDep,
        offset: int = 0,
        limit: Annotated[int, Query(le=100)] = 100,
        name: Optional[str] = None,
        # category_id: Optional[uuid.UUID] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        location: Optional[str] = None,
        sort_by: Optional[str] = "created_at",
        sort_order: Optional[str] = "desc"
) -> Sequence[Equipment]:
    query = select(Equipment)

    # FILTROWANIE
    if name:
        query = query.where(Equipment.name.ilike(f"%{name}%"))  # Wyszukiwanie po nazwie (case-insensitive)
    # if category_id:
    #     query = query.where(Equipment.category_id == category_id)
    if min_price is not None:
        query = query.where(Equipment.price_per_day >= min_price)
    if max_price is not None:
        query = query.where(Equipment.price_per_day <= max_price)
    if location:
        query = query.where(Equipment.location.ilike(f"%{location}%"))

    # SORTOWANIE
    sort_column = getattr(Equipment, sort_by, Equipment.created_at)
    if sort_order.lower() == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    # PAGINACJA
    equipment = session.exec(query.offset(offset).limit(limit)).all()
    return equipment


@app.get("/category")
def get_category(
        session: SessionDep
) -> Sequence[Category]:
    categories = session.exec(select(Category)).all()
    return categories


@app.post("/users")
async def create_user(user_data: dict, session: SessionDep) -> User:
    return await create_resource(User, UserCreate, user_data, session)


@app.post("/equipment")
async def create_equipment(eq_data: dict, session: SessionDep) -> Equipment:
    return await create_resource(Equipment, EquipmentCreate, eq_data, session)


@app.post("/category")
async def create_category(cat_data: dict, session: SessionDep) -> Category:
    return await create_resource(Category, CategoryCreate, cat_data, session)
