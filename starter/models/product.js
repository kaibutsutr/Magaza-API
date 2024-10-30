const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lütfen ürün adı giriniz!"], // cant be empty
  },
  price: {
    type: Number,
    required: [true, "Lütfen ürün fiyatı giriniz!"], // cant be empty
  },
  featured: {
    type: Boolean,
    default: false, // default is not featured
  },
  rating: {
    type: Number,
    default: 4.5, // default is 4.5
  },
  createdAt: {
    type: Date, // mongoose supports date
    default: Date.now(), // current date
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported. Please provide a valid company name",
    },
  },
});
module.exports = mongoose.model("Products", productSchema); // create a model with given schema
