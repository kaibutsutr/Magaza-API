const Product = require("../models/product"); // bring our model

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ company: "ikea" }); // show only ikea products
  res.status(200).json({ products });
};
const getAllProducts = async (req, res) => {
  const products = await Product.find(req.query); // products means mongoose knows its multiple docs. find() brings ALL docs.
  // if there is a query, check the query and do the filtering
  res.status(200).json({ products });
};

module.exports = { getAllProducts, getAllProductsStatic };
