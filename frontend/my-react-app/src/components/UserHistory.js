import React, { useEffect, useState } from "react";

const UserHistory = () => {
  const [history, setHistory] = useState([]);
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
        if (!res.ok) throw new Error("Nie można pobrać historii.");
        return res.json();
      })
      .then((data) =>
        // traktujemy wszystko poza pending/active jako zakończone
        setHistory(
          data.filter((r) => r.status !== "pending" && r.status !== "active")
        )
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie historii…</p>;
  if (error) return <p style={{ color: "red" }}>Błąd: {error}</p>;

  return (
    <div style={{ padding: "20px" }} className="content-card">
      <h2>Historia wypożyczeń</h2>
      {history.length === 0 && <p>Brak zakończonych wypożyczeń.</p>}
      {history.map((r) => (
        <div key={r.id} className="history-item" style={{ marginBottom: 16 }}>
          <p>
            <strong>Produkt ID:</strong> {r.id}
          </p>
          <p>
            <strong>Okres:</strong> {new Date(r.start_date).toLocaleDateString()} –{" "}
            {new Date(r.end_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: "#555" }}>{r.status}</span>
          </p>
          <button>Oceń produkt</button>
        </div>
      ))}
    </div>
  );
};

export default UserHistory;
