import datetime as _dt
import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database

# Podstawowy użytkownik posiada (email:admin@admin.com, hasło:admin)


# Co posiadamy w bazie danych za tabele (wzór tabel)


class User(_database.Base):
    __tablename__ = "users"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    email = _sql.Column(_sql.String(255), unique=True, index=True, nullable=False)
    password_hash = _sql.Column(_sql.String(255), nullable=False)
    first_name = _sql.Column(_sql.String(50))
    last_name = _sql.Column(_sql.String(50))
    phone_number = _sql.Column(_sql.String(20))
    created_at = _sql.Column(_sql.DateTime, default=_dt.datetime.now)
    updated_at = _sql.Column(
        _sql.DateTime, default=_dt.datetime.now, onupdate=_dt.datetime.now
    )
    role = _sql.Column(_sql.String(20), default="user")

    reservations = _orm.relationship("Reservation", back_populates="user")
    reviews = _orm.relationship("Review", back_populates="user")
    support_tickets = _orm.relationship("SupportTicket", back_populates="user")
    admin_reports = _orm.relationship("AdminReport", back_populates="admin")

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.password_hash)


class AdminReport(_database.Base):
    __tablename__ = "admin_reports"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    admin_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    report_type = _sql.Column(_sql.String(50), nullable=False)
    title = _sql.Column(_sql.String(100), nullable=False)
    start_date = _sql.Column(_sql.DateTime)
    end_date = _sql.Column(_sql.DateTime)
    content = _sql.Column(_sql.Text)
    created_at = _sql.Column(_sql.DateTime, default=_dt.datetime.now)
    updated_at = _sql.Column(
        _sql.DateTime, default=_dt.datetime.now, onupdate=_dt.datetime.now
    )

    admin = _orm.relationship("User", back_populates="admin_reports")


class SupportTicket(_database.Base):
    __tablename__ = "support_tickets"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    user_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    issue_description = _sql.Column(_sql.Text, nullable=False)
    status = _sql.Column(_sql.String(20), default="open")
    created_at = _sql.Column(_sql.DateTime, default=_dt.datetime.now)
    updated_at = _sql.Column(
        _sql.DateTime, default=_dt.datetime.now, onupdate=_dt.datetime.now
    )

    user = _orm.relationship("User", back_populates="support_tickets")


class Reservation(_database.Base):
    __tablename__ = "reservations"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    user_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    start_date = _sql.Column(_sql.DateTime, nullable=False)
    end_date = _sql.Column(_sql.DateTime, nullable=False)
    status = _sql.Column(_sql.String(20), default="pending")
    created_at = _sql.Column(_sql.DateTime, default=_dt.datetime.now)
    updated_at = _sql.Column(
        _sql.DateTime, default=_dt.datetime.now, onupdate=_dt.datetime.now
    )

    user = _orm.relationship("User", back_populates="reservations")
    reservation_items = _orm.relationship(
        "ReservationItem", back_populates="reservation"
    )
    payment = _orm.relationship("Payment", uselist=False, back_populates="reservation")


class ReservationItem(_database.Base):
    __tablename__ = "reservation_items"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    reservation_id = _sql.Column(_sql.Integer, _sql.ForeignKey("reservations.id"))
    equipment_id = _sql.Column(_sql.Integer, _sql.ForeignKey("equipment.id"))
    quantity = _sql.Column(_sql.Integer, nullable=False)
    price_per_day = _sql.Column(_sql.DECIMAL(10, 2), nullable=False)
    total_price = _sql.Column(_sql.DECIMAL(10, 2), nullable=False)

    reservation = _orm.relationship("Reservation", back_populates="reservation_items")
    equipment = _orm.relationship("Equipment", back_populates="reservation_items")


class Payment(_database.Base):
    __tablename__ = "payments"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    reservation_id = _sql.Column(_sql.Integer, _sql.ForeignKey("reservations.id"))
    amount = _sql.Column(_sql.DECIMAL(10, 2), nullable=False)
    payment_method = _sql.Column(_sql.String(20), nullable=False)
    status = _sql.Column(_sql.String(20), default="pending")
    created_at = _sql.Column(_sql.DateTime, default=_dt.datetime.now)

    reservation = _orm.relationship("Reservation", back_populates="payment")


class Review(_database.Base):
    __tablename__ = "reviews"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    user_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    equipment_id = _sql.Column(_sql.Integer, _sql.ForeignKey("equipment.id"))
    rating = _sql.Column(_sql.Integer, nullable=False)
    comment = _sql.Column(_sql.Text)
    created_at = _sql.Column(_sql.DateTime, default=_dt.datetime.now)

    user = _orm.relationship("User", back_populates="reviews")
    equipment = _orm.relationship("Equipment", back_populates="reviews")


class Equipment(_database.Base):
    __tablename__ = "equipment"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    name = _sql.Column(_sql.String(100), nullable=False)
    category_id = _sql.Column(_sql.Integer, _sql.ForeignKey("categories.id"))
    description = _sql.Column(_sql.Text)
    price_per_day = _sql.Column(_sql.DECIMAL(10, 2), nullable=False)
    available_quantity = _sql.Column(_sql.Integer, nullable=False)
    created_at = _sql.Column(_sql.DateTime, default=_dt.datetime.now)
    updated_at = _sql.Column(
        _sql.DateTime, default=_dt.datetime.now, onupdate=_dt.datetime.now
    )

    category = _orm.relationship("Category", back_populates="equipment")
    reservation_items = _orm.relationship("ReservationItem", back_populates="equipment")
    reviews = _orm.relationship("Review", back_populates="equipment")


class Category(_database.Base):
    __tablename__ = "categories"

    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    name = _sql.Column(_sql.String(50), nullable=False)
    description = _sql.Column(_sql.Text)

    equipment = _orm.relationship("Equipment", back_populates="category")
