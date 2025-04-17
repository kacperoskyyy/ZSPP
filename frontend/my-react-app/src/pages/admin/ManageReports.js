// src/pages/admin/ManageReports.js
import React, { useState, useEffect } from "react";

const ManageReports = () => {
  const [reps, setReps] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/api/admin/reports", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setReps)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Raporty</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Typ</th>
            <th>Tytuł</th>
            <th>Okres</th>
          </tr>
        </thead>
        <tbody>
          {reps.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.report_type}</td>
              <td>{r.title}</td>
              <td>
                {new Date(r.start_date).toLocaleDateString()} –{" "}
                {new Date(r.end_date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageReports;
