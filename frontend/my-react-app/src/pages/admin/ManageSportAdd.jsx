// src/pages/admin/ManageSportAdd.jsx
import React, { useState } from "react";

const ManageSportAdd = ({ onBack }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    await fetch("/api/admin/equipment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price_per_day: price, available_quantity: quantity }),
    });
    onBack();
  };

  return (
    <div className="detail-panel">
      <h2>Dodaj sprzęt sportowy</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>Nazwa:<input value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>Cena/dzień:<input type="number" value={price} onChange={e=>setPrice(e.target.value)} /></label>
        <label>Ilość:<input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} /></label>
        <div className="form-buttons">
          <button type="submit" className="save-button">Zapisz</button>
          <button type="button" className="back-button" onClick={onBack}>Anuluj</button>
        </div>
      </form>
    </div>
  );
};

export default ManageSportAdd;