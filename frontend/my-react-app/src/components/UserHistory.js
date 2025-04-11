// src/components/UserHistory.js
import React from "react";

const UserHistory = () => {
  // Wyświetlasz historię zakończonych rezerwacji
  // Możesz też dodać możliwość oceny produktu
  return (
    <div style={{ padding: "20px" }}>
      <h2>Historia wypożyczeń</h2>
      <div className="history-item">
        <p>Liczniki GPS rowerowy Garmin Edge 1040</p>
        <p>Status: Zwrócony</p>
        <p>Data zwrotu: 06.03.2025</p>
        <p>Kwota: 75.00 zł</p>
        <button>Oceń produkt</button>
      </div>
      {/* Więcej zakończonych rezerwacji */}
    </div>
  );
};

export default UserHistory;
