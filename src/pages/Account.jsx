import "../styles/Account.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { updateUserById } from "../server";

const Account = ({ user }) => {
  const [editedUser, setEditedUser] = useState({
    first_name: user.first_name,
    phone_number: user.phone_number,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Call the server function to update the user data
      await updateUserById(user.id, {
        first_name: editedUser.first_name,
        phone_number: editedUser.phone_number,
      });

      console.log("User updated successfully");
      alert("Профиль успешно обновлен");
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="account">
      <h2>Мой аккаунт</h2>
      <img src="default_ava.svg" alt="default avatar" />
      <span className="raiting">
        Рейтинг: {(parseFloat(user.raiting) || 0).toFixed(1)}/10.0
      </span>
      <div className="balance">Баланс: ${user.balance}</div>

      {/* Editable fields */}
      <div className="input_rounded_row">
        <span>Имя:</span>
        <input
          type="text"
          name="first_name"
          value={editedUser.first_name}
          onChange={handleInputChange}
        />
      </div>
      <div className="input_rounded_row">
        <span>Мобильный телефон:</span>
        <input
          type="text"
          name="phone_number"
          value={editedUser.phone_number}
          onChange={handleInputChange}
          readOnly={true}
        />
      </div>

      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
};

// PropTypes validation
Account.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    raiting: PropTypes.number.isRequired,
  }).isRequired,
};

export default Account;
