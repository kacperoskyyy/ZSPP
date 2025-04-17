// src/pages/Register.js
import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

  // Pobranie metody login z AuthContext oraz nawigacji do przekierowywania
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    // Walidacja dopasowania haseł
    if (password !== repeatPassword) {
      setError("Hasła nie są takie same!");
      return;
    }

    // Przygotowanie danych do wysłania
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
      // Zapis tokenu w localStorage
      localStorage.setItem("access_token", data.access_token);

      // Ustawienie danych użytkownika w kontekście
      login(data.user);

      setSuccessMessage("Konto zostało założone pomyślnie!");

      // Opcjonalnie – przekierowanie po pomyślnej rejestracji
      if (data.user.role === "admin") {
        navigate("/admin-panel");
      } else {
        navigate("/user-dashboard");
      }

      // Wyczyść pola
      setEmail("");
      setPassword("");
      setRepeatPassword("");
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setGender("");
      setPhone("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Zarejestruj się
      </h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {successMessage && (
        <p style={{ color: "green", textAlign: "center" }}>{successMessage}</p>
      )}

      <form onSubmit={handleRegister}>
        {/* Sekcja z danymi logowania */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Adres e-mail</label>
          <input
            type="email"
            id="email"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Wprowadź e-mail"
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
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
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="repeatPassword">Powtórz hasło</label>
          <input
            type="password"
            id="repeatPassword"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            placeholder="Powtórz hasło"
            required
          />
        </div>

        {/* Sekcja z danymi profilu */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="firstName">Imię</label>
          <input
            type="text"
            id="firstName"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Wprowadź imię"
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="lastName">Nazwisko</label>
          <input
            type="text"
            id="lastName"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Wprowadź nazwisko"
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="birthDate">Data urodzenia</label>
          <input
            type="date"
            id="birthDate"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="gender">Płeć</label>
          <select
            id="gender"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Wybierz płeć</option>
            <option value="true">Mężczyzna</option>
            <option value="false">Kobieta</option>
          </select>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="phone">Numer telefonu</label>
          <input
            type="tel"
            id="phone"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Podaj numer telefonu"
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
          disabled={loading}
        >
          {loading ? "Proszę czekać…" : "Zarejestruj się"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "15px" }}>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </div>
    </FormContainer>
  );
};

export default Register;
