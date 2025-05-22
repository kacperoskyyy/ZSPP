
import React from "react";
import ProductCarousel from "./CarouselProd";

const products = [
  { name: "Futerał",   price: "1000zł", image: "/Produkt1.jpg" },
  { name: "GPS",       price: "500zł",  image: "/Produkt2.jpg" },
  { name: "Rękawice",  price: "1000zł", image: "/Produkt3.jpg" },
  { name: "Latarka",   price: "200zł",  image: "/Produkt4.jpg" },
  { name: "Plecak",    price: "300zł",  image: "/Produkt5.jpg" },
  { name: "Futerał",   price: "1000zł", image: "/Produkt1.jpg" },
  { name: "GPS",       price: "500zł",  image: "/Produkt2.jpg" },
  { name: "Rękawice",  price: "1000zł", image: "/Produkt3.jpg" },
  { name: "Latarka",   price: "200zł",  image: "/Produkt4.jpg" },
  { name: "Plecak",    price: "300zł",  image: "/Produkt5.jpg" },
];

const ProductGallery = () => (
  <div className="App-Page3-Swipe">
    
    <ProductCarousel
      products={products}
      visibleCount={3}
      itemWidth={250}
      itemGap={20}
    />
  </div>
);

export default ProductGallery;


