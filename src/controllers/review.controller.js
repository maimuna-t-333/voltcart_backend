const Review   = require('../models/Review.model');
const Product  = require('../models/Product.model');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiError     = require('../utils/ApiError');
const { success }  = require('../utils/ApiResponse');

const findProduct = async slugOrId => {
  let p = await Product.findOne({ slug: slugOrId });
  if (!p && mongoose.Types.ObjectId.isValid(slugOrId)) p = await Product.findById(slugOrId);
  return p;
};

exports.getReviews = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.slug);
  if (!product) throw new ApiError(404, 'Product not found');

  const reviews = await Review.find({ product: product._id })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  success(res, 200, { reviews });
});

exports.createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  if (!rating) throw new ApiError(400, 'Rating is required');

  const product = await findProduct(req.params.slug);
  if (!product) throw new ApiError(404, 'Product not found');

  // one review per user per product
  const existing = await Review.findOne({ product: product._id, user: req.user._id });
  if (existing) throw new ApiError(409, 'You have already reviewed this product');

  const review = await Review.create({
    product:  product._id,
    user:     req.user._id,
    rating,
    body:     comment,  
    title,
    isVerified: false,
  });

  const stats = await Review.aggregate([
    { $match: { product: product._id } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length) {
    product.avgRating   = Math.round(stats[0].avg * 10) / 10;
    product.reviewCount = stats[0].count;
    await product.save();
  }

  const populated = await review.populate('user', 'name');
  success(res, 201, { review: populated }, 'Review submitted');
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) throw new ApiError(404, 'Review not found');

  const isOwner = review.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) throw new ApiError(403, 'Not authorized');

  const product = await Product.findById(review.product);
  await review.deleteOne();

  if (product) {
    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    product.avgRating   = stats.length ? Math.round(stats[0].avg * 10) / 10 : 0;
    product.reviewCount = stats.length ? stats[0].count : 0;
    await product.save();
  }

  success(res, 200, null, 'Review deleted');
});