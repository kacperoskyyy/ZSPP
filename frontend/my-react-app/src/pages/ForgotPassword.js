// src/pages/ForgotPassword.js
import React, { useState } from "react";
import FormContainer from "../components/FormContainer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatusMessage("");
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
    }
  };

  return (
    <FormContainer>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Resetuj hasło
      </h2>
      <form onSubmit={handleForgotPassword}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Podaj swój adres e-mail:</label>
          <input
            type="email"
            id="email"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Wyślij link resetujący
        </button>
      </form>
      {statusMessage && (
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          {statusMessage}
        </p>
      )}
    </FormContainer>
  );
};

export default ForgotPassword;
