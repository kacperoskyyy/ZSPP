// src/AdminNavigation.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const AdminNavigation = () => {
  const { logout } = useAuth();

  return (



        <header className="User-Header-Nav">
          <div className="User-Nav-Left">
            <Link className="MainPage" to="/">
            <span>WSS</span>
            </Link>
            {/* <button onClick={logout}>Wyloguj się</button>8?} */}
          </div>
          <div className="User-Nav-Right">
          <Link className="Profile" to="/admin-panel">
            <img src="/gregory.png" alt="koszyk" className="NavIcon" />
            <span>Panel Administratora</span>
            </Link>
            <Link className="Basket" to="/">
            <img src="/sport.png" alt="koszyk" className="NavIcon" />
            <span>Sklep</span>
            </Link>
    
          </div>
        </header>
      );
    };
  

export default AdminNavigation;
