// src/pages/admin/ManageUsers.js
import React, { useState, useEffect } from "react";
import CompositeButtons from "../../components/CompositeButtons";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Brak dostępu");
        return res.json();
      })
      .then(setUsers)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Zarządzaj użytkownikami</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Rola</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.first_name}</td>
              <td>{u.last_name}</td>
              <td>{u.role}</td>
              <td><CompositeButtons/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
