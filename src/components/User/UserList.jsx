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
        users.map((user) => (
          <User
            key={user.id} // Ensure to use a unique key
            admin={user.admin}
            balance={user.balance}
            first_name={user.first_name}
            id={user.id}
            phone_number={user.phone_number}
            raiting={`${user.raiting / 10}.${user.raiting % 10}`}
          />
        ))
      ) : (
        <p>Пользователей не найдено.</p> // Message when no users are available
      )}
    </div>
  );
};

export default UserList;
