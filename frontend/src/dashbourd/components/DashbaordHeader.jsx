import React, { useEffect, useState } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { NavLink, useNavigate } from "react-router-dom";
import "../../Styles/Header.css";

const DashboardHeader = () => {
  const [activeClass, setActiveClass] = useState(false);
  const [isAdmin, setIsAdmin] = useState("");
  const navigate = useNavigate();

  const handleToggleClass = () => {
    setActiveClass((prevActiveClass) => !prevActiveClass);
  };
  useEffect(() => {
    const id = secureLocalStorage.getItem("id");
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://justsmilebackend.onrender.com/user/${id}`);
        setIsAdmin(response.data.role);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    if (!isAdmin === "admin") {
      navigate("/login");
    }
    fetchUser();
  }, []);
  return (
    <>
      <section className={`Header ${activeClass ? "anotherClass" : ""}`}>
        <div onClick={handleToggleClass}></div>

        <div className="Header1">
          <div
            className={` links ${
              activeClass ? "active" : "notactive"
            } headerNavlinks`}
          >
            <NavLink to="/dashboard/home" className="headersNavlink">
              Home
            </NavLink>
            <NavLink to="/dashboard/items" className="headersNavlink">
              Items
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardHeader;
