import React from "react";


function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-section">
          <h3>Kontakt</h3>
          <p>ul. Willowa 2</p>
          <p>Bielsko-Biała 43-300</p>
          <p>Tel: 123 456 789</p>
          <p>wss.kontakt@mail.com</p>
        </div>
        <div className="footer-section">
          <h3>Social Media</h3>
          <div className="social-icons">
          <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
              <img src="/SocialLogos/FacebookIcon.svg" alt="Facebook" />
            </a>
            <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
              <img src="/SocialLogos/InstagramIcon.svg" alt="Instagram"  />
            </a>
            <a href="https://linkedin.com" className="social-icon" aria-label="Linkedin">
              <img src="/SocialLogos/LinkedinIcon.svg" alt="Linkedin"  />
            </a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Regulamin</h3>
          <p>Polityka prywatności</p>
          <p>O nas</p>
          <p>Nasi Partnerzy</p>
          <p>Realizacja Zamówień</p>
        </div>
      </footer>
    </>
  );
}
export default Footer;
