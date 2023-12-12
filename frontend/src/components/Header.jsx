// Header.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { NavLink } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { SlLogout } from "react-icons/sl";
import { RiLoginBoxLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import "../Styles/Header.css";
import SmMenu from "./menu";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState("");
  const [userId, setUserId] = useState("");

  const handleLogout = () => {
    secureLocalStorage.removeItem("token");
    secureLocalStorage.removeItem("id");
    secureLocalStorage.setItem("loggedIn", false);
    window.location.reload();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    const loggedIn = secureLocalStorage.getItem("loggedIn");
    if (token && loggedIn === true) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const id = secureLocalStorage.getItem("id");
    setUserId(id);
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `https://justsmilebackend.onrender.com/user/${id}`
          );
          setIsAdmin(response.data.role);
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      };
      fetchUser();
    }
  }, []);

  return (
    <>
      <section className={`Header `}>
        <div className="Header1">
          <h1 className="logo">Just Smile</h1>
          <div className={`links  headerNavlinks`}>
            {isAdmin === "admin" ? (
              <NavLink to="/dashboard/home" className={`headersNavlink `}>
                Dashboard
              </NavLink>
            ) : (
              ""
            )}
            <NavLink to="/" className="headersNavlink">
              Home
            </NavLink>
            <NavLink to="/items" className="headersNavlink">
              Items
            </NavLink>
            {isLoggedIn ? (
              <p onClick={handleLogout} className="headersNavlink">
                Logout <SlLogout />
              </p>
            ) : (
              <NavLink to="/login" className="headersNavlink">
                Login <RiLoginBoxLine />
              </NavLink>
            )}
            {isLoggedIn ? (
              <>
                {" "}
                <NavLink to="/cart" className="headersNavlink">
                  <AiOutlineShoppingCart className="headerCartIcon" />
                </NavLink>
                <NavLink to={`/profile/${userId}`} className="headersNavlink">
                  <CgProfile className="headerIcon" />
                </NavLink>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="sm-menu-container">
          <div className="sm-links">
            <NavLink to="/">
              <h1 className="logo">Just Smile</h1>
            </NavLink>

            <div className="respociveNavIcons">
              {/* {isLoggedIn ? (
                <>
                  <NavLink to={`/profile/${userId}`} className="">
                    <CgProfile className="headerIcon" />
                  </NavLink>
                
                </>
              ) : (
                ""
              )} */}
              <SmMenu className="headerIcon" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
