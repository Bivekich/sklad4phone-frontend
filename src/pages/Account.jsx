import "../styles/Account.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { updateUserById } from "../server";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Star, DollarSign, User, Phone } from "lucide-react";

const Account = ({ user }) => {
  const [editedUser, setEditedUser] = useState({
    first_name: user.first_name,
    phone_number: user.phone_number,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Call the server function to update the user data
      await updateUserById(user.id, {
        first_name: editedUser.first_name,
        phone_number: editedUser.phone_number,
      });

      console.log("User updated successfully");
      alert("Профиль успешно обновлен");
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Мой профиль</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src="/placeholder-avatar.jpg"
                  alt={editedUser.first_name}
                />
                <AvatarFallback>
                  {editedUser.first_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{editedUser.first_name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Личная информация
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{editedUser.first_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{editedUser.phone_number}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Мой рейтинг
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-start">
                  {(parseFloat(user.raiting) || 0).toFixed(1)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Мой баланс
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold flex items-center">
                  {user.balance.toLocaleString()}
                  <DollarSign className="h-6 w-6 ml-1 text-green-600" />
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// PropTypes validation
Account.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    raiting: PropTypes.string.isRequired,
  }).isRequired,
};

export default Account;
