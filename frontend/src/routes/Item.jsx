import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/loader";

import "../Styles/Item.css";

const Item = () => {
  const [item, setItem] = useState("");
  const [Lquantity, setLQuantity] = useState("0");
  const [MLquantity, setMLQuantity] = useState("0");
  const [alert, setAlert] = useState("");
  const [valid, setValid] = useState(false);
  const [addedToCart, setAddedToCart] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const itemID = useParams();
  const navigate = useNavigate();

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

  const handleAddToCart = async () => {
    if (!secureLocalStorage.getItem("token")) {
      console.log(!secureLocalStorage.getItem("token"));
      navigate("/login");
    }
    try {
      const res = await axios.post(
        "https://justsmilebackend.onrender.com/cart",
        {
          id: itemID.id,
          quantityL: Lquantity,
          quantityML: MLquantity,

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

  const fetchData = async () => {
    const startTime = Date.now();

    try {
      await Promise.all([fetchItem()]);
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
  }, [itemID._id]);

  useEffect(() => {
    let timer;
    if (valid) {
      timer = setTimeout(() => {
        setValid(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [valid]);

  return (
    <>
      <Header />
      {isLoading ? (
        <div className="LoaderWrapper">
          <Loader />
        </div>
      ) : (
        <div className="item">
          <img src={item.image} alt="item" />

          <div className="itemContent">
            {valid && (
              <i
                className={
                  addedToCart ? "SuccessMessageitem" : "ErrorMessageitem"
                }
              >
                {alert}
              </i>
            )}
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div className="ingredientsContainer">
              <h4>Ingredients:</h4>
              <ul>
                {item.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <p>Price: {item.Lprice}$/Liter</p>
              <p>Price: {item.MLprice}$/300ML</p>
            </div>
            <div className="quantityAddToCartButtonContainer">
              <div>
                <div className="quantityContainer">
                  <p>1L bottles</p>
                  <input
                    type="number"
                    onChange={(value) => setLQuantity(value.target.value)}
                  />
                </div>
                <div className="quantityContainer">
                  <p>300ml bottles</p>
                  <input
                    type="number"
                    min="0"
                    onChange={(value) => setMLQuantity(value.target.value)}
                  />
                </div>
              </div>

              <button onClick={() => handleAddToCart()}> Add To cart</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Item;
