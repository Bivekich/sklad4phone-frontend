import { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/Modal.css";
import { createSale } from "../../server"; // Ensure createSale endpoint handles file upload

const CreateCard = ({ isOpen, onClose }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    collected_now: 0,
    collected_need: 0,
  });
  const [image, setImage] = useState(null); // For the uploaded image file
  const [preview, setPreview] = useState(""); // For previewing the image

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "collected_now" ||
        name === "collected_need"
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Generate a preview URL for the image
  };

  const handleSave = async () => {
    // Validate fields
    if (!newProduct.name || !newProduct.description || !image) {
      alert("Пожалуйста, заполните все обязательные поля и загрузите фото.");
      return;
    }
    if (newProduct.price <= 0) {
      alert("Цена должна быть положительным числом.");
      return;
    }
    if (newProduct.collected_need <= 0 || newProduct.collected_now < 0) {
      alert("Неверные значения для сбора.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("collected_now", newProduct.collected_now);
    formData.append("collected_need", newProduct.collected_need);
    formData.append("image", image); // Append the image file to the form data

    try {
      await createSale(formData); // Pass FormData directly to the API call
      alert("Сбор успешно создан!"); // Success message
      onClose(); // Close the modal after saving
      window.location.reload(); // Refresh page to show the new product (optional)
    } catch (error) {
      console.error("Ошибка при создании нового сбора:", error);
      alert(
        "Произошла ошибка при создании нового сбора. Пожалуйста, попробуйте снова.",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &#215;
        </button>
        <h2>Создать новый сбор</h2>
        <div>
          <label className="editCardLabel">
            Название:
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
            />
          </label>
          <label className="editCardLabel">
            Описание:
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleChange}
            />
          </label>
          <label className="editCardLabel">
            Цена:
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
            />
          </label>
          <label className="editCardLabel">
            Собрано сейчас:
            <input
              type="number"
              name="collected_now"
              value={newProduct.collected_now}
              onChange={handleChange}
            />
          </label>
          <label className="editCardLabel">
            Нужно собрать:
            <input
              type="number"
              name="collected_need"
              value={newProduct.collected_need}
              onChange={handleChange}
            />
          </label>
          <label className="editCardLabel">
            Фото:
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <img
                src={preview}
                alt="Предварительный просмотр"
                className="image-preview"
              />
            )}
          </label>
        </div>
        <div className="two_buttons">
          <button onClick={onClose}>Отменить</button>
          <button onClick={handleSave}>Создать сбор</button>
        </div>
      </div>
    </div>
  );
};

CreateCard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateCard;
