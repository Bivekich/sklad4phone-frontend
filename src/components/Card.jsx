import "../styles/Card.css";
const Card = ({ image, name, short_desc, price, max, now }) => {
  const handleShow = () => {};

  const progressPercentage = Math.min(100, Math.floor((now / max) * 100));

  const color =
    progressPercentage >= 70
      ? "#BBFB4C"
      : progressPercentage >= 50
      ? "#E2FF31"
      : progressPercentage >= 20
      ? "#5285E8"
      : "#FF1515";

  return (
    <>
      <div className="card">
        <img src="" alt="" />
        <div className="info">
          <div className="text_info">
            <h4>{name}</h4>
            <span>{short_desc}</span>
          </div>
          <button type="button" onClick={handleShow}>
            Подробнее
          </button>
        </div>
        <div className="price">{price}₽</div>
        <div
          className="process_round"
          style={{
            background: `conic-gradient(${color} ${progressPercentage}%, #242424 0)`,
          }}
        >
          <span>
            {now}/{max}
          </span>
        </div>
      </div>
    </>
  );
};

export default Card;
