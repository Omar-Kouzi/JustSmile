import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/Item.css";
import Loader from "../components/loader";

const Offer = () => {
  const [offer, setOffer] = useState("");
  const offerId = useParams();
  const [quantity, setQuantity] = useState(0);
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
          id: offer._id,
          quantity: quantity,
          sizeIndex: 0,
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
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
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

            <p>Price: {offer.sizePrice[0].price}$</p>
            <div className="quantityAddToCartButtonContainer">
              <div className="quantityContainer">
                <div>
                  <div
                    className="QuantitySubtract"
                    onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  >
                    <p>-</p>
                  </div>

                  <p className="itemQuantityBox">{quantity}</p>
                  <div
                    className="Quantityadd"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <p>+</p>
                  </div>
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

export default Offer;
