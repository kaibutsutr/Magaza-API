const getAllProductsStatic = async (req, res) => {
  throw "Testing async errors!!";
  res.status(200).json({ msg: "Testing get method" });
};
const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: "get method" });
};

module.exports = { getAllProducts, getAllProductsStatic };
