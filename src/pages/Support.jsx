import { useState, useEffect } from "react";
import "../styles/Support.css";
import {
  createSupportTicket,
  getUserSupportTickets,
  getAllSupportTickets,
} from "../server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";

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

  const handleInputChange = (value, name) => {
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
    <div className="text-start support">
      <h1 className="text-start text-3xl font-bold mb-6 w-fit">
        Техническая поддержка
      </h1>

      <Card className="text-start mb-6">
        <CardHeader>
          <CardTitle className="text-start w-fit">
            Мои заявки{" "}
            <span className="text-start text-sm font-normal text-muted-foreground">
              ({ticketCount})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {supportTickets.length > 0 && (
            <div>
              <h3 className="text-start font-semibold mb-2">
                Последняя заявка:
              </h3>
              <p className="text-start text-sm text-muted-foreground mb-1">
                Тип: {supportTickets[0].subject}
              </p>
              <p>{supportTickets[0].message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {user.admin ? (
        <div className="text-start blocks">
          {supportTickets.length > 0 ? (
            supportTickets.map((item) => (
              <div className="text-start block_orders" key={item.id}>
                <h4>Заявка #{item.id}</h4>
                <div className="text-start ticket">
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
        <Card>
          <CardHeader>
            <CardTitle>Создать новую заявку</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="text-start space-y-4">
              <div>
                <label
                  htmlFor="type"
                  className="text-start block text-sm font-medium text-gray-700 mb-1"
                >
                  Тип заявки
                </label>
                <Select
                  name="type"
                  onValueChange={(value) => handleInputChange(value, "type")}
                >
                  <SelectTrigger id="ticketType">
                    <SelectValue placeholder="Выберите тип заявки" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Техническая поддержка">
                      Техническая поддержка
                    </SelectItem>
                    <SelectItem value="Вопрос по доставке">
                      Вопрос по доставке
                    </SelectItem>
                    <SelectItem value="Проблема с оплатой">
                      Проблема с оплатой
                    </SelectItem>
                    <SelectItem value="Другое">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="text-start block text-sm font-medium text-gray-700 mb-1"
                >
                  Ваш вопрос
                </label>
                <Textarea
                  id="description"
                  placeholder="Опишите вашу проблему или задайте вопрос"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange(e.target.value, "description")
                  }
                  className="text-start text-black"
                  rows={4}
                />
              </div>
              <Button type="submit">Отправить заявку</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Support;
