import React, { useState, useRef } from "react";
import { broadcastNotification } from "../server"; // Импорт функции

const Notifications = () => {
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0]; // Allow only one file
    console.log("Selected photo:", selectedFile);
    setPhoto(selectedFile);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input field
    }
  };

  const handleBroadcast = async () => {
    try {
      const formData = new FormData();
      formData.append("message", text);

      // Append the single photo to FormData if a photo was selected
      if (photo) {
        formData.append("photo", photo);
      }

      console.log("Sending formData:", formData);

      await broadcastNotification(formData);
      alert("Сообщение успешно отправлено!");

      // Clear form after successful broadcast
      setText("");
      setPhoto(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input field
      }
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      alert("Ошибка при отправке сообщения.");
    }
  };

  return (
    <div>
      <h2>Картинка</h2>
      <input
        type="file"
        onChange={handlePhotoChange}
        accept="image/*"
        ref={fileInputRef} // Attach ref to the input
      />
      {photo && (
        <div>
          <p>Выбрана картинка: {photo.name}</p>
          <button onClick={handleRemovePhoto}>Удалить картинку</button>
        </div>
      )}
      <br />
      <div style={{ maxWidth: "100vw", width: "100%", padding: "1rem" }}>
        <textarea
          style={{
            maxWidth: "100vw",
            width: "100%",
            minHeight: "300px",
            padding: "1rem",
            borderRadius: "20px",
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение"
        />
      </div>
      <br />
      <button onClick={handleBroadcast}>Отправить уведомление</button>
    </div>
  );
};

export default Notifications;
