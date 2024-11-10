import React, { useState } from "react";
import { broadcastNotification } from "../server"; // Импорт функции

const Notifications = () => {
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0]; // Allow only one file
    console.log("Selected photo:", selectedFile);
    setPhoto(selectedFile);
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
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      alert("Ошибка при отправке сообщения.");
    }
  };

  return (
    <div>
      <h2>Картинка</h2>
      <input type="file" onChange={handlePhotoChange} accept="image/*" />
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
