import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/Modal.css"; // Ensure you have appropriate styles for the modal

const CardModal = ({ isOpen, onClose, product }) => {
  const [selectedAmount, setSelectedAmount] = useState(1); // Initialize with the current amount
  const [step, setStep] = useState(0); // Initialize with the current step

  // Reset step to 0 whenever the modal is closed
  useEffect(() => {
    setStep(0);
  }, [isOpen]);

  if (!isOpen) return null; // Don't render if modal is not open

  const handleSliderChange = (event) => {
    setSelectedAmount(Number(event.target.value)); // Update the selected amount based on slider
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Step 0: Show product details and the slider
  if (step === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <img src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <div className="modal-progress">
            <span>{selectedAmount}</span>
            <span>{product.collected_need - product.collected_now}</span>
          </div>

          {/* Slider for selecting amount */}
          <div className="slider-container">
            <input
              type="range"
              min="1"
              max={product.collected_need - product.collected_now} // Set the maximum value based on the product max
              value={selectedAmount}
              onChange={handleSliderChange}
              className="amount-slider"
            />
            <div className="slider-value">Количество: {selectedAmount} шт</div>
          </div>

          <div className="modal-price">
            Сумма: {product.price * selectedAmount}₽
          </div>
          <button onClick={handleNextStep}>Забронировать</button>
        </div>
      </div>
    );
  }

  // Step 1: Show terms and conditions confirmation
  if (step === 1) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <h2>Внимание</h2>
          <p>Изучите правила и условия</p>
          <a href="">Правила и условия</a>
          <div className="two_buttons">
            <button className="second_button" onClick={handleBack}>
              Отмена
            </button>
            <button onClick={handleNextStep}>Забронировать</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <p>На ваше имя выставлена бронь на:</p>
          <a href="">Правила и условия</a>
          <div className="two_buttons">
            <button className="second_button" onClick={handleBack}>
              Отмена
            </button>
            <button onClick={handleNextStep}>Забронировать</button>
          </div>
        </div>
      </div>
    );
  }

  return null; // Fallback for other steps
};

// Define prop types for CardModal
CardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Boolean to control modal visibility
  onClose: PropTypes.func.isRequired, // Function to close the modal
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    collected_need: PropTypes.number.isRequired,
    collected_now: PropTypes.number.isRequired,
  }).isRequired,
};

export default CardModal;
