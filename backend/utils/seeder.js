const { connectDatabase } = require("../config/database");
const products = require("../data/products.json");
const dotenv = require("dotenv");
const productModel = require("../models/productModel");

dotenv.config({
  path: "backend/config/config.env",
});

connectDatabase();

const seedProducts = async () => {
  try {
    await productModel.deleteMany();
    console.log("products deleted successfully!! ");
    await productModel.insertMany(products);
    console.log("Products updated successfully!!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

seedProducts();

module.exports = seedProducts;
