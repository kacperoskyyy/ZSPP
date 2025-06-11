// // src/pages/ResetPassword.js
// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import FormContainer from "../components/FormContainer";

// const ResetPassword = () => {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");
//   const [error, setError] = useState("");

//   // Pobieramy token z parametrów URL
//   const queryParams = new URLSearchParams(useLocation().search);
//   const token = queryParams.get("token");

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setError("");
//     setStatusMessage("");

//     if (newPassword !== confirmPassword) {
//       setError("Hasła nie są zgodne!");
//       return;
//     }

//     try {
//       const response = await fetch("/api/password-reset/confirm", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, new_password: newPassword }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         setError(data.detail || "Błąd resetu hasła.");
//       } else {
//         setStatusMessage(data.message || "Hasło zostało zresetowane.");
//       }
//     } catch (error) {
//       setError("Wystąpił błąd przy komunikacji z serwerem.");
//     }
//   };

//   return (
//     <FormContainer>
//       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Zmień hasło</h2>
//       {token ? (
//         <form onSubmit={handleResetPassword}>
//           <div style={{ marginBottom: "15px" }}>
//             <label htmlFor="newPassword">Nowe hasło:</label>
//             <input
//               type="password"
//               id="newPassword"
//               style={{ width: "100%", padding: "8px", marginTop: "5px" }}
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div style={{ marginBottom: "15px" }}>
//             <label htmlFor="confirmPassword">Potwierdź nowe hasło:</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               style={{ width: "100%", padding: "8px", marginTop: "5px" }}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             style={{
//               width: "100%",
//               padding: "10px",
//               backgroundColor: "#007bff",
//               color: "#fff",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             Zmień hasło
//           </button>
//         </form>
//       ) : (
//         <p>Token resetowania nie został podany.</p>
//       )}
//       {error && (
//         <p style={{ color: "red", marginTop: "15px", textAlign: "center" }}>
//           {error}
//         </p>
//       )}
//       {statusMessage && (
//         <p style={{ color: "green", marginTop: "15px", textAlign: "center" }}>
//           {statusMessage}
//         </p>
//       )}
//     </FormContainer>
//   );
// };

// export default ResetPassword;

// src/pages/ResetPassword.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  // Pobieramy token z parametrów URL
  const queryParams = new URLSearchParams(useLocation().search);
  const token = queryParams.get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");

    if (newPassword !== confirmPassword) {
      setError("Hasła nie są zgodne!");
      return;
    }

    try {
      const response = await fetch("/api/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Błąd resetu hasła.");
      } else {
        setStatusMessage(data.message || "Hasło zostało zresetowane.");
      }
    } catch (error) {
      setError("Wystąpił błąd przy komunikacji z serwerem.");
    }
  };

  return (
    <FormContainer>
      <div className="reset-password-container">
        <h2 className="reset-password-title">Zmień hasło</h2>
        
        {token ? (
          <form onSubmit={handleResetPassword} className="reset-password-form">
            <div className="form-group">
              <label className="form-label">Nowe hasło:</label>
              <input
                type="password"
                className="form-input"
                placeholder="Wprowadź nowe hasło"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Potwierdź nowe hasło:</label>
              <input
                type="password"
                className="form-input"
                placeholder="Potwierdź nowe hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="submit-button">
              Zmień hasło
            </button>
          </form>
        ) : (
          <div className="no-token-message">
            Token resetowania nie został podany.
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {statusMessage && (
          <div className="success-message">
            {statusMessage}
          </div>
        )}
      </div>
    </FormContainer>
  );
};

export default ResetPassword;