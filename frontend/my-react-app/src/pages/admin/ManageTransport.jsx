// src/pages/admin/ManageTransport.jsx
import React, { useState } from "react";

const ManageTransport = ({ onBack }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [itemId, setItemId] = useState("");

  const handleTransport = async () => {
    const token = localStorage.getItem("access_token");
    await fetch(`/api/admin/transport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ item_id: itemId, from_location: from, to_location: to }),
    });
    onBack();
  };

  return (
    <div className="detail-panel">
      <h2>Transport między punktami</h2>
      <label>ID sprzętu:<input value={itemId} onChange={e=>setItemId(e.target.value)} /></label>
      <label>Z:<input value={from} onChange={e=>setFrom(e.target.value)} /></label>
      <label>Do:<input value={to} onChange={e=>setTo(e.target.value)} /></label>
      <div className="form-buttons">
        <button className="save-button" onClick={handleTransport}>Wyślij</button>
        <button className="back-button" onClick={onBack}>Anuluj</button>
      </div>
    </div>
  );
};

export default ManageTransport;