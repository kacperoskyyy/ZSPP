import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const { user: ctxUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nie można pobrać profilu.");
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie profilu…</p>;
  if (error) return <p style={{ color: "red" }}>Błąd: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profil użytkownika</h2>
      <p>
        <strong>Imię i nazwisko:</strong>{" "}
        {profile.first_name || profile.last_name
          ? `${profile.first_name} ${profile.last_name}`
          : "Brak"}
      </p>
      <p>
        <strong>Data urodzenia:</strong>{" "}
        {profile.birth_date ? profile.birth_date : "Brak"}
      </p>
      <p>
        <strong>Płeć:</strong>{" "}
        {profile.gender !== null
          ? profile.gender
            ? "Mężczyzna"
            : "Kobieta"
          : "Brak"}
      </p>
      <p>
        <strong>Numer telefonu:</strong> {profile.phone_number || "Brak"}
      </p>
      <p>
        <strong>Adres e-mail:</strong> {profile.email}
      </p>
      <p>
        <strong>Zdjęcie profilowe:</strong>{" "}
        {profile.profile_image ? (
          <img
            src={`/${profile.profile_image}`}
            alt="Profilowe"
            style={{ width: 80, borderRadius: 8 }}
          />
        ) : (
          "Brak"
        )}
      </p>
      <button>Zmień hasło</button>
    </div>
  );
};

export default UserProfile;
