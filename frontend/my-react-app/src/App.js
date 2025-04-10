import "./App.css";
import Navigation from "./Navigation";
import ReviewSection from "./Review";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./LogIn";
import ProductGallery from "./Products";
import ImageGallery from "./Gallery";
import WelcomeSection from "./Welcome";
import MainNavigation from "./MainNav";
function App() {
    
    return (
    <div className="App">
                <MainNavigation/>       
                <header className="App-header">
                    <WelcomeSection/>                   
                </header>
                <div className="App-Page2">
                    <Navigation kierunek />
                    <ImageGallery/>
                </div>
                <div className="App-Page3">
                    <Navigation kierunek />
                    <ProductGallery/>  
                </div>
                <div className="App-Page4">
                    <Navigation kierunek />
                    <ReviewSection />
                </div>
                <Routes>
                    <Route path="/LogIn" element={<LogIn />} />
                </Routes>           
        </div>       
    );
}
export default App;
