import "../styles/CardList.css";
import Card from "./Card";

const CardList = () => {
  const cards = [
    {
      image: "",
      name: "uqewr",
      short_desc: "qwer werwr ...",
      price: "9999",
      max: 100,
      now: 70,
    },
    {
      image: "",
      name: "uqewr",
      short_desc: "qwer werwr ...",
      price: "9999",
      max: 100,
      now: 50,
    },
    {
      image: "",
      name: "uqewr",
      short_desc: "qwer werwr ...",
      price: "9999",
      max: 100,
      now: 20,
    },
    {
      image: "",
      name: "uqewr",
      short_desc: "qwer werwr ...",
      price: "9999",
      max: 100,
      now: 10,
    },
  ];
  return (
    <>
      <div className="cards_container">
        <h3>Сборы</h3>
        {cards.map((item) => (
          <Card
            image={item.image}
            name={item.name}
            short_desc={item.short_desc}
            price={item.price}
            max={item.max}
            now={item.now}
          />
        ))}
      </div>
    </>
  );
};

export default CardList;
