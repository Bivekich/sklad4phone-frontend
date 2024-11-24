import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/Modal.css"; // Import styles for UserModal
import HistoryCard from "../HistoryCard";
import { Link } from "react-router-dom";
import {
  updateUserById,
  getUserOrders,
  getUserByPhoneNumber,
  createLog,
  getAllUserLogs,
} from "../../server";

const UserModal = ({ isOpen, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [editedUser, setEditedUser] = useState({});
  const [oldBalance, setOldBalance] = useState(0); // Track the old balance

  useEffect(() => {
    const fetchData = async () => {
      const user_response = await getUserByPhoneNumber(user.phone_number);
      setEditedUser(user_response);
      setOldBalance(user_response.balance);
      const response = await getUserOrders(user.phone_number);
      // Создаем массивы для разных статусов
      const collectedOrders = response.filter(
        (order) => order.collected_now === order.collected_need,
      );
      const canceledOrders = response.filter(
        (order) => order.cancel && order.collected_now !== order.collected_need,
      );
      const deletedOrders = response.filter(
        (order) =>
          order.deleted &&
          !order.cancel &&
          order.collected_now !== order.collected_need,
      );
      const otherOrders = response.filter(
        (order) => !order.collected_now && !order.cancel && !order.deleted,
      );

      // Объединяем массивы в нужном порядке
      const sortedOrders = [
        ...otherOrders, // Добавляем обычные заказы в начале
        ...collectedOrders, // Затем добавляем собранные заказы
        ...canceledOrders, // Затем добавляем отмененные заказы
        ...deletedOrders, // И в конце добавляем удаленные заказы
      ];
      setOrders(sortedOrders);
      const logs_response = await getAllUserLogs(user.id);
      setLogs(logs_response);
    };

    fetchData();
  }, []);

  if (!isOpen) return null; // If not open, return null

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    console.log("Updated user details:", editedUser);

    try {
      // Use the updateUser ById function to send the update request
      await updateUserById(editedUser.id, {
        // Pass the user ID
        first_name: editedUser.first_name,
        balance: editedUser.balance,
        raiting: editedUser.raiting,
      });

      // Check if the balance has changed
      if (oldBalance !== editedUser.balance) {
        await createLog(
          `Баланс изменен с $${oldBalance} на $${editedUser.balance}`,
          editedUser.phone_number,
        );
        // alert(`Баланс изменен с $${oldBalance} на $${editedUser.balance}`); // Send notification
      }

      console.log("User  updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error (show notification, etc.)
    }

    setIsEditing(false); // Close editing mode after saving
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Получаем день и добавляем ноль, если нужно
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    const year = String(date.getFullYear()).slice(-4); // Получаем последние две цифры года

    return `${day}.${month}.${year}`;
  };

  const increaseRating = () => {
    setEditedUser((prev) => ({
      ...prev,
      raiting: prev.raiting <= 10 ? prev.raiting + 0.1 : 10,
    }));
  };

  const decreaseRating = () => {
    setEditedUser((prev) => ({
      ...prev,
      raiting: prev.raiting > 0 ? prev.raiting - 0.1 : 0,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &#215;
        </span>
        <h2>ID: {user.id}</h2>
        <img src={user.image} alt="" />
        <div className="raiting">
          <span>Рейтинг:</span>
          {isEditing ? (
            <div className="rating-controls">
              <button onClick={decreaseRating}>-</button>
              <span className="greenyellow_color">
                {(parseFloat(editedUser.raiting) || 0).toFixed(1)} / 10.0{" "}
              </span>

              <button onClick={increaseRating}>+</button>
            </div>
          ) : (
            <span className="greenyellow_color">
              {" "}
              {(parseFloat(editedUser.raiting) || 0).toFixed(1)} / 10.0
            </span>
          )}
        </div>
        <div className="input_rounded_row">
          <span>Баланс:</span>
          <input
            type="number"
            name="balance"
            value={editedUser.balance}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>
        <div className="input_rounded_row">
          <span>Имя:</span>
          <input
            type="text"
            name="first_name"
            value={editedUser.first_name}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>
        <div className="input_rounded_row">
          <span>Мобильный телефон:</span>
          <input
            type="text"
            name="phone_number"
            value={editedUser.phone_number}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>
        <div className="button-group">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-button">
                Сохранить
              </button>
              <button onClick={handleEditToggle} className="cancel-button">
                Отмена
              </button>
            </>
          ) : (
            <button onClick={handleEditToggle} className="edit-button">
              Редактировать
            </button>
          )}
        </div>
        <Link
          to={`https://t.me/${editedUser.username || editedUser.phone_number}`}
        >
          <button className="edit-button">Связаться</button>
        </Link>
        <br />
        <br />
        <div>
          <h2>Информация о транцакциях</h2>
          {logs.length > 0 ? (
            <ul>
              {logs.map((log) => (
                <>
                  <p>
                    {log.action} {formatDate(log.createdAt)}
                  </p>
                </>
              ))}
            </ul>
          ) : (
            <div>Пока что здесь пусто(</div>
          )}
        </div>
        <br />
        <br />
        <div>
          <h2>История сборов</h2>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order) => (
                <HistoryCard key={order.id} id={order.id} />
              ))}
            </ul>
          ) : (
            <div>Пока что здесь пусто(</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Define prop types for UserModal
UserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default UserModal;
