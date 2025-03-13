import "./App.css";
import InfiniteScrollPage from "./InfiniteScrollPage";
import Button from "./Button";

function App() {
    return (
        <div className="App">
            <div className="App-Navigation">
                <div className="App-Title">
                    <h1>WSS</h1>
                </div>
                <div className="App-Nav">
                    <button className="App-Button-Nav">Sprzęt</button>
                    <button className="App-Button-Nav">Cennik</button>
                    <button className="App-Button-Nav">Zaloguj się</button>
                    <button className="App-Button-Nav">Rejestracja</button>
                </div>
            </div>

            <header className="App-header">
                <div className="App-Greet">
                    <p>Znajdź idealny <br /> sprzęt sportowy <br /> na każdą okazje.</p>
                    <button className="App-Button">Przeglądaj Oferte</button> {/*text="Przeglądaj oferte" onClick={() => alert("Działa!")} />*/}
                </div>
                <div className="App-Scroll-Down">⬇️ Przewiń w dół</div>
                <div>
                    <img className="App-logo" src="/Biegacz1.png" alt="Opis obrazka" />
                </div>
            </header>
        </div>
    );
}

export default App;
