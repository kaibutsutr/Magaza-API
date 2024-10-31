const Product = require("../models/product"); // bring our model

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ company: "ikea" }); // show only ikea products
  res.status(200).json({ products });
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query; // take the query parts we are interested in query then check if they are not null
  const queryObject = {}; // create an empty queryobject so empty search brings ALL items. Then we add filters if they are expected.
  if (featured) {
    // check if featured is null or not
    if (featured === "true") {
      // its a bool value so we need to check if its true or not
      queryObject.featured = true; // if its true then add it to query object
    } else if (featured === "false") {
      queryObject.featured = false; // if its false then add it to query object
      // if its another value than true or false, we ignore it and we bring all objects since queryobject is empty now.
    }
  }
  if (company) {
    // if its not null then we add it to our query object
    queryObject.company = { $regex: company, $options: "i" }; // used regex to make company query case insensitive
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" }; // used regex to make name query case insensitive
  }
  // console.log(queryObject);
  // const products = await Product.find(queryObject); // WE need to change this code if we are using sorting since its chained AFTER find.
  let result = Product.find(queryObject); // we query first then we check if we need to chain other commands
  if (sort) {
    // check for sort already exists
    const sortList = sort.split(",").join(" "); // we need to get rid of commas and replace it with spaces for mongoose command sort
    //split array into multiple parts with each comma, then join them together with space in between
    console.log(sortList);
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt"); // default sort
  }
  const products = await result; // we need to put await here since its async func
  res.status(200).json({ nbHits: products.length, products }); // show number of items we return
};

module.exports = { getAllProducts, getAllProductsStatic };
