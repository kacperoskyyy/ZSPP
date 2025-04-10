import React from "react";
import Sidebar from "./SideBar-Std";
import AccountNavigation from "./AccountNav";

const reservations = [
    {
      id: 1,
      name: "Licznik GPS rowerowy Garmin Edge 1040",
      price: "187,99 zł / dzień",
      status: "Wypożyczony",
      statusColor: "status-green",
      button: null,
    },
    {
      id: 2,
      name: "Licznik GPS rowerowy Garmin Edge 1040",
      price: "187,99 zł / dzień",
      status: "Rezerwacja",
      statusColor: "status-yellow",
      button: <Button className="cancel-button">Anuluj rezerwację</Button>,
    },
  ];

  export default function BikeGPSRental() {
    return (
      <div className="app-container">
        <Sidebar/>
        
        {/* Sidebar */}
        {/*<aside className="sidebar">
          <div>
            <h1 className="logo">WSS</h1>
            <nav className="nav-links">
              <div className="nav-item">
                <img src="/reserve-icon.png" alt="Reserve Icon" className="icon" />
                <span className="highlight">Moje rezerwacje</span>
              </div>
              <div className="nav-item">
                <img src="/profile-icon.png" alt="Profile Icon" className="icon" />
                <span>Profil</span>
              </div>
              <div className="nav-item">
                <img src="/history-icon.png" alt="History Icon" className="icon" />
                <span>Historia</span>
              </div>
            </nav>
          </div>
        </aside>8/}
  
        {/* Main Content */}
        <main className="main-content">
          {/*<div className="header">
            <span>Sklep</span>
            <span>Nickocado 0,00 zł</span>
            <img src="/profile-pic.png" alt="User" className="profile-pic" />
          </div>*/}
          <AccountNavigation/>
  
          <h2 className="section-title">Lista aktualnych wypożyczeń</h2>
          <div className="cards">
            {reservations.map((item) => (
              <div key={item.id} className="card">
                <div className="card-content">
                  <img src="/garmin.png" alt="Garmin Edge 1040" className="card-image" />
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                  <p className={item.statusClass}>Status: {item.status}</p>
                  {item.button && <div className="button-container">{item.button}</div>}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }
  
