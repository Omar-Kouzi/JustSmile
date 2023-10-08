import React, { useState, useEffect } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../dashbaordStyles/DashboardItems.css";
import { useNavigate } from "react-router";
import DashboardHeader from "../components/DashbaordHeader";
import Loader from "../../components/loader";

const DashboardItems = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    ingredients: "",
    MLprice: "",
    Lprice: "",
    flavor: "",
    category: "",
    image: null,
    available: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

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
  const handledeleteItem = async (itemId) => {
    try {
      const response = await axios.delete(
        `https://justsmilebackend.onrender.com/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );
      fetchItems();
    } catch (error) {
      console.log("Error fetching categories:", error);
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
    navigate(`/dashboard/items/${ItemId}`);
  };

  const handleItemChange = (e) => {
    if (e.target.name === "image" && e.target.files.length > 0) {
      setNewItem({
        ...newItem,
        image: e.target.files[0],
      });
    } else {
      const { name, value } = e.target;
      setNewItem({
        ...newItem,
        [name]: value,
      });
    }
  };
  const handlePostItem = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newItem.title);
    formData.append("description", newItem.description);
    formData.append("ingredients", newItem.ingredients);
    formData.append("Lprice", newItem.Lprice);
    formData.append("MLprice", newItem.MLprice);
    formData.append("flavor", newItem.flavor);
    formData.append("category", newItem.category);
    formData.append("image", newItem.image);
    formData.append("availabe", newItem.available);
    formData.append("userId", secureLocalStorage.getItem("id"));

    try {
      const response = await axios.post(
        "https://justsmilebackend.onrender.com/items/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      fetchItems();
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const fetchData = async () => {
    const startTime = Date.now();

    try {
      await Promise.all([
        fetchItems(),
        fetchCategories(),
      ]);
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
    fetchData();

    const storedCategory = secureLocalStorage.getItem("selectedCategory");
    if (storedCategory) {
      setSelectedCategory(storedCategory);
    }
  }, []);
  return (
    <>
      <Header />
      
      <DashboardHeader />{" "}
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
            <form action="#" className="itemCardform">
              <div className="itemFormInputs">
                <div className="barJuiceItemFormInput-field">
                  <p>Title</p>
                  <input
                    className="dashboardItemInput"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="title"
                    onChange={(e) => {
                      handleItemChange(e);
                    }}
                  />
                </div>
                <div className="barJuiceItemFormInput-field">
                  <p>Description</p>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="description"
                    onChange={(e) => {
                      handleItemChange(e);
                    }}
                    className="dashboardItemInput"
                  />
                </div>
                <div className="barJuiceItemFormInput-field">
                  <p>Ingredients</p>
                  <input
                    type="text"
                    id="ingredients"
                    name="ingredients"
                    placeholder="ingredients"
                    onChange={(e) => {
                      handleItemChange(e);
                    }}
                    className="dashboardItemInput"
                  />
                </div>
                <div className="barJuiceItemFormInput-field">
                  <p>Flavor</p>
                  <input
                    type="text"
                    id="flavor"
                    name="flavor"
                    placeholder="flavor"
                    onChange={(e) => {
                      handleItemChange(e);
                    }}
                    className="dashboardItemInput"
                  />
                </div>
                <div className="barJuiceItemFormInput-field">
                  <p>LPrice</p>
                  <input
                    type="text"
                    placeholder="Lprice"
                    name="Lprice"
                    onChange={(e) => {
                      handleItemChange(e);
                    }}
                    className="dashboardItemInput"
                  />
                </div>{" "}
                <div className="barJuiceItemFormInput-field">
                  <p>MLPrice</p>
                  <input
                    type="text"
                    placeholder="MLprice"
                    name="MLprice"
                    onChange={(e) => {
                      handleItemChange(e);
                    }}
                    className="dashboardItemInput"
                  />
                </div>
                <select
                  id="itemSelect"
                  name="category"
                  onChange={(e) => {
                    handleItemChange(e);
                  }}
                  className="dashboardItemInput"
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                <div className="barJuiceItemFormInput-field">
                  <p>Image</p>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={(e) => {
                      handleItemChange(e);
                    }}
                  />
                </div>
              </div>
              <div className="">
                <input
                  type="submit"
                  value="Post a Item"
                  onClick={(e) => handlePostItem(e)}
                />
              </div>
            </form>
            {filteredItems.map((item, index) => (
              <div key={index} className="itemCard">
                <img src={item.image} alt={item.title} className="itemImage" />

                <div className="content">
                  {" "}
                  <h4 className="itemName">{item.title}</h4>
                  <div className="recommendedDescription">
                    {item.description}
                  </div>
                  <button
                    className="dashboardItemDeleteButton"
                    onClick={() => handledeleteItem(item._id)}
                  >
                    delete
                  </button>
                  <button
                    onClick={() => handleItemClick(item._id)}
                    className="orderButton"
                  >
                    Show more
                  </button>
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

export default DashboardItems;
