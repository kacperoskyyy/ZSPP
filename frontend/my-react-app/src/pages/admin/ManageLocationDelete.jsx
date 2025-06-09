import React from "react";

const ManageLocationDelete = ({ user, onBack, onDelete }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`/api/admin/locations/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Nie udało się usunąć lokalizacji");
      onDelete(); // odśwież listę
      onBack();   // wróć do listy
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="detail-panel">
      <h2>Usuń lokalizację</h2>
      <p>Czy na pewno chcesz usunąć lokalizację <strong>{user.street} {user.house_number}, {user.city}</strong>?</p>

      <div className="form-buttons">
        <button className="delete-button" onClick={handleDelete}>Usuń</button>
        <button className="back-button" onClick={onBack}>Anuluj</button>
      </div>
    </div>
  );
};

export default ManageLocationDelete;
