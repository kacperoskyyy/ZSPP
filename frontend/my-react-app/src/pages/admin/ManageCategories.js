// src/pages/admin/ManageCategories.js
import React, { useState, useEffect } from "react";

const ManageCategories = () => {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/api/categories", {
      // nie ma GET /api/admin/categories, więc używamy publicznego
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setCats)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Zarządzaj kategoriami</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa</th>
            <th>Opis</th>
          </tr>
        </thead>
        <tbody>
          {cats.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategories;
