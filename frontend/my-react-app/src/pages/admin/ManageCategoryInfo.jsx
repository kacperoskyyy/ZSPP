// src/pages/admin/ManageCategoryInfo.jsx
import React from "react";

const ManageCategoryInfo = ({ cat, onBack }) => (
  <div className="detail-panel">
    <h2>Szczegóły kategorii</h2>
    <p><strong>ID:</strong> {cat.id}</p>
    <p><strong>Nazwa:</strong> {cat.name}</p>
    <p><strong>Opis:</strong> {cat.description || "-"}</p>
    <button className="back-button" onClick={onBack}>← Powrót do listy</button>
  </div>
);

export default ManageCategoryInfo;
