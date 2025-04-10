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
        <button className="App-Button-Nav">Sprzęt</button>
        <button className="App-Button-Nav">Cennik</button>
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
