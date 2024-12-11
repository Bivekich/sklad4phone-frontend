import { useState } from "react";
import "../styles/Search.css";
import { useNavigate, useLocation } from "react-router-dom";
import { phoneNumberConst } from "../server";
import { Input } from "./ui/input";

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
    <div className="search-container mt-6">
      <form onSubmit={handleSearch} className="search">
        <Input
          type="search"
          placeholder="Поиск товаров..."
          className="mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Search;
