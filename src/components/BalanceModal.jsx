// BalanceModal.js
import React, { useEffect, useState } from "react";
import "../styles/Modal.css";
import {
  createLog,
  createBybitTransaction,
  verifyBybitTransaction,
  getCource,
} from "../server";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

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
      await createLog(`Запросил пополнение через менеджера на $${amount}`);
      alert("Свяжитесь с менеджером для пополнения баланса");
      setStep(3); // Step to show confirmation
    } catch (error) {
      console.error("Ошибка при пополнении баланса:", error);
      alert(
        "Произошла ошибка при пополнении баланса. Пожалуйста, попробуйте снова."
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

          <Input
            type="number"
            placeholder="Сумма в $:"
            className="my-6 text-black"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* <div className="two_buttons"> */}
          <Button className="w-full" onClick={handleRecharge}>
            Продолжить
          </Button>
          {/* </div>å */}
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
            На сумму: ${Number(amount)} ({(Number(amount) / course).toFixed(2)}
            P)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full" onClick={handlePay}>
              Наличными
            </Button>
            <Button className="w-full" onClick={handleUsdtPayment}>
              Оплатить с USDT
            </Button>
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
            Свяжитесь с менеджером для оплаты ${amount} (
            {(Number(amount) / course).toFixed(2)}P)
          </p>
          <h2>
            В телеграм:{" "}
            <Link to="https://t.me/manager_kazaka">@manager_kazaka</Link>
          </h2>
          <Link to="https://t.me/manager_kazaka">
            <Button className="w-full" onClick={handleConfirmPayment}>
              Перейти в телеграм
            </Button>
          </Link>
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
            <Button className="w-full" onClick={handleConfirmPayment}>
              Я отправил платеж
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BalanceModal;
