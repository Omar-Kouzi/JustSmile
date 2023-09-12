import { Routes, Route } from "react-router-dom";
import Items from "../routes/Items";
import Home from "../routes/Home";
import Contact from "../routes/Contact";
import Login from "../routes/Login";
import Item from "../routes/Item";
import Cart from "../routes/Cart";

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
    </Routes>
    
  );
}

export default PageRoutes;
