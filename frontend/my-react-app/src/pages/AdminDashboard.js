// src/pages/AdminDashboard.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import ManageUsers from "./admin/ManageUsers";
import ManageCategories from "./admin/ManageCategories";
import ManageEquipment from "./admin/ManageEquipment";
import ManageReports from "./admin/ManageReports";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const displayField = (field) => (field ? field : "Brak");

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h3>Menu Admina</h3>
        <ul>
          <li>
            <button
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              Panel główny
            </button>
          </li>
          <li>
            <button
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              Zarządzaj użytkownikami
            </button>
          </li>
          <li>
            <button
              className={activeTab === "categories" ? "active" : ""}
              onClick={() => setActiveTab("categories")}
            >
              Zarządzaj kategoriami
            </button>
          </li>
          <li>
            <button
              className={activeTab === "equipment" ? "active" : ""}
              onClick={() => setActiveTab("equipment")}
            >
              Zarządzaj sprzętem
            </button>
          </li>
          <li>
            <button
              className={activeTab === "reports" ? "active" : ""}
              onClick={() => setActiveTab("reports")}
            >
              Raporty
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Wyloguj się
            </button>
          </li>
        </ul>
      </aside>

      <main className="main-panel">
        {activeTab === "dashboard" && (
          <div className="dashboard-home">
            <h2>Panel główny admina</h2>
            <p>
              <strong>ID:</strong> {displayField(user.id)}
            </p>
            <p>
              <strong>Email:</strong> {displayField(user.email)}
            </p>
            <p>
              <strong>Imię:</strong> {displayField(user.first_name)}
            </p>
            <p>
              <strong>Nazwisko:</strong> {displayField(user.last_name)}
            </p>
            <p>
              <strong>Rola:</strong> {displayField(user.role)}
            </p>
            <p>
              <strong>Profilowe:</strong>{" "}
              {user.profile_image ? (
                <img
                  src={`/${user.profile_image}`}
                  alt="Profilowe"
                  className="profile-img"
                />
              ) : (
                "Brak"
              )}
            </p>
          </div>
        )}
        {activeTab === "users" && <ManageUsers />}
        {activeTab === "categories" && <ManageCategories />}
        {activeTab === "equipment" && <ManageEquipment />}
        {activeTab === "reports" && <ManageReports />}
      </main>
    </div>
  );
};

export default AdminDashboard;
