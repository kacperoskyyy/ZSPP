import datetime as _dt
from typing import Optional
import pydantic as _pydantic


# Podstawa do dziedziczenia pozostałych pól
class _UserBase(_pydantic.BaseModel):
    email: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None


# Do tworzenia użytkownika mamy hasło i pola z _UserBase
class UserCreate(_UserBase):
    hash_password: str


class UserRead(_UserBase):
    id: int
    created_at: _dt.datetime

    class Config:
        from_attributes = True


class UserUpdate(_pydantic.BaseModel):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None


class UserLogin(_pydantic.BaseModel):
    email: str
    password: str


class _ReservationBase(_pydantic.BaseModel):
    user_id: int
    start_date: _dt.datetime
    end_date: _dt.datetime
    status: str  # "pending", "confirmed", "canceled", "completed"


# Schemat dla tworzenia rezerwacji
class ReservationCreate(_ReservationBase):
    pass


# Schemat do odczytu rezerwacji
class ReservationRead(_ReservationBase):
    id: int
    created_at: _dt.datetime

    class Config:
        from_attributes = True


# Podstawowa klasa wyposażenia
class _EquipmentBase(_pydantic.BaseModel):
    name: str
    category_id: int
    description: str
    price_per_day: float
    available_quantity: int


class EquipmentCreate(_EquipmentBase):
    pass

class EquipmentRead(_EquipmentBase):
    id: int
    


# Podstawowa klasa płatności
class _PaymentBase(_pydantic.BaseModel):
    reservation_id: int
    amount: float
    payment_method: str  # "PayPal", "BLIK", "Visa"


# Schemat dla tworzenia płatności
class PaymentCreate(_PaymentBase):
    pass


# Schemat do odczytu płatności
class PaymentRead(_PaymentBase):
    id: int
    status: str  # "pending", "completed", "failed"
    created_at: _dt.datetime

    class Config:
        from_attributes = True


# Podstawowa klasa recenzji
class _ReviewBase(_pydantic.BaseModel):
    user_id: int
    equipment_id: int
    rating: int  # 1-5
    comment: Optional[str] = None


# Schemat dla tworzenia recenzji
class ReviewCreate(_ReviewBase):
    pass


# Schemat do odczytu recenzji
class ReviewRead(_ReviewBase):
    id: int
    created_at: _dt.datetime

    class Config:
        from_attributes = True
