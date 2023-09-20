import mongoose from "mongoose";

const slideSchema = mongoose.Schema({
  image: {
    type: String,
    default: "",
  },
});
const Slide = mongoose.model("Slide", slideSchema);

export default Slide;
