
import React from "react";
import { useCart } from "../../contexts/CartContext";
import "./Basket.css"; // Optional: create this file for styles



const FREE_SHIPPING_THRESHOLD = 200;

const Basket = () => {
  const { cartItems, removeFromCart } = useCart();

  const totalValue = cartItems.reduce(
    (sum, item) => sum + item.price_per_day * item.quantity,
    0
  );

  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - totalValue, 0);

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
    </div>
  );
};

export default Basket;
