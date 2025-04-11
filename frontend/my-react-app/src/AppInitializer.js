// src/AppInitializer.js
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

function AppInitializer() {
  const { login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Pobieramy dane użytkownika z chronionego endpointu
      fetch("/api/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Nie udało się pobrać danych użytkownika.");
          }
          return res.json();
        })
        .then((data) => {
          // Ustawiamy dane użytkownika w kontekście
          login(data);
        })
        .catch((err) => {
          console.error("Błąd przy odświeżaniu danych użytkownika", err);
        });
    }
  }, [login]);

  return null;
}

export default AppInitializer;
