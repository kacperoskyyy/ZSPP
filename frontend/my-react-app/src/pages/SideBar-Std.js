import React from "react";

const Sidebar = () => {
    return (
    <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
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
        </aside>
  </div>
  )
};
export default Sidebar;