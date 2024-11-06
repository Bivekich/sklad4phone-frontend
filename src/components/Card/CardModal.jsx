import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/Modal.css"; // Ensure you have appropriate styles for the modal
import {
  buyForSale,
  deleteSale,
  updateSale,
  createTransaction,
  createBybitTransaction,
  verifyBybitTransaction,
} from "../../server";

const CardModal = ({ isOpen, onClose, admin, product }) => {
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [step, setStep] = useState(0);
  const [editMode, setEditMode] = useState(false); // State to track edit mode
  const [editedProduct, setEditedProduct] = useState(product); // State for edited product data
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for image slider
  const [total, setTotal] = useState(0);

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

  const handlePay = async () => {
    await createTransaction(product.price * selectedAmount, product.id);
    setStep(3);
  };

  const handleConfirmPayment = async () => {
    const response = await verifyBybitTransaction(product.id);
    if (response) {
      alert("Покупка успешно подтверждена");
    } else {
      alert("Процесс перевода средств ещё не окончился");
    }
  };

  const totalSumm = () => {
    // product.price * selectedAmount add .12 or other small part
    const baseAmount = product.price * selectedAmount;

    const randomFraction = Math.random();

    // Add the random fractional part to the total
    const finalTotal = baseAmount + randomFraction;

    return finalTotal.toFixed(2);
  };

  const handleDelete = async () => {
    await deleteSale(product.id);
    alert("Сбор успешно удален!");
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

  const handleUsdtPayment = async () => {
    try {
      // Adjust this function to interact with the backend for USDT payments
      setTotal(totalSumm());
      await createBybitTransaction(total, product.id);
      setStep(4);
    } catch (error) {
      console.error("Ошибка при оплате USDT:", error);
      alert("Ошибка при оплате USDT. Пожалуйста, попробуйте снова.");
    }
  };

  // Handle changes in the edit mode
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };
  // Image slider navigation
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < product.images.length - 1 ? prevIndex + 1 : 0,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : product.images.length - 1,
    );
  };

  // Step 0: Show product details and the slider
  if (step === 0 && !editMode) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          {/* Image Slider */}
          <div className="image-slider">
            <img
              src={product.images[currentImageIndex]}
              alt={editedProduct.name}
            />
            <div className="two_buttons">
              <button onClick={prevImage}>&#10094;</button>
              <button onClick={nextImage}>&#10095;</button>
            </div>
          </div>
          <h2>{editedProduct.name}</h2>
          <p>{editedProduct.description}</p>
          <div className="modal-progress">
            <span>{selectedAmount}</span>
            <span>
              {editedProduct.collected_need - editedProduct.collected_now}
            </span>
          </div>

          {/* Slider for selecting amount */}
          <div className="slider-container">
            <input
              type="range"
              min="1"
              max={editedProduct.collected_need - editedProduct.collected_now}
              value={selectedAmount}
              onChange={handleSliderChange}
              className="amount-slider"
            />
            <div className="slider-value">Количество: {selectedAmount} шт</div>
          </div>

          <div className="modal-price">
            Сумма: {product.price * selectedAmount}$
          </div>
          {admin ? (
            <>
              <button onClick={() => setEditMode(true)}>Редактировать</button>
              <button onClick={handleDelete}>Удалить</button>
              <button onClick={onClose}>Готово</button>
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
            {/* <label className="editCardLabel">
              Цена:
              <input
                type="number"
                name="price"
                value={editedProduct.price}
                onChange={handleEditChange}
              />
            </label> */}
            {/* <label className="editCardLabel">
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
            </label> */}
            <div className="modal-progress">
              <span>1</span>
              <span>{editedProduct.collected_need}</span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="1"
                name="collected_now"
                max={editedProduct.collected_need}
                value={editedProduct.collected_now}
                onChange={handleEditChange}
                className="amount-slider"
              />
              <div className="slider-value">
                Собрано сейчас: {editedProduct.collected_now} шт
              </div>
            </div>
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
          <div className="two_buttons">
            <button onClick={handlePay}>Оплатить через менеджера</button>
          </div>
          <div className="two_buttons">
            <button onClick={handleUsdtPayment}>Оплатить с USDT</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <p>Свяжитесь с менеджером для оплаты</p>
          <h2>В телеграм: VladimirEHoffman</h2>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <h2>Переведите на данный счет {total}: </h2>
          <p>TQfrEu1sP4iF4xTZUqGsjQzNGKEeFnyjrQ</p>

          <div className="two_buttons">
            <button onClick={handleConfirmPayment}>Я отправил платеж</button>
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
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    collected_need: PropTypes.number.isRequired,
    collected_now: PropTypes.number.isRequired,
  }).isRequired,
};

export default CardModal;
