import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/Item.css";

const Offer = () => {
  const [offer, setOffer] = useState("");
  const offerId = useParams();
  const [quantity, setQuantity] = useState("");
  const [alert, setAlert] = useState("");
  const [valid, setValid] = useState(false);
  const [addedToCart, setAddedToCart] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const fetchOffer = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/offer/${offerId.id}`
      );
      setOffer(response.data);
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
          id: offerId.id,
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
  const fetchData = async () => {
    const startTime = Date.now();

    try {
      await Promise.all([fetchOffer()]);
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
  }, [valid, offerId.id]);

  return (
    <>
      <Header />

      {isLoading ? (
        <div className="LoaderWrapper">
          <Loader />
        </div>
      ) : (
        <div className="item">
          <img src={offer.image} alt="item" />

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
            <h2>{offer.title}</h2>
            <p>{offer.description}</p>

            <p>Price: {offer.price}$</p>
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
      )}

      <Footer />
    </>
  );
};

export default Offer;
