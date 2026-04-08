const Product    = require('../models/Product.model');
const { uploadToCloudinary } = require('../services/image.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError     = require('../utils/ApiError');
const { success }  = require('../utils/ApiResponse');

exports.getProducts = asyncHandler(async (req, res) => {
  const { search, category, brand, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;
  const query = { status: 'active' };
  if (search)   query.$text = { $search: search };
  if (category) query.category = category;
  if (brand)    query.brand = { $in: brand.split(',') };
  if (minPrice || maxPrice) query.basePrice = {};
  if (minPrice) query.basePrice.$gte = Number(minPrice);
  if (maxPrice) query.basePrice.$lte = Number(maxPrice);
  if (rating)   query.avgRating = { $gte: Number(rating) };

  const sortMap = { price_asc: { basePrice: 1 }, price_desc: { basePrice: -1 },
    newest: { createdAt: -1 }, rating: { avgRating: -1 }, bestseller: { soldCount: -1 } };
  const sortBy = sortMap[sort] || { isFeatured: -1 };

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortBy).skip(skip).limit(Number(limit));
  success(res, 200, { products, total, page: Number(page), pages: Math.ceil(total / limit) });
});

exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, status: 'active' });
  if (!product) throw new ApiError(404, 'Product not found');
  success(res, 200, { product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  success(res, 201, { product }, 'Product created');
});

exports.uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  const urls = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));
  if (product.variants[0]) product.variants[0].images.push(...urls);
  await product.save();
  success(res, 200, { images: urls }, 'Images uploaded');
});

exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    status: 'active',
    isFeatured: true
  }).sort({ createdAt: -1 }).limit(8);

  success(res, 200, { products });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) throw new ApiError(404, 'Product not found');

  success(res, 200, { product }, 'Product updated');
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) throw new ApiError(404, 'Product not found');

  success(res, 200, null, 'Product deleted');
});