import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import connectDB from "./config/db.js";
import UserRoutes from "./routes/userRout.js";
import ItemRoutes from "./routes/itemRout.js";
import CategoryRoutes from "./routes/categoryRout.js"
import CartRoutes from "./routes/cartRout.js"
dotenv.config();

connectDB();
const port = process.env.PORT || 1000;

const app = new express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use("/user", UserRoutes);
app.use("/items", ItemRoutes);
app.use("/category", CategoryRoutes);
app.use("/cart", CartRoutes);
app.listen(port, () => console.log(`Server is tunning on PORT: ${port}`));
