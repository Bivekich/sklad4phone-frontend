import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";

import { Button } from "../ui/button";
import CardModal from "./CardModal";
import CardMembersModal from "./CardMembersModal";
import { deleteSale } from "../../server";

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
    ? "gray"
    : progressPercentage >= 70
    ? "hsl(221.2 83.2% 53.3%)"
    : progressPercentage >= 50
    ? "#E2FF31"
    : progressPercentage >= 20
    ? "#5285E8"
    : "#FF1515";

  return (
    <>
      <Card
        className={`w-full ${isCompleted && "hidden"}`}
        style={{ order: collected_need - collected_now }}
      >
        <CardContent className="p-0">
          <img
            src={images[0]}
            alt={name}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              ${price.toFixed(2)}
            </p>
            <Progress value={progressPercentage} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Собрано {collected_now} из {collected_need} шт.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleShow}>
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
