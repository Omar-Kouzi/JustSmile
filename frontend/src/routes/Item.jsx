import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/Item.css";

const Item = () => {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [alert, setAlert] = useState("");
  const [valid, setValid] = useState(false);
  const [addedToCart, setAddedToCart] = useState("");

  const itemID = useParams();
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchItem();
  }, [itemID.id]);

  const handleAddToCart = async () => {
    if (!secureLocalStorage.getItem("token")) {
      console.log(!secureLocalStorage.getItem("token"));
      navigate("/login");
    }
    try {
      const res = await axios.post(
        "https://justsmilebackend.onrender.com/cart",
        {
          id: itemID.id, // Use itemID.id instead of an object
          quantity: quantity,
          userId: secureLocalStorage.getItem("id"),
        },
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.message) {
        setAddedToCart(res.data.success);
        setValid(true);
        setAlert(res.data.message);
      } else {
        setAddedToCart(res.data.success);
        setValid(true);
        setAlert("Item added to cart successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let timer;
    if (valid) {
      timer = setTimeout(() => {
        setValid(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [valid]);

  return (
    <>
      <Header />

      <div>
        {item ? (
          <div className="item">
            <img src={item.image} alt="item" />

            <div className="itemContent">
              {valid && (
                <i
                  className={
                    addedToCart ? "SuccessMessageLogin" : "ErrorMessageLogin"
                  }
                >
                  {alert}
                </i>
              )}
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <div className="ingredientsContainer">
                <h3>Ingredients:</h3>
                <ul>
                  {item.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <p>Price: {item.price}$</p>
              <div className="quantityAddToCartButtonContainer">
                <input
                  type="number"
                  placeholder="Quantity"
                  onChange={(value) => setQuantity(value.target.value)}
                />
                <button onClick={() => handleAddToCart()}> Add To cart</button>
              </div>
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

export default Item;
