import React from 'react';
import ActionButton from './ActionButton';
import './AdminPanel.css';

const DeleteUserForm = ({ user, onBack, onDelete }) => {
  const handleDelete = () => {
    const token = localStorage.getItem('access_token');
    fetch(`/api/admin/users/${user.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      if (!response.ok) throw new Error('Błąd usuwania');
      onDelete();
      onBack();
    })
    .catch(error => alert(error.message));
  };

  return (
    <div className="admin-panel">
      <h2>Usuwanie użytkownika</h2>
      <div className="user-info">
        <p>Czy na pewno chcesz usunąć użytkownika:</p>
        <p><strong>{user.first_name} {user.last_name}</strong> ({user.email})?</p>
      </div>
      <div className="button-group">
        <ActionButton type="secondary" label="Anuluj" onClick={onBack} />
        <ActionButton type="danger" label="Usuń na stałe" onClick={handleDelete} />
      </div>
    </div>
  );
};

export default DeleteUserForm;