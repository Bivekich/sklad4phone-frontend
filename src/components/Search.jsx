import { useState } from "react";
import "../styles/Search.css";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    navigate(`/?search=${search}`);
  };

  return (
    <>
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
            <img src="/search.svg" alt="" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Search;
