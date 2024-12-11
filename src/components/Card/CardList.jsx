import { useEffect, useState } from "react";
import "../../styles/CardList.css";
import Card from "./Card";
import { getAllSales } from "../../server"; // Import the function to get sales
import CreateCard from "./CreateCard";
import { useLocation } from "react-router-dom";

const CardList = ({ user }) => {
  const location = useLocation();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [modal, setShowModal] = useState(false);
  const urlParams = new URLSearchParams(location.search);

  const search = urlParams.get("search") || "";
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesData = await getAllSales(); // Call the API to get all sales
        setCards(salesData); // Update state with the fetched data
        setFilteredCards(salesData); // Initialize filtered cards
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSales(); // Trigger the fetch function
  }, []);

  useEffect(() => {
    // Filter cards based on the search input
    const results = cards.filter(
      (card) =>
        card.name.toLowerCase().includes(search.toLowerCase()) || // Filter by name
        card.description.toLowerCase().includes(search.toLowerCase()) // Filter by description
    );
    setFilteredCards(results); // Update filtered cards
  }, [search, cards]); // Re-run the filter whenever search or cards change

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
        <div className="flex flex-col gap-2">
          {filteredCards.map((item, index) => (
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
        {/* <Card
          user={user}
          key={0}
          admin={user.admin}
          id={1}
          images={[""]}
          name={"134"}
          description={"5654645"}
          price={3453}
          collected_need={1}
          collected_now={10}
        /> */}
      </div>
      {modal && (
        <CreateCard isOpen={modal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default CardList;
