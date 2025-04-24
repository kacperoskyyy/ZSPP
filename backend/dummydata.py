# import requests
# import datetime
#
# # 1. Konfiguracja
# BASE_URL = "http://localhost:8000"  # dostosuj port/adres, jeśli potrzebne
# ADMIN_EMAIL = "admin@admin.com"
# ADMIN_PASS = "admin"
#
# def login_admin():
#     resp = requests.post(
#         f"{BASE_URL}/api/login",
#         data={"username": ADMIN_EMAIL, "password": ADMIN_PASS},
#         headers={"Content-Type": "application/x-www-form-urlencoded"}
#     )
#     resp.raise_for_status()
#     token = resp.json()["access_token"]
#     return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
#
# def create_categories(headers):
#     cats = [
#         {"name": "Rower","image_path":"./public/uploads/d.png", "description": "Sprzęt rowerowy do jazdy terenowej"},
#         {"name": "Narty", "image_path":"./public/uploads/d.png","description": "Sprzęt zimowy – narty i buty narciarskie"},
#         {"name": "Kajak", "image_path":"./public/uploads/d.png","description": "Sprzęt wodny – kajaki i akcesoria"},
#     ]
#     created = []
#     for c in cats:
#         r = requests.post(f"{BASE_URL}/api/admin/categories", json=c, headers=headers)
#         r.raise_for_status()
#         created.append(r.json())
#         print("Utworzono kategorię:", r.json())
#     return created
#
# def create_equipment(headers, categories):
#     items = [
#         {
#             "name": "Rower górski MTB X200",
#             "description": "Wytrzymała rama, pełne zawieszenie, do trudnego terenu.",
#             "category_id": categories[0]["id"],
#             "price_per_day": 120.00,
#             "available_quantity": 5,
#         },
#         {
#             "name": "Narty zjazdowe Rossignol",
#             "description": "Długość 170 cm, wiązania Marker.",
#             "category_id": categories[1]["id"],
#             "price_per_day": 85.00,
#             "available_quantity": 8,
#         },
#         {
#             "name": "Kajak jednoosobowy Sea kayak",
#             "description": "Lekki, łatwy do transportu, wytrzymały plastik.",
#             "category_id": categories[2]["id"],
#             "price_per_day": 60.00,
#             "available_quantity": 3,
#         },
#     ]
#     created = []
#     for it in items:
#         r = requests.post(f"{BASE_URL}/api/admin/equipment", json=it, headers=headers)
#         r.raise_for_status()
#         created.append(r.json())
#         print("Utworzono equipment:", r.json())
#     return created
#
# def create_reservation(headers):
#     # Pobranie danych bieżącego (admin) użytkownika
#     me = requests.get(f"{BASE_URL}/api/users/me", headers=headers)
#     me.raise_for_status()
#     user = me.json()
#
#     # Przygotowanie dat
#     start = datetime.datetime.now() + datetime.timedelta(days=1)
#     end = start + datetime.timedelta(days=3)
#     payload = {
#         "start_date": start.isoformat(),
#         "end_date": end.isoformat(),
#         "status": "pending"
#     }
#     # Tworzymy rezerwację
#     r = requests.post(f"{BASE_URL}/api/reservations", json=payload, headers=headers)
#     r.raise_for_status()
#     print("Utworzono rezerwację:", r.json())
#     return r.json()
#
# def main():
#     print("Logowanie jako admin…")
#     headers = login_admin()
#
#     print("\nTworzenie kategorii…")
#     cats = create_categories(headers)
#
#     print("\nTworzenie sprzętu…")
#     eq = create_equipment(headers, cats)
#
#     print("\nTworzenie przykładowej rezerwacji…")
#     res = create_reservation(headers)
#
#     print("\nGotowe! Dane testowe zostały wprowadzone.")
#
# if __name__ == "__main__":
#     main()

from database import SessionLocal, engine, Base
import models
import datetime

def seed():
    # 1) Upewnij się, że wszystkie tabele są utworzone
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # --- Categories ---
        cats = [
            models.Category(name="Rower", description="Sprzęt rowerowy", image_path="uploads/rower.jpg"),
            models.Category(name="Narty", description="Sprzęt zimowy", image_path="uploads/narty.jpg"),
            models.Category(name="Kajak", description="Sprzęt wodny", image_path="uploads/kajak.jpg"),
        ]
        db.add_all(cats)
        db.commit()

        # --- Equipment ---
        eqs = [
            models.Equipment(
                name="MTB X200",
                description="Pełne zawieszenie, terenowy",
                category_id=cats[0].id,
                price_per_day=120.00,
                available_quantity=5
            ),
            models.Equipment(
                name="Rossignol Z17",
                description="Narty zjazdowe 170 cm",
                category_id=cats[1].id,
                price_per_day=85.00,
                available_quantity=8
            ),
            models.Equipment(
                name="Sea kayak 1-os",
                description="Lekki kajak plastikowy",
                category_id=cats[2].id,
                price_per_day=60.00,
                available_quantity=3
            ),
        ]
        db.add_all(eqs)
        db.commit()

        # --- Reservation (załóżmy, że admin ma id=1) ---
        start = datetime.datetime.now() + datetime.timedelta(days=1)
        end = start + datetime.timedelta(days=3)
        reservation = models.Reservation(
            user_id=2,
            start_date=start,
            end_date=end,
            status="pending"
        )
        db.add(reservation)
        db.commit()

        print("✅ Seedowanie zakończone pomyślnie!")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
