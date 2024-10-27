import { useState } from "react";
import "../styles/Support.css";

const Support = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const dataArray = Object.entries(formData).map(([key, value]) => ({
      [key]: value,
    }));
    console.log("Data ready for submission:", dataArray);
    // You can send dataArray to your server here using fetch or axios
  };

  return (
    <div className="support">
      <h3>Тех поддержка</h3>

      <div className="block_orders">
        <h4>Мои заявки</h4>
        <span className="count">0 заявок</span>
      </div>

      <form action="" onSubmit={handleSubmit}>
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
          <option value="technical">Техническая поддержка</option>
          <option value="billing">Вопрос по оплате</option>
          <option value="general">Общий вопрос</option>
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
    </div>
  );
};

export default Support;
