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
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [video, setVideo] = useState(null); // Single video file
  const [videoPreview, setVideoPreview] = useState(null); // Video preview

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]:
        (name === "price" ||
          name === "collected_now" ||
          name === "collected_need") &&
        value !== ""
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!newProduct.name || !newProduct.description || images.length === 0) {
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

    images.forEach((image) => {
      formData.append("images", image);
    });

    if (video) {
      formData.append("video", video); // Append video file to FormData
    }

    try {
      await createSale(formData);
      alert("Сбор успешно создан!");
      onClose();
      window.location.reload();
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
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <div className="image-previews">
              {previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Предварительный просмотр ${index + 1}`}
                  className="image-preview"
                />
              ))}
            </div>
          </label>
          <label className="editCardLabel">
            Видео:
            <input type="file" accept="video/*" onChange={handleVideoChange} />
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="video-preview"
                width="100%"
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
