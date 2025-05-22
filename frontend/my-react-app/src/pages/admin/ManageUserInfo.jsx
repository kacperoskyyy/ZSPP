import React from "react";
import ActionButton from "./ActionButton";
import "./AdminPanel.css";

const ManageUserInfo = ({ user, onBack }) => (
  <div className="admin-panel">
    <h2>Szczegóły użytkownika</h2>
    
    <div className="user-details">
      <div className="detail-row">
        <span className="detail-label">ID:</span>
        <span className="detail-value">{user.id}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Email:</span>
        <span className="detail-value">{user.email}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Imię:</span>
        <span className="detail-value">{user.first_name}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Nazwisko:</span>
        <span className="detail-value">{user.last_name}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Telefon:</span>
        <span className="detail-value">{user.phone_number || 'Nie podano'}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Rola:</span>
        <span className="detail-value">{user.role}</span>
      </div>
      {user.profile_image && (
        <div className="detail-row">
          <span className="detail-label">Zdjęcie:</span>
          <img 
            src={user.profile_image} 
            alt="Profilowe" 
            className="user-image"
          />
        </div>
      )}
      <div className="detail-row">
        <span className="detail-label">Data rejestracji:</span>
        <span className="detail-value">{user.created_at}</span>
      </div>
    </div>
    
    <div className="button-group">
      <ActionButton 
        type="secondary" 
        label="Powrót" 
        onClick={onBack} 
      />
    </div>
  </div>
);

export default ManageUserInfo;