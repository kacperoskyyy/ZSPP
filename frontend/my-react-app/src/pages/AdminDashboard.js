// src/pages/AdminDashboard.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import ManageUsers from "./admin/ManageUsers";
import ManageCategories from "./admin/ManageCategories";
import ManageEquipment from "./admin/ManageEquipment";
import ManageReports from "./admin/ManageReports";
import ManageLocations from "./admin/ManageLocations";
import ManageReservations from "./admin/ManageReservations";

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
        <ul className="sidebar-menu">
          <li>
            <button             
              className={`menu-button ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}>
              <img src= "/chart.png" alt="Profil" className="menu-icon" />
            
              Panel główny
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}>
              <img src= "/profile.png" alt="Profil" className="menu-icon" />
              Zarządzaj użytkownikami
            </button>
          </li>
          <li>
            <button              
              className={`menu-button ${activeTab === "categories" ? "active" : ""}`}
              onClick={() => setActiveTab("categories")}>
                <img src= "/category.png" alt="Profil" className="menu-icon" />
              Zarządzaj kategoriami
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "equipment" ? "active" : ""}`}
              onClick={() => setActiveTab("equipment")}>
                <img src= "/store.png" alt="Profil" className="menu-icon" />
              Zarządzaj sprzętem
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "reports" ? "active" : ""}`}
              onClick={() => setActiveTab("reports")}>
                <img src= "/info.png" alt="Profil" className="menu-icon" />
              Raporty
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "locations" ? "active" : ""}`}
              onClick={() => setActiveTab("locations")}>
                <img src= "/pin.png" alt="Profil" className="menu-icon" />
              Lokalizacje
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "reservations" ? "active" : ""}`}
              onClick={() => setActiveTab("reservations")}>
                <img src= "/product-return.png" alt="Profil" className="menu-icon" />
              Zwroty
              </button>
          </li>
          <li>
            <button className="menu-button"
              onClick={() => {
                logout();
                navigate("/");
              }}>
                <img src= "/logout.png" alt="Profil" className="menu-icon" />
              Wyloguj się
            </button>
          </li>
        </ul>
      </aside>

      <main className="main-panel">
        {activeTab === "dashboard" && (
          <div className="dashboard-home">
          <h2>Panel główny admina</h2>
          <div className="dashboard-info">
            <div className="info-row">
              <strong className="info-label">ID: </strong>
              <span className="info-value">{displayField(user.id)}</span>
            </div>
            <div className="info-row">
              <strong className="info-label">Email: </strong>
              <span className="info-value">{displayField(user.email)}</span>
            </div>
            <div className="info-row">
              <strong className="info-label">Imię: </strong>
              <span className="info-value">{displayField(user.first_name)}</span>
            </div>
            <div className="info-row">
              <strong className="info-label">Nazwisko: </strong>
              <span className="info-value">{displayField(user.last_name)}</span>
            </div>
            <div className="info-row">
              <strong className="info-label">Rola: </strong>
              <span className="info-value">{displayField(user.role)}</span>
            </div>
            <div className="info-row">
              <strong className="info-label">Profilowe: </strong>
              <span className="info-value">
                {user.profile_image
                  ? <img src={`/${user.profile_image}`} alt="Profilowe" className="profile-img" />
                  : "Brak"}
              </span>
            </div>
          </div>
        </div>        
        )}
        {activeTab === "users" && <ManageUsers />}
        {activeTab === "categories" && <ManageCategories />}
        {activeTab === "equipment" && <ManageEquipment />}
        {activeTab === "reports" && <ManageReports />}
        {activeTab === "locations" && <ManageLocations/>}
        {activeTab === "reservations" && <ManageReservations />}
      </main>
    </div>
  );
};

export default AdminDashboard;
