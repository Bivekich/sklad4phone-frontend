import { useEffect, useState } from "react";
import "../styles/HistoryCard.css";
import { getSaleInHistoryById } from "../server";

const HistoryCard = ({ id }) => {
  const [status, setStatus] = useState("Зарезервирован");
  const [statusColor, setStatusColor] = useState("#bbfb4c");
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSaleInHistoryById(id);
        setProduct(response);
      } catch (err) {
        setError("Failed to fetch product data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    // Log the product data for debugging
    console.log("Product data:", product);

    if (product.collected_now === product.collected_need) {
      setStatus("Завершен");
      setStatusColor("gray");
    } else if (product.cancel) {
      setStatus("Отменен");
      setStatusColor("#FF1515");
    } else if (product.deleted) {
      setStatus("Удален");
      setStatusColor("#FF1515");
    } else {
      // If none of the above conditions are met, keep it as "Зарезервирован"
      setStatus("Зарезервирован");
      setStatusColor("#bbfb4c");
    }
  }, [product]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  const progressPercentage = Math.min(
    100,
    Math.floor((product.collected_now / product.collected_need) * 100),
  );
  const isCompleted = progressPercentage >= 100;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Получаем день и добавляем ноль, если нужно
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    const year = String(date.getFullYear()).slice(-4); // Получаем последние две цифры года

    return `${day}.${month}.${year}`;
  };

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
    <div
      className="historyCard"
      style={{
        order: isCompleted
          ? 10000
          : product.collected_need - product.collected_now,
      }}
    >
      {product.images && product.images.length > 0 && (
        <img src={product.images[0]} alt={product.name} />
      )}
      <div className="info">
        <h4>{product.name}</h4>
        <span>Оплачено: ${product.price * (product.quantity || 1) * 0.1}</span>
        <span>Количество: {product.quantity}</span>
        <span>Цена: ${product.price}</span>
        <span>{formatDate(product.createdAt)}</span>
      </div>
      <div className="column">
        <div
          className="process_round"
          style={{
            background: `conic-gradient(${color} ${progressPercentage}%, #242424 0)`,
          }}
        >
          <span>
            {product.collected_now}/{product.collected_need}
          </span>
        </div>
        <div className="status" style={{ background: statusColor }}>
          {status}
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
