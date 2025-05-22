// src/UserNavigation.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";


const UserNavigation = () => {
  const { logout } = useAuth();

  return (
    <header className="User-Header-Nav">
      <div className="User-Nav-Left">
        <Link className="MainPage" to="/">
        <a className="LOGO">WSS</a>
        </Link>
        {/* <button onClick={logout}>Wyloguj się</button>8?} */}
      </div>
      <div className="User-Nav-Right">
      <Link className="Profile" to="/Catalogue">
        <img src="/Store.png" alt="koszyk" className="NavIcon" />
        <span>Sklep</span>
        </Link>
      <Link className="Profile" to="/user-dashboard">
        <img src="/gregory.png" alt="koszyk" className="NavIcon" />
        <span>Panel użytkownika</span>
        </Link>
        <Link className="Basket" to="/">
        <img src="/sport.png" alt="koszyk" className="NavIcon" />
        <span>Koszyk</span>
        </Link>

      </div>
    </header>
  );
};

export default UserNavigation;
