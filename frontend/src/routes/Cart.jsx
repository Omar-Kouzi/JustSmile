import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [cartitems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [alert, setAlert] = useState("");
  const itemID = useParams();
  useEffect(() => {
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
    fetchCart();
  }, []);

  // useEffect(() => {
  //   console.log(alert);
  // }, [alert]);

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
            <div className="cartItemDescription">
              <img src={item.image} alt="" />
              <p className="cartItemName">{item.title}</p>
            </div>
            <div className="cartItemQuantityEdit">
              <p>-</p>
              <p className="cartItemQuantity">{item.quantity}</p>
              <p>+</p>
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
            
          <button>Order Cart</button>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
