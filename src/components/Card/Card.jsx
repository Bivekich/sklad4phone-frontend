import React, { useState } from "react";
import PropTypes from "prop-types";
import CardModal from "./CardModal"; // Import the CardModal
import "../../styles/Card.css";

const Card = ({
  user,
  admin,
  id,
  images, // Accept images as an array
  name,
  description,
  price,
  collected_need,
  collected_now,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShow = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    window.location.reload();
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
        <img src={images[0]} alt={name} />{" "}
        {/* Display the first image as preview */}
        <div className="info">
          <div className="text_info">
            <h4>{name}</h4>
            <span>{description}</span>
          </div>
          <button type="button" onClick={handleShow}>
            {admin ? `Редактировать` : `Подробнее`}
          </button>
        </div>
        <div className="price">{price}$</div>
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
        user={user}
        isOpen={isModalOpen}
        onClose={handleClose}
        admin={admin}
        product={{
          id,
          images, // Pass all images to the modal
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

Card.propTypes = {
  admin: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired, // Ensure it's an array
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  collected_need: PropTypes.number.isRequired,
  collected_now: PropTypes.number.isRequired,
};

export default Card;
