import "../styles/HistoryCard.css";
const HistoryCard = ({ image, title, price, status, date }) => {
  return (
    <>
      <div className="historyCard">
        <img src={image} alt="" />
        <div className="info">
          <h4>{title}</h4>
          <span>{price}</span>
          <div className="date">{date}</div>
        </div>
        <div className="status">{status}</div>
      </div>
    </>
  );
};

export default HistoryCard;
