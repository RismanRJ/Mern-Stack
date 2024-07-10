const catchAsyncError = require("../middlewares/catchAsyncError");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");

// register user -api/v1/register
module.exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  const user = await userModel.create({
    name,
    email,
    password,
    avatar,
  });
  const token = user.getJwtToken();
  sendToken(user, 201, res);
});

// login user -/api/v1/login
module.exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return next(new ErrorHandler("Please enter your email & password", 400));
  }

  //   finding user data

  const user = await userModel
    .findOne({
      email: email,
    })
    .select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email & Password", 400));
  }

  if (!(await user.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid Email & Password", 400));
  }

  sendToken(user, 201, res);
});

// logout user - /api/v1/logout

module.exports.logoutUser = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "user loggged out successfully!!",
    });
};

// forgot password - /api/v1/password/forgot

module.exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  const resetToken = user.getResetToken();
  await user.save({
    validateBeforeSave: false,
  });

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password reset url is as follow \n\n
  ${resetUrl}\n\n
  If You have not requested this email,then ignore it.`;

  try {
    sendEmail({
      email: user.email,
      subject: "RJCart Password Recovery",
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `Email successfully sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({
      validateBeforeSave: false,
    });

    return next(new ErrorHandler(error.message), 500);
    // statuscode 500- internal server error
  }
});

// reset Password = /api/v1/password/reset/:token
module.exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(
      new ErrorHandler("Password token is invalid or token expired", 404)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match"), 404);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;

  await user.save({
    validateBeforeSave: false,
  });

  sendToken(user, 201, res);
});

// get user profile -/api/v1/myprofile
module.exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// change Password - /api/v1/password/change
module.exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");

  // check old password
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new ErrorHandler("Old password is Incorrect"), 401);
  }

  // assigning new password
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
});

// update profile-/api/v1/update

module.exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin : Get All users - api/v1/admin/users
module.exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Admin : Get Specific user - api/v1/admin/user/:id
module.exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`),
      400
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin : Update User - api/v1/admin/user/:id
module.exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin : delete user -  api/v1/admin/user/:id
module.exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`),
      400
    );
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
  });
});
