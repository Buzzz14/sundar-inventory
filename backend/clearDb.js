import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./src/models/categoryModel.js";
import Item from "./src/models/itemModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    await Category.deleteMany({});
    await Item.deleteMany({});
    console.log("All categories and items removed!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(clearDatabase);
