import React, { useState } from "react";
import PropTypes from "prop-types";
import CardModal from "./CardModal";
import "../../styles/Card.css";
import { deleteSale } from "../../server";
const Card = ({
  user,
  admin,
  id,
  images,
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

  const onDelete = async () => {
    await deleteSale(id);
  };

  const progressPercentage = Math.min(
    100,
    Math.floor((collected_now / collected_need) * 100),
  );

  const isCompleted = progressPercentage >= 100;

  const color = isCompleted
    ? "gray"
    : progressPercentage >= 70
      ? "#BBFB4C"
      : progressPercentage >= 50
        ? "#E2FF31"
        : progressPercentage >= 20
          ? "#5285E8"
          : "#FF1515";

  return (
    <>
      <div
        className={`card ${isCompleted ? "completed" : ""}`}
        style={{ order: isCompleted ? 10000 : collected_need - collected_now }}
      >
        <img src={images[0]} alt={name} />
        <div className="info">
          <div className="text_info">
            <h4>{name}</h4>
            <span>{description}</span>
          </div>
          {!isCompleted && (
            <button type="button" onClick={handleShow}>
              {admin ? `Редактировать` : `Подробнее`}
            </button>
          )}
          {isCompleted && admin && (
            <button
              type="button"
              className="delete-button"
              onClick={() => onDelete(id)}
            >
              Удалить
            </button>
          )}
        </div>
        <div className="price">${price}</div>
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

      <CardModal
        user={user}
        isOpen={isModalOpen}
        onClose={handleClose}
        admin={admin}
        product={{
          id,
          images,
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
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  collected_need: PropTypes.number.isRequired,
  collected_now: PropTypes.number.isRequired,
};

export default Card;
