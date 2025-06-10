import React from "react";

const ManageLocationDetails = ({ location, onBack }) => {
  return (
    <div className="detail-panel">
      <h2>Szczegóły lokalizacji</h2>
      <div className="user-details">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{location.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Numer kontaktowy:</span>
          <span className="detail-value">{location.contact_number}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Ulica:</span>
          <span className="detail-value">{location.street}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Numer budynku:</span>
          <span className="detail-value">{location.house_number}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Miasto:</span>
          <span className="detail-value">{location.city}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Utworzono:</span>
          <span className="detail-value">{location.created_at}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Edytowano:</span>
          <span className="detail-value">{location.updated_at}</span>
        </div>
      </div>

      <div className="form-buttons">
        <button className="back-button" onClick={onBack}>Powrót</button>
      </div>
    </div>
  );
};

export default ManageLocationDetails;
