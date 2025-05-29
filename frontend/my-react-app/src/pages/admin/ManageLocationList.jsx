// src/pages/admin/ManageLocationList.jsx
import React from "react";

const ManageLocationList = ({ items, onBack }) => (
  <div className="detail-panel">
    <h2>Lista sprzętu wg lokalizacji</h2>
    {/* Tu możesz pogrupować po lokalizacjach */}
    <button className="back-button" onClick={onBack}>← Powrót</button>
  </div>
);

export default ManageLocationList;