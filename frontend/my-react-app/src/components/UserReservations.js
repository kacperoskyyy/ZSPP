// src/components/UserReservations.js
import React from "react";

const UserReservations = () => {
  // Tu możesz pobrać rezerwacje z API (np. /api/reservations) i wyświetlić listę
  return (
    <div style={{ padding: "20px" }}>
      <h2>Moje rezerwacje</h2>
      {/* Przykładowa lista rezerwacji */}
      <div className="reservation-card">
        <p>Liczniki GPS rowerowy Garmin Edge 1040</p>
        <p>Status: Wypożyczony</p>
        <button>Anuluj rezerwację</button>
      </div>
      {/* Dodaj tyle elementów, ile rezerwacji pobierzesz */}
    </div>
  );
};

export default UserReservations;
