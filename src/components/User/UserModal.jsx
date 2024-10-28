import React from "react";
import PropTypes from "prop-types";
import "../../styles/Modal.css"; // Import styles for UserModal

const UserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null; // If not open, return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &#215;
        </span>
        <h2>ID: {user.id}</h2>
        <p>Рейтинг: {user.raiting}</p>
        <p>Баланс: {user.balance}₽</p>

        <p>Phone Number: {user.phone_number}</p>
        <p>Admin: {user.admin ? "Yes" : "No"}</p>
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
