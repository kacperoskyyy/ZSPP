// src/pages/admin/ManageReports.js
import React, { useState, useEffect } from "react";
import ButtonPanel from "../../components/ButtonPanel";
import CompositeButtons from "../../components/CompositeButtons";
import './ManageEquipment.css';

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
    <>
    <div>
      <h2>Raporty ogólne</h2>
      <div class="butttons-next-to">
    <ButtonPanel 
      iconSrc="/money.png"
      label="Wygeneruj pełny raport finansowy"
      onClick={() => { /* funkcja */ }}
    />
    <ButtonPanel
        iconSrc="/pin.png"
        label="Wygeneruj raport z podsumowanie każdej lokalizacji"
        onClick={() => { /* funkcja */ }}
    />
    </div>
    <h2>Raporty dla lokalizacji</h2>
    <div class="butttons-next-to">
    <ButtonPanel
        iconSrc="/money.png"
        label="Wygeneruj raport finansowy dla lokalizacji"
        onClick={() => { /* funkcja */ }}
    />
    <ButtonPanel
        iconSrc="/pin.png"
        label="Wygeneruj raport wypozyczeń dla lokalizacji"
        onClick={() => { /* funkcja */ }}
    />
    </div>
    <h2>Raporty użytkowników</h2>
    <div class="butttons-next-to">
    <ButtonPanel
        iconSrc="/profile.png"
        label="Wygeneruj raport wypozyczeń użytkowników"
        onClick={() => { /* funkcja */ }}
    />
    <ButtonPanel
        iconSrc="/profile.png"
        label="Wygeneruj raport pracowników"
        onClick={() => { /* funkcja */ }}
    />
    </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Typ</th>
            <th>Tytuł</th>
            <th>Okres</th>
            <th>Akcja</th>
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
              <td><CompositeButtons/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default ManageReports;
