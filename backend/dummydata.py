# seed_api.py
import requests
import datetime

BASE_URL = "http://localhost:8000"   # dostosuj, jeśli to nie ten adres
ADMIN_CREDENTIALS = {"username": "admin@admin.com", "password": "admin"}
NEW_USER = {
    "email": "userr@user.com",
    "password": "userpass",
    "first_name": "Jan",
    "last_name": "Kowalski",
    "phone_number": "600700800",
    "gender": True,
    "birth_date": "1995-05-15"
}

def login(creds):
    resp = requests.post(
        f"{BASE_URL}/api/login",
        data=creds,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    resp.raise_for_status()
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def register_user():
    resp = requests.post(
        f"{BASE_URL}/api/register",
        json=NEW_USER,
        headers={"Content-Type": "application/json"}
    )
    print(resp.json())
    resp.raise_for_status()
    data = resp.json()
    print("▷ Zarejestrowano usera:", data["user"])
    return {"Authorization": f"Bearer {data['access_token']}", "Content-Type": "application/json"}

def create_locations(headers):
    locs = [
        {"contact_number":"111222333","street":"Główna","house_number":"1","city":"Warszawa"},
        {"contact_number":"444555666","street":"Drugorzędna","house_number":"2","city":"Kraków"},
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
        {"name":"Rower","image_path":"uploads/default_category.jpg","description":"Sprzęt rowerowy"},
        {"name":"Narty","image_path":"uploads/default_category.jpg","description":"Sprzęt zimowy"},
        {"name":"Kajak","image_path":"uploads/default_category.jpg","description":"Sprzęt wodny"},
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
            "name":"MTB X200","description":"Pełne zawieszenie","category_id":categories[0]["id"],
            "price_per_day":120.0,"available_quantity":5
        },
        {
            "name":"Rossignol Z17","description":"Narty 170 cm","category_id":categories[1]["id"],
            "price_per_day":85.0,"available_quantity":8
        },
        {
            "name":"Sea kayak","description":"Jednoosobowy kajak","category_id":categories[2]["id"],
            "price_per_day":60.0,"available_quantity":3
        },
    ]
    created = []
    for it in items:
        r = requests.post(f"{BASE_URL}/api/admin/equipment", json=it, headers=headers)
        r.raise_for_status()
        created.append(r.json())
        print("▷ Dodano sprzęt:", r.json())
    return created

def create_reservation_and_payment(headers):
    # przygotuj daty
    start = datetime.datetime.now() + datetime.timedelta(days=1)
    end   = start + datetime.timedelta(days=3)
    payload = {
        "start_date": start.isoformat(),
        "end_date":   end.isoformat(),
        "status":     "pending"
    }
    # rezerwacja
    r = requests.post(f"{BASE_URL}/api/reservations", json=payload, headers=headers)
    r.raise_for_status()
    res = r.json()
    print("▷ Stworzono rezerwację:", res)
    # płatność
    total_amount = sum(item["price_per_day"] * ( (end-start).days ) for item in [res]) \
                   if False else 0  # tu możesz obliczyć sumę, albo wiesz, wpisz kwotę ręcznie
    pay_payload = {
        "reservation_id": res["id"],
        "amount": total_amount or 100.0,
        "payment_method": "card"
    }
    p = requests.post(f"{BASE_URL}/api/payments", json=pay_payload, headers=headers)
    p.raise_for_status()
    print("▷ Wystawiono płatność:", p.json())
    return res

def main():
    # 1) Zaloguj admina
    admin_headers = login(ADMIN_CREDENTIALS)

    # 2) Zarejestruj usera (i pobierz token)
    user_headers = register_user()

    # 3) Tworzenie lokacji / kategorii / sprzętu jako admin
    create_locations(admin_headers)
    cats = create_categories(admin_headers)
    create_equipment(admin_headers, cats)

    # 4) Rezerwacja + płatność: dla admina
    print("\n— Admin tworzy rezerwację:")
    create_reservation_and_payment(admin_headers)

    # 5) Rezerwacja + płatność: dla usera
    print("\n— User tworzy rezerwację:")
    create_reservation_and_payment(user_headers)

    print("\n✅ Seed API zakończony.")

if __name__ == "__main__":
    main()
