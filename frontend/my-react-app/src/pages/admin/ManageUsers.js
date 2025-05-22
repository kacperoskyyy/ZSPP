// src/pages/admin/ManageUsers.js
import React, { useState, useEffect } from "react";
import CompositeButtons from "../../components/CompositeButtons";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState("list"); // 'list' | 'view' | 'edit' | 'delete'
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Brak dostępu");
        return res.json();
      })
      .then(setUsers)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Zarządzaj użytkownikami</h2>
  
      {activeView === "list" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Rola</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td>{u.role}</td>
                <td>
                  <CompositeButtons
                    onButtonOneClick={() => {
                      setSelectedUser(u);
                      setActiveView("view");
                    }}
                    onButtonTwoClick={() => {
                      setSelectedUser(u);
                      setActiveView("edit");
                    }}
                    onButtonThreeClick={() => {
                      setSelectedUser(u);
                      setActiveView("delete");
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
  
      {activeView === "view" && selectedUser && (
        <div>
          <h3>Podgląd użytkownika</h3>
          <p><strong>ID:</strong> {selectedUser.id}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Imię:</strong> {selectedUser.first_name}</p>
          <p><strong>Nazwisko:</strong> {selectedUser.last_name}</p>
          <p><strong>Rola:</strong> {selectedUser.role}</p>
          <button onClick={() => setActiveView("list")}>← Wróć</button>
        </div>
      )}
  
      {activeView === "edit" && selectedUser && (
        <div>
          <h3>Edycja użytkownika</h3>
          <p>(Tu możesz dodać formularz z predefiniowanymi danymi użytkownika)</p>
          <button onClick={() => setActiveView("list")}>← Wróć</button>
        </div>
      )}
  
      {activeView === "delete" && selectedUser && (
        <div>
          <h3>Usuń użytkownika</h3>
          <p>Czy na pewno chcesz usunąć użytkownika <strong>{selectedUser.email}</strong>?</p>
          <button>Usuń</button>
          <button onClick={() => setActiveView("list")}>Anuluj</button>
        </div>
      )}
    </div>
  );
  
};

export default ManageUsers;
