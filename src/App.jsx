import "./App.css";
import Layout from "./layouts/Lauout";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Support from "./pages/Support";
import History from "./pages/History";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/support" element={<Support />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
