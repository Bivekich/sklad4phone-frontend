import "../styles/Header.css";

const Header = () => {
  return (
    <>
      <header>
        <img src="menu.svg" alt="logo" />
        <img src="logo_header.svg" alt="logo" />
        <div className="wallet">
          <span>399</span>
          <img src="wallet.svg" alt="" />
        </div>
      </header>
    </>
  );
};

export default Header;
