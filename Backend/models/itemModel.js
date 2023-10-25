import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [],
  },
  sizePrice: [
    {
      size: { type: String },
      price: { type: Number },
    },
  ],

  image: {
    type: String,
    default: "",
  },
  flavor: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const Item = mongoose.model("Item", itemSchema);
Item.find()
  .populate({ path: "categoryID", select: "title" })
  .exec(function (err, items) {});

export default Item;
