// src/pages/admin/ManageCategories.jsx
import React, { useState, useEffect } from "react";
import CompositeButtons from "../../components/CompositeButtons";
import ManageCategoryInfo from "./ManageCategoryInfo";
import ManageCategoryEdit from "./ManageCategoryEdit";
import ManageCategoryDelete from "./ManageCategoryDelete";
import "./AdminPanel.css";

const ManageCategories = () => {
  const [cats, setCats] = useState([]);
  const [activeView, setActiveView] = useState("list"); // 'list' | 'info' | 'edit' | 'delete'
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Brak dostępu");
        return r.json();
      })
      .then(setCats)
      .catch(console.error);
  }, []);

  const handleViewChange = (view, cat) => {
    setSelectedCat(cat);
    setActiveView(view);
  };
  const showList = () => {
    setActiveView("list");
    setSelectedCat(null);
  };

  // Widoki szczegółów/edycji/usuwania
  if (activeView === "info")
    return <ManageCategoryInfo cat={selectedCat} onBack={showList} />;
  if (activeView === "edit")
    return <ManageCategoryEdit cat={selectedCat} onBack={showList} />;
  if (activeView === "delete")
    return <ManageCategoryDelete cat={selectedCat} onBack={showList} />;

  // Widok listy
  return (
    <div className="admin-panel">
      <h2>Zarządzaj kategoriami</h2>
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nazwa</th>
              <th>Opis</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.description || "-"}</td>
                <td>
                  <CompositeButtons
                    onButtonOneClick={() => handleViewChange("info", c)}
                    onButtonTwoClick={() => handleViewChange("edit", c)}
                    onButtonThreeClick={() => handleViewChange("delete", c)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;
