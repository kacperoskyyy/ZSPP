import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1) Odczytujemy stan koszyka z localStorage lub zaczynamy od pustej tablicy
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // 2) Za każdym razem, gdy cart się zmieni, zapisujemy go w localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Dodajemy przedmiot do koszyka
  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  // Czyścimy koszyk (np. po złożeniu zamówienia)
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
