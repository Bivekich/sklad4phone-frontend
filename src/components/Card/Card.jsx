import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';

import { Button } from '../ui/button';
import CardModal from './CardModal';
import CardMembersModal from './CardMembersModal';
import { deleteSale } from '../../server';

const ProductCard = ({
  user,
  admin,
  id,
  images,
  name,
  description,
  price,
  collected_need,
  collected_now,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const handleShow = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    window.location.reload(); // Consider using state management instead of reload
  };

  const onDelete = async () => {
    await deleteSale(id);
    window.location.reload(); // Consider using state management instead of reload
  };

  const toggleMembers = () => {
    setIsMembersModalOpen(!isMembersModalOpen);
  };

  const progressPercentage = Math.min(
    100,
    Math.floor((collected_now / collected_need) * 100)
  );

  const isCompleted = progressPercentage >= 100;

  // Determine color based on progress
  const color = isCompleted
    ? 'gray'
    : progressPercentage >= 70
    ? 'hsl(221.2 83.2% 53.3%)'
    : progressPercentage >= 50
    ? '#E2FF31'
    : progressPercentage >= 20
    ? '#5285E8'
    : '#FF1515';

  return (
    <>
      <Card
        className={`w-full group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl ${
          isCompleted && 'hidden'
        }`}
        style={{ order: collected_need - collected_now }}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-xl">
            <img
              src={images[0]}
              alt={name}
              width={400}
              height={200}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-medium">Подробнее</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg tracking-tight">{name}</h3>
            <p className="text-sm text-muted-foreground">${price.toFixed(2)}</p>
            <Progress
              value={progressPercentage}
              className="h-2 bg-gray-200"
              indicatorClassName="bg-black"
            />
            <p className="text-sm text-muted-foreground">
              Собрано {collected_now} из {collected_need} шт.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full transition-colors" onClick={handleShow}>
            Подробнее
          </Button>
        </CardFooter>
      </Card>

      <CardModal
        user={user}
        isOpen={isModalOpen}
        onClose={handleClose}
        admin={admin}
        product={{ id }}
      />
      <CardMembersModal
        sale_id={id}
        isOpen={isMembersModalOpen}
        onClose={toggleMembers}
      />
    </>
  );
};

ProductCard.propTypes = {
  admin: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  collected_need: PropTypes.number.isRequired,
  collected_now: PropTypes.number.isRequired,
};

export default ProductCard;
