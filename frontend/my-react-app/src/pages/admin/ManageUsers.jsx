import React, { useState, useEffect } from "react";
import CompositeButtons from "../../components/CompositeButtons";
import ManageUserInfo from "./ManageUserInfo";
import ManageUserEdit from "./ManageUserEdit";
import ManageUserDelete from "./ManageUserDelete";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState("list");
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

  const handleViewChange = (view, user) => {
    console.log("Changing view to:", view, "User:", user);
    setSelectedUser(user);
    setActiveView(view);
  };

  const showList = () => {
    setActiveView("list");
    setSelectedUser(null);
  };
  const refreshUsers = () => {
    const token = localStorage.getItem("access_token");
    fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUsers);
  };

  // render pojedynczych widoków
  if (activeView === "info")
    return <ManageUserInfo user={selectedUser} onBack={showList} />;
  if (activeView === "edit")
    return <ManageUserEdit onSave={refreshUsers} user={selectedUser} onBack={showList} />;
  if (activeView === "delete")
    return <ManageUserDelete onDelete={refreshUsers} user={selectedUser} onBack={showList} />;

  // render listy użytkowników
  return (
    <div>
      <h2>Zarządzaj użytkownikami</h2>
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
                  onButtonOneClick={() => handleViewChange("info", u)}
                  onButtonTwoClick={() => handleViewChange("edit", u)}
                  onButtonThreeClick={() => handleViewChange("delete", u)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
