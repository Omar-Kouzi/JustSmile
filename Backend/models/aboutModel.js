import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  about: {
    type: String,
  },
  image: {
    type: String,
  },
});

const About = mongoose.model("About", AboutSchema);

export default About;
