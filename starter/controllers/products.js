const Product = require("../models/product"); // bring our model

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ company: "ikea" }); // show only ikea products
  res.status(200).json({ products });
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, select, numericFilters } = req.query; // take the query parts we are interested in query then check if they are not null
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

  //Numeric filters
  if (numericFilters) {
    //check if exists
    const operatorMap = {
      // map user friendly symbols to mongoose code
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g; // regex code for the matching
    let filters = numericFilters.replace(
      // check numeric filters array for matching operators and replace them with mongoose operator syntax
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"]; // create and array with price and rating variables in it since these are the numeric values
    filters = filters.split(",").forEach((item) => {
      // split our filters array between commas
      const [field, operator, value] = item.split("-"); // then in each splitted array,  look for - symbol and split it into 3 parts called field, operator, value
      // this way we have and array with 3 values
      if (options.includes(field)) {
        // then check the field matches our price or rating. These are our only numeric values so we dont need to compare them to every property
        queryObject[field] = { [operator]: Number(value) }; //if the field is numeric then replace the user friendly query into mongoose query.
        console.log(numericFilters);
        console.log(queryObject);
      }
    });
  }
  let result = Product.find(queryObject); // we query first then we check if we need to chain other commands
  //sort method
  if (sort) {
    // check for sort already exists
    const sortList = sort.split(",").join(" "); // we need to get rid of commas and replace it with spaces for mongoose command sort
    //split array into multiple parts with each comma, then join them together with space in between
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt"); // default sort
  }
  //select method
  if (select) {
    // check for select is given
    const selectedList = select.split(",").join(" "); // we need to get rid of commas and replace it with spaces for mongoose command sort
    //split array into multiple parts with each comma, then join them together with space in between
    result = result.select(selectedList);
  }
  //pagination
  const page = Number(req.query.page) || 1; //default is first page
  const limit = Number(req.query.limit) || 10; // default is 10 items per page
  const skip = (page - 1) * limit; // first page returns skip zero so we dont skip any items
  // if we wanna see third page we need to skip 2 times of page limit items
  result = result.skip(skip).limit(limit);

  const products = await result; // we need to put await here since its async func
  res.status(200).json({ nbHits: products.length, products }); // show number of items we return
};

module.exports = { getAllProducts, getAllProductsStatic };
