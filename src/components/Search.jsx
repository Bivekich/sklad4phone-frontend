import { useState } from "react";
import "../styles/Search.css";
import { useNavigate, useLocation } from "react-router-dom";
import { phoneNumberConst } from "../server";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const urlParams = new URLSearchParams(location.search);
  const phoneNumber = urlParams.get("phoneNumber") || phoneNumberConst; // Default to phoneNumberConst if not found

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Update URL parameters
    urlParams.set("phoneNumber", phoneNumber); // Use the phone number from URL or constant
    urlParams.set("search", search);

    // Navigate to the new URL
    navigate(`/?${urlParams.toString()}`, {
      replace: true,
    });
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search">
        <input
          type="text"
          name="search"
          placeholder="Поиск по товарам"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">
          <img src="/search.svg" alt="Search" />
        </button>
      </form>
    </div>
  );
};

export default Search;
