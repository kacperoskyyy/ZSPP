import datetime as dt
from typing import Optional, List
import pydantic as _pydantic


# --- USER ---
class UserBase(_pydantic.BaseModel):
    email: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None


class UserCreate(UserBase):
    password: str
    gender: Optional[bool] = None
    birth_date: Optional[dt.date] = None


class UserRead(UserBase):
    id: int
    gender: Optional[bool]
    birth_date: Optional[dt.date]
    created_at: dt.datetime
    role: str
    profile_image: Optional[str]

    class Config:
        orm_mode = True


class UserUpdate(_pydantic.BaseModel):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_image: Optional[str] = None


class PasswordResetRequest(_pydantic.BaseModel):
    email: _pydantic.EmailStr


class PasswordResetConfirm(_pydantic.BaseModel):
    token: str
    new_password: str


# --- CATEGORY ---
class CategoryBase(_pydantic.BaseModel):
    name: str
    description: Optional[str] = None
    image_path: str


class CategoryCreate(CategoryBase):
    class Config:
        orm_mode = True


class CategoryRead(CategoryBase):
    id: int

    class Config:
        orm_mode = True


# --- EQUIPMENT ---
class EquipmentImageBase(_pydantic.BaseModel):
    image_path: str


class EquipmentImageCreate(EquipmentImageBase):
    equipment_id: int


class EquipmentImageRead(EquipmentImageBase):
    id: int

    class Config:
        orm_mode = True


class EquipmentBase(_pydantic.BaseModel):
    name: str
    description: Optional[str] = None
    category_id: int
    price_per_day: float
    available_quantity: int


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentRead(EquipmentBase):
    id: int
    created_at: dt.datetime
    updated_at: dt.datetime
    images: List[EquipmentImageRead] = []

    class Config:
        orm_mode = True


# --- RESERVATION ---
class ReservationBase(_pydantic.BaseModel):
    start_date: dt.datetime
    end_date: dt.datetime
    status: Optional[str] = "pending"


class ReservationCreate(ReservationBase):
    pass


class ReservationRead(ReservationBase):
    id: int
    user_id: int
    created_at: dt.datetime

    class Config:
        orm_mode = True


# --- SUPPORT TICKET ---
class SupportTicketBase(_pydantic.BaseModel):
    issue_description: str
    status: Optional[str] = "open"


class SupportTicketCreate(SupportTicketBase):
    pass


class SupportTicketRead(SupportTicketBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


# --- EQUIPMENT TRANSPORT ---
class EquipmentTransportBase(_pydantic.BaseModel):
    reservation_id: int
    current_location_id: int
    destination_id: int


class EquipmentTransportCreate(EquipmentTransportBase):
    pass


class EquipmentTransportRead(EquipmentTransportBase):
    id: int
    created_at: dt.datetime
    updated_at: dt.datetime

    class Config:
        orm_mode = True


# --- EQUIPMENT TRANSPORT ITEM ---
class EquipmentTransportItemBase(_pydantic.BaseModel):
    transport_id: int
    equipment_id: int
    quantity: int


class EquipmentTransportItemCreate(EquipmentTransportItemBase):
    pass


class EquipmentTransportItemRead(EquipmentTransportItemBase):
    id: int

    class Config:
        orm_mode = True


# --- PAYMENT ---
class PaymentBase(_pydantic.BaseModel):
    reservation_id: int
    amount: float
    payment_method: str
    status: Optional[str] = "pending"


class PaymentCreate(PaymentBase):
    pass


class PaymentRead(PaymentBase):
    id: int
    created_at: dt.datetime

    class Config:
        orm_mode = True


# --- REVIEW ---
class ReviewBase(_pydantic.BaseModel):
    equipment_id: int
    rating: int
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    pass


class ReviewRead(ReviewBase):
    id: int
    user_id: int
    created_at: dt.datetime

    class Config:
        orm_mode = True


# --- LOCATION ---
class LocationBase(_pydantic.BaseModel):
    contact_number: Optional[str] = None
    street: Optional[str] = None
    house_number: Optional[str] = None
    city: Optional[str] = None


class LocationCreate(LocationBase):
    pass


class LocationRead(LocationBase):
    id: int
    created_at: dt.datetime
    updated_at: dt.datetime

    class Config:
        orm_mode = True


class AdminReportBase(_pydantic.BaseModel):
    admin_id: int
    report_type: str
    title: str
    start_date: dt.datetime
    end_date: dt.datetime
    content: str


class AdminReportCreate(AdminReportBase):
    pass


class AdminReportRead(AdminReportBase):
    id: int

    class Config:
        orm_mode = True
