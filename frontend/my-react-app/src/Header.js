// src/App.js  (albo lepiej: wyciągnij Header do osobnego pliku)
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import MainNavigation from "./MainNav";
import UserNavigation from "./UserNavigation";
import AdminNavigation from "./AdminNavigation";

const Header = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  // Tu wypiszemy trasy, na których chcemy ukryć globalny Header
  const hideHeaderOn = ["/login", "/register", ];

  if (hideHeaderOn.includes(pathname)) {
    // Nie renderujemy Main/User/AdminNavigation
    return null;
  }

  // W przeciwnym razie normalnie dobieramy nagłówek wg roli
  if (user && user.role === "admin") {
    return <AdminNavigation />;
  } else if (user) {
    return <UserNavigation />;
  } else {
    return <MainNavigation />;
  }
};

export default Header;
