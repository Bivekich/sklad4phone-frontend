import Search from "../components/Search";
import CardList from "../components/Card/CardList";

const Home = ({ user }) => {
  return (
    <>
      <Search />
      <CardList user={user} />
    </>
  );
};

export default Home;
