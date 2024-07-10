const catchAsyncError = require("../middlewares/catchAsyncError");
const productModel = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

// Get products = /api/v1/products
module.exports.getProducts = async (req, res, next) => {
  const resPerPage = 2;
  // search function & filter function
  const apiFeatures = new APIFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .paginate(resPerPage);
  const products = await apiFeatures.query;
  // const data = await productModel.find();
  // console.log(data.length);

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};

// create products - /api/v1/products/new
module.exports.newProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await productModel.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// getSingleProduct - /api/v1/products/:id
module.exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product Not found", 400));
    } else {
      res.status(201).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Please check the product id",
    });
  }
};

// updateProduct - /api/v1/products/:id
module.exports.updateProduct = async (req, res, next) => {
  try {
    let product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No product matched",
      });
    }
    product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Please check the product id",
    });
  }
};

// deletProduct-  api/vi/products/:id
module.exports.deleteProduct = async (req, res, next) => {
  try {
    let product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No product matched",
      });
    }
    await productModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Please check the product id",
    });
  }
};

// Create Review - api/v1/review
module.exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productID, rating, comment } = req.body;
  const review = {
    user: req.user.id,
    rating,
    comment,
  };

  const product = await productModel.findById(productID);
  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user.id.toString();
  });

  // finding user has already Reviewed
  if (isReviewed) {
    // updating the review
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    // Creating the review
    product.reviews.push(review);
    product.numberOfReview = product.reviews.length;
  }

  // Find the average of the product reviews
  product.ratings =
    product.reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / product.reviews.length;

  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

  await product.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews - api/v1/reviews?id={productID}
module.exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review - api/v1/review
module.exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.productID);

  // Filtering the reviews which does not matching the deleting review id
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  // Updating Number of Reviews
  const numberOfReview = reviews.length;

  // Finding the average of Ratings for filtered reviews
  let ratings =
    reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / reviews.length;

  // checking NaN
  ratings = isNaN(product.ratings) ? 0 : ratings;
  // Saving the Product
  await productModel.findByIdAndUpdate(req.query.productID, {
    reviews,
    numberOfReview,
    ratings,
  });

  res.status(200).json({
    success: true,
  });
});
