import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/Cart.css";
import ReactWhatsapp from "react-whatsapp";
import { CSSTransition } from "react-transition-group";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [cartitems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);
  const [userName, setUserName] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const userId = secureLocalStorage.getItem("id");
  const transitionRef = useRef(null);
  const navigate = useNavigate();
  const fetchCart = async () => {
    try {
      const response = await axios.get(`https://justsmilebackend.onrender.com/cart/`, {
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setTotalPrice(response.data.totalPrice);
      setCart(response.data);
      setCartItems(response.data.items);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const increaseQuantity = async (item) => {
    try {
      await axios.patch(
        `https://justsmilebackend.onrender.com/cart/inc/${item}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseQuantity = async (item) => {
    try {
      await axios.put(
        `https://justsmilebackend.onrender.com/cart/dec/${item}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteConfirm = async () => {
    console.log(cart._id);
    try {
      await axios.patch(
        `https://justsmilebackend.onrender.com/cart/${cart._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );
      setShowDeletePopup(false);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };
  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://justsmilebackend.onrender.com/user/${userId}`);
      setUserAddress(response.data.address);
      setUserName(response.data.name);
      setUserPhoneNumber(response.data.phoneNumber);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handlePhoneNumberChange = (e) => {
    setUserPhoneNumber(e.target.value);
  };

  const handleAddressChange = (e) => {
    setUserAddress(e.target.value);
  };

  const Form = `Hi there! Here's the list of items I want to Rent:

  ${cartitems
    .map(
      (item, index) =>
        `${index + 1}. ${item.title} - ${item.quantity} - ${
          item.price
        } USD/Piece `
    )
    .join("\n")}
  
  Please confirm the items in your cart and their respective quantities. If you need to make any changes, please let us know.
  
  To proceed with the purchase, please provide the following details:
  - Your full name: ${userName}
  - Delivery address: ${userAddress}
  - Contact number: ${userPhoneNumber}
  - Total Price: USD ${totalPrice}
  - Payment method: on delivery
  `;
  useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    const loggedIn = secureLocalStorage.getItem("loggedIn");
    if (!token || !loggedIn === true) {
      navigate("/login");
    }

    fetchCart();
  }, []);

  return (
    <>
      <Header />
      <div className="Cart">
        <ul className="cartHeader">
          <li className="cartItemDescriptio">Description</li>
          <li className="cartItemQuantityEdit">Quantity</li>
          <li className="cartItemPrice">Price</li>
        </ul>
        {cartitems.map((item, index) => (
          <div className="cartItem" key={index}>
            <div
              onClick={() => navigate(`/items/${item._id}`)}
              className="cartItemDescription"
            >
              <img src={item.image} alt="" />
              <p className="cartItemName">{item.title}</p>
            </div>
            <div className="cartItemQuantityEdit">
              <p onClick={() => decreaseQuantity(item._id)}>-</p>
              <p className="cartItemQuantity">{item.quantity}</p>
              <p onClick={() => increaseQuantity(item._id)}>+</p>
            </div>
            <p className="cartItemPrice">{item.price}$</p>
          </div>
        ))}
        <div className="cartInfo">
          <div>
            <div>
              <div>
                <p>Total quantity</p>
                <p>{cart.totalQuantity}</p>
              </div>
              <div>
                <p>Total price</p>
                <p>{cart.totalPrice}</p>
              </div>
            </div>

            <div>
              <p>Phone Number</p>
              <input
                type="text"
                placeholder="Phone Number"
                defaultValue={userPhoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>

            <div>
              <p>Address</p>
              <input
                type="text"
                placeholder="Address"
                defaultValue={userAddress}
                onChange={handleAddressChange}
              />
            </div>
          </div>
          <div className="cartButtons">
            <button
              onClick={() => setShowConfirmationDialog(true)}
              className="purchase-button"
            >
              ORDER NOW
            </button>

            <button
              onClick={() => handleDeleteClick()}
              className="clearCartButton"
            >
              Clear Cart
            </button>
          </div>
        </div>{" "}
        {showConfirmationDialog ? (
          <div className="orderPopup">
            <div className="orderPopupContent">
              <h1>Are you sure you want to place the order?</h1>
              <div className="orderPopupButtonsContainer">
                <ReactWhatsapp
                  number="+961 81284452"
                  message={Form}
                  className="orderPopupButtons yes"
                >
                  ORDER NOW
                </ReactWhatsapp>
                <button
                  className="orderPopupButtons no"
                  onClick={() => setShowConfirmationDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <CSSTransition
          in={showDeletePopup}
          timeout={300}
          classNames="deletePopup"
          unmountOnExit
          nodeRef={transitionRef} // Assign the ref here
        >
          <div className="deletePopup" ref={transitionRef}>
            <div className="deletePopupContent">
              <h1>Are you sure you want to clear your cart?</h1>
              <div className="deletePopupButtonsContainer">
                <button
                  className="deletePopupButtons yes"
                  onClick={handleDeleteConfirm}
                >
                  Yes
                </button>
                <button
                  className="deletePopupButtons no"
                  onClick={handleDeleteCancel}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>

      <Footer />
    </>
  );
};

export default Cart;