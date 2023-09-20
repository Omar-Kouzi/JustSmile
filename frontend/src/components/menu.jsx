import React, { useState, useEffect } from "react";
import "../Styles/menu.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import {AiOutlineShoppingCart} from "react-icons/ai"
import { NavLink } from "react-router-dom";
const SmMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <ul>
            <li>
              <NavLink to="/" onClick={closeMenu}>
                <h2>Home</h2>
              </NavLink>
            </li>
            <li>
              <NavLink to="/items" onClick={closeMenu}>
                <h2>Items</h2>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" onClick={closeMenu}>
                <h2>Cart </h2>
                <AiOutlineShoppingCart className="headerCartIcon" />
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmMenu;
