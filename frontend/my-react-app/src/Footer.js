import React from "react";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-section">
          <h3>Kontakt</h3>
          <p>ul. Willowa 2</p>
          <p>Bielsko-Bia�a 43-300</p>
          <p>Tel: 123 456 789</p>
          <p>wss.kontakt@mail.com</p>
        </div>
        <div className="footer-section">
          <h3>Social Media</h3>
          <div className="social-icons">
            <a href="#" className="social-icon instagram"></a>
            <a href="#" className="social-icon custom-icon"></a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Regulamin</h3>
        </div>
      </footer>
    </>
  );
}
export default Footer;
