// src/pages/admin/ManageEquipment.js
import React, { useState, useEffect } from "react";
import ButtonPanel from "../../components/ButtonPanel";
import './ManageEquipment.css';


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
      <h2>Zarządzanie kategoriami sprzętu</h2>
      <center>
      <ButtonPanel
      iconSrc="/category.png"
      label="Lista kategorii sprzętu"
      onClick={() => { /* funkcja */ }}
    />
    <h2>Zarządznie sprzętem</h2>
    <div class="butttons-next-to">
    <ButtonPanel 
      iconSrc="/sport.png"
      label="Lista dostępnego sprzętu sportowego"
      onClick={() => { /* funkcja */ }}
    />
    <ButtonPanel 
      iconSrc="/pin.png"
      label="Lista sprzętu dostępnego w lokalizacjach"
      onClick={() => { /* funkcja */ }}
    />
    </div>
    <br/>
    <div class="butttons-next-to">
    <ButtonPanel 
      iconSrc="/sport.png"
      label="Dodawanie sprzętu sportowego"
      onClick={() => { /* funkcja */ }}
    />
    <ButtonPanel 
      iconSrc="/location.png"
      label="Transport między punktami"
      onClick={() => { /* funkcja */ }}
    />
    </div>
    </center>
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
