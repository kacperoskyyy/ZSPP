// src/UserNavigation.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const UserNavigation = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Przekierowanie na stronę główną po wylogowaniu
  };

  return (
    <header style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
      <nav>
        <ul
          style={{ listStyle: "none", display: "flex", gap: "1rem", margin: 0 }}
        >
          <li>
            <Link to="/user-dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/user-profile">Profil</Link>
          </li>
          {/* Możesz dodać kolejne linki */}
          <li>
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>
              Wyloguj się
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default UserNavigation;
