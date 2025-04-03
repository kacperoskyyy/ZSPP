import "./App.css";
import InfiniteScrollPage from "./InfiniteScrollPage";
import Button from "./Button";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <div className="App-Navigation">
        <div className="App-Title">
          <h1>WSS</h1>
        </div>
        <div className="App-Nav">
          <button className="App-Button-Nav">Sprzęt</button>
          <button className="App-Button-Nav">Cennik</button>
          <button className="App-Button-Nav" onClick={() => navigate("/login")}>
            Zaloguj się
          </button>
          <button
            className="App-Button-Nav"
            onClick={() => navigate("/register")}
          >
            Rejestracja
          </button>
        </div>
      </div>

      <header className="App-header">
        <div className="App-Greet">
          <p>
            Znajdź idealny <br /> sprzęt sportowy <br /> na każdą okazje.
          </p>
          <button className="App-Button">Przeglądaj Oferte</button>{" "}
          {/*text="Przeglądaj oferte" onClick={() => alert("Działa!")} />*/}
        </div>
        <div className="App-Scroll-Down">⬇️ Przewiń w dół</div>
        <div>
          <img className="App-logo" src="/Biegacz1.png" alt="Opis obrazka" />
        </div>
      </header>
      <div className="App-Page2">
        <div className="Navigation">
          <a href="#up">
            <img src="/arrow-up-solid.png" alt="Strzałka w górę"></img>
            <span>Przewiń w górę</span>
          </a>
        </div>
        <div className="App-Page2-Gallery">
          <img classname="App-Page2-Pict1" src="/Obraz1.jpg" alt="Obrazek1" />
          <img classname="App-Page2-Pict2" src="/Obraz2.jpg" alt="Obrazek2" />
          <img classname="App-Page2-Pict3" src="/Obraz3.jpg" alt="Obrazek3" />
          <img classname="App-Page2-Pict4" src="/Obraz4.jpg" alt="Obrazek4" />
        </div>
        <div className="Navigation">
          <a href="#bottom">
            <img src="/arrow-down-solid.png" alt="Strzałka w dół"></img>
            <span>Przewiń w dół</span>
          </a>
        </div>
      </div>
      <div className="App-Page3">
        <div className="Navigation">
          <a href="#up">
            <img src="/arrow-up-solid.png" alt="Strzałka w górę"></img>
            <span>Przewiń w górę</span>
          </a>
        </div>
        <div className="App-Page3-Swipe">
          <div className="App-Page3-Swipe_Product">
            <img
              classname="App-Page3-Pict1"
              src="/Produkt1.jpg"
              alt="Obrazek1"
            />
            <p className="Caption">Futerał - 1000zł</p>
          </div>
          <div className="App-Page3-Swipe_Product">
            <img
              classname="App-Page3-Pict2"
              src="/Produkt2.jpg"
              alt="Obrazek1"
            />
            <p className="Caption">GPS - 500zł</p>
          </div>
          <div className="App-Page3-Swipe_Product">
            <img
              classname="App-Page3-Pict1"
              src="/Produkt3.jpg"
              alt="Obrazek1"
            />
            <p className="Caption">Rękawice - 1000zł</p>
          </div>
        </div>
        <div className="Navigation">
          <a href="#bottom">
            <img src="/arrow-down-solid.png" alt="Strzałka w dół"></img>
            <span>Przewiń w dół</span>
          </a>
        </div>
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Strona główna lub inne komponenty */}
        {/*<Route path="/" element={<Home />} />*/}
      </Routes>
    </div>
  );
}

export default App;
