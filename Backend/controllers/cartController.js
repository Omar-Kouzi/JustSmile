import CartModel from "../models/cartModel.js";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";
import Offer from "../models/offersModel.js";
const addToCart = async (req, res) => {
  try {
    const { id, quantity, sizeIndex } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    if (!userId) {
      return res.status(200).json({ message: "Unauthorized" });
    }

    const item = (await Offer.findById(id)) || (await Item.findById(id));

    if (!item) {
      return res.status(200).json({ message: "Item not found" });
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(200).json({ message: "Invalid quantity" });
    }

    const sizePrice = item.sizePrice[sizeIndex];

    if (!sizePrice) {
      return res.status(200).json({ message: "Size not found for the item" });
    }

    const totalPrice = sizePrice.price * quantityNum;

    const cart = await CartModel.findOne({ user: userId }).populate("items");

    if (!cart) {
      // If the user's cart does not exist, create a new cart.
      const newCart = await CartModel.create({
        user: userId,
        items: [
          {
            _id: item._id,
            image: item.image,
            title: item.title,
            sizePrice: [
              {
                size: sizePrice.size,
                price: sizePrice.price,
                quantity: quantityNum,
              },
            ],
            totalQuantity: quantityNum, // Set totalQuantity for the single item
          },
        ],
        totalPrice: totalPrice,
        totalQuantity: quantityNum, // Set totalQuantity for the cart
      });
      return res.status(201).json(newCart);
    }

    let updatedTotalQuantity = 0;

    for (const cartItem of cart.items) {
      for (const sizePrice of cartItem.sizePrice) {
        updatedTotalQuantity += sizePrice.quantity;
      }
    }

    const existingItemIndex = cart.items.findIndex(
      (cartItem) => cartItem.title === item.title
    );

    if (existingItemIndex >= 0) {
      const existingSizePriceIndex = cart.items[
        existingItemIndex
      ].sizePrice.findIndex((size) => size.size === sizePrice.size);

      if (existingSizePriceIndex >= 0) {
        cart.items[existingItemIndex].sizePrice[
          existingSizePriceIndex
        ].quantity += quantityNum;
      } else {
        cart.items[existingItemIndex].sizePrice.push({
          size: sizePrice.size,
          price: sizePrice.price,
          quantity: quantityNum,
        });
      }

      // Update the totalQuantity for the existing item.
      cart.items[existingItemIndex].totalQuantity = cart.items[
        existingItemIndex
      ].sizePrice.reduce((acc, sizePrice) => acc + sizePrice.quantity, 0);
    } else {
      cart.items.push({
        _id: item._id,
        image: item.image,
        title: item.title,
        sizePrice: [
          {
            size: sizePrice.size,
            price: sizePrice.price,
            quantity: quantityNum,
          },
        ],
        totalQuantity: quantityNum, // Set totalQuantity for the new item
      });
    }

    await cart.save();

    return res.status(200).json({ cart, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// const addToCart = async (req, res) => {
//   try {
//     const { id, quantity, sizeIndex } = req.body;
//     const userId = req.user.id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(200).json({ message: "User not found" });
//     }

//     if (!userId) {
//       return res.status(200).json({ message: "Unauthorized" });
//     }

//     const item = (await Offer.findById(id)) || (await Item.findById(id));

//     if (!item) {
//       return res.status(200).json({ message: "Item not found" });
//     }

//     const quantityNum = parseInt(quantity);
//     if (isNaN(quantityNum) || quantityNum <= 0) {
//       return res.status(200).json({ message: "Invalid quantity" });
//     }

//     const sizePrice = item.sizePrice[sizeIndex];

//     if (!sizePrice) {
//       return res.status(200).json({ message: "Size not found for the item" });
//     }

//     const totalPrice = sizePrice.price * quantityNum;

//     const cart = await CartModel.findOne({ user: userId }).populate("items");

//     if (!cart) {
//       const newCart = await CartModel.create({
//         user: userId,
//         items: [
//           {
//             _id: item._id,
//             image: item.image,
//             title: item.title,
//             sizePrice: [
//               {
//                 size: sizePrice.size,
//                 price: sizePrice.price,
//                 quantity: quantityNum,
//               },
//             ],
//           },
//         ],
//         totalPrice: totalPrice,
//         totalQuantity: quantityNum,
//       });
//       return res.status(201).json(newCart);
//     }

//     let updatedTotalQuantity = 0;

//     const existingItemIndex = cart.items.findIndex(
//       (cartItem) => cartItem.title === item.title
//     );

//     if (existingItemIndex >= 0) {
//       const existingSizePriceIndex = cart.items[
//         existingItemIndex
//       ].sizePrice.findIndex((size) => size.size === sizePrice.size);

//       if (existingSizePriceIndex >= 0) {
//         cart.items[existingItemIndex].sizePrice[
//           existingSizePriceIndex
//         ].quantity += quantityNum;
//       } else {
//         cart.items[existingItemIndex].sizePrice.push({
//           size: sizePrice.size,
//           price: sizePrice.price,
//           quantity: quantityNum,
//         });
//       }

//       cart.items[existingItemIndex].totalQuantity = cart.items[
//         existingItemIndex
//       ].sizePrice.reduce((acc, sizePrice) => acc + sizePrice.quantity, 0);

//       updatedTotalQuantity = cart.items.reduce(
//         (acc, item) => acc + item.totalQuantity,
//         0
//       );
//     } else {
//       cart.items.push({
//         _id: item._id,
//         image: item.image,
//         title: item.title,
//         sizePrice: [
//           {
//             size: sizePrice.size,
//             price: sizePrice.price,
//             quantity: quantityNum,
//           },
//         ],
//         totalQuantity: quantityNum,
//       });

//       updatedTotalQuantity = cart.items.reduce(
//         (acc, item) => acc + item.totalQuantity,
//         0
//       );
//     }

//     cart.totalPrice += totalPrice;
//     cart.totalQuantity = updatedTotalQuantity;
//     await cart.save();

//     return res.status(200).json({ cart, success: true });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

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

const updateQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { sizeIndex, quantity } = req.body;
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

    const sizePrice = item.sizePrice[sizeIndex];

    if (!sizePrice) {
      return res.status(200).json({ message: "Size not found for the item" });
    }

    const quantityNum = parseInt(quantity);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(200).json({ message: "Invalid quantity" });
    }

    const oldQuantity = sizePrice.quantity;
    sizePrice.quantity = quantityNum;

    await updateTotalQuantity(cart);
    await updateTotalPrice(cart);

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//================

const updateTotalQuantity = async (cart) => {
  try {
    const updatedTotalQuantity = cart.items.reduce((acc, item) => {
      return (
        acc +
        item.sizePrice.reduce(
          (itemAcc, sizePrice) => itemAcc + sizePrice.quantity,
          0
        )
      );
    }, 0);
    cart.totalQuantity = updatedTotalQuantity;
    await cart.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateTotalPrice = async (cart) => {
  try {
    let updatedTotalPrice = 0;

    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      for (let j = 0; j < item.sizePrice.length; j++) {
        const sizePrice = item.sizePrice[j];
        updatedTotalPrice += sizePrice.price * sizePrice.quantity;
      }
    }

    cart.totalPrice = updatedTotalPrice;
    await cart.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//================

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
