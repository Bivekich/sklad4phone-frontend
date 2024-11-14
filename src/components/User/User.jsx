import React, { useState } from "react";
import PropTypes from "prop-types";
import UserModal from "./UserModal"; // Import the UserModal
import "../../styles/User.css";

const User = ({ admin, balance, first_name, id, phone_number, raiting }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleShow = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleClose = () => {
    setIsModalOpen(false); // Close the modal
    window.location.reload();
  };

  return (
    <>
      <div className="user_card">
        <div className="info">
          <div className="info_col">
            <h4>{first_name}</h4>
            <span>ID: {id}</span>
          </div>
          <div className="info_col">
            <h4>Баланс:</h4>
            <span>{balance}$</span>
          </div>
          <div className="info_col">
            <h4>Рейтинг:</h4>
            <span>{raiting}</span>
          </div>
        </div>
        <button type="button" onClick={handleShow}>
          Изменить
        </button>
      </div>

      {/* Render the UserModal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleClose}
        user={{
          raiting,
          first_name,
          phone_number,
          balance,
          admin,
          id,
        }}
      />
    </>
  );
};

// Define the prop types for the User component
User.propTypes = {
  admin: PropTypes.bool.isRequired,
  balance: PropTypes.number.isRequired,
  first_name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  phone_number: PropTypes.string.isRequired,
  raiting: PropTypes.string.isRequired,
};

export default User;
