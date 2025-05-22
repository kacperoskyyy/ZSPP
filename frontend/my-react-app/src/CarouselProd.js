import React, { useState, useRef, useEffect } from "react";
import "./App.css";  
const CarouselProd = ({
  products,
  visibleCount = 3,      // ile produktów chcesz widzieć na raz
  itemWidth = 250,        // szerokość pojedynczej karty
  itemGap = 20            // odstęp między kartami
}) => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  // Ile maksymalnych przesunięć w prawo? (np. 5 produktów, 3 widoczne → 2 kroki)
  const maxIndex = products.length - visibleCount;

  const handlePrev = () => {
    // setIndex(i => Math.max(i - 1, 0));
    
    setIndex(i => (i <= 0 ? maxIndex : i - 1));

  };
  const handleNext = () => {
    // setIndex(i => Math.min(i + 1, maxIndex));
    setIndex(i => (i >= maxIndex ? 0 : i + 1));
  };

  // przy zmianie indexu przesuwamy kontener
  useEffect(() => {
    const offset = -index * (itemWidth + itemGap);
    const c = containerRef.current;
    c.style.transition = "transform 0.5s ease";
    c.style.transform = `translateX(${offset}px)`;
  }, [index, itemWidth, itemGap]);

  return (
    <div
      className="carousel-wrapper"
      style={{
        width: `calc(${visibleCount} * ${itemWidth}px + ${(visibleCount - 1)} * ${itemGap}px)`
      }}
    >
        <h2>Lista naszych bestsellerów</h2>
      <button
        className="carousel-arrow carousel-arrow--left"
        onClick={handlePrev}
        // disabled={index === 0}
      >
        ‹
      </button>

      <div className="carousel-window">
        <div className="carousel-container" ref={containerRef}>
          {products.map((p, i) => (
            <div
              className="carousel-card"
              key={i}
              style={{
                width: `${itemWidth}px`,
                marginRight: i === products.length - 1 ? 0 : `${itemGap}px`
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                className="carousel-card__img"
              />
              <p className="carousel-card__info">
                {p.name} – <strong>{p.price}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        className="carousel-arrow carousel-arrow--right"
        onClick={handleNext}
        // disabled={index === maxIndex}
      >
        ›
      </button>
    </div>
  );
};

export default CarouselProd;
