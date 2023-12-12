import mongoose from "mongoose";

const OffersSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  sizePrice: [
    {
      price: { type: Number, required: true },
      size: { type: String, default: "offer" },
    },
  ],
});

const Offers = mongoose.model("Offers", OffersSchema);

export default Offers;
