import React, { useState, useEffect } from "react";
import CompositeButtons from "../../components/CompositeButtons";
import ManageUserInfo from "./ManageUserInfo";
import ManageUserEdit from "./ManageUserEdit";
import ManageUserDelete from "./ManageUserDelete";
import "./AdminPanel.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState("list");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Brak dostępu");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Błąd pobierania użytkowników:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleViewChange = (view, user) => {
    setSelectedUser(user);
    setActiveView(view);
  };

  const showList = () => {
    setActiveView("list");
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const searchContent = `${user.id} ${user.email} ${user.first_name} ${user.last_name} ${user.phone_number} ${user.role}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  if (activeView === "info") return <ManageUserInfo user={selectedUser} onBack={showList} />;
  if (activeView === "edit") return <ManageUserEdit user={selectedUser} onBack={showList} />;
  if (activeView === "delete") return <ManageUserDelete user={selectedUser} onBack={showList} />;

  return (
    <div className="admin-panel">
      <div className="search-header">
        <h2>Zarządzaj użytkownikami</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Wyszukaj użytkowników..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Telefon</th>
              <th>Rola</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.phone_number || "-"}</td>
                <td>{user.role}</td>
                <td>
                  <CompositeButtons
                    onButtonOneClick={() => handleViewChange("info", user)}
                    onButtonTwoClick={() => handleViewChange("edit", user)}
                    onButtonThreeClick={() => handleViewChange("delete", user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="no-results">Brak wyników wyszukiwania</div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;