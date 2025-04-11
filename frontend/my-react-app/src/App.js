// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppInitializer from "./AppInitializer";

// Import nagłówków
import MainNavigation from "./MainNav";
import UserNavigation from "./UserNavigation";
import AdminNavigation from "./AdminNavigation";

// Import stron
import MainPage from "./MainPage";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard"; // zakładamy, że masz ten komponent
import Footer from "./Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const Header = () => {
  const { user } = useAuth();
  if (user && user.role === "admin") {
    return <AdminNavigation />;
  } else if (user) {
    return <UserNavigation />;
  } else {
    return <MainNavigation />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppInitializer />
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            {/* Chronione trasy */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-panel"
              element={
                <ProtectedRoute>
                  {/* Opcjonalnie możesz dodatkowo sprawdzić rolę, by admin miał wyższy priorytet */}
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* Jeśli użytkownik próbowałby wejść do chronionej trasy bez autoryzacji, zostanie przekierowany */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
