// App.jsx
import "./App.css";
import { useState, useEffect } from "react";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Support from "./pages/Support";
import History from "./pages/History";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { getUserByPhoneNumber } from "./server";
import Users from "./pages/Users";
import UserBooking from "./pages/UsersBooking";
import Cookies from "universal-cookie";

function App() {
  const cookies = new Cookies();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve phone number from URL parameters and store it in cookies
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get("phoneNumber");

    if (phoneNumber) {
      cookies.set("phoneNumber", phoneNumber, { path: "/" });
      navigate("/", { replace: true }); // Clean URL by removing query parameter
    }

    const fetchUser = async () => {
      try {
        const phone = cookies.get("phoneNumber");
        if (phone) {
          const fetchedUser = await getUserByPhoneNumber(phone);
          console.log("Fetched user data:", fetchedUser);
          setUser(fetchedUser);
        }
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
          <Route path="/" element={<Home user={user} />} />
          <Route path="/account" element={<Account user={user} />} />
          <Route path="/support" element={<Support />} />
          <Route path="/history" element={<History />} />
          {user && user.admin && (
            <>
              <Route path="/users" element={<Users />} />
              <Route path="/users-booking" element={<UserBooking />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
