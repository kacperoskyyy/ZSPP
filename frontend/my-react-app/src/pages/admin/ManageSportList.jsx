// src/pages/admin/ManageSportList.jsx
import React from "react";

const ManageSportList = ({ items, onBack }) => (
  <div className="detail-panel">
    <h2>Lista sprzętu sportowego</h2>
    <ul>
      {items.map(i => (
        <li key={i.id}>{i.name} - {i.available_quantity}</li>
      ))}
    </ul>
    <button className="back-button" onClick={onBack}>← Powrót</button>
  </div>
);

export default ManageSportList;