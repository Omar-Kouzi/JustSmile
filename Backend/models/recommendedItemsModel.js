import mongoose from "mongoose";

const RecommendedSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

const Recommended = mongoose.model("Recommended", RecommendedSchema);

export default Recommended;
