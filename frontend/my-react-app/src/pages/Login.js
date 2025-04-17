// src/pages/Login.js
import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

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

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      setSuccessMessage("Zalogowano pomyślnie!");

      // Ustawiamy dane użytkownika w kontekście
      login(data.user);
      setUsername("");
      setPassword("");

      // Przekierowanie w zależności od roli
      if (data.user.role === "admin") {
        navigate("/admin-panel");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          disabled={loading}
        >
          {loading ? "Proszę czekać…" : "Zaloguj się"}
        </button>
      </form>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <Link to="/forgot-password">Przypomnij hasło</Link>
      </div>
      <div style={{ textAlign: "center" }}>
        Nie masz konta? <Link to="/register">Zarejestruj się</Link>
      </div>
    </FormContainer>
  );
};

export default Login;
