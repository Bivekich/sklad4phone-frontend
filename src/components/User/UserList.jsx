import { useEffect, useState } from "react";
import { getAllUsers } from "../../server";
import User from "./User"; // Import the User component
import "../../styles/UserList.css";
const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        console.log("Fetched users:", users);
        setUsers(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    // Call fetchUsers whenever you need to load the user list
    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      {users.length > 0 ? (
        users.map((user_) => (
          <User
            key={user_.id} // Ensure to use a unique key
            admin={user_.admin}
            balance={user_.balance}
            first_name={user_.first_name}
            id={user_.id}
            phone_number={user_.phone_number}
            raiting={(parseFloat(user_.raiting) || 0).toFixed(1)}
          />
        ))
      ) : (
        <p>Пользователей не найдено.</p> // Message when no users are available
      )}
    </div>
  );
};

export default UserList;
