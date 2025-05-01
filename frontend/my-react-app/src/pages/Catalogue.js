import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import "./Catalogue.css";

const sortOptions = [
  { value: "price_asc", label: "Cena rosnąco" },
  { value: "price_desc", label: "Cena malejąco" },
  { value: "name_asc", label: "Nazwa A–Z" },
  { value: "name_desc", label: "Nazwa Z–A" },
];

const Catalogue = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);

  const [sort, setSort] = useState("price_asc");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Pobranie listy sprzętu i kategorii
  useEffect(() => {
    fetch("/api/equipment")
      .then((r) => r.json())
      .then(setEquipment);
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  // Filtrowanie i sortowanie
  const filtered = equipment
    .filter((it) => {
      if (categoryFilter && it.category_id !== +categoryFilter) return false;
      const p = +it.price_per_day;
      if (minPrice && p < +minPrice) return false;
      if (maxPrice && p > +maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price_per_day - b.price_per_day;
        case "price_desc":
          return b.price_per_day - a.price_per_day;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // Dodanie do koszyka
  const handleAdd = (item) => {
    if (!user) {
      // zapisujemy tymczasowo i kierujemy na logowanie
      const pending = JSON.parse(localStorage.getItem("pendingCart") || "[]");
      pending.push(item);
      localStorage.setItem("pendingCart", JSON.stringify(pending));
      navigate("/login");
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="catalogue-page">
      <aside className="catalogue-sidebar">
      <div className="filter-group">
        <label>
          Sortuj
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        </div>
        <div className="filter-group">
        <label>
          Kategorie
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Wszystkie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        </div>
        <div className="filter-group price-range">
          
          <label>Cena (zł)</label>
          <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          {" – "}
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          </div>
          </div>
        
          <div className="filter-group-checkbox">
        <label>Dostępność w punkcie</label>
        <ul className="checkbox-list">
          <li>
            <label className="checkbox-label"> 
            <input
                type="checkbox"
                name="location1"
                />Andrychów
            </label>    
          </li>
          
          <li>
            <label className="checkbox-label"> 
            <input
                type="checkbox"
                name="location2"               
              />CIsiec
              </label>
          </li>
          
          <li>
            <label  className="checkbox-label">  
            <input
                type="checkbox"
                name="location3"               
              />Kęty
            </label>
          </li>
        </ul>
      </div>
    </aside>

      <main className="catalogue-main">
        {filtered.map((item) => (
          <div className="catalogue-card" key={item.id}>
            <img
              className="catalogue-img"
              src={
                (item.images && item.images[0]?.image_path) ||
                "/gregory.png"
              }
              alt={item.name}
            />
            <h3>{item.name}</h3>
            <p>
              <strong>{item.price_per_day} zł</strong> / dzień
            </p>
            <button onClick={() => handleAdd(item)}>Dodaj do koszyka</button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Catalogue;
