// App.jsx
import "./App.css";
import { useState, useEffect } from "react";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Support from "./pages/Support";
import History from "./pages/History";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getUserByPhoneNumber, phoneNumber } from "./server";
import Users from "./pages/Users";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserByPhoneNumber(phoneNumber);
        console.log("Fetched user data:", fetchedUser);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          {" "}
          {/* Pass user here */}
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/support" element={<Support />} />
          <Route path="/history" element={<History />} />
          {user &&
            user.admin && ( // Check if user is defined before accessing admin
              <Route path="/users" element={<Users />} />
            )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
