import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/Modal.css"; // Ensure you have appropriate styles for the modal
import UserMember from "../User/UserMember"; // Import the User component
import {
  buyForSale,
  deleteSale,
  updateSale,
  createTransaction,
  createBybitTransaction,
  verifyBybitTransaction,
  getCource,
  calcelSale,
  getSaleById,
  getOrderUsers,
} from "../../server";
import BalanceModal from "../BalanceModal";
import { Link } from "react-router-dom";

const CardModal = ({ user, isOpen, onClose, admin, product }) => {
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [step, setStep] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [course, setCourse] = useState(0);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const respanse = await getOrderUsers(product.id);

      setUsers(respanse);
    };

    fetchUsers();
  }, [product]);
  useEffect(() => {
    setStep(0);
    const fetchData = async () => {
      const response = await getSaleById(product.id);
      setEditedProduct(response);
    };
    fetchData();
  }, [isOpen, product]);

  useEffect(() => {
    const fetchCource = async () => {
      const course_result = await getCource();
      setCourse(Number(course_result));
    };

    fetchCource();
  }, []);

  if (!isOpen) return null;

  const toggleBalanceModal = () => {
    setIsBalanceModalOpen(!isBalanceModalOpen);
  };

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
    await createTransaction(
      editedProduct.price * selectedAmount,
      editedProduct.id,
    );
    setStep(3);
  };

  const handleConfirmPayment = async () => {
    const response = await verifyBybitTransaction(editedProduct.id);
    if (response) {
      alert("Покупка успешно подтверждена");
    } else {
      alert("Процесс перевода средств ещё не окончился");
    }
  };

  const totalSumm = () => {
    const baseAmount = editedProduct.price * selectedAmount * 0.1;
    const randomFraction = Math.random();
    const finalTotal = baseAmount + randomFraction;
    return finalTotal.toFixed(2);
  };

  const handleDelete = async () => {
    await deleteSale(editedProduct.id);
    alert("Сбор успешно удален!");

    window.location.reload();
  };

  const handleCancel = async () => {
    await calcelSale(editedProduct.id);
    onClose();
  };

  const handleSave = async () => {
    if (editedProduct.price < editedProduct.price) {
      alert("Цена не может быть ниже текущей стоимости.");
      return;
    }

    if (editedProduct.collected_now < editedProduct.collected_now) {
      alert("Нельзя уменьшить значение 'Собрано сейчас'.");
      return;
    }

    try {
      const result = await updateSale(editedProduct.id, editedProduct);
      setEditedProduct(result);
      setEditMode(false);
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
      alert("Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.");
    }
  };

  const handleBuyFromBalance = async () => {
    const response = await buyForSale(editedProduct.id, selectedAmount);
    window.location.reload();
    console.log(response);
  };

  const handleUsdtPayment = async () => {
    try {
      setTotal(totalSumm());
      await createBybitTransaction(total, editedProduct.id);
      setStep(4);
    } catch (error) {
      console.error("Ошибка при оплате USDT:", error);
      alert("Ошибка при оплате USDT. Пожалуйста, попробуйте снова.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const nextImage = () => {
    const minus = editedProduct.video ? 0 : 1;
    setCurrentImageIndex((prevIndex) =>
      prevIndex < editedProduct.images.length - minus ? prevIndex + 1 : 0,
    );
  };

  const prevImage = () => {
    const minus = editedProduct.video ? 0 : 1;

    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : editedProduct.images.length - minus,
    );
  };

  if (step === 0 && !editMode) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>

          <div className="image-slider">
            {0 === currentImageIndex && editedProduct.video ? (
              editedProduct.video && (
                <div className="video-container">
                  <video controls src={editedProduct.video} />
                </div>
              )
            ) : (
              <img
                src={
                  editedProduct.images[
                    currentImageIndex - (editedProduct.video ? 1 : 0)
                  ]
                }
                alt={editedProduct.name}
              />
            )}

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
            Сейчас на счету: ${user.balance} (
            {(Number(user.balance) / course).toFixed(2)}P)
          </div>
          <div className="modal-price">
            Сумма: ${editedProduct.price * selectedAmount} (
            {(Number(editedProduct.price * selectedAmount) / course).toFixed(2)}
            P)
          </div>
          <div className="modal-price">
            Предоплата за бронь 10% от суммы заказа: <br />$
            {editedProduct.price * selectedAmount * 0.1}(
            {(
              Number(editedProduct.price * selectedAmount * 0.1) / course
            ).toFixed(2)}
            P)
          </div>
          {admin ? (
            <>
              <button onClick={() => setEditMode(true)}>Редактировать</button>
              <button onClick={handleCancel}>Отменить сбор</button>
              <button onClick={handleDelete}>Удалить</button>
              <button onClick={onClose}>Готово</button>
              <br />
              <br />
              {users.length > 0 ? (
                users.map((user) => (
                  <>
                    <UserMember
                      key={user.id} // Ensure to use a unique key
                      admin={user.admin}
                      quantity={user.quantity}
                      balance={user.balance}
                      first_name={user.first_name}
                      id={user.id}
                      phone_number={user.phone_number}
                      raiting={(parseFloat(user.raiting) || 0).toFixed(1)}
                    />
                    <br />
                  </>
                ))
              ) : (
                <p>Пользователей не найдено.</p> // Message when no users are available
              )}
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
          <Link to="/agreement/service_rules">Правила и условия</Link>
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
      <>
        {isBalanceModalOpen ? (
          <>
            <BalanceModal user={user} onClose={toggleBalanceModal} />
          </>
        ) : (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={onClose}>
                &#215;
              </button>
              <p>Выберите способ оплаты</p>
              <h2>
                10% от суммы заказа: <br />$
                {editedProduct.price * selectedAmount * 0.1}(
                {(
                  Number(editedProduct.price * selectedAmount * 0.1) / course
                ).toFixed(2)}
                P)
              </h2>

              {user.balance <
                Number(editedProduct.price * selectedAmount * 0.1) && (
                <div className="two_buttons">
                  <button onClick={toggleBalanceModal}>Пополнить баланс</button>
                </div>
              )}
              <div className="two_buttons">
                <button onClick={handleBuyFromBalance}>
                  Оплатить с баланса
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (step === 3) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <p>
            Свяжитесь с менеджером для оплаты $
            {editedProduct.price * selectedAmount * 0.1} (
            {(
              Number(editedProduct.price * selectedAmount * 0.1) / course
            ).toFixed(2)}
            P)
          </p>
          <h2>
            В телеграм:{" "}
            <a href="https://t.me/manager_kazaka">@manager_kazaka</a>
          </h2>
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
          <h2>
            Переведите на данный счет {total} (
            {(Number(total) / course).toFixed(2)}
            P):{" "}
          </h2>
          <p>Сеть: TRC20 (Tron)</p>
          <p>Адрес кошелька: TQfrEu1sP4iF4xTZUqGsjQzNGKEeFnyjrQ</p>
          <img src="qr.jpg" alt="" />
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
  }).isRequired,
};

export default CardModal;
