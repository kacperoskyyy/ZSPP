import React, { useState } from "react";

const ManageLocationEdit = ({ location, onBack }) => {
  const [formData, setFormData] = useState({
    contact_number: location.contact_number || "",
    street: location.street || "",
    house_number: location.house_number || "",
    city: location.city || ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`/api/admin/locations/${location.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error("Błąd edycji lokalizacji");
      onBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="detail-panel">
      <h2>Edytuj lokalizację</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <label>
          Numer kontaktowy:
          <input name="contact_number" value={formData.contact_number} onChange={handleChange} />
        </label>
        <label>
          Ulica:
          <input name="street" value={formData.street} onChange={handleChange} />
        </label>
        <label>
          Numer budynku:
          <input name="house_number" value={formData.house_number} onChange={handleChange} />
        </label>
        <label>
          Miasto:
          <input name="city" value={formData.city} onChange={handleChange} />
        </label>

        <div className="form-buttons">
          <button type="submit" className="save-button">Zapisz</button>
          <button type="button" onClick={onBack} className="back-button">Powrót</button>
        </div>
      </form>
    </div>
  );
};

export default ManageLocationEdit;
