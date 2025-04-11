// src/components/UserProfile.js
import React from "react";

const UserProfile = () => {
  // Wyświetlasz dane użytkownika (np. z AuthContext lub z osobnego API)
  // i umożliwiasz edycję (np. zmiana danych osobowych, nr telefonu, itp.)
  return (
    <div style={{ padding: "20px" }}>
      <h2>Profil użytkownika</h2>
      <p>Imię i nazwisko: brak</p>
      <p>Data urodzenia: brak</p>
      <p>Płeć: brak</p>
      <p>Numer telefonu: brak</p>
      <p>Adres e-mail: brak</p>
      <p>...</p>
      {/* Link lub funkcja do zmiany hasła */}
      <button>Zmień hasło</button>
    </div>
  );
};

export default UserProfile;
