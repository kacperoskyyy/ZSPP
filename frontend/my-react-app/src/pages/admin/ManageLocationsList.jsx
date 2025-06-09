// src/pages/admin/ManageLocationsList.jsx
import React from "react";

const ManageLocationsList = ({ items, onBack }) => (
  <div className="detail-panel">
    <h2>Lista lokalizacji</h2>
    <ul>
      {items.map(i => (
        <li key={i.id}>{i.contact_number} , {i.street}, {i.house_number} , {i.city} </li>
      ))}
    </ul>
    <button className="back-button" onClick={onBack}>← Powrót</button>
  </div>
);

export default ManageLocationsList;