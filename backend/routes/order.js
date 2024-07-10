const express = require("express");
const {
  newOrder,
  getSingleOrder,
  getMyOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const {
  isAuthenticatedUser,
  authourizeRoles,
} = require("../middlewares/authenticate");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/myorders").get(isAuthenticatedUser, getMyOrders);

// Admin Routes
router
  .route("/orders")
  .get(isAuthenticatedUser, authourizeRoles("admin"), getAllOrders);
router
  .route("/order/:id")
  .put(isAuthenticatedUser, authourizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authourizeRoles("admin"), deleteOrder);

module.exports = router;
