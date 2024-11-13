// BalanceModal.js
import React, { useEffect, useState } from "react";
import "../styles/Modal.css";
import {
  createTransaction,
  createBybitTransaction,
  verifyBybitTransaction,
  getCource,
} from "../server";

const BalanceModal = ({ user, onClose }) => {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(0);
  const [total, setTotal] = useState(0);
  const [course, setCourse] = useState(0);

  useEffect(() => {
    const fetchCource = async () => {
      const course_result = await getCource();
      setCourse(Number(course_result));
    };

    fetchCource();
  }, []);

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
      const totalAmount = parseFloat(amount); // Adding a small fee
      const randomFraction = Math.random();

      // Add the random fractional part to the total
      const finalTotal = totalAmount + randomFraction;

      setTotal(finalTotal.toFixed(2)); // Show total with the fee
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
          <h2>
            Сейчас на счету: ${user.balance} (
            {(Number(user.balance) / course).toFixed(2)}P){" "}
          </h2>
          <div className="input_rounded_row">
            <span>Сумма в $:</span>
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
          <p>
            На сумму: ${amount} ({(Number(amount) / course).toFixed(2)}P)
          </p>
          <div className="two_buttons">
            <button onClick={handlePay}>Наличными</button>
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
          <p>
            Свяжитесь с менеджером для оплаты ${total} (
            {(Number(amount) / course).toFixed(2)}P)
          </p>
          <h2>
            В телеграм:{" "}
            <a href="https://t.me/manager_kazaka">@manager_kazaka</a>
          </h2>
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
          <h2>
            Переведите на данный счет ${total} (
            {(Number(amount) / course).toFixed(2)}P):{" "}
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

export default BalanceModal;
