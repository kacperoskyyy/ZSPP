// // src/pages/UserDashboard.js
// import React, { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";

// // 1️⃣ Importujemy gotowe komponenty
// import UserProfile from "../components/UserProfile";
// import UserReservations from "../components/UserReservations";
// import UserHistory from "../components/UserHistory";

// const UserDashboard = () => {
//   const { logout } = useAuth();
//   const [activeTab, setActiveTab] = useState("profile");

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <h3>Menu</h3>
//         <ul className="sidebar-menu">
//           <li>
//             <button
//               className={activeTab === "profile" ? "active" : ""}
//               onClick={() => setActiveTab("profile")}
//             >
//               Profil
//             </button>
//           </li>
//           <li>
//             <button
//               className={activeTab === "reservations" ? "active" : ""}
//               onClick={() => setActiveTab("reservations")}
//             >
//               Rezerwacje
//             </button>
//           </li>
//           <li>
//             <button
//               className={activeTab === "reviews" ? "active" : ""}
//               onClick={() => setActiveTab("reviews")}
//             >
//               Historia
//             </button>
//           </li>
//           <li>
//             <button
//               onClick={() => {
//                 logout();
//                 window.location.href = "/";
//               }}
//             >
//               Wyloguj się
//             </button>
//           </li>
//         </ul>
//       </aside>

//       {/* Main content */}
//       <main className="User-Main-Content">
//         {activeTab === "profile" && <UserProfile />}
//         {activeTab === "reservations" && <UserReservations />}
//         {activeTab === "reviews" && <UserHistory />}
//       </main>
//     </div>
//   );
// };

// export default UserDashboard;


// src/pages/UserDashboard.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./UserDashboard.css";

// Importujemy komponenty widoków
import UserProfile from "../components/UserProfile";
import UserReservations from "../components/UserReservations";
import UserHistory from "../components/UserHistory";



const UserDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Menu</h3>
        <ul className="sidebar-menu">
          <li>
            <button
              className={`menu-button ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <img src= "/profile.png" alt="Profil" className="menu-icon" />
              <span>Profil</span>
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "reservations" ? "active" : ""}`}
              onClick={() => setActiveTab("reservations")}
            >
              <img src="/money.png" alt="Rezerwacje" className="menu-icon" />
              <span>Rezerwacje</span>
            </button>
          </li>
          <li>
            <button
              className={`menu-button ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              <img src="/info.png" alt="Historia" className="menu-icon" />
              <span>Historia</span>
            </button>
          </li>
          <li>
            <button
              className="menu-button"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              <img src= "/logout.png" alt="Wyloguj" className="menu-icon" />
              <span>Wyloguj się</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="User-Main-Content">
        {activeTab === "profile" && <UserProfile />}
        {activeTab === "reservations" && <UserReservations />}
        {activeTab === "reviews" && <UserHistory />}
      </main>
    </div>
  );
};

export default UserDashboard;
