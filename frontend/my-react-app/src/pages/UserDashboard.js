// src/pages/UserDashboard.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // domyślny widok

  // Funkcja do wyświetlania danych, jeśli pusta – "Brak"
  const displayField = (field) => {
    return field && field !== "" ? field : "Brak";
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Menu</h3>
        
        
        <ul className="sidebar-menu">
          <li>
            <button
              className={`menu-button ${activeTab === "profile" ? "menu-button-active" : "menu-button-inactive"}`}
              onClick={() => setActiveTab("profile")}
            >
              <img 
                src="/profile.png" 
                alt="" 
                className={`menu-icon ${activeTab === "profile" ? "icon-white" : ""}`} 
              />
              Profil
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "reservations" ? "menu-button-active" : "menu-button-inactive"}`}
              onClick={() => setActiveTab("reservations")}
            >
              <img 
                src="/reservations.png" 
                alt="" 
                className={`menu-icon ${activeTab === "reservations" ? "icon-white" : ""}`} 
              />
              Rezerwacje
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "reviews" ? "menu-button-active" : "menu-button-inactive"}`}
              onClick={() => setActiveTab("reviews")}
            >
              <img 
                src="info.png" 
                alt="" 
                className={`menu-icon ${activeTab === "reviews" ? "icon-white" : ""}`} 
              />
              Opinie
            </button>
          </li>
          <li>
            <button
              className="menu-button"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              <img 
                src="/logout.png"
                alt="" 
                className="menu-icon" 
              />
              Wyloguj się
            </button>
          </li>
        </ul>
      </aside>






      {/* Główna zawartość panelu */}
      <main className="User-Main-Content" style={{ flex: 1, padding: "1rem" }}>
        {activeTab === "profile" && (
          <div>
            <h2>Twój Profil</h2>
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
              <strong>Numer telefonu:</strong> {displayField(user.phone_number)}
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
                  style={{ width: "100px" }}
                />
              ) : (
                "Brak"
              )}
            </p>
          </div>
        )}
        {activeTab === "reservations" && (
          <div>
            <h2>Rezerwacje</h2>
            {/* Dodaj wywołanie API lub przekaż dane rezerwacji */}
            <p>Brak rezerwacji</p>
          </div>
        )}
        {activeTab === "reviews" && (
          <div>
            <h2>Opinie</h2>
            {/* Dodaj wywołanie API lub przekaż dane opinii */}
            <p>Brak opinii</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
