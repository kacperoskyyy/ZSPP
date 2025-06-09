// src/pages/admin/ManageLocationAdd.jsx
import React, { useState } from "react";

const ManageLocationAdd = ({ onBack }) => {
  const [name, setName] = useState("");
  const [address, setaddress] = useState(0);
  const [phone, setphone] = useState(0);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    await fetch("/api/admin/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price_per_day: price, available_quantity: quantity }), //TUTAJ jest poprawka jak będzie backend na to xD
    });
    onBack();
  };

  return (
    <div className="detail-panel">
      <h2>Dodaj Lokalizację</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>Nazwa:<input value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>Adres:<input type="text" value={address} onChange={e=>setaddress(e.target.value)} /></label>
        <label>Numer kontaktowy:<input type="number" value={phone} onChange={e=>setphone(e.target.value)} /></label>
        <div className="form-buttons">
          <button type="submit" className="save-button">Zapisz</button>
          <button type="button" className="back-button" onClick={onBack}>Anuluj</button>
        </div>
      </form>
    </div>
  );
};

export default ManageLocationAdd;