import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/Modal.css"; // Ensure you have appropriate styles for the modal
import { buyForSale, deleteSale, updateSale } from "../../server";

const CardModal = ({ isOpen, onClose, admin, product }) => {
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [step, setStep] = useState(0);
  const [editMode, setEditMode] = useState(false); // State to track edit mode
  const [editedProduct, setEditedProduct] = useState(product); // State for edited product data

  useEffect(() => {
    setStep(0);
    setEditedProduct(product); // Reset edited product when modal opens
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleSliderChange = (event) => {
    setSelectedAmount(Number(event.target.value));
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleDelete = async () => {
    await deleteSale(product.id);
    window.location.reload();
  };

  const handleSave = async () => {
    if (editedProduct.price < product.price) {
      alert("Цена не может быть ниже текущей стоимости.");
      return; // Prevent saving if price is below the current product price
    }

    if (editedProduct.collected_now < product.collected_now) {
      alert("Нельзя уменьшить значение 'Собрано сейчас'.");
      return; // Prevent saving if collected_now is decreased
    }

    try {
      // Attempt to save the edited product data
      const result = await updateSale(product.id, editedProduct);
      setEditedProduct(result);
      setEditMode(false); // Exit edit mode upon successful save
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
      alert("Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.");
    }
  };

  const handleBuyFromBalance = async () => {
    const response = await buyForSale(product.id, selectedAmount);
    window.location.reload();
    console.log(response);
  };

  // Handle changes in the edit mode
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Step 0: Show product details and the slider
  if (step === 0 && !editMode) {
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
              max={product.collected_need - product.collected_now}
              value={selectedAmount}
              onChange={handleSliderChange}
              className="amount-slider"
            />
            <div className="slider-value">Количество: {selectedAmount} шт</div>
          </div>

          <div className="modal-price">
            Сумма: {product.price * selectedAmount}₽
          </div>
          {admin ? (
            <>
              <button onClick={() => setEditMode(true)}>Редактировать</button>
              <button onClick={handleDelete}>Удалить</button>
              <button onClick={handleSave}>Готово</button>
            </>
          ) : (
            <>
              <button onClick={handleNextStep}>Забронировать</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Edit Mode
  if (editMode) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <h2>Редактировать сбор</h2>
          <div>
            <label className="editCardLabel">
              Название:
              <input
                type="text"
                name="name"
                value={editedProduct.name}
                onChange={handleEditChange}
              />
            </label>
            <label className="editCardLabel">
              Описание:
              <textarea
                name="description"
                value={editedProduct.description}
                onChange={handleEditChange}
              />
            </label>
            <label className="editCardLabel">
              Цена:
              <input
                type="number"
                name="price"
                value={editedProduct.price}
                onChange={handleEditChange}
              />
            </label>
            <label className="editCardLabel">
              Собрано сейчас:
              <input
                type="number"
                name="collected_now"
                value={editedProduct.collected_now}
                onChange={handleEditChange}
              />
            </label>
            <label className="editCardLabel">
              Нужно собрать:
              <input
                type="number"
                name="collected_need"
                value={editedProduct.collected_need}
                onChange={handleEditChange}
              />
            </label>
          </div>
          <div className="two_buttons">
            <button onClick={() => setEditMode(false)}>Отменить</button>
            <button onClick={handleSave}>Сохранить изменения</button>
          </div>
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
          <p>Выберите способ оплаты</p>
          <h2>10% от суммы заказа</h2>

          <div className="two_buttons">
            <button onClick={handleBuyFromBalance}>Оплатить с баланса</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Define prop types for CardModal
CardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  admin: PropTypes.bool.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    collected_need: PropTypes.number.isRequired,
    collected_now: PropTypes.number.isRequired,
  }).isRequired,
};

export default CardModal;
