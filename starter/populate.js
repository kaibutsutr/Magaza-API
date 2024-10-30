require("dotenv").config(); // dotenv for secrets
const connectDB = require("./db/connect");
const Product = require("./models/product"); // bring our model
const jsonProducts = require("./products.json");

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to database successfully!");

    await Product.deleteMany(); //emtpy db first
    console.log("Deleted database successfully!");

    await Product.create(jsonProducts); // then copy the array from products.json
    console.log("Populated database successfully!");
  } catch (error) {
    console.log(error);
  }
};
start(); // start populating
