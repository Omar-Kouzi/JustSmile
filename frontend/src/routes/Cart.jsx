import React, { useState, useEffect } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../Styles/Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [cartitems, setCartItems] = useState([]);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:1111/cart/`, {
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setCart(response.data);
      setCartItems(response.data.items);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const increaseQuantity = async (item) => {
    try {
      await axios.patch(
        `http://localhost:1111/cart/inc/${item}`,
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
        `http://localhost:1111/cart/dec/${item}`,
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
  const clearCart = async () => {
    try {
      await axios.patch(
        `http://localhost:1111/cart/${cart._id}`,
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
  useEffect(() => {
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
              className="cartItemDescription"
              onClick={() => navigate(`/items/${item._id}`)}
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
              <p>Location</p>
              <input type="text" placeholder="Location" />
            </div>
          </div>

          <button onClick={() => clearCart()}>Order Cart</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
