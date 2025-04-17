// src/pages/admin/ManageEquipment.js
import React, { useState, useEffect } from "react";

const ManageEquipment = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/api/equipment", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Zarządzaj sprzętem</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa</th>
            <th>Cena/dzień</th>
            <th>Ilość</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.name}</td>
              <td>{i.price_per_day}</td>
              <td>{i.available_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEquipment;
