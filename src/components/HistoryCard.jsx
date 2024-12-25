import { useEffect, useState } from 'react';
import { getSaleInHistoryById } from '../server';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const HistoryCard = ({ id }) => {
  const [status, setStatus] = useState('Зарезервирован');
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSaleInHistoryById(id);
        setProduct(response);
      } catch (err) {
        setError('Failed to fetch product data');
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
        setStatus('Завершен');
      } else if (product.cancel) {
        setStatus('Отменен');
      } else if (product.deleted) {
        setStatus('Удален');
      } else {
        setStatus('Зарезервирован');
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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-4);

    return `${day}.${month}.${year}`;
  };

  return (
    <Card
      key={product.id}
      className="hover:shadow-md transition-shadow duration-300"
    >
      <CardContent className="p-4">
        <div className="flex gap-4 w-full">
          <div className="shrink-0 w-[130px] h-[120px]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between min-w-0 h-[120px]">
            <div className="flex flex-col items-start gap-2 w-full">
              <h2 className="text-lg font-semibold truncate w-full text-left">
                {product.name}
              </h2>
              <Badge
                variant={status === 'Завершен' ? 'default' : 'secondary'}
                className="w-fit"
              >
                {status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Количество: {product.quantity} шт.
              </p>
              <p className="font-medium">
                ${product.price * (product.quantity || 1)}
              </p>
            </div>

            <div className="flex justify-start">
              <CollectionDetails collection={product} status={status} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function CollectionDetails({ collection, status }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="hover:bg-secondary/80 transition-colors"
        >
          Подробнее
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{collection.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {[
            [
              'Предоплата',
              `$${collection.price * (collection.quantity || 1) * 0.1}`,
            ],
            ['Количество', `${collection.quantity} шт.`],
            ['Цена за единицу', `$${collection.price}`],
            [
              'Полная цена',
              `$${collection.price * (collection.quantity || 1)}`,
            ],
            ['Статус', status],
          ].map(([label, value]) => (
            <div key={value} className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">
                {label}:
              </p>
              {label === 'Статус' ? (
                <Badge
                  variant={status === 'Завершен' ? 'default' : 'secondary'}
                >
                  {status}
                </Badge>
              ) : (
                <p className="text-sm">{value}</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HistoryCard;
