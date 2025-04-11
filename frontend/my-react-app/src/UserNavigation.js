// src/UserNavigation.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const UserNavigation = () => {
  const { logout } = useAuth();

  return (
    <header>
      <nav>
        <Link to="/">Strona główna</Link>
        <Link to="/user-dashboard">Panel użytkownika</Link>
        <button onClick={logout}>Wyloguj się</button>
      </nav>
    </header>
  );
};

export default UserNavigation;
