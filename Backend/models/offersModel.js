import mongoose from "mongoose";

const OffersSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

const Offers = mongoose.model("Offers", OffersSchema);

export default Offers;
