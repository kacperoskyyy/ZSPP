// src/pages/Register.js
import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Register.css";

const Register = () => {
  // Dane logowania
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Dane profilu
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  // Komunikaty
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Kontekst uwierzytelniania i nawigacja
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (password !== repeatPassword) {
      setError("Hasła nie są takie same!");
      setLoading(false);
      return;
    }

    const payload = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      gender: gender === "true",
      birth_date: birthDate,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          "Rejestracja nie powiodła się. Sprawdź dane i spróbuj ponownie."
        );
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      login(data.user);
      setSuccessMessage("Konto zostało założone pomyślnie!");

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
      <h2 className="register-title">Zarejestruj się</h2>

      {error && (
        <p className="register-message register-error">{error}</p>
      )}
      {successMessage && (
        <p className="register-message register-success">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleRegister}>
        <div className="register-form-group">
          <label htmlFor="email">Adres e-mail</label>
          <input
            type="email"
            id="email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Wprowadź e-mail"
            required
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="password">Hasło</label>
          <input
            type="password"
            id="password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
            required
          />
        </div>

        <div className="register-form-group register-form-group--password">
          <label htmlFor="repeatPassword">Powtórz hasło</label>
          <input
            type="password"
            id="repeatPassword"
            className="register-input"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            placeholder="Powtórz hasło"
            required
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="firstName">Imię</label>
          <input
            type="text"
            id="firstName"
            className="register-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Wprowadź imię"
            required
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="lastName">Nazwisko</label>
          <input
            type="text"
            id="lastName"
            className="register-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Wprowadź nazwisko"
            required
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="birthDate">Data urodzenia</label>
          <input
            type="date"
            id="birthDate"
            className="register-input"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>

        <div className="register-form-group">
          <label htmlFor="gender">Płeć</label>
          <select
            id="gender"
            className="register-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Wybierz płeć</option>
            <option value="true">Mężczyzna</option>
            <option value="false">Kobieta</option>
          </select>
        </div>

        <div className="register-form-group register-form-group--password">
          <label htmlFor="phone">Numer telefonu</label>
          <input
            type="tel"
            id="phone"
            className="register-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Podaj numer telefonu"
            required
          />
        </div>

        <button
          type="submit"
          className="register-button"
          disabled={loading}
        >
          {loading ? "Proszę czekać…" : "Zarejestruj się"}
        </button>
      </form>

      <Link to="/login" className="register-link">
        Masz już konto? Zaloguj się
      </Link>
    </FormContainer>
  );
};

export default Register;
