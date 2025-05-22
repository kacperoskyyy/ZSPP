
import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // tu masz swoje style

const Karuzela = ({ reviews, slideWidth = 300, interval = 3000  }) => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const count = reviews.length;

  // co `interval` ms zmień index
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % count);
    }, interval);
    return () => clearInterval(timer);
  }, [count, interval]);

  // przy zmianie indexu przesuwamy kontener
  useEffect(() => {
    const x = -index * slideWidth;
    const c = containerRef.current;
    c.style.transition = "transform 0.5s ease-in-out";
    c.style.transform = `translateX(${x}px)`;
  }, [index, slideWidth]);

  return (
    <section className="review-section">
      <h1>Opinie naszych klientów</h1>
      <div className="review-wrapper">
        <div className="review-container" ref={containerRef}>
          {reviews.map(r => (
            <div key={r.id} className="review-card">
              <div className="review-header">
                <div className="review-avatar" />
                <h3>{r.name}</h3>
              </div>
              <p>{r.text}</p>
              <div className="rating">
                {[...Array(r.rating)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Karuzela;
