import { useEffect, useState } from "react";
import { getAllUsers, getAllTransactions } from "../../server";
import Book from "./Book";
import "../../styles/UserList.css";

const UserList = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllTransactions();
        console.log("Fetched users:", users);
        setTransactions(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      <input
        type="text"
        placeholder="Поиск по номеру телефона или ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        className="search-input"
      />
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <Book
            key={transaction.user.id}
            amount={transaction.amount}
            transactionId={transaction.id}
            first_name={transaction.user.first_name}
            id={transaction.user.id}
            raiting={(parseFloat(transaction.user.raiting) || 0).toFixed(1)}
          />
        ))
      ) : (
        <p>Пользователей не найдено.</p>
      )}
    </div>
  );
};

export default UserList;
