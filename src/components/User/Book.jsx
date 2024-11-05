import React, { useState } from "react";
import PropTypes from "prop-types"; // Import the UserModal
import "../../styles/User.css";
import { updateTransactionStatus } from "../../server";

const User = ({ amount, first_name, transactionId, id, raiting }) => {
  const [paid, setPaid] = useState(false);
  const handleConfirm = async () => {
    setPaid(true);
    await updateTransactionStatus(transactionId, true);
  };

  if (!paid) {
    return (
      <>
        <div className="user_card">
          <div className="info">
            <div className="info_col">
              <h4>{first_name}</h4>
              <span>ID: {id}</span>
            </div>
            <div className="info_col">
              <h4>Сумма:</h4>
              <span>{amount}$</span>
            </div>
            <div className="info_col">
              <h4>Рейтинг:</h4>
              <span>{raiting}</span>
            </div>
          </div>
          <button type="button" onClick={handleConfirm}>
            Подтвердить
          </button>
        </div>
      </>
    );
  }

  return null;
};

// Define the prop types for the User component
User.propTypes = {
  amount: PropTypes.number.isRequired,
  first_name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  transactionId: PropTypes.number.isRequired,
  raiting: PropTypes.string.isRequired,
};

export default User;
