# seed_api.py
import requests
import datetime
import random

BASE_URL = "http://localhost:8000"
ADMIN_CREDENTIALS = {"username": "admin@admin.com", "password": "admin"}


def login(creds):
    resp = requests.post(
        f"{BASE_URL}/api/login",
        data=creds,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    resp.raise_for_status()
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def create_locations(headers):
    locs = [
        {"contact_number": "111222333", "street": "Główna", "house_number": "1", "city": "Warszawa"},
        {"contact_number": "444555666", "street": "Drugorzędna", "house_number": "2", "city": "Kraków"},
    ]
    created = []
    for loc in locs:
        r = requests.post(f"{BASE_URL}/api/admin/locations", json=loc, headers=headers)
        r.raise_for_status()
        created.append(r.json())
        print("▷ Dodano lokalizację:", r.json())
    return created


def create_categories(headers):
    cats = [
        {"name": "Rower", "image_path": "uploads/default_category.jpg", "description": "Sprzęt rowerowy"},
        {"name": "Narty", "image_path": "uploads/default_category.jpg", "description": "Sprzęt zimowy"},
        {"name": "Kajak", "image_path": "uploads/default_category.jpg", "description": "Sprzęt wodny"},
    ]
    created = []
    for c in cats:
        r = requests.post(f"{BASE_URL}/api/admin/categories", json=c, headers=headers)
        r.raise_for_status()
        created.append(r.json())
        print("▷ Dodano kategorię:", r.json())
    return created


def create_equipment(headers, categories):
    items = [
        {
            "name": "MTB X200", "description": "Pełne zawieszenie", "category_id": categories[0]["id"],
            "price_per_day": 120.0, "available_quantity": 5
        },
        {
            "name": "Rossignol Z17", "description": "Narty 170 cm", "category_id": categories[1]["id"],
            "price_per_day": 85.0, "available_quantity": 8
        },
        {
            "name": "Sea kayak", "description": "Jednoosobowy kajak", "category_id": categories[2]["id"],
            "price_per_day": 60.0, "available_quantity": 3
        },
    ]
    created = []
    for it in items:
        r = requests.post(f"{BASE_URL}/api/admin/equipment", json=it, headers=headers)
        r.raise_for_status()
        created.append(r.json())
        print("▷ Dodano sprzęt:", r.json())
    return created


def create_users_with_reservations_and_payments(equipment, locations, admin_headers):
    for i in range(1, 6):  # 5 użytkowników
        email = f"user{i}@mail.com"
        user_data = {
            "email": email,
            "password": "userpass",
            "first_name": f"Imię{i}",
            "last_name": f"Nazwisko{i}",
            "phone_number": f"60070080{i}",
            "gender": True,
            "birth_date": "1990-01-01"
        }

        # Rejestracja użytkownika
        r = requests.post(f"{BASE_URL}/api/register", json=user_data)
        r.raise_for_status()
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

        for j in range(2):  # Każdy użytkownik ma 2 rezerwacje
            start = datetime.datetime.now() + datetime.timedelta(days=j * 2)
            end = start + datetime.timedelta(days=50)

            res_payload = {
                "start_date": start.isoformat(),
                "end_date": end.isoformat(),
                "status": "pending"
            }
            res = requests.post(f"{BASE_URL}/api/reservations", json=res_payload, headers=headers)
            res.raise_for_status()
            reservation = res.json()

            # Transport
            # location = locations[(i + j) % len(locations)]
            location = {"id": random.randint(1, 2)}
            trans_payload = {
                "reservation_id": reservation["id"],
                "current_location_id": location["id"],
                "destination_id": location["id"],
                "equipment_id": 1,
            }
            tr = requests.post(f"{BASE_URL}/api/admin/equipment_transport", json=trans_payload, headers=admin_headers)
            tr.raise_for_status()
            transport = tr.json()

            # Transport item
            # eq = equipment[(i + j) % len(equipment)]
            eq = {"id": random.randint(1, 3)}
            ei_payload = {
                "transport_id": transport["id"],
                "equipment_id": eq["id"],
                "quantity": 1
            }
            requests.post(f"{BASE_URL}/api/admin/equipment_transport_items", json=ei_payload, headers=admin_headers)

            # Płatność
            pay_payload = {
                "reservation_id": reservation["id"],
                "amount": 150 + i * 10 + j * 5,
                "payment_method": "card"
            }
            requests.post(f"{BASE_URL}/api/payments", json=pay_payload, headers=headers)

            print(f"▷ {email} utworzył rezerwację {reservation['id']} i płatność.")


def main():
    print("▶ Logowanie jako admin...")
    admin_headers = login(ADMIN_CREDENTIALS)

    print("▶ Tworzenie lokalizacji, kategorii, sprzętu...")
    locations = create_locations(admin_headers)
    categories = create_categories(admin_headers)
    equipment = create_equipment(admin_headers, categories)

    print("▶ Tworzenie użytkowników, rezerwacji i płatności...")
    create_users_with_reservations_and_payments(equipment, locations, admin_headers)

    print("\n✅ SEED zakończony pomyślnie.")


if __name__ == "__main__":
    main()
