import mongoose from "mongoose";

const BarJuiceSuppliersSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  location: { type: String, required: true },
  links: [
    {
      title: { type: String },
      link: { type: String },
    },
  ],
});

const BarJuiceSuppliers = mongoose.model(
  "BarJuiceSuppliers",
  BarJuiceSuppliersSchema
);

export default BarJuiceSuppliers;
