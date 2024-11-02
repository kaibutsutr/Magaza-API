require("dotenv").config(); // dotenv for secrets
require("express-async-errors"); // async error wrapper. We dont have to write try-catch for every async functions

//async errors

const express = require("express");
const app = express();
const port = 3000;

const notFound = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
//error middleware not used
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

//middleware
app.use(express.json());

//routes
app.use("/api/v1/products", productsRouter); // use the router after this url address.

app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start(); // start server
