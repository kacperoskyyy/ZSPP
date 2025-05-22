import React, { useState } from 'react';
import ActionButton from './ActionButton';
import './AdminPanel.css';

const EditUserForm = ({ user, onBack, onSave }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profile_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    
    fetch(`/api/admin/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) throw new Error('Błąd aktualizacji');
      onSave();
      onBack();
    })
    .catch(error => alert(error.message));
  };

  return (
    <div className="admin-panel">
      <h2>Edytuj użytkownika</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-grid">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Imię:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />

          <label>Nazwisko:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />

          <label>Telefon:</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />

          <label>Rola:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <label>Zdjęcie profilowe:</label>
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formData.profile_image && (
              <img 
                src={formData.profile_image} 
                alt="Podgląd" 
                className="image-preview"
              />
            )}
          </div>
        </div>
        <div className="button-group">
          <ActionButton type="secondary" label="Anuluj" onClick={onBack} />
          <ActionButton type="primary" label="Zapisz zmiany" onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;