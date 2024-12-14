import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, DollarSign } from "lucide-react";
import { UserInfo } from "./UserInfo";
import BalanceModal from "./BalanceModal";

const Header = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleBalanceModal = () => {
    setIsBalanceModalOpen(!isBalanceModalOpen);
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-background border-b mb-6">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <UserInfo name={user.first_name} id={user.id} />
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-lg" onClick={closeMenu}>
                Главная
              </Link>
              <Link to="/account" className="text-lg" onClick={closeMenu}>
                Мой профиль
              </Link>
              <Link to="/history" className="text-lg" onClick={closeMenu}>
                История сборов
              </Link>
              <Link
                to="https://t.me/Sklad4Phones_bot"
                className="text-lg"
                onClick={closeMenu}
              >
                Уведомления
              </Link>
              <Link to="/support" className="text-lg" onClick={closeMenu}>
                Тех поддержка
              </Link>
              <Link
                to="/agreement/offer"
                className="text-lg"
                onClick={closeMenu}
              >
                Договор оферты
              </Link>
              <Link
                to="/agreement/service_rules"
                className="text-lg"
                onClick={closeMenu}
              >
                Правила сервиса
              </Link>
              <Link
                to="/agreement/warranty"
                className="text-lg"
                onClick={closeMenu}
              >
                Гарантии
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <h1 className="text-xl font-bold">Sklad4Phone</h1>

        <div
          className="flex items-center cursor-pointer"
          onClick={toggleBalanceModal}
        >
          <DollarSign className="h-5 w-5 mr-1" />
          <span className="font-semibold">{user.balance}</span>
        </div>
      </header>

      {/* Balance Modal */}
      {isBalanceModalOpen && (
        <>
          <BalanceModal user={user} onClose={toggleBalanceModal} />
          <div className="overlay" onClick={toggleBalanceModal}></div>
        </>
      )}
    </>
  );
};

export default Header;
