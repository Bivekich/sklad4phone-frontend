import { useEffect, useState } from "react";
import "../styles/HistoryCard.css";
import { getSaleInHistoryById } from "../server";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const HistoryCard = ({ id }) => {
  const [status, setStatus] = useState("Зарезервирован");
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
    if (Object.keys(product).length > 0) {
      if (product.collected_now === product.collected_need) {
        setStatus("Завершен");
      } else if (product.cancel) {
        setStatus("Отменен");
      } else if (product.deleted) {
        setStatus("Удален");
      } else {
        setStatus("Зарезервирован");
      }
    }
  }, [product]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const progressPercentage = Math.min(
    100,
    Math.floor((product.collected_now / product.collected_need) * 100)
  );
  const isCompleted = progressPercentage >= 100;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-4);

    return `${day}.${month}.${year}`;
  };

  const color = isCompleted
    ? "gray"
    : progressPercentage >= 70
    ? "hsl(221.2 83.2% 53.3%)"
    : progressPercentage >= 50
    ? "#E2FF31"
    : progressPercentage >= 20
    ? "#5285E8"
    : "#FF1515";

  return (
    <Card key={product.id}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={product.images[0]}
            alt={product.name}
            width={130}
            height={80}
            className="rounded-md"
          />
          <div className="flex-1">
            <h2 className="text-lg w-fit font-semibold">{product.name}</h2>
            <div className="flex justify-between items-center mt-2">
              <Badge variant={status === "Завершен" ? "default" : "secondary"}>
                {status}
              </Badge>
              <p className="font-medium">
                ${product.quantity * (product.quantity || 1)}
              </p>
            </div>
          </div>
        </div>
        <CollectionDetails collection={product} status={status} />
      </CardContent>
    </Card>
  );
};

function CollectionDetails({ collection, status }) {
  return (
    <Dialog>
      <DialogTrigger className="mt-1" asChild>
        <Button
          variant="ghost"
          className="w-fit justify-start p-2 text-sm ml-auto"
        >
          Подробнее
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{collection.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium">Предоплата:</p>
            <p>${collection.quantity * (collection.quantity || 1) * 0.1}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium">Количество:</p>
            <p>{collection.quantity} шт.</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium">Цена за единицу:</p>
            <p>${collection.price}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium">Полная цена:</p>
            <p>${collection.price * (collection.quantity || 1)}</p>
          </div>
          {/* <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium">Дата заказа:</p>
            <p>{formatDate(collection.orderDate)}</p>
          </div> */}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium">Статус:</p>
            <Badge variant={status === "Завершен" ? "default" : "secondary"}>
              {status}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HistoryCard;
