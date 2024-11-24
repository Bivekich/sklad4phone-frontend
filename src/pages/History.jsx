import { useEffect, useState } from "react";
import { getUserOrders } from "../server";
import HistoryCard from "../components/HistoryCard";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserOrders();

        // Создаем массивы для разных статусов
        const collectedOrders = response.filter(
          (order) => order.collected_now === order.collected_need,
        );
        const canceledOrders = response.filter(
          (order) =>
            order.cancel && order.collected_now !== order.collected_need,
        );
        const deletedOrders = response.filter(
          (order) =>
            order.deleted &&
            !order.cancel &&
            order.collected_now !== order.collected_need,
        );
        const otherOrders = response.filter(
          (order) => !order.collected_now && !order.cancel && !order.deleted,
        );

        // Объединяем массивы в нужном порядке
        const sortedOrders = [
          ...otherOrders, // Добавляем обычные заказы в начале
          ...collectedOrders, // Затем добавляем собранные заказы
          ...canceledOrders, // Затем добавляем отмененные заказы
          ...deletedOrders, // И в конце добавляем удаленные заказы
        ];

        setOrders(sortedOrders);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>История сборов</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <HistoryCard key={order.id} id={order.id} />
          ))}
        </ul>
      ) : (
        <div>Пока что здесь пусто(</div>
      )}
    </div>
  );
};

export default History;
