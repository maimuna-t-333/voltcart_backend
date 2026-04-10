const Cart     = require('../models/Cart.model');
const Product  = require('../models/Product.model');
const Coupon   = require('../models/Coupon.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError     = require('../utils/ApiError');
const { success }  = require('../utils/ApiResponse');

const getOrCreateCart = async (userId, sessionId) => {
  const query = userId ? { user: userId } : { sessionId };
  const cart = await Cart.findOne(query);
  return cart || Cart.create(query);
};

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user?._id, req.headers['x-session-id']);
  await cart.populate('items.product', 'name slug basePrice variants status');
  success(res, 200, { cart });
});

exports.addItem = asyncHandler(async (req, res) => {
  const { productId, variantSku, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  const variant = product.variants.find(v => v.sku === variantSku);
  if (!variant) throw new ApiError(400, 'Variant not found');
  if (variant.stock < quantity) throw new ApiError(400, 'Insufficient stock');
  const cart  = await getOrCreateCart(req.user?._id, req.headers['x-session-id']);
  const existing = cart.items.find(i => i.variantSku === variantSku);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ product: productId, variantSku, quantity, price: variant.price });
  await cart.save();
  success(res, 200, { cart }, 'Added to cart');
});

exports.applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new ApiError(400, 'Invalid coupon code');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new ApiError(400, 'Coupon expired');
  if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) throw new ApiError(400, 'Coupon usage limit reached');
  const cart     = await getOrCreateCart(req.user?._id, req.headers['x-session-id']);
  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  if (subtotal < coupon.minOrder) throw new ApiError(400, `Minimum order $${coupon.minOrder} required`);
  const discount = coupon.type === 'percent' ? subtotal * coupon.value / 100 : coupon.value;
  cart.couponCode = coupon.code;
  cart.discount   = Math.min(discount, subtotal);
  await cart.save();
  success(res, 200, { discount: cart.discount, couponCode: cart.couponCode }, 'Coupon applied');
});
