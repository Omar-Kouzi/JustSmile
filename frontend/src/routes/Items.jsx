import React, { useState, useEffect } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/Items.css";
import { useNavigate } from "react-router";
import Loader from "../components/loader";
import { FaFilter } from "react-icons/fa6";
import { CiFilter } from "react-icons/ci";

const Items = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [sortBy, setSortBy] = useState("default"); // "default", "lowToHigh", "highToLow"

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

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const sortedItemsByPrice = () => {
    if (sortBy === "lowToHigh") {
      return sortedItems.sort(
        (a, b) => a.sizePrice[0].price - b.sizePrice[0].price
      );
    } else if (sortBy === "highToLow") {
      return sortedItems.sort(
        (a, b) => b.sizePrice[0].price - a.sizePrice[0].price
      );
    } else {
      return sortedItems;
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

  // Sort items with available ones first
  const sortedItems = [...filteredItems].sort((a, b) =>
    a.available && !b.available ? -1 : b.available && !a.available ? 1 : 0
  );
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

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
            <div onClick={toggleMenu} className="filtericon">
              {isOpen ? (
                <>
                  {" "}
                  <b>filter</b> <CiFilter />
                </>
              ) : (
                <>
                  <b>filter</b> <FaFilter />
                </>
              )}
            </div>
            <div className={isOpen ? "categories" : "closedFilter"}>
              <b>Category :</b>
              <div className="CategoriesContainer">
                {" "}
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

              <div className="SortContainer">
                <label htmlFor="sortBy">
                  <b> Sort By:</b>
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="SortSelect"
                >
                  <option value="default">Default</option>
                  <option value="lowToHigh">Price Low to High</option>
                  <option value="highToLow">Price High to Low</option>
                </select>
              </div>
            </div>
          </section>
          <section className="Items">
            {sortedItemsByPrice().map((item, index) => (
              <div key={index} className="itemCard">
                <img src={item.image} alt={item.title} className="itemImage" />

                <div className="content">
                  {" "}
                  <div className="itemCardTitlePrice">
                    <h4 className="itemName">{item.title} </h4>
                    <h4>{item.sizePrice[0].price} $</h4>
                  </div>
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
