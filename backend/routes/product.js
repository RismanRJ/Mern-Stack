const express = require("express");
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
} = require("../controllers/productController");
const {
  isAuthenticatedUser,
  authourizeRoles,
} = require("../middlewares/authenticate");
const router = express.Router();

// router
router.route("/products").get(isAuthenticatedUser, getProducts);

router
  .route("/review")
  .put(isAuthenticatedUser, createReview)
  .delete(isAuthenticatedUser, deleteReview);
router.route("/reviews").get(isAuthenticatedUser, getReviews);

// Admin Routes
router
  .route("/products/new")
  .post(isAuthenticatedUser, authourizeRoles("admin"), newProduct);
router
  .route("/products/:id")
  .get(getSingleProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
