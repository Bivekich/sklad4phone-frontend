import React, { useState } from "react";
import PropTypes from "prop-types";
import UserModal from "./UserModal"; // Import the UserMemberModal
import "../../styles/User.css";

const UserMember = ({
  admin,
  balance,
  first_name,
  id,
  quantity,
  phone_number,
  raiting,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleShow = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleClose = () => {
    setIsModalOpen(false); // Close the modal
    // window.location.reload();
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
            <h4>Купил:</h4>
            <span>{quantity} шт.</span>
          </div>
          <div className="info_col">
            <h4>Рейтинг:</h4>
            <span>{raiting}</span>
          </div>
        </div>
        <button type="button" style={{ marginTop: "0" }} onClick={handleShow}>
          Подробнее
        </button>
      </div>

      {/* Render the UserMemberModal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleClose}
        user={{
          id,
        }}
      />
    </>
  );
};

// Define the prop types for the UserMember component
UserMember.propTypes = {
  admin: PropTypes.bool.isRequired,
  balance: PropTypes.number.isRequired,
  first_name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  phone_number: PropTypes.string.isRequired,
  raiting: PropTypes.string.isRequired,
};

export default UserMember;
