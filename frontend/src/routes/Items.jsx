import React, { useState, useEffect } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/Items.css";
import { useNavigate } from "react-router";
import Loader from "../components/loader";

const Items = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        "https://justsmilebackend.onrender.com/items"
      );
      setItems(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://justsmilebackend.onrender.com/category"
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };



  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    secureLocalStorage.setItem("selectedCategory", category);
  };

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleItemClick = (ItemId) => {
    navigate(`/items/${ItemId}`);
  };
  const fetchData = async () => {
    const startTime = Date.now();

    try {
      await Promise.all([fetchCategories(), fetchItems()]);
      const elapsedTime = Date.now() - startTime;
      const minimumDuration = 3000;

      if (elapsedTime < minimumDuration) {
        setTimeout(() => {
          setIsLoading(false);
        }, minimumDuration - elapsedTime);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedCategory = secureLocalStorage.getItem("selectedCategory");
    if (storedCategory) {
      setSelectedCategory(storedCategory);
    }
    fetchData();
  }, []);
  return (
    <>
      <Header />
      {isLoading ? (
        <div className="LoaderWrapper">
          <Loader />
        </div>
      ) : (
        <div>
          <section className="CategoriesBar">
            <div className="CategoriesContainer">
              <p
                onClick={() => handleCategoryChange("all")}
                className={
                  selectedCategory === "all" ? "Category active" : "Category"
                }
              >
                All
              </p>
              {categories.map((category, key) => (
                <p
                  key={key}
                  onClick={() => handleCategoryChange(category._id)}
                  className={
                    selectedCategory === category._id
                      ? "Category active"
                      : "Category"
                  }
                >
                  {category.title}
                </p>
              ))}
            </div>
          </section>
          <section className="Items">
            {filteredItems.map((item, index) => (
              <div key={index} className="itemCard">
                <img src={item.image} alt={item.title} className="itemImage" />

                <div className="content">
                  {" "}
                  <h4 className="itemName">{item.title}</h4>
                  <div className="recommendedDescription">
                    {item.description}
                  </div>
                  {item.available ? (
                    <button
                      onClick={() => handleItemClick(item._id)}
                      className="orderButton"
                    >
                      Show more
                    </button>
                  ) : (
                    <p className="orderButton-Unavailable">Item Unavailable</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Items;
