import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ManagePayment = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`/api/reservations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setReservation);
  }, [id]);

  if (!reservation) return <p>Ładowanie...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Podsumowanie rezerwacji #{reservation.id}</h2>
      <p><strong>Użytkownik:</strong> {reservation.user_id}</p>
      <p><strong>Okres:</strong> {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {reservation.status}</p>
      {/* tutaj możesz dodać opcję "zatwierdzenia płatności" */}
      <button onClick={() => alert("Płatność zatwierdzona!")}>Zatwierdź płatność</button>
    </div>
  );
};

export default ManagePayment;
