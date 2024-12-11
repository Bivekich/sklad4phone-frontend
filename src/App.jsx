// App.jsx
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getUserByPhoneNumber } from "./server";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Support from "./pages/Support";
import History from "./pages/History";
import Users from "./pages/Users";
import UserBooking from "./pages/UsersBooking";
import Notifications from "./pages/Notifications";
import Agreement from "./pages/Agreement";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserByPhoneNumber();
        console.log("Fetched user data:", fetchedUser);

        // setUser(fetchedUser);
        setUser(fetchedUser ? fetchedUser : { admin: false });
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
    <ThemeProvider defaultTheme="white" storageKey="vite-ui-theme">
      {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout user={user} />}>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/account" element={<Account user={user} />} />
            <Route path="/support" element={<Support user={user} />} />
            <Route path="/history" element={<History />} />
            <Route
              path="/agreement/:type"
              element={<Agreement user={user} />}
            />
            {user && user.admin && (
              <>
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users-booking" element={<UserBooking />} />
              </>
            )}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
