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
    <div style={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "1rem",
        }}
      >
        <h3>Menu</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "none",
                background: activeTab === "profile" ? "#007bff" : "transparent",
                color: activeTab === "profile" ? "#fff" : "#000",
                textAlign: "left",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              Profil
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("reservations")}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "none",
                background:
                  activeTab === "reservations" ? "#007bff" : "transparent",
                color: activeTab === "reservations" ? "#fff" : "#000",
                textAlign: "left",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              Rezerwacje
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("reviews")}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "none",
                background: activeTab === "reviews" ? "#007bff" : "transparent",
                color: activeTab === "reviews" ? "#fff" : "#000",
                textAlign: "left",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              Opinie
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "none",
                background: "transparent",
                color: "#000",
                textAlign: "left",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Wyloguj się
            </button>
          </li>
        </ul>
      </aside>

      {/* Główna zawartość panelu */}
      <main style={{ flex: 1, padding: "1rem" }}>
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
