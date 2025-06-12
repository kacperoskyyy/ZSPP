// src/pages/admin/ManagePayment.js
import React, { useState } from "react";

const ManagePayment = ({ reservation, onBack }) => {
  const [status, setStatus] = useState(reservation?.status || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!reservation) return <p>Ładowanie...</p>;

  const completeReservation = async () => {
    const token = localStorage.getItem("access_token");
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/reservations/complete?reservation_id=${reservation.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nie udało się zakończyć rezerwacji.");
      }

      const result = await response.json();
      setStatus("completed");
      setMessage(result.message || "Rezerwacja została zakończona.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }} className="manage-payment-container">
      <h2>Podsumowanie rezerwacji #{reservation.id}</h2>
      <p>
        <strong>Użytkownik:</strong> {reservation.user_id}
      </p>
      <p>
        <strong>Okres:</strong>{" "}
        {new Date(reservation.start_date).toLocaleDateString()} -{" "}
        {new Date(reservation.end_date).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span style={{ fontWeight: "bold" }}>{status}</span>
      </p>

      {status !== "completed" && (
        <button
          onClick={completeReservation}
          disabled={loading}
          className="reservation-button"
        >
          {loading ? "Zatwierdzanie..." : "Zatwierdź rezerwację"}
        </button>
      )}
      <button onClick={onBack} style={{ marginLeft: 10 }}>
        Powrót
      </button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
};

export default ManagePayment;
