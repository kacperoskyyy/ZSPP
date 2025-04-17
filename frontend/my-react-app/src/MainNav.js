import React from "react";
import { useNavigate } from "react-router-dom";
const MainNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="App-Navigation">
      <div className="App-Title">
        <h1 onClick={() => navigate("/")}>WSS</h1>
      </div>
      <div className="App-Nav">
        <button onClick={() => navigate("/Catalogue")} className="App-Button-Nav">Sprzęt</button>
        <button onClick={() => navigate("/contact")} className="App-Button-Nav">Kontakt</button>
        <button onClick={() => navigate("/LogIn")} className="App-Button-Nav">
          Zaloguj się
        </button>
        <button
          onClick={() => navigate("/Register")}
          className="App-Button-Nav"
        >
          Rejestracja
        </button>
      </div>
    </div>
  );
};
export default MainNavigation;
