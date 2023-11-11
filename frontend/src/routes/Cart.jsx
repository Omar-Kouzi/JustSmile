import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/Cart.css";
import ReactWhatsapp from "react-whatsapp";
import { CSSTransition } from "react-transition-group";
import Loader from "../components/loader";
import { BsTrash } from "react-icons/bs";
const Cart = () => {
  const [cart, setCart] = useState([]);
  const [cartitems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);
  const [userName, setUserName] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [quantity, setNewQuantity] = useState("0");
  const userId = secureLocalStorage.getItem("id");
  const [isLoading, setIsLoading] = useState(true);

  const transitionRef = useRef(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/cart/`,
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setTotalPrice(response.data.totalPrice);
      setCart(response.data);
      setCartItems(response.data.items);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const updatedQuantity = async (itemId, quantity, sizeIndex) => {
    try {
      const response = await axios.patch(
        `https://justsmilebackend.onrender.com/cart/qty/${itemId}`,
        {
          quantity: quantity,
          sizeIndex: sizeIndex, // Pass the size index to the API
        },
        {
          headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.patch(
        `https://justsmilebackend.onrender.com/cart`,
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
  const handleRemoveItem = async (id) => {
    try {
      await axios.patch(
        `https://justsmilebackend.onrender.com/cart/${id}`,
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

  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `https://justsmilebackend.onrender.com/user/${userId}`
      );
      setUserAddress(response.data.address);
      setUserName(response.data.name);
      setUserPhoneNumber(response.data.phoneNumber);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handlePhoneNumberChange = (e) => {
    setUserPhoneNumber(e.target.value);
  };

  const handleAddressChange = (e) => {
    setUserAddress(e.target.value);
  };

  const Form = `Hi there! Here's the list of items I'm ordering:

  ${
    cartitems.length > 0
      ? cartitems
          .map(
            (item, index) =>
              `${index + 1}. ${item.title} - ${item.sizePrice[0].quantity} x ${
                item.sizePrice[0].size
              } - $${item.sizePrice[0].price} USD/Piece\n`
          )
          .join("")
      : "Your cart is empty"
  }
    
  Please confirm the items in your cart and their respective quantities. If you need to make any changes, please let us know.
  
  To proceed with the purchase, please provide the following details:
  - Your full name: ${userName}
  - Delivery address: ${userAddress}
  - Contact number: ${userPhoneNumber}
  - Total Price: USD ${totalPrice}
  - Payment method: on delivery
  `;

  const fetchData = async () => {
    const startTime = Date.now();

    try {
      const token = secureLocalStorage.getItem("token");
      const loggedIn = secureLocalStorage.getItem("loggedIn");
      if (!token || !loggedIn === true) {
        navigate("/login");
      }

      fetchCart();
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
    fetchUser();
  }, []);

  return (
    <>
      <Header />
      {isLoading ? (
        <div className="LoaderWrapper">
          <Loader />
        </div>
      ) : (
        <div className="Cart">
          <div>
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
                </div>{" "}
                <div>
                  {item.sizePrice.map((size, index) => (
                    <div key={index} className="cartItemQuantityEdit">
                      <p>{size.size}</p>
                      <input
                        type="number"
                        defaultValue={size.quantity}
                        className="cartItemQuantity"
                        onChange={(e) => setNewQuantity(e.target.value)}
                        onBlur={() =>
                          updatedQuantity(item._id, quantity, index)
                        }
                      />
                    </div>
                  ))}
                </div>{" "}
                <button
                  className="removeItemCart"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  <BsTrash className="removeItemIcon" />
                </button>
                <div>
                  {" "}
                  {item.sizePrice.map((size, index) => (
                    <div key={index}>
                      <p className="cartItemPrice">
                        {size.price}$/{size.size}
                      </p>
                    </div>
                  ))}
                </div>{" "}
              </div>
            ))}
          </div>
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
              {cartitems.length > 0 ? (
                <>
                  {userAddress.trim() !== "" ? (
                    <button
                      onClick={() => setShowConfirmationDialog(true)}
                      className="purchase-button"
                    >
                      ORDER NOW
                    </button>
                  ) : (
                    <p>
                      Please enter your delivery address before placing an order
                    </p>
                  )}
                </>
              ) : (
                <p>Can't order with an empty cart</p>
              )}
              {cartitems.length > 0 ? (
                <button
                  onClick={() => handleDeleteClick()}
                  className="clearCartButton"
                >
                  Clear Cart
                </button>
              ) : (
                <p></p>
              )}
            </div>
          </div>
          {showConfirmationDialog ? (
            <div className="orderPopup">
              <div className="orderPopupContent">
                <h3>Are you sure you want to place the order?</h3>
                <div className="orderPopupButtonsContainer">
                  <ReactWhatsapp
                    number="+961 81284452"
                    message={Form}
                    className="deletePopupButtons yes"
                  >
                    Order
                  </ReactWhatsapp>
                  <button
                    className="deletePopupButtons no"
                    onClick={() => setShowConfirmationDialog(false)}
                  >
                    No
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
                <h3>Are you sure you want to clear your cart?</h3>
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
      )}
      <Footer />
    </>
  );
};

export default Cart;
