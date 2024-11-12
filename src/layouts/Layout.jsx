import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { useEffect } from "react";
import { phoneNumberConst } from "../server";

const Layout = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Retrieve phone number from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const phoneNumber = urlParams.get("phoneNumber");

    // If phone number is missing, add it to the URL
    if (!phoneNumber) {
      urlParams.set("phoneNumber", phoneNumberConst);
      navigate(`${location.pathname}?${urlParams.toString()}`, {
        replace: true,
      });
    }
  }, [location, navigate]);

  return (
    <>
      <Header user={user} />
      <Outlet />
    </>
  );
};

export default Layout;
