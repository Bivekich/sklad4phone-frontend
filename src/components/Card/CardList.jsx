import { useEffect, useState } from "react";
import "../../styles/CardList.css";
import Card from "./Card";
import { getAllSales } from "../../server"; // Import the function to get sales

const CardList = () => {
  // const cards = [
  //   {
  //     image: "",
  //     name: "uqewr",
  //     description: "qwer werwr ...",
  //     price: "9999",
  //     collected_need: 100,
  //     collected_now: 70,
  //   },
  //   {
  //     image: "",
  //     name: "uqewr",
  //     description: "qwer werwr ...",
  //     price: "9999",
  //     collected_need: 100,
  //     collected_now: 50,
  //   },
  //   {
  //     image: "",
  //     name: "uqewr",
  //     description: "qwer werwr ...",
  //     price: "9999",
  //     collected_need: 100,
  //     collected_now: 20,
  //   },
  //   {
  //     image: "",
  //     name: "uqewr",
  //     description: "qwer werwr ...",
  //     price: "9999",
  //     collected_need: 100,
  //     collected_now: 10,
  //   },
  // ];
  const [cards, setCards] = useState([]);

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

  console.log(cards);

  return (
    <>
      <div className="cards_container">
        <h3>Сборы</h3>
        {cards.map((item, index) => (
          <Card
            key={index}
            image={item.image}
            name={item.name}
            description={item.description}
            price={item.price}
            collected_need={item.collected_need}
            collected_now={item.collected_now}
          />
        ))}
      </div>
    </>
  );
};

export default CardList;
