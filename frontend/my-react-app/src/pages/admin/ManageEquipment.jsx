// src/pages/admin/ManageEquipment.jsx
import React, { useState, useEffect } from "react";
import ButtonPanel from "../../components/ButtonPanel";
import ManageSportList from "./ManageSportList";
import ManageLocationList from "./ManageLocationList";
import ManageSportAdd from "./ManageSportAdd";
import ManageTransport from "./ManageTransport";
import './AdminPanel.css';

const ManageEquipment = () => {
  const [items, setItems] = useState([]);
  const [activeView, setActiveView] = useState("list"); // 'list', 'sportList', 'locationList', 'sportAdd', 'transport'

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/api/equipment", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  const showList = () => setActiveView("list");

  // Render subviews
  if (activeView === "sportList") return <ManageSportList items={items} onBack={showList} />;
  if (activeView === "locationList") return <ManageLocationList items={items} onBack={showList} />;
  if (activeView === "sportAdd") return <ManageSportAdd onBack={showList} />;
  if (activeView === "transport") return <ManageTransport onBack={showList} />;

  return (
    <div className="equipment-panel">
      <h2>Zarządzanie sprzętem</h2>
      <div className="equipment-button-row">
        <ButtonPanel
          iconSrc="/sport.png"
          label="Lista sprzętu sportowego"
          onClick={() => setActiveView("sportList")}
        />
        <ButtonPanel
          iconSrc="/pin.png"
          label="Lista sprzętu wg lokalizacji"
          onClick={() => setActiveView("locationList")}
        />
      </div>
      <div className="equipment-button-row">
        <ButtonPanel
          iconSrc="/sport.png"
          label="Dodaj sprzęt sportowy"
          onClick={() => setActiveView("sportAdd")}
        />
        <ButtonPanel
          iconSrc="/location.png"
          label="Transport między punktami"
          onClick={() => setActiveView("transport")}
        />
      </div>
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