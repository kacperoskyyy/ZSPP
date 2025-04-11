// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, redirectPath = "/login" }) => {
  const { user } = useAuth();

  // Jeśli użytkownik nie jest zalogowany, przekierowujemy go na stronę logowania.
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // Jeśli chcesz dodatkowo sprawdzać rolę, możesz przekazać dodatkowy warunek (np. admin)
  return children;
};

export default ProtectedRoute;
