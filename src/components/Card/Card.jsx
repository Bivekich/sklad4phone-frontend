import React, { useState } from "react";
import PropTypes from "prop-types";
import CardModal from "./CardModal"; // Import the CardModal
import "../../styles/Card.css";

const Card = ({
  admin,
  id,
  image,
  name,
  description,
  price,
  collected_need,
  collected_now,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleShow = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  const progressPercentage = Math.min(
    100,
    Math.floor((collected_now / collected_need) * 100),
  );

  const color =
    progressPercentage >= 70
      ? "#BBFB4C"
      : progressPercentage >= 50
        ? "#E2FF31"
        : progressPercentage >= 20
          ? "#5285E8"
          : "#FF1515";

  return (
    <>
      <div className="card">
        <img src={image} alt={name} />
        <div className="info">
          <div className="text_info">
            <h4>{name}</h4>
            <span>{description}</span>
          </div>
          <button type="button" onClick={handleShow}>
            {admin ? `Редактировать` : `Подробнее`}
          </button>
        </div>
        <div className="price">{price}₽</div>
        <div
          className="process_round"
          style={{
            background: `conic-gradient(${color} ${progressPercentage}%, #242424 0)`,
          }}
        >
          <span>
            {collected_now}/{collected_need}
          </span>
        </div>
      </div>

      {/* Render the CardModal */}
      <CardModal
        isOpen={isModalOpen}
        onClose={handleClose}
        admin={admin}
        product={{
          id,
          image,
          name,
          description,
          price,
          collected_need,
          collected_now,
        }}
      />
    </>
  );
};

// Define the prop types for the Card component
Card.propTypes = {
  admin: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  collected_need: PropTypes.number.isRequired,
  collected_now: PropTypes.number.isRequired,
};

export default Card;
