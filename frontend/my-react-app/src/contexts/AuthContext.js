// src/contexts/AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useCart } from "./CartContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { addToCart } = useCart();

  // 1) Inicjalny stan użytkownika z localStorage (jeśli jest)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // 2) login i logout powinny mieć stabilną referencję
  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }, []);

  // 3) Po zalogowaniu przenosimy pendingCart → cart
  useEffect(() => {
    if (user) {
      const pending = JSON.parse(localStorage.getItem("pendingCart") || "[]");
      pending.forEach((item) => addToCart(item));
      localStorage.removeItem("pendingCart");
    }
  }, [user, addToCart]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
