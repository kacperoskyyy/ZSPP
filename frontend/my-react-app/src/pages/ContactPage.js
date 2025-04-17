// src/pages/ContactPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactPage.css";

const ContactPage = () => {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>WSS</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Powrót
        </button>
      </header>

      <main className="contact-main">
        <h2>Nasze lokalizacje:</h2>
        <div className="locations-list">
          {locations.map((loc) => {
            // jeśli w obiekcie loc nie ma emaila, domyślnie mailto na nudy.d@onet.com
            const email = loc.email || "nudy.d@onet.com";
            const address = `${loc.street} ${loc.house_number}, ${loc.city}`;
            const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
              address
            )}&output=embed`;

            return (
              <div className="location-card" key={loc.id}>
                <div className="location-info">
                  <p>
                    <strong>
                      {loc.street} {loc.house_number}
                    </strong>
                  </p>
                  <p>{loc.city}</p>
                  <p>{loc.contact_number}</p>
                  <p>
                    <a href={`mailto:${email}`}>{email}</a>
                  </p>
                </div>
                <div className="location-map">
                  <iframe
                    title={`map-${loc.id}`}
                    src={mapSrc}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="contact-btn-wrap">
          <a className="contact-btn" href="mailto:nudy.d@onet.com">
            Skontaktuj się z nami
          </a>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
