const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const {
  isAuthenticatedUser,
  authourizeRoles,
} = require("../middlewares/authenticate");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/password/change").put(isAuthenticatedUser, changePassword);
router.route("/myprofile").get(isAuthenticatedUser, getUserProfile);
router.route("/myprofile").get(isAuthenticatedUser, getUserProfile);
router.route("/update").put(isAuthenticatedUser, updateProfile);

// Admin Routes
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authourizeRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authourizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authourizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authourizeRoles("admin"), deleteUser);

module.exports = router;
