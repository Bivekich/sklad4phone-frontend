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
        setOrders(response);
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
            <HistoryCard
              key={order.id}
              image={order.images[0]}
              title={order.name}
              price={order.price}
              quantity={order.quantity}
              collected_need={order.collected_need}
              collected_now={order.collected_now}
              cancel={order.cancel}
              date=""
            />
          ))}
        </ul>
      ) : (
        <div>Пока что здесь пусто(</div>
      )}
    </div>
  );
};

export default History;
