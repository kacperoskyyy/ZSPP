// src/pages/admin/ManageCategoryEdit.jsx
import React, { useState } from "react";

const ManageCategoryEdit = ({ cat, onBack }) => {
  const [name, setName] = useState(cat.name);
  const [description, setDescription] = useState(cat.description || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });
    onBack();
  };

  return (
    <div className="detail-panel">
      <h2>Edytuj kategorię</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>
          Nazwa:
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          Opis:
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <div className="form-buttons">
          <button type="submit" className="save-button">Zapisz</button>
          <button type="button" className="back-button" onClick={onBack}>Anuluj</button>
        </div>
      </form>
    </div>
  );
};

export default ManageCategoryEdit;
