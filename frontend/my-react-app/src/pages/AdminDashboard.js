// src/pages/AdminDashboard.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard"); // domyślny widok
  const navigate = useNavigate();

  // Funkcja pomocnicza do wyświetlania "Brak" w przypadku pustych danych
  const displayField = (field) => (field && field !== "" ? field : "Brak");

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
      {/* Sidebar - menu administratora */}
      <aside
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "1rem",
          backgroundColor: "#f7f7f7",
        }}
      >
        <h3>Menu Admina</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <button className="Dashboard-Admin-Button"
              onClick={() => setActiveTab("dashboard")}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "none",
                background:
                  activeTab === "dashboard" ? "#007bff" : "transparent",
                color: activeTab === "dashboard" ? "#fff" : "#000",
                textAlign: "left",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              Panel Główny
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("users")}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "none",
                background: activeTab === "users" ? "#007bff" : "transparent",
                color: activeTab === "users" ? "#fff" : "#000",
                textAlign: "left",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              Zarządzaj użytkownikami
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("categories")}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "none",
                background:
                  activeTab === "categories" ? "#007bff" : "transparent",
                color: activeTab === "categories" ? "#fff" : "#000",
                textAlign: "left",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              Zarządzaj kategoriami
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("equipment")}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "none",
                background:
                  activeTab === "equipment" ? "#007bff" : "transparent",
                color: activeTab === "equipment" ? "#fff" : "#000",
                textAlign: "left",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              Zarządzaj sprzętem
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("reports")}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "none",
                background: activeTab === "reports" ? "#007bff" : "transparent",
                color: activeTab === "reports" ? "#fff" : "#000",
                textAlign: "left",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
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

      {/* Główna zawartość panelu admina */}
      <main style={{ flex: 1, padding: "1rem" }}>
        {activeTab === "dashboard" && (
          <div>
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
                  style={{ width: "100px" }}
                />
              ) : (
                "Brak"
              )}
            </p>
          </div>
        )}
        {activeTab === "users" && (
          <div>
            <h2>Zarządzaj użytkownikami</h2>
            <p>Tutaj możesz wyświetlić i edytować listę użytkowników.</p>
            {/* Wywołanie API, mapowanie danych – tutaj przykład placeholder */}
          </div>
        )}
        {activeTab === "categories" && (
          <div>
            <h2>Zarządzaj kategoriami</h2>
            <p>Tutaj możesz dodawać, edytować i usuwać kategorie produktów.</p>
          </div>
        )}
        {activeTab === "equipment" && (
          <div>
            <h2>Zarządzaj sprzętem</h2>
            <p>Tutaj możesz zarządzać produktami i przypisywać zdjęcia.</p>
          </div>
        )}
        {activeTab === "reports" && (
          <div>
            <h2>Raporty</h2>
            <p>Tutaj możesz generować raporty i analizować dane.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
