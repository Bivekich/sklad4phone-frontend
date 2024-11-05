import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/Modal.css"; // Import styles for UserModal
import HistoryCard from "../HistoryCard";
import { updateUserById, getUserOrders } from "../../server";

const UserModal = ({ isOpen, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [editedUser, setEditedUser] = useState({
    first_name: user.first_name,
    phone_number: user.phone_number,
    balance: user.balance,
    raiting: user.raiting,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserOrders(editedUser.phone_number);
      setOrders(response);
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
      // Use the updateUserById function to send the update request
      await updateUserById(editedUser.id, {
        // Pass the user ID
        first_name: editedUser.first_name,
        balance: editedUser.balance,
        raiting: editedUser.raiting,
      });

      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error (show notification, etc.)
    }

    setIsEditing(false); // Close editing mode after saving
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
        <div>
          <h2>История сборов</h2>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order) => (
                <HistoryCard
                  key={order.id}
                  image={order.image}
                  title={order.name}
                  price={order.price}
                  status={"Зарезервирован"}
                  date=""
                />
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
