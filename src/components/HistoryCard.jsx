import { useEffect, useState } from "react";
import "../styles/HistoryCard.css";
const HistoryCard = ({
  image,
  title,
  price,
  date,
  quantity,
  collected_need,
  collected_now,
  cancel,
}) => {
  const [status, setStatus] = useState("Зарезервирован");
  const [statusColor, setStatusColor] = useState("#bbfb4c");

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
  useEffect(() => {
    if (collected_now === collected_need) {
      setStatus("Завершен");
      setStatusColor("gray");
    }
    if (cancel) {
      setStatus("Отменен");
      setStatusColor("#FF1515");
    }
  }, []);

  return (
    <>
      <div className="historyCard">
        <img src={image} alt="" />
        <div className="info">
          <h4>{title}</h4>
          <span>Оплачено: ${price * quantity * 0.1}</span>
          <span>${price}</span>
          <div className="date">{date}</div>
        </div>
        <div className="column">
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
          <div className="status" style={{ background: statusColor }}>
            {status}
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryCard;
