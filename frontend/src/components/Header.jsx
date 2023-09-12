import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { SlLogout } from "react-icons/sl";
import { RiLoginBoxLine } from "react-icons/ri";
import "../Styles/Header.css";
import secureLocalStorage from "react-secure-storage";

const Header = () => {
  const [activeClass, setActiveClass] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleToggleClass = () => {
    setActiveClass((prevActiveClass) => !prevActiveClass);
  };

  const handleLogout = () => {
    secureLocalStorage.removeItem("token");
    secureLocalStorage.removeItem("id");
    secureLocalStorage.setItem("loggedIn", false);
    setIsLoggedIn(false);
    setActiveClass(false);
  };

  useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    const loggedIn = secureLocalStorage.getItem("loggedIn");

    if (token && loggedIn === true) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <section className={`Header ${activeClass ? "anotherClass" : ""}`}>
      <h1 className="logo">Just Smile</h1>
      <h1 onClick={handleToggleClass}>click</h1>
      <div
        className={` links ${
          activeClass ? "active" : "notactive"
        } headerNavlinks`}
      >
        <NavLink className="headersNavlink" to="/">
          Home
        </NavLink>
        <NavLink className="headersNavlink" to="/items">
          Items
        </NavLink>
        {/* <NavLink className="headersNavlink" to="/contact">Contact</NavLink> */}
        {isLoggedIn ? (
          <p className="headersNavlink" onClick={handleLogout}>
            Logout <SlLogout />
          </p>
        ) : (
          <NavLink className="headersNavlink" to="/login">
            Login <RiLoginBoxLine />
          </NavLink>
        )}
        {isLoggedIn ? (
          <NavLink className="headersNavlink" to="/cart">
            <AiOutlineShoppingCart className="headerCartIcon" />
          </NavLink>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default Header;
