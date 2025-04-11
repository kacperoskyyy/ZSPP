// src/AdminNavigation.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const AdminNavigation = () => {
  const { logout } = useAuth();

  return (
    <header>
      <nav>
        <Link to="/">Strona główna</Link>
        <Link to="/admin-panel">Panel administratora</Link>
        <button onClick={logout}>Wyloguj się</button>
      </nav>
    </header>
  );
};

export default AdminNavigation;
