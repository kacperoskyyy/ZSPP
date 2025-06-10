// src/pages/admin/ManageLocations.jsx
import React, { useState, useEffect } from "react";
import ButtonPanel from "../../components/ButtonPanel";
import ManageLocationAdd from "./ManageLocationAdd";
import "./AdminPanel.css";
import CompositeButtons from "../../components/CompositeButtons";
import ManageLocationsList from "./ManageLocationsList";
import ManageLocationDetails from "./ManageLocationDetails";
import ManageLocationDelete from "./ManageLocationDelete";
import ManageLocationsEdit from "./ManageLocationEdit";

const ManageLocations = () => {
  const [items, setItems] = useState([]);
  const [activeView, setActiveView] = useState("list");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/api/locations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error);
  }, []);
  const [selectedlocation, setSelectedLocation] = useState(null);

  const handleViewChange = (view, location) => {
    setSelectedLocation(location);
    setActiveView(view);
  };

  const showList = () => setActiveView("list");

  const refreshLocations = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch("/api/locations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Brak dostępu");
      const data = await response.json();
    } catch (error) {
      console.error("Błąd pobierania użytkowników:", error);
    }
  };

  // Render subviews
  if (activeView === "locationList")
    return <ManageLocationsList items={items} onBack={showList} />;
  if (activeView === "locationAdd")
    return <ManageLocationAdd onBack={showList} />;
  if (activeView === "info")
    return (
      <ManageLocationDetails onBack={showList} location={selectedlocation} />
    );
  if (activeView === "delete")
    return (
      <ManageLocationDelete
        user={selectedlocation}
        onBack={showList}
        onDelete={refreshLocations}
      />
    );
  if (activeView === "edit")
    return (
      <ManageLocationsEdit location={selectedlocation} onBack={showList} />
    );

  return (
    <div className="equipment-panel">
      <h2>Zarządzanie lokalizacjami</h2>
      <div className="equipment-button-row">
        <ButtonPanel
          iconSrc="/pin.png"
          label="Lista Lokalizacji"
          onClick={() => setActiveView("locationList")}
        />
      </div>
      <div className="equipment-button-row">
        <ButtonPanel
          iconSrc="/pin.png"
          label="Dodaj lokalizację"
          onClick={() => setActiveView("locationAdd")}
        />
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Numer kontaktowy</th>
            <th>ulica</th>
            <th>Numer budynku</th>
            <th>Miasto</th>
            <th>Utworzono</th>
            <th>Edytowano</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.contact_number}</td>
              <td>{i.street}</td>
              <td>{i.house_number}</td>
              <td>{i.city}</td>
              <td>{i.created_at}</td>
              <td>{i.updated_at}</td>
              <td>
                <CompositeButtons
                  onButtonOneClick={() => handleViewChange("info", i)}
                  onButtonTwoClick={() => handleViewChange("edit", i)}
                  onButtonThreeClick={() => handleViewChange("delete", i)}
                />
              </td>
            </tr>
          ))} 
        </tbody>
      </table>
    </div>
  );
};

export default ManageLocations;
