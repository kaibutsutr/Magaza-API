require("dotenv").config();
//async errors

const express = require("express");
const app = express();
const port = 3000;

const notFound = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");

//middleware
app.use(express.json());

//routes

app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

const start = async () => {
  // server start method
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log("Server is listening"));
  } catch (error) {
    console.log(error);
  }
};
start(); // start server
