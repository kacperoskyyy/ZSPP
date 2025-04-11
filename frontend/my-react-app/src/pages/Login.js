// src/pages/Login.js
import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e) => {
    
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Create URLSearchParams from the form data
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error("Błędne dane logowania lub inny problem z serwerem.");
      }

      setSuccessMessage("Zalogowano pomyślnie!");
      // Optionally redirect to another page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <FormContainer>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Zaloguj się</h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {successMessage && (
        <p style={{ color: "green", textAlign: "center" }}>{successMessage}</p>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="username">Adres e-mail</label>
          <input
            type="email"
            id="username"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Wprowadź e-mail"
            required
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="password">Hasło</label>
          <input
            type="password"
            id="password"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
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
            marginBottom: "10px",
          }}
        >
          Zaloguj się
        </button>
      </form>

      {/* Link do przypomnienia hasła - możesz zrobić osobną stronę, np. /forgot-password */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <Link to="/forgot-password">Przypomnij hasło</Link>
      </div>

      {/* Link do rejestracji (przenosi na stronę rejestracji) */}
      <div style={{ textAlign: "center" }}>
        Nie masz konta? <Link to="/register">Zarejestruj się</Link>
      </div>
    </FormContainer>
  );
};

export default Login;
