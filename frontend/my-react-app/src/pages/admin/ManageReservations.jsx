import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagePayment from "./ManagePayment";

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [activeView, setActiveView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("/api/admin/reservations/all", {
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

    const handleViewChange = (view, reservation) => {
    setReservations(reservation);
    setActiveView(view);
  };

  const showList = () => {
    setActiveView("list");
  };

  if (activeView === "payments") return <ManagePayment onBack={showList} />;

  if (loading) return <p>Ładowanie rezerwacji…</p>;
  if (error) return <p style={{ color: "red" }}>Błąd: {error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Lista wszystkich rezerwacji</h2>
      {reservations.length === 0 && <p>Brak rezerwacji.</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Użytkownik</th>
            <th>Od</th>
            <th>Do</th>
            <th>Status</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.user_id}</td>
              <td>{new Date(r.start_date).toLocaleDateString()}</td>
              <td>{new Date(r.end_date).toLocaleDateString()}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => handleViewChange("payments", reservations)} className="reservation-button">
                  Podsumowanie
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageReservations;
