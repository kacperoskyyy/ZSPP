
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard"); // default view
  const navigate = useNavigate();

  // Helper function for empty data
  const displayField = (field) => (field && field !== "" ? field : "Brak");

  return (
    <div className="dashboard-container">
      {/* Sidebar - admin menu */}
      <aside className="sidebar">
        <h3>Menu Admina</h3>
        <ul className="sidebar-menu horizontal-menu">
          <li>
            <button 
              className={`menu-button ${activeTab === "dashboard" ? "menu-button-active" : "menu-button-inactive"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <img 
                src="/chart.png" 
                alt="" 
                className={`menu-icon ${activeTab === "dashboard" ? "icon-white" : ""}`} 
              />
              <span>Panel Główny</span>
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "users" ? "menu-button-active" : "menu-button-inactive"}`}
              onClick={() => setActiveTab("users")}
            >
              <img 
                src="/profile.png" 
                alt="" 
                className={`menu-icon ${activeTab === "users" ? "icon-white" : ""}`} 
              />
              <span>Zarządzaj użytkownikami</span>
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "categories" ? "menu-button-active" : "menu-button-inactive"}`}
              onClick={() => setActiveTab("categories")}
            >
              <img 
                src="/category.png" 
                alt="" 
                className={`menu-icon ${activeTab === "categories" ? "icon-white" : ""}`} 
              />
              <span>Zarządzaj kategoriami</span>
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "equipment" ? "menu-button-active" : "menu-button-inactive"}`}
              onClick={() => setActiveTab("equipment")}
            >
              <img 
                src="/sport.png" 
                alt="" 
                className={`menu-icon ${activeTab === "equipment" ? "icon-white" : ""}`} 
              />
              <span>Zarządzaj sprzętem</span>
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "reports" ? "menu-button-active" : "menu-button-inactive"}`}
              onClick={() => setActiveTab("reports")}
            >
              <img 
                src="/info.png" 
                alt="" 
                className={`menu-icon ${activeTab === "reports" ? "icon-white" : ""}`} 
              />
              <span>Raporty</span>
            </button>
          </li>
          <li>
            <button
              className="menu-button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <img 
                src="/logout.png" 
                alt="" 
                className="menu-icon" 
              />
              <span>Wyloguj się</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Main admin panel content */}
      <main className="User-Main-Content">
        {activeTab === "dashboard" && (
          <div className="dashboard-item">
            <h2>Panel Główny Admina</h2>
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
              <strong>Zdjęcie profilowe:</strong>{" "}
              {user.profile_image ? (
                <img
                  src={`/${user.profile_image}`}
                  alt="Profilowe"
                  className="profile-image"
                />
              ) : (
                "Brak"
              )}
            </p>
          </div>
        )}
        {activeTab === "users" && (
          <div className="dashboard-item">
            <h2>Zarządzaj użytkownikami</h2>
            <p>Tutaj możesz wyświetlić i edytować listę użytkowników.</p>
          </div>
        )}
        {activeTab === "categories" && (
          <div className="dashboard-item">
            <h2>Zarządzaj kategoriami</h2>
            <p>Tutaj możesz dodawać, edytować i usuwać kategorie produktów.</p>
          </div>
        )}
        {activeTab === "equipment" && (
          <div className="dashboard-item">
            <h2>Zarządzaj sprzętem</h2>
            <p>Tutaj możesz zarządzać produktami i przypisywać zdjęcia.</p>
          </div>
        )}
        {activeTab === "reports" && (
          <div className="dashboard-item">
            <h2>Raporty</h2>
            <p>Tutaj możesz generować raporty i analizować dane.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;