// import React from "react";
// import { Link, useNavigate } from "react-router-dom";


// const WelcomeSection = () => {
//     return (
        
//         <><div className="Welcome-Page">
//             <div className="App-Greet">
//                 <p>Znajdź idealny <br /> sprzęt sportowy <br /> na każdą okazje.</p>
//                 <button className="App-Button" onClick={scrollToNext}>
                
//       </button>
//             </div>
//             <div className="App-logo">
//                 <img src="/Biegacz1.png" alt="Opis obrazka" />
//             </div>

//         </div><div className="App-Scroll-Down">Zobacz wiecej</div></>
          
//     ) 
// };
// export default WelcomeSection;


// src/Welcome.js
import React from "react";

const WelcomeSection = () => {
  const scrollToNext = () => {
    const el = document.getElementById("page2");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="Welcome-Page">
      <div className="App-Greet">
        <p>
          Znajdź idealny <br />
          sprzęt sportowy <br />
          na każdą okazję.
        </p>
        <button className="App-Button" onClick={scrollToNext}>
          Przeglądaj ofertę ↓
        </button>
      </div>
      <div className="App-Logo">
        <img src="/Biegacz1.png" alt="Opis obrazka" />
      </div>
      <div className="App-Scroll-Down">Zobacz więcej ↓</div>
    </div>
  );
};

export default WelcomeSection;
