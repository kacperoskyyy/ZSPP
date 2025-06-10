import React, { useEffect, useState } from "react";

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/api/reservations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nie można pobrać rezerwacji.");
        return res.json();
      })
      .then((data) => setReservations(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie rezerwacji…</p>;
  if (error) return <p style={{ color: "red" }}>Błąd: {error}</p>;

  // Załóżmy, że "pending" i "active" to bieżące rezerwacje
  const current = reservations.filter(
    (r) => r.status === "pending" || r.status === "active"
  );

  const cancelReservation = (id) => {
    // TODO: zaimplementuj endpoint anulowania po stronie API
    fetch(`/api/reservations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    }).then(() => {
      setReservations((prev) => prev.filter((r) => r.id !== id));
    });
  };

  return (
    <div style={{ padding: "20px" }} className="content-card">
      <h2>Moje rezerwacje</h2>
      {current.length === 0 && <p>Brak aktywnych rezerwacji.</p>}
      {current.map((r) => (
        <div key={r.id} className="reservation-card" style={{ marginBottom: 16 }}>
          <p>
            <strong>Produkt ID:</strong> {r.id}
          </p>
          <p>
            <strong>Okres:</strong> {new Date(r.start_date).toLocaleDateString()} –{" "}
            {new Date(r.end_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: "green" }}>{r.status}</span>
          </p>
          <button onClick={() => cancelReservation(r.id)}>Anuluj rezerwację</button>
        </div>
      ))}
    </div>
  );
};

export default UserReservations;
