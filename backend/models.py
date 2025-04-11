import datetime as dt
import sqlalchemy as sql
import sqlalchemy.orm as orm
import passlib.hash as hash
import database


class User(database.Base):
    __tablename__ = "users"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    email = sql.Column(sql.String(255), unique=True, index=True, nullable=False)
    password_hash = sql.Column(sql.String(255), nullable=False)
    first_name = sql.Column(sql.String(50))
    last_name = sql.Column(sql.String(50))
    phone_number = sql.Column(sql.String(20))
    gender = sql.Column(sql.Boolean)
    birth_date = sql.Column(sql.Date)
    created_at = sql.Column(sql.DateTime, default=dt.datetime.now)
    updated_at = sql.Column(sql.DateTime, default=dt.datetime.now, onupdate=dt.datetime.now)
    role = sql.Column(sql.String(20), default="user")
    profile_image = sql.Column(sql.String(255))

    reservations = orm.relationship("Reservation", back_populates="user")
    reviews = orm.relationship("Review", back_populates="user")
    support_tickets = orm.relationship("SupportTicket", back_populates="user")
    admin_reports = orm.relationship("AdminReport", back_populates="admin")

    def verify_password(self, password: str) -> bool:
        return hash.bcrypt.verify(password, self.password_hash)


class Category(database.Base):
    __tablename__ = "categories"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    name = sql.Column(sql.String(50), nullable=False)
    image_path = sql.Column(sql.String(255), nullable=False)
    description = sql.Column(sql.Text)
    equipment = orm.relationship("Equipment", back_populates="category")


class Equipment(database.Base):
    __tablename__ = "equipment"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    name = sql.Column(sql.String(100), nullable=False)
    category_id = sql.Column(sql.Integer, sql.ForeignKey("categories.id"))
    description = sql.Column(sql.Text)
    price_per_day = sql.Column(sql.DECIMAL(10, 2), nullable=False)
    available_quantity = sql.Column(sql.Integer, nullable=False)
    created_at = sql.Column(sql.DateTime, default=dt.datetime.now)
    updated_at = sql.Column(sql.DateTime, default=dt.datetime.now, onupdate=dt.datetime.now)
    category = orm.relationship("Category", back_populates="equipment")
    reservation_items = orm.relationship("ReservationItem", back_populates="equipment")
    reviews = orm.relationship("Review", back_populates="equipment")
    transport_items = orm.relationship("EquipmentTransportItem", back_populates="equipment")
    images = orm.relationship("EquipmentImage", back_populates="equipment")

class EquipmentImage(database.Base):
    __tablename__ = "equipment_images"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    equipment_id = sql.Column(sql.Integer, sql.ForeignKey("equipment.id"), nullable=False)
    image_path = sql.Column(sql.String(255), nullable=False)

    equipment = orm.relationship("Equipment", back_populates="images")

class Reservation(database.Base):
    __tablename__ = "reservations"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    start_date = sql.Column(sql.DateTime, nullable=False)
    end_date = sql.Column(sql.DateTime, nullable=False)
    status = sql.Column(sql.String(20), default="pending")
    created_at = sql.Column(sql.DateTime, default=dt.datetime.now)
    updated_at = sql.Column(sql.DateTime, default=dt.datetime.now, onupdate=dt.datetime.now)
    user = orm.relationship("User", back_populates="reservations")
    reservation_items = orm.relationship("ReservationItem", back_populates="reservation")
    payment = orm.relationship("Payment", uselist=False, back_populates="reservation")
    transport = orm.relationship("EquipmentTransport", back_populates="reservation")


class ReservationItem(database.Base):
    __tablename__ = "reservation_items"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    reservation_id = sql.Column(sql.Integer, sql.ForeignKey("reservations.id"))
    equipment_id = sql.Column(sql.Integer, sql.ForeignKey("equipment.id"))
    quantity = sql.Column(sql.Integer, nullable=False)
    price_per_day = sql.Column(sql.DECIMAL(10, 2), nullable=False)
    total_price = sql.Column(sql.DECIMAL(10, 2), nullable=False)
    reservation = orm.relationship("Reservation", back_populates="reservation_items")
    equipment = orm.relationship("Equipment", back_populates="reservation_items")


class Payment(database.Base):
    __tablename__ = "payments"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    reservation_id = sql.Column(sql.Integer, sql.ForeignKey("reservations.id"))
    amount = sql.Column(sql.DECIMAL(10, 2), nullable=False)
    payment_method = sql.Column(sql.String(20), nullable=False)
    status = sql.Column(sql.String(20), default="pending")
    created_at = sql.Column(sql.DateTime, default=dt.datetime.now)
    reservation = orm.relationship("Reservation", back_populates="payment")


class Review(database.Base):
    __tablename__ = "reviews"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    equipment_id = sql.Column(sql.Integer, sql.ForeignKey("equipment.id"))
    rating = sql.Column(sql.Integer, nullable=False)
    comment = sql.Column(sql.Text)
    created_at = sql.Column(sql.DateTime, default=dt.datetime.now)
    user = orm.relationship("User", back_populates="reviews")
    equipment = orm.relationship("Equipment", back_populates="reviews")


class SupportTicket(database.Base):
    __tablename__ = "support_tickets"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    issue_description = sql.Column(sql.Text, nullable=False)
    status = sql.Column(sql.String(20), default="open")
    created_at = sql.Column(sql.DateTime, default=dt.datetime.now)
    updated_at = sql.Column(sql.DateTime, default=dt.datetime.now, onupdate=dt.datetime.now)
    user = orm.relationship("User", back_populates="support_tickets")


class AdminReport(database.Base):
    __tablename__ = "admin_reports"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    admin_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    report_type = sql.Column(sql.String(50), nullable=False)
    title = sql.Column(sql.String(100), nullable=False)
    start_date = sql.Column(sql.DateTime)
    end_date = sql.Column(sql.DateTime)
    content = sql.Column(sql.Text)
    created_at = sql.Column(sql.DateTime, default=dt.datetime.now)
    updated_at = sql.Column(sql.DateTime, default=dt.datetime.now, onupdate=dt.datetime.now)
    admin = orm.relationship("User", back_populates="admin_reports")


class Location(database.Base):
    __tablename__ = "locations"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    contact_number = sql.Column(sql.String(20))
    street = sql.Column(sql.String(100))
    house_number = sql.Column(sql.String(20))
    city = sql.Column(sql.String(100))
    created_at = sql.Column(sql.DateTime, default=dt.datetime.now)
    updated_at = sql.Column(sql.DateTime, default=dt.datetime.now, onupdate=dt.datetime.now)


class EquipmentTransport(database.Base):
    __tablename__ = "equipment_transport"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    reservation_id = sql.Column(sql.Integer, sql.ForeignKey("reservations.id"))
    current_location_id = sql.Column(sql.Integer, sql.ForeignKey("locations.id"))
    destination_id = sql.Column(sql.Integer, sql.ForeignKey("locations.id"))
    created_at = sql.Column(sql.DateTime, default=dt.datetime.now)
    updated_at = sql.Column(sql.DateTime, default=dt.datetime.now, onupdate=dt.datetime.now)
    reservation = orm.relationship("Reservation", back_populates="transport")
    transport_items = orm.relationship("EquipmentTransportItem", back_populates="transport")


class EquipmentTransportItem(database.Base):
    __tablename__ = "equipment_transport_items"
    id = sql.Column(sql.Integer, primary_key=True, index=True, autoincrement=True)
    transport_id = sql.Column(sql.Integer, sql.ForeignKey("equipment_transport.id"))
    equipment_id = sql.Column(sql.Integer, sql.ForeignKey("equipment.id"))
    quantity = sql.Column(sql.Integer, nullable=False)
    transport = orm.relationship("EquipmentTransport", back_populates="transport_items")
    equipment = orm.relationship("Equipment", back_populates="transport_items")
