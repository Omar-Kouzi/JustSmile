import React, { useState, useEffect } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { Blurhash } from "react-blurhash";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../Styles/Items.css";
import { useNavigate } from "react-router";
const DashboardItems = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadedImages, setLoadedImages] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [ItemId, setItemId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:1111/items");
        setItems(response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:1111/category");
        setCategories(response.data.categories);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageLoad = (index) => {
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, index]);
  };

  useEffect(() => {
    const storedCategory = secureLocalStorage.getItem("selectedCategory");
    if (storedCategory) {
      setSelectedCategory(storedCategory);
    }
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setExpandedItems([]);
    secureLocalStorage.setItem("selectedCategory", category);
  };

  // const toggleContent = (index) => {
  //   if (expandedItems.includes(index)) {
  //     setExpandedItems((prevExpandedItems) =>
  //       prevExpandedItems.filter((itemIndex) => itemIndex !== index)
  //     );
  //   } else {
  //     setExpandedItems((prevExpandedItems) => [...prevExpandedItems, index]);
  //   }
  // };

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleItemClick = (index) => {
    const ItemId = items[index]._id;
    navigate(`/items/${ItemId}`);
  };
  return (
    <>
      <Header />

      <div>
        <section className="CategoriesBar">
          <div className="CategoriesContainer">
            <p
              className={
                selectedCategory === "all" ? "Category active" : "Category"
              }
              onClick={() => handleCategoryChange("all")}
            >
              All
            </p>
            {categories.map((category, key) => (
              <p
                key={key}
                className={
                  selectedCategory === category._id
                    ? "Category active"
                    : "Category"
                }
                onClick={() => handleCategoryChange(category._id)}
              >
                {category.title}
              </p>
            ))}
          </div>
        </section>
        <section className="Items">
          {filteredItems.map((item, index) => (
            <div className="itemCard" key={index}>
              {!loadedImages.includes(index) && (
                <Blurhash
                  hash={"LEHV6nWB2yk8pyo0adR*.7kCMdnj"}
                  width={200}
                  height={200}
                  resolutionX={32}
                  resolutionY={32}
                  punch={1}
                  style={{ display: "inline-block" }}
                />
              )}
              <img
                src={item.image}
                alt={item.title}
                className="itemImage"
                onLoad={() => handleImageLoad(index)}
              />
              <p className="itemName">{item.title}</p>

              <div>
                <div
                  className={`content ${
                    expandedItems.includes(index) ? "expanded" : ""
                  }`}
                  id={`paragraph-${index}`}
                >
                  {item.description}
                </div>
              </div>
              <p>Price: {item.price}$</p>
              <button
                className="orderButton"
                onClick={() => handleItemClick(index)}
              >
                Show more
              </button>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default DashboardItems;
