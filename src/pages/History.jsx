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

        // Create a new sorted array based on status
        const sortedOrders = response.reduce((acc, order) => {
          if (order.collected_now === order.collected_need) {
            acc.splice(acc.length - 2, 0, order); // Add before the last element
          } else if (order.cancel) {
            acc.splice(acc.length - 1, 0, order); // Add before the last element
          } else if (order.deleted) {
            acc.push(order); // Add to the end
          } else {
            acc.unshift(order); // Add to the beginning
          }
          return acc;
        }, []);

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
