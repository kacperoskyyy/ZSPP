// src/pages/ForgotPassword.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setStatusMessage(data.message);
    } catch (error) {
      setStatusMessage("Wystąpił błąd podczas wysyłania żądania resetu hasła.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <div className="forgot-password-container">
        <h2 className="forgot-password-title">Resetuj hasło</h2>
        
        <form onSubmit={handleForgotPassword} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Podaj swój adres e-mail:
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Wprowadź e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Wysyłanie..." : "Wyślij link resetujący"}
          </button>
        </form>
        
        <div className="back-to-login">
          <Link to="/login">Powróć do logowania</Link>
        </div>
        
        {statusMessage && (
          <div className="status-message">
            {statusMessage}
          </div>
        )}
      </div>
    </FormContainer>
  );
};

export default ForgotPassword;