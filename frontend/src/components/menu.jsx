import React, { useState, useEffect } from "react";
import "../Styles/menu.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { SlLogout } from "react-icons/sl";
import { RiLoginBoxLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const SmMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userId = secureLocalStorage.getItem("id");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleLogout = () => {
    secureLocalStorage.removeItem("token");
    secureLocalStorage.removeItem("id");
    secureLocalStorage.setItem("loggedIn", false);
    setIsLoggedIn(false);
  };
  useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    const loggedIn = secureLocalStorage.getItem("loggedIn");
    if (token && loggedIn === true) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="sm-menu-container">
      <div onClick={toggleMenu}>
        {isOpen ? (
          <RxCross2 className="hamburger" />
        ) : (
          <GiHamburgerMenu className="hamburger" />
        )}
      </div>
      {isOpen && (
        <div className="menu">
          <ul className="menuul">
            <li>
              <NavLink to="/" onClick={closeMenu} className="headersNavlink">
                <h2>Home</h2>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/items"
                onClick={closeMenu}
                className="headersNavlink"
              >
                <h2>Items</h2>
              </NavLink>
            </li>
            <li>
              {isLoggedIn ? (
                <h2 onClick={handleLogout} className="headersNavlink">
                  Logout <SlLogout className="" />
                </h2>
              ) : (
                <NavLink to="/login" className="headersNavlink">
                  <h2> Login</h2> <RiLoginBoxLine />
                </NavLink>
              )}
            </li>{" "}
            <li>
              {isLoggedIn ? (
                <NavLink
                  to="/cart"
                  className="headersNavlink headersNavlinkCart"
                >
                  <h2>Cart</h2>
                  <AiOutlineShoppingCart className="" />
                </NavLink>
              ) : (
                ""
              )}
            </li>
            <li>
              {isLoggedIn ? (
                <>
                  <NavLink to={`/profile/${userId}`} className="headersNavlink">
                    <h2>Profile </h2>
                    <CgProfile className="" />
                  </NavLink>
                </>
              ) : (
                ""
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmMenu;
