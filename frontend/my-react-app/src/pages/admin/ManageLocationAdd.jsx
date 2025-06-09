// src/pages/admin/ManageLocationAdd.jsx
import React, { useState } from "react";

const ManageLocationAdd = ({ onBack }) => {
  const [street, setstreet] = useState(0);
  const [buildingNumber, setbuildingNumber] = useState(0);
  const [city, setcity] = useState(0);
  const [phone, setphone] = useState(0);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    await fetch("/api/admin/locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ contact_number: phone, street: street, house_number: buildingNumber, city: city }), 
    });
    onBack();
  };

  return (
    <div className="detail-panel">
      <h2>Dodaj Lokalizację</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>Ulica:<input type="text" value={street} onChange={e=>setstreet(e.target.value)} /></label>
        <label>Numer budynku:<input type="text" value={buildingNumber} onChange={e=>setbuildingNumber(e.target.value)} /></label>
        <label>Miasto:<input type="text" value={city} onChange={e=>setcity(e.target.value)} /></label>
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