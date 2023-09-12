import CartModel from "../models/cartModel.js";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const { userId } = req.body;
    const user = await User.findById(userId);

    console.log(req.body);

    if (!user) {
      return res.status(200).json({ message: "user not found" });
    }
    if (!userId) {
      return res.status(200).json({ message: "Unauthorized" });
    }
    const item = await Item.findById(id);
    if (!item) {
      return res.status(200).json({ message: "item not found" });
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(200).json({ message: "Invalid quantity" });
    }

    const totalPrice = quantityNum * item.price;
    const cart = await CartModel.findOne({ user: userId }).populate("items");
    if (!cart) {
      const newCart = await CartModel.create({
        user: userId,
        items: [
          {
            image: item.image,
            title: item.title,
            price: item.price,
            quantity: quantityNum,
          },
        ],
        totalPrice: totalPrice,
        totalQuantity: quantityNum,
      });
      return res.status(201).json(newCart);
    }

    const existingItemIndex = cart.items.findIndex(
      (items) => items.title == item.title
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantityNum;
      cart.items[existingItemIndex].totalPrice += totalPrice;
    } else {
      cart.items.push({
        image: item.image,
        title: item.title,
        price: item.price,
        quantity: quantityNum,
        totalPrice: totalPrice,
      });
    }

    cart.totalPrice += totalPrice; // add the new totalPrice to the existing totalPrice of the cart

    cart.totalQuantity = (cart.totalQuantity || 0) + quantityNum; // add the new quantity to the existing totalQuantity of the cart
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//================

const getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : undefined;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await CartModel.findOne({ user: userId }).populate("items");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//================

const decreaseQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user ? req.user._id : undefined;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex < 0) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const item = cart.items[itemIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;
      item.totalPrice -= item.price;
      cart.totalPrice -= item.price;
      await updateTotalQuantity(cart);
      await cart.save();
      return res.status(200).json(cart);
    } else if (item.quantity === 1) {
      // Remove the item from the cart
      cart.items.splice(itemIndex, 1);
      cart.totalPrice -= item.price;
      await updateTotalQuantity(cart);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res
        .status(400)
        .json({ message: "Cannot decrease quantity below 1" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//================

const increaseQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user ? req.user._id : undefined;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex < 0) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const item = cart.items[itemIndex];

    item.quantity += 1;
    item.totalPrice += item.price;
    cart.totalPrice += item.price;
    await updateTotalQuantity(cart);
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//================

const updateTotalQuantity = async (cart) => {
  let totalQuantity = 0;
  for (let i = 0; i < cart.items.length; i++) {
    totalQuantity += cart.items[i].quantity;
  }
  cart.totalQuantity = totalQuantity;
  await cart.save();
};

//================

const clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : undefined;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;
    cart.totalQuantity = 0;
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  addToCart,
  getCart,
  decreaseQuantity,
  clearCart,
  increaseQuantity,
};
