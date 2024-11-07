import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";

const Layout = ({ user }) => {
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Retrieve phone number from URL parameters and store it in cookies
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get("phoneNumber");
    setPhone(phoneNumber);
    if (phoneNumber && !localStorage.getItem("phoneNumber")) {
      localStorage.setItem("phoneNumber", phoneNumber, { path: "/" });
      // window.location.reload();
      // navigate("/", { replace: true }); // Clean URL by removing query parameter
    }
  }, []);
  return (
    <>
      <Header user={user} />
      {/* {phone} */}
      <Outlet />
    </>
  );
};

export default Layout;
