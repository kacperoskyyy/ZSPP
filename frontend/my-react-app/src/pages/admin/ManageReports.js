import React, { useState, useEffect } from "react";
import ButtonPanel from "../../components/ButtonPanel";
import CompositeButtons from "../../components/CompositeButtons";
import "./AdminPanel.css";

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch("/api/admin/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Błąd pobierania raportów");
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Błąd:", error);
      }
    };
    fetchReports();
  }, []);

  const generateReport = async (reportType, title) => {
    setIsLoading(true);
    setActiveReport(title);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/admin/generate-report/${reportType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Błąd generowania raportu");
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Błąd generowania raportu:", error);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderReportResult = () => {
    if (isLoading) {
      return <div className="loading">Generowanie raportu...</div>;
    }

    if (!reportData || !reportData.chart) {
      return <div className="no-results">Brak danych do wyświetlenia</div>;
    }

    return (
      <div className="report-chart">
        <h3>{reportData.title}</h3>
        <img
          src={reportData.chart}
          alt={reportData.title}
          style={{ maxWidth: "100%", height: "auto", marginTop: "1rem" }}
        />
      </div>
    );
  };

  return (
    <div className="admin-panel">
      <div className="search-header">
        <h2>Zarządzanie raportami</h2>
      </div>

      <div className="report-sections">
        <section>
          <h2>Raporty ogólne</h2>
          <div className="buttons-next-to">
            <ButtonPanel
              iconSrc="/money.png"
              label="Wygeneruj pełny raport finansowy"
              onClick={() =>
                generateReport("full_financial", "Pełny raport finansowy")
              }
            />
            <ButtonPanel
              iconSrc="/pin.png"
              label="Wygeneruj raport z podsumowaniem każdej lokalizacji"
              onClick={() =>
                generateReport("location_summary", "Podsumowanie lokalizacji")
              }
            />
          </div>
        </section>

        <section>
          <h2>Raporty dla lokalizacji</h2>
          <div className="buttons-next-to">
            <ButtonPanel
              iconSrc="/money.png"
              label="Wygeneruj raport finansowy dla lokalizacji"
              onClick={() =>
                generateReport(
                  "location_financial",
                  "Raport finansowy lokalizacji"
                )
              }
            />
            <ButtonPanel
              iconSrc="/pin.png"
              label="Wygeneruj raport wypożyczeń dla lokalizacji"
              onClick={() =>
                generateReport(
                  "location_rentals",
                  "Raport wypożyczeń lokalizacji"
                )
              }
            />
          </div>
        </section>

        <section>
          <h2>Raporty użytkowników</h2>
          <div className="buttons-next-to">
            <ButtonPanel
              iconSrc="/profile.png"
              label="Wygeneruj raport wypożyczeń użytkowników"
              onClick={() =>
                generateReport("user_rentals", "Raport wypożyczeń użytkowników")
              }
            />
            <ButtonPanel
              iconSrc="/profile.png"
              label="Wygeneruj raport pracowników"
              onClick={() => generateReport("employees", "Raport pracowników")}
            />
          </div>
        </section>
      </div>

      {activeReport && renderReportResult()}

      <div className="saved-reports">
        <h2>Zapisane raporty</h2>
        <div className="table-responsive">
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
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.report_type}</td>
                  <td>{r.title}</td>
                  <td>
                    {new Date(r.start_date).toLocaleDateString()} –{" "}
                    {new Date(r.end_date).toLocaleDateString()}
                  </td>
                  <td>
                    <CompositeButtons
                      onButtonOneClick={() =>
                        console.log("Podgląd raportu", r.id)
                      }
                      onButtonTwoClick={() =>
                        console.log("Eksport raportu", r.id)
                      }
                      onButtonThreeClick={() =>
                        console.log("Usuń raport", r.id)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <div className="no-results">Brak zapisanych raportów</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageReports;
