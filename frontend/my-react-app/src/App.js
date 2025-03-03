import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="App-Navigation">
        <div className="App-Title">
          <h1>WSS</h1>
        </div>
        <div className="App-Nav">
          <p>Sprzęt</p>
          <p>Cennik</p>
          <p>Zaloguj się</p>
        </div>
      </div>

      <header className="App-header">
        <div className="App-Greet">
          <p>Znajdź idealny sprzęt sportowy na każdą okazje.</p>
          <p>Przeglądaj oferte</p>
        </div>
        <div>
          <img className="App-logo" src="/Biegacz1.png" alt="Opis obrazka" />
        </div>
      </header>
    </div>
  );
}

export default App;
