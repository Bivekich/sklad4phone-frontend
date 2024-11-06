// BalanceModal.js
import React, { useState } from "react";
import "../styles/Modal.css";
import {
  createTransaction,
  createBybitTransaction,
  verifyBybitTransaction,
} from "../server";

const BalanceModal = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(0);
  const [total, setTotal] = useState(0);

  const handleRecharge = () => {
    setStep(1);
  };

  const handlePay = async () => {
    try {
      await createTransaction(amount);
      alert("Свяжитесь с менеджером для пополнения баланса");
      setStep(3); // Step to show confirmation
    } catch (error) {
      console.error("Ошибка при пополнении баланса:", error);
      alert(
        "Произошла ошибка при пополнении баланса. Пожалуйста, попробуйте снова.",
      );
    }
  };

  const handleUsdtPayment = async () => {
    try {
      const totalAmount = parseFloat(amount) * 1.1; // Adding a small fee
      setTotal(totalAmount.toFixed(2)); // Show total with the fee
      await createBybitTransaction(total); // Proceed with the USDT transaction
      setStep(4); // Move to the confirmation step
    } catch (error) {
      console.error("Ошибка при оплате USDT:", error);
      alert("Ошибка при оплате USDT. Пожалуйста, попробуйте снова.");
    }
  };

  const handleConfirmPayment = async () => {
    const response = await verifyBybitTransaction();
    if (response) {
      alert("Покупка успешно подтверждена");
    } else {
      alert("Процесс перевода средств ещё не окончился");
    }
  };

  // Step 0: Input amount
  if (step === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <h2>Пополнить баланс</h2>
          <div className="input_rounded_row">
            <span>Сумма:</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </div>

          <div className="two_buttons">
            <button onClick={handleRecharge}>Продолжить</button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Choose payment method
  if (step === 1) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <h2>Выберите способ пополнения</h2>
          <div className="two_buttons">
            <button onClick={handlePay}>Пополнить с баланса</button>
          </div>
          <div className="two_buttons">
            <button onClick={handleUsdtPayment}>Оплатить с USDT</button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Confirmation for balance payment
  if (step === 3) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <h2>Пополнение баланса успешно</h2>
          <p>Ваш баланс был пополнен на сумму {amount}.</p>
          <div className="two_buttons">
            <button onClick={onClose}>Закрыть</button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: USDT payment confirmation
  if (step === 4) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &#215;
          </button>
          <h2>Переведите на данный счет {total} USDT:</h2>
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

export default BalanceModal;
