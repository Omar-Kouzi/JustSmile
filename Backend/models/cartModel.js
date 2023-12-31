import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        _id: { type: String, required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        sizePrice: [
          {
            size: { type: String },
            price: { type: Number },
            quantity: { type: Number },
          },
        ],
      },
    ],
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;
