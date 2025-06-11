import React from "react";

const ManagePayment = ({ reservation, onBack }) => {
  if (!reservation) return <p>Ładowanie...</p>;

  return (
    <div style={{ padding: 20 }} className="manage-payment-container">
      <h2>Podsumowanie rezerwacji #{reservation.id}</h2>
      <p><strong>Użytkownik:</strong> {reservation.user_id}</p>
      <p><strong>Okres:</strong> {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {reservation.status}</p>

      <button onClick={() => alert("Płatność zatwierdzona!")/* TUTAJ POWINNA BYC FUNKCJA, KTORA ODPYTUJE API ALE NW 
    CZY JEST NA TO ENDPOINT ZROBIONY */}>Zatwierdź płatność</button>
      <button onClick={onBack} style={{ marginLeft: 10 }}>Powrót</button>
    </div>
  );
};

export default ManagePayment;
