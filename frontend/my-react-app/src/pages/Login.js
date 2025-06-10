// src/pages/Login.js
import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

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
    
    <FormContainer className="form-container">
      
      <h2 className="login-title">Zaloguj się</h2>
      {error && (
        <p className="login-message login-error">{error}</p>
      )}
      {successMessage && (
        <p className="login-message login-success">{successMessage}</p>
      )}
      <form onSubmit={handleLogin}>
        <div className="login-form-group">
          <label htmlFor="username">Adres e-mail</label>
          <input
            type="email"
            id="username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Wprowadź e-mail"
            required
          />
        </div>
        <div className="login-form-group login-form-group--password">
          <label htmlFor="password">Hasło</label>
          <input
            type="password"
            id="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
            required
          />
        </div>
        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Proszę czekać…" : "Zaloguj się"}
        </button>
      </form>
      <Link to="/forgot-password" className="login-link">
        Przypomnij hasło
      </Link>
      <Link to="/register" className="login-link">
        Nie masz konta? Zarejestruj się
      </Link>
    </FormContainer>
    
  );
};

export default Login;
