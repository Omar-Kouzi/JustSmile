import { Routes, Route } from "react-router-dom";
import Items from "../routes/Items";
import Home from "../routes/Home";
import Contact from "../routes/Contact";
import Login from "../routes/Login";
import Item from "../routes/Item";
import Cart from "../routes/Cart";
import DashboardItem from "../dashbourd/routes/DashboardItem";
import DashboardItems from "../dashbourd/routes/DashboardItems";
import DashboardHome from "../dashbourd/routes/DashboardHome";

function PageRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/items" element={<Items />} />
      <Route exact path="/items/:id" element={<Item />} />
      <Route exact path="/cart" element={<Cart />} />
      <Route exact path="/contact" element={<Contact />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Login />} />
      <Route exact path="/dashboard" element={<Home />} />
      <Route exact path="/dashboard/home" element={<DashboardHome />} />
      <Route exact path="/dashboard/items" element={<DashboardItems />} />
      <Route exact path="/dashboard/items/:id" element={<DashboardItem />} />
    </Routes>
  );
}

export default PageRoutes;
