import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAgreementByType, updateAgreementByType } from "../server";

const Agreement = ({ user }) => {
  const { type } = useParams(); // Получаем тип соглашения из URL
  const [agreementText, setAgreementText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [header, setHeader] = useState();

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        setLoading(true);
        const data = await getAgreementByType(type);
        setAgreementText(data.text); // Предполагаем, что `text` - это поле с содержимым соглашения
        setEditText(data.text); // Устанавливаем начальное значение для редактирования
      } catch (error) {
        console.error("Не удалось получить данные соглашения:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgreement();
  }, [type]);

  const handleSave = async () => {
    try {
      await updateAgreementByType(type, editText); // Отправляем обновленный текст на сервер
      setAgreementText(editText); // Обновляем текст после успешного сохранения
      setIsEditing(false); // Завершаем режим редактирования
      alert("Соглашение успешно обновлено!");
    } catch (error) {
      console.error("Не удалось обновить соглашение:", error);
      alert("Ошибка при обновлении соглашения");
    }
  };

  useEffect(() => {
    if (type === "offer") {
      setHeader("Договор оферты");
    } else if (type === "service_rules") {
      setHeader("Правила сервиса");
    } else if (type === "warranty") {
      setHeader("Гарантии");
    }
  }, []);

  return (
    <div>
      <h1>{header}</h1>
      <br />
      <b>для приложения sklad4phones_bot</b>
      <br />
      <br />
      {loading ? (
        <p>Загрузка соглашения...</p>
      ) : isEditing && user.admin ? (
        <div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows="10"
            style={{ width: "100%" }}
          />
          <br />
          <br />
          <button onClick={handleSave}>Сохранить</button>
          <br />
          <br />
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </div>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>{agreementText}</pre>
      )}
      {user.admin && !isEditing && (
        <>
          <br />
          <br />
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
        </>
      )}
    </div>
  );
};

export default Agreement;
