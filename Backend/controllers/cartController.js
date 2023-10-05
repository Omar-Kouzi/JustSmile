import CartModel from "../models/cartModel.js";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";
import Offer from "../models/offersModel.js";

const addToCart = async (req, res) => {
  try {
    const { id, quantityML, quantityL } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({ message: "user not found" });
    }

    if (!userId) {
      return res.status(200).json({ message: "Unauthorized" });
    }

    const item = (await Offer.findById(id)) || (await Item.findById(id));

    if (!item) {
      return res.status(200).json({ message: "item not found" });
    }

    const quantityLNum = parseInt(quantityL);
    const quantityMLNum = parseInt(quantityML);

    if (
      (isNaN(quantityLNum) || quantityLNum <= 0) &&
      (isNaN(quantityMLNum) || quantityMLNum <= 0)
    ) {
      return res.status(200).json({ message: "Invalid quantity L" });
    }

    const LtotalPrice = quantityLNum * item.Lprice;
    const MLtotalPrice = quantityMLNum * item.MLprice;
    const totalPrice = LtotalPrice + MLtotalPrice;
    const totalQuantity = quantityLNum + quantityMLNum;

    const cart = await CartModel.findOne({ user: userId }).populate("items");

    if (!cart) {
      const newCart = await CartModel.create({
        user: userId,
        items: [
          {
            _id: item._id,
            image: item.image,
            title: item.title,
            Lprice: item.Lprice,
            MLprice: item.MLprice,
            MLquantity: quantityMLNum,
            Lquantity: quantityLNum,
            totalPriceL: LtotalPrice,
            totalPriceML: MLtotalPrice,
          },
        ],
        totalPrice: totalPrice,
        totalQuantity: totalQuantity,
      });
      return res.status(201).json(newCart);
    }

    const existingItemIndex = cart.items.findIndex(
      (items) => items.title == item.title
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].MLquantity += quantityMLNum;
      cart.items[existingItemIndex].Lquantity += quantityLNum;
      cart.items[existingItemIndex].totalPriceL += LtotalPrice;
      cart.items[existingItemIndex].totalPriceML += MLtotalPrice;
    } else {
      cart.items.push({
        _id: item._id,
        image: item.image,
        title: item.title,
        Lprice: item.Lprice,
        MLprice: item.MLprice,
        MLquantity: quantityMLNum,
        Lquantity: quantityLNum,
        totalPriceL: LtotalPrice,
        totalPriceML: MLtotalPrice,
      });
    }

    cart.totalPrice += totalPrice;
    cart.totalQuantity += totalQuantity;
    await cart.save();

    return res.status(200).json({ cart, success: true });
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


// const decreaseQuantity = async (req, res) => {
//   try {
//     const { itemId } = req.params;
//     const userId = req.user ? req.user._id : undefined;
//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const cart = await CartModel.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) => item._id.toString() === itemId
//     );

//     if (itemIndex < 0) {
//       return res.status(404).json({ message: "Item not found in cart" });
//     }

//     const item = cart.items[itemIndex];

//     if (item.quantity > 1) {
//       item.quantity -= 1;
//       item.totalPrice -= item.price;
//       cart.totalPrice -= item.price;
//       await updateTotalQuantity(cart);
//       await cart.save();
//       return res.status(200).json(cart);
//     } else if (item.quantity === 1) {
//       // Remove the item from the cart
//       cart.items.splice(itemIndex, 1);
//       cart.totalPrice -= item.price;
//       await updateTotalQuantity(cart);
//       await cart.save();
//       return res.status(200).json(cart);
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Cannot decrease quantity below 1" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

//================

const updateQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { MLquantity, Lquantity } = req.body;
    const userId = req.user ? req.user._id : undefined;
    console.log(req.body);
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
    console.log(item);
    // Ensure MLquantity and Lquantity are valid numbers
    const MLquantityNum = parseInt(MLquantity);
    const LquantityNum = parseInt(Lquantity);
    console.log(MLquantityNum, LquantityNum);
    if (
      (isNaN(LquantityNum) || LquantityNum <= 0) &&
      (isNaN(MLquantityNum) || MLquantityNum <= 0)
    ) {
      return res.status(200).json({ message: "Invalid quantity" });
    }

    // Update the item's quantities and total prices
    item.MLquantity = MLquantityNum;
    item.Lquantity = LquantityNum;

    // Recalculate the cart's total price and quantity
    const newCart = await cart.save();
    await updateTotalQuantity(cart);
    await updateTotalPrice(cart);
    console.log(cart);
    return res.status(200).json(newCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//================

const updateTotalQuantity = async (cart) => {
  let totalQuantity = 0;
  for (let i = 0; i < cart.items.length; i++) {
    console.log(cart.items[i].MLquantity);
    totalQuantity =
      cart.items[i].Lquantity + cart.items[i].MLquantity + totalQuantity;
  }
  console.log(totalQuantity);
  cart.totalQuantity = totalQuantity;
  await cart.save();
};
const updateTotalPrice = async (cart) => {
  try {
    let totalPrice = 0;

    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      const itemLTotalPrice = item.Lquantity * item.Lprice;
      const itemMLTotalPrice = item.MLquantity * item.MLprice;
      totalPrice += itemLTotalPrice + itemMLTotalPrice;
    }

    cart.totalPrice = totalPrice;
    await cart.save();

    console.log(`Updated cart total price to ${totalPrice}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
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
  updateQuantity,
  clearCart,
};
