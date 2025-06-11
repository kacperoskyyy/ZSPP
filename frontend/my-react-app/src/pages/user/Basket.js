
import React from "react";
import {useNavigate} from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import "./Basket.css"; // Optional: create this file for styles



const FREE_SHIPPING_THRESHOLD = 200;

const Basket = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalValue = cartItems.reduce(
    (sum, item) => sum + item.price_per_day * item.quantity,
    0
  );

  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - totalValue, 0);

  const handleCreateReservation = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Musisz być zalogowany, aby dokonać rezerwacji.");
      return;
    }

    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(); 

    try {
      for(const item of cartItems) {
        const reservationData = {
          start_date: startDate,
          end_date: endDate,
        };

        const response = await fetch("/api/reservations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        });
        if (!response.ok) {
          throw new Error("Błąd podczas tworzenia rezerwacji");
        }
      }

      alert("Rezerwacja została pomyślnie utworzona!");
      clearCart(); 
      navigate("/user/reservations");
    } catch (error) {
      alert("Wystąpił błąd podczas tworzenia rezerwacji.");
      console.error(error);
    }
  };

  return (
    <div className="basket-page">
      <h1>Zawartość Twojego koszyka</h1>
      <div className="free-shipping-banner">
        Do darmowej wysyłki brakuje: {remaining} zł
      </div>
      <table className="basket-table">
        <thead>
          <tr>
            <th>PRODUKT</th>
            <th>WYSYŁKA</th>
            <th>ILOŚĆ</th>
            <th>CENA</th>
            <th>WARTOŚĆ</th>
            <th>AKCJE</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td className="basket-product">
                <img
                  src={item.images?.[0]?.image_path || "/gregory.png"}
                  alt={item.name}
                  className="basket-img"
                />
                <span>{item.name}</span>
              </td>
              <td>24 h</td>
              <td>{item.quantity} szt.</td>
              <td>{item.price_per_day.toFixed(2)} zł</td>
              <td>{(item.price_per_day * item.quantity).toFixed(2)} zł</td>
              <td>
                <button onClick={() => removeFromCart(item)}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cartItems.length > 0 && (
        <div className="basket-actions">
          <button onClick={handleCreateReservation} className="reservation-button">
            Dodaj wypożyczenie
          </button>
        </div>
      )}

    </div>
  );
};

export default Basket;
