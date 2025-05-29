// src/pages/admin/ManageCategoryDelete.jsx
import React from "react";

const ManageCategoryDelete = ({ cat, onBack }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem("access_token");
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    onBack();
  };

  return (
    <div className="detail-panel">
      <h2>Usuń kategorię</h2>
      <p>Czy na pewno chcesz usunąć kategorię <strong>{cat.name}</strong>?</p>
      <div className="form-buttons">
        <button className="delete-button" onClick={handleDelete}>Tak, usuń</button>
        <button className="back-button" onClick={onBack}>Anuluj</button>
      </div>
    </div>
  );
};

export default ManageCategoryDelete;
