import { useState, useEffect } from "react";
import "../styles/Support.css";
import {
  createSupportTicket,
  getUserSupportTickets,
  getAllSupportTickets,
} from "../server";

const Support = ({ user }) => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
  });
  const [supportTickets, setSupportTickets] = useState([]);
  const [ticketCount, setTicketCount] = useState(0);

  // Fetch user tickets on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const tickets = user.admin
          ? await getAllSupportTickets()
          : await getUserSupportTickets();
        setSupportTickets(tickets);
        setTicketCount(tickets.length);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [user.admin]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formdataSending = {
        subject: formData.type,
        message: formData.description,
      };

      await createSupportTicket(formdataSending);
      setFormData({ type: "", description: "" });

      const tickets = await getUserSupportTickets();
      setSupportTickets(tickets);
      setTicketCount(tickets.length);
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  return (
    <div className="support">
      <h3>Тех поддержка</h3>

      <div className="block_orders">
        <h4>{user.admin ? "Заявки" : "Мои заявки"}</h4>
        <span className="count">{ticketCount} заявок</span>
      </div>

      {user.admin ? (
        <div className="blocks">
          {supportTickets.length > 0 ? (
            supportTickets.map((item) => (
              <div className="block_orders" key={item.id}>
                <h4>Заявка #{item.id}</h4>
                <div className="ticket">
                  <h5>Тип заявки: {item.subject}</h5>
                  <p>Сообщение: {item.message}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Нет заявок.</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {supportTickets.length > 0 ? (
            <div className="block_orders">
              <h4>Последняя заявка</h4>
              <div className="ticket">
                <h5>Тип заявки: {supportTickets[0].subject}</h5>
                <p>Сообщение: {supportTickets[0].message}</p>
              </div>
            </div>
          ) : (
            <p>У вас нет заявок.</p>
          )}

          <h4>Новая заявка</h4>

          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="request-type"
          >
            <option value="" disabled>
              Выберите тип заявки
            </option>
            <option value="Техническая поддержка">Техническая поддержка</option>
            <option value="Вопрос по оплате">Вопрос по оплате</option>
            <option value="Общий вопрос">Общий вопрос</option>
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Опишите вашу проблему или вопрос"
            rows="4"
            className="request-description"
          />

          <button type="submit" className="submit-button">
            Отправить
          </button>
        </form>
      )}
    </div>
  );
};

export default Support;
