import "./App.css";
import Navigation from "./Navigation";
import ReviewSection from "./Review";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./pages/Login";
import ProductGallery from "./Products";
import ImageGallery from "./Gallery";
import WelcomeSection from "./Welcome";
import MainNavigation from "./MainNav";
import Footer from "./Footer";
import MainPage from "./MainPage";
import Register from "./pages/Register";
function App() {
  return (
    <div className="App">
      <MainNavigation />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
}
export default App;
