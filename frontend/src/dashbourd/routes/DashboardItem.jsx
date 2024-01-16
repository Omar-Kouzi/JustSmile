import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../../components/Header";
import DashboardHeader from "../components/DashbaordHeader";
import Footer from "../../components/Footer";
import Loader from "../../components/loader";

import "../../Styles/Item.css";

const DashboardItem = () => {
  const [item, setItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [alert, setAlert] = useState("");
  const [valid, setValid] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    flavor: "",
    sizePrice: [{ size: "", price: "" }],
    category: "",
    ingredients: "",
    image: null,
    available: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const itemID = useParams();

  const fetchItem = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/items/${itemID.id}`
      );
      setItem(response.data);
      setNewItem((prevItem) => ({
        ...prevItem,
        sizePrice: response.data.sizePrice,
      }));
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/category`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const handleItemChange = (e, index) => {
    if (e.target.name === "image" && e.target.files.length > 0) {
      setNewItem({
        ...newItem,
        [e.target.name]: e.target.files[0],
      });
    } else {
      const { name, value } = e.target;

      if (name.startsWith("size") || name.startsWith("price")) {
        const updatedSizes = [...newItem.sizePrice];
        updatedSizes[index][name] = value;

        setNewItem({
          ...newItem,
          sizePrice: updatedSizes,
        });
      } else {
        setNewItem({
          ...newItem,
          [name]: value,
        });
      }
    }
  };

  const handleAddSizePrice = () => {
    setNewItem({
      ...newItem,
      sizePrice: [...newItem.sizePrice, { size: "", price: "" }],
    });
  };

  const handleRemoveSizePrice = (index) => {
    const updatedSizes = [...newItem.sizePrice];
    updatedSizes.splice(index, 1);

    setNewItem({
      ...newItem,
      sizePrice: updatedSizes,
    });
  };

  const handlePatchItem = async () => {
    const formData = new FormData();
    formData.append("image", newItem.image || item.image);
    formData.append("title", newItem.title || item.title);
    formData.append("description", newItem.description || item.description);
    formData.append("flavor", newItem.flavor || item.flavor);
    formData.append("sizePrice", JSON.stringify(newItem.sizePrice));
    formData.append("category", newItem.category || item.category);
    formData.append(
      "ingredients",
      newItem.ingredients || item.ingredients.join(", ")
    );
    formData.append("available", newItem.available || item.available);
    formData.append("id", itemID.id);

    try {
      const res = await axios.patch(
        `https://justsmilebackend.onrender.com/items/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
    } catch (error) {
      console.error(error);
      if(error.response.status === 401){
        secureLocalStorage.removeItem("token");
        secureLocalStorage.removeItem("id");
        secureLocalStorage.setItem("loggedIn", false);
        window.location.reload();
      }
    }
  };

  const fetchData = async () => {
    const startTime = Date.now();

    try {
      await Promise.all([fetchItem(), fetchCategories()]);
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

    let timer;
    if (valid) {
      timer = setTimeout(() => {
        setValid(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [valid, itemID.id]);

  return (
    <>
      <Header />
      <DashboardHeader />
      {isLoading ? (
        <div className="LoaderWrapper">
          <Loader />
        </div>
      ) : (
        <div className="item dashbaordItem">
          <div>
            <img src={item.image} alt="item" />
            <input
              type="file"
              name="image"
              onChange={(e) => handleItemChange(e)}
              accept="image/*"
            />
          </div>

          <div className="itemContent dashboardItemContent">
            {valid && (
              <i
                className={
                  updateSuccess
                    ? "SuccessMessageItemUpdate"
                    : "ErrorMessageItemUpdate"
                }
              >
                {alert}
              </i>
            )}
            <div>
              <h4>Title</h4>
              <input
                name="title"
                value={newItem.title || item.title}
                onChange={(e) => handleItemChange(e)}
                className="dashboardItemInput"
              />
            </div>
            <div>
              <h4>Description</h4>
              <textarea
                name="description"
                value={newItem.description || item.description}
                onChange={(e) => handleItemChange(e)}
                className="dashboardItemInput"
              />
            </div>
            <div>
              <h4>Flavor</h4>
              <input
                name="flavor"
                value={newItem.flavor || item.flavor}
                onChange={(e) => handleItemChange(e)}
                className="dashboardItemInput"
              />
            </div>
            <div className="ingredientsContainer">
              <h4>Ingredients:</h4>
              <input
                name="ingredients"
                value={newItem.ingredients || item.ingredients.join(", ")}
                onChange={(e) => handleItemChange(e)}
                className="dashboardItemInput"
              />
            </div>
            <div className="sizeAndPrice">
              <h4>Size & Price</h4>
              {newItem.sizePrice.map((sizePrice, index) => (
                <div className="sizePriceItem" key={index}>
                  <div className="sizePriceItemInput">
                    <input
                      type="text"
                      placeholder="Size"
                      name={`size${index}`}
                      defaultValue={sizePrice.size}
                      onChange={(e) => handleItemChange(e, index)}
                      className="dashboardItemInput"
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      name={`price${index}`}
                      defaultValue={sizePrice.price}
                      onChange={(e) => handleItemChange(e, index)}
                      className="dashboardItemInput"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSizePrice(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddSizePrice}>
                Add Size/Price
              </button>
            </div>{" "}
            <div>
              <h4>Category</h4>
              <select
                name="category"
                value={newItem.category || item.category}
                onChange={(e) => handleItemChange(e)}
                className="dashboardItemInput"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h4>Available</h4>
              <select
                name="available"
                value={newItem.available || item.available}
                onChange={(e) => handleItemChange(e)}
                className="dashboardItemInput"
              >
                <option value={true}>True</option>
                <option value={false}>False</option>
              </select>
            </div>
            <button onClick={() => handlePatchItem()}>Update Item</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default DashboardItem;
