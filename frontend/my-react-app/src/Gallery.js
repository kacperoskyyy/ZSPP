import React from "react";

const ImageGallery = () => {
  const items = [
    { src: "/Obraz1.jpg", alt: "Obrazek1", label: "Sporty Górskie" },
    { src: "/Obraz2.jpg", alt: "Obrazek2", label: "Sporty Zimowe" },
    { src: "/Obraz3.jpg", alt: "Obrazek3", label: "Sporty Wodne" },
    { src: "/Obraz4.jpg", alt: "Obrazek4", label: "Na zewnątrz" },
  ];

  return (
    <div className="gallery">
      {items.map((it, i) => (
        <div className="gallery-item" key={i}>
          <img className="gallery-img" src={it.src} alt={it.alt} />
          <div className="overlay" />
          <p className="overlay-text">{it.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
