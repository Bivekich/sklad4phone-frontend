import { useState } from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import { user } from "../server";

console.log(user);
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header>
        <button className="menu-button" onClick={toggleMenu}>
          <img src="menu.svg" alt="menu" />
        </button>
        <img src="logo_header.svg" alt="logo" />
        <div className="wallet">
          <span>{user.balance}</span>
          <img src="wallet.svg" alt="wallet" />
        </div>
      </header>

      {/* Sidebar Menu */}
      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <button className="close-button" onClick={toggleMenu}>
          &#215;
        </button>
        <nav>
          <div className="acc_info">
            <img src="default_ava.svg" alt="default_ava" />
            <div className="acc_info_col">
              <h3>{user.first_name}</h3>
              <span>ID: {user.id}</span>
            </div>
          </div>
          <div className="hr"></div>
          <ul>
            <li>
              <img src="home.svg" alt="home" />
              <Link to="/">Главная</Link>
            </li>
            <li>
              <img src="person.svg" alt="person" />
              <Link to="/account">Мой аккаунт</Link>
            </li>
            <li>
              <img src="history.svg" alt="history" />
              <Link to="/history">История сборов</Link>
            </li>
            <li>
              <img src="bell.svg" alt="bell" />
              <Link to="#services">Уведомления</Link>
            </li>
            <li>
              <img src="headphones.svg" alt="headphones" />
              <Link to="/support">Техподдержка</Link>
            </li>
            <li>
              <img src="contract.svg" alt="contract" />
              <Link to="#services">Договор оферты</Link>
            </li>
            <li>
              <img src="document.svg" alt="document" />
              <Link to="#services">Правила сервиса</Link>
            </li>
            <li>
              <img src="checkmark.svg" alt="checkmark" />
              <Link to="#services">Гарантии</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay to close menu when clicked outside */}
      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </>
  );
};

export default Header;
