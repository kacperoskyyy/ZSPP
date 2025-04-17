// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppInitializer from "./AppInitializer";

// Import stron
import MainPage from "./MainPage";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Footer from "./Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./contexts/CartContext";
import Catalogue from "./pages/Catalogue";
import ContactPage from "./pages/ContactPage";
import Header from "./Header";

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <AppInitializer />
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route
                path="/user-dashboard"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-panel"
                element={
                  <ProtectedRoute requiredRole="admin" redirectPath="/">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
