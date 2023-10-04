import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../Styles/Item.css";

const DashboardItem = () => {
  const [item, setItem] = useState(null);
  const [categories, setCategories] = useState([]); // State for categories
  const [alert, setAlert] = useState("");
  const [valid, setValid] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    flavor: "",
    price: "",
    category: "", // Use a select input for category
    ingredients: "",
    image: null,
    available: true, // Use a select input for available
  });
  const itemID = useParams();

  const fetchItem = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/items/${itemID.id}`
      );
      setItem(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // Fetch Categories function
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`https://justsmilebackend.onrender.com/category`);
      setCategories(response.data.categories);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchItem();
    fetchCategories(); 

    let timer;
    if (valid) {
      timer = setTimeout(() => {
        setValid(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [valid, itemID.id]);

  const handleItemChange = (e) => {
    if (e.target.name === "image" && e.target.files.length > 0) {
      setNewItem({
        ...newItem,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setNewItem({
        ...newItem,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handlePatchItem = async () => {
    const formData = new FormData();
    formData.append("image", newItem.image || item.image);
    formData.append("title", newItem.title || item.title);
    formData.append("description", newItem.description || item.description);
    formData.append("flavor", newItem.flavor || item.flavor);
    formData.append("price", newItem.price || item.price);
    formData.append("category", newItem.category || item.category);
    formData.append(
      "ingredients",
      newItem.ingredients || item.ingredients.join(", ")
    );
    formData.append("available", newItem.available || item.available);
    formData.append("id", itemID.id);

    try {
      const res = await axios.patch(`https://justsmilebackend.onrender.com/items/`, formData, {
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchItem();

      if (res.data.message) {
        setUpdateSuccess(true);
        setValid(true);
        setAlert(res.data.message);
      } else {
        setUpdateSuccess(true);
        setValid(true);
        setAlert("Item updated successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />

      <div>
        {item ? (
          <div className="item dashbaordItem">
            <div>
               <img src={item.image} alt="item" />
            <input
              type="file"
              name="image"
              onChange={handleItemChange}
              accept="image/*"
            />
            </div>
           
            <div className="itemContent dashboardItemContent">
              {valid && (
                <i
                  className={
                    updateSuccess ? "SuccessMessageItemUpdate" : "ErrorMessageItemUpdate"
                  }
                >
                  {alert}
                </i>
              )}
              <div>
                <h4>Title</h4>
                <textarea
                  name="title"
                  value={newItem.title || item.title}
                  onChange={handleItemChange}
                />
              </div>
              <div>
                <h4>Description</h4>
                <textarea
                  name="description"
                  value={newItem.description || item.description}
                  onChange={handleItemChange}
                />
              </div>
              <div>
                <h4>Flavor</h4>
                <textarea
                  name="flavor"
                  value={newItem.flavor || item.flavor}
                  onChange={handleItemChange}
                />
              </div>
              <div>
                <h4>Price</h4>
                <textarea
                  name="price"
                  value={newItem.price || item.price}
                  onChange={handleItemChange}
                />
              </div>
              <div>
                <h4>Category</h4>
                <select
                  name="category"
                  value={newItem.category || item.category}
                  onChange={handleItemChange}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ingredientsContainer">
                <h4>Ingredients:</h4>
                <textarea
                  name="ingredients"
                  value={newItem.ingredients || item.ingredients.join(", ")}
                  onChange={handleItemChange}
                />
              </div>
              <div>
                <h4>Available</h4>
                <select
                  name="available"
                  value={newItem.available || item.available}
                  onChange={handleItemChange}
                >
                  <option value={true}>True</option>
                  <option value={false}>False</option>
                </select>
              </div>
              <button onClick={() => handlePatchItem()}>Update Item</button>
            </div>
          </div>
        ) : (
          <p>Loading item data...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DashboardItem;
