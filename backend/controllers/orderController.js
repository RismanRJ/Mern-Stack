const catchAsyncError = require("../middlewares/catchAsyncError");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");

// Create New Order - api/v1/order/new
module.exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await orderModel.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// Get Single Order - /api/v1/order/:id
module.exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user", "name email");
  if (!order) {
    return next(new ErrorHandler("Order id not found"), 404);
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// Get all order - /api/v1/myorders
module.exports.getMyOrders = catchAsyncError(async (req, res, next) => {
  const orders = await orderModel.find({
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Admin - Get All user's Orders
module.exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await orderModel.find();
  let totalAmount = 0;
  orders.forEach((val) => {
    totalAmount += val.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update Order - api/v1/order/:id
module.exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("Order has been already delivered"), 400);
  }

  // updating the product stock of each order Item
  order.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem.product, orderItem.quantity);
  });

  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(productID, quantity) {
  const product = await productModel.findById(productID);
  product.stock = product.stock - quantity;
  await product.save({
    validateBeforeSave: false,
  });
}

// Admin - Delete Order - api/v1/order/:id
module.exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("order id not found"), 400);
  }

  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});
