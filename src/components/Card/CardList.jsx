import { useEffect, useState } from "react";
import "../../styles/CardList.css";
import Card from "./Card";
import { getAllSales } from "../../server"; // Import the function to get sales
import CreateCard from "./CreateCard";

const CardList = ({ user }) => {
  const [cards, setCards] = useState([]);
  const [modal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesData = await getAllSales(); // Call the API to get all sales
        setCards(salesData); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSales(); // Trigger the fetch function
  }, []);

  return (
    <>
      <div className="cards_container">
        <h3 style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          Сборы{" "}
          {user.admin && (
            <button className="smallButton" onClick={() => setShowModal(true)}>
              Создать сбор
            </button>
          )}
        </h3>
        {cards.map((item, index) => (
          <Card
            user={user}
            key={index}
            admin={user.admin}
            id={item.id}
            images={item.images}
            name={item.name}
            description={item.description}
            price={item.price}
            collected_need={item.collected_need}
            collected_now={item.collected_now}
          />
        ))}
      </div>
      {modal && (
        <CreateCard isOpen={modal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default CardList;
