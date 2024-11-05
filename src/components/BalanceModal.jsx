// BalanceModal.js
import React, { useState } from "react";
import "../styles/Modal.css";
import { createTransaction } from "../server";

const BalanceModal = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(0);

  const handleRecharge = async () => {
    await createTransaction(amount);
    setStep(1);
    onClose();
  };

  if (step === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2>Пополнить баланс</h2>

          <div className="input_rounded_row">
            <span>Введите сумму:</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button className="recharge-button" onClick={handleRecharge}>
            Пополнить
          </button>
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
            <button className="second_button" onClick={onClose}>
              Отмена
            </button>
            <button onClick={() => setStep(2)}>Забронировать</button>
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
          <p>Свяжитесь с менеджером для оплаты</p>
          <h2>В телеграм: VladimirEHoffman</h2>
        </div>
      </div>
    );
  }

  return null;
};

export default BalanceModal;
