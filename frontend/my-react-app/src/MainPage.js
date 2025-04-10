import React from "react";
import WelcomeSection from "./Welcome";
import Navigation from "./Navigation";
import ImageGallery from "./Gallery";
import ProductGallery from "./Products";
import ReviewSection from "./Review";


function MainPage() {
  return (
    <>
      <header className="App-header">
        <WelcomeSection />
      </header>
      <div className="App-Page2">
        <Navigation kierunek />
        <ImageGallery />
      </div>
      <div className="App-Page3">
        <Navigation kierunek />
        <ProductGallery />
      </div>
      <div className="App-Page4">
        <Navigation kierunek />
        <ReviewSection />
      </div>
    </>
  );
}

export default MainPage;
