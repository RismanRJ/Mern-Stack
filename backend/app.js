const express = require("express");
const app = express();
const cors = require("cors");
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
const error = require("./middlewares/error");
const catchAsyncError = require("./middlewares/catchAsyncError");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/v1/", products);
app.use("/api/v1/", auth);
app.use("/api/v1/", order);
app.use(catchAsyncError);
app.use(error);

module.exports = app;
