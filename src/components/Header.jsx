import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import BalanceModal from "./BalanceModal";

const Header = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleBalanceModal = () => {
    setIsBalanceModalOpen(!isBalanceModalOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header>
        <button className="menu-button" onClick={toggleMenu}>
          <img src="menu.svg" alt="menu" />
        </button>
        <img src="logo_header.svg" alt="logo" />
        <div className="wallet" onClick={toggleBalanceModal}>
          <span>{user ? user.balance : "Loading..."}</span>
          <img src="wallet.svg" alt="wallet" />
        </div>
      </header>

      {/* Sidebar Menu */}
      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <button className="close-button" onClick={closeMenu}>
          &#215;
        </button>
        <nav>
          <div className="acc_info">
            <img src="default_ava.svg" alt="default_ava" />
            <div className="acc_info_col">
              <h3>{user ? user.first_name : "Loading..."}</h3>
              <span>ID: {user ? user.id : "Loading..."}</span>
            </div>
          </div>
          <div className="hr"></div>
          <ul>
            <li onClick={closeMenu}>
              <img src="home.svg" alt="home" />
              <Link to="/">Главная</Link>
            </li>
            {user.admin ? (
              <>
                <li onClick={closeMenu}>
                  <img src="person.svg" alt="person" />
                  <Link to="/users">Пользователи</Link>
                </li>
                <li onClick={closeMenu}>
                  <img src="book.svg" alt="book" />
                  <Link to="/users-booking">Бронь пользователей</Link>
                </li>
              </>
            ) : (
              <>
                <li onClick={closeMenu}>
                  <img src="person.svg" alt="person" />
                  <Link to="/account">Мой аккаунт</Link>
                </li>
                <li onClick={closeMenu}>
                  <img src="history.svg" alt="history" />
                  <Link to="/history">История сборов</Link>
                </li>
              </>
            )}
            <li onClick={closeMenu}>
              <img src="bell.svg" alt="bell" />
              <Link
                to={
                  user.admin
                    ? "/notifications"
                    : "https://t.me/Sklad4Phones_bot"
                }
              >
                Уведомления
              </Link>
            </li>
            <li onClick={closeMenu}>
              <img src="headphones.svg" alt="headphones" />
              <Link to="/support">Техподдержка</Link>
            </li>
            <li onClick={closeMenu}>
              <img src="contract.svg" alt="contract" />
              <Link to="/agreement/offer">Договор оферты</Link>
            </li>
            <li onClick={closeMenu}>
              <img src="document.svg" alt="document" />
              <Link to="/agreement/service_rules">Правила сервиса</Link>
            </li>
            <li onClick={closeMenu}>
              <img src="checkmark.svg" alt="checkmark" />
              <Link to="/agreement/warranty">Гарантии</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay to close menu when clicked outside */}
      {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}

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
