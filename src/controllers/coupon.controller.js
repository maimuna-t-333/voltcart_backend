const Coupon = require('../models/Coupon.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { success } = require('../utils/ApiResponse');

exports.getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  success(res, 200, { coupons, total: coupons.length });
});

exports.createCoupon = asyncHandler(async (req, res) => {
  const { code, type, value, minOrder, maxUses, expiresAt, isActive } = req.body;
  if (!code || !type || !value) throw new ApiError(400, 'code, type, and value are required');
  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) throw new ApiError(409, 'Coupon code already exists');
  const coupon = await Coupon.create({ code, type, value, minOrder, maxUses, expiresAt, isActive });
  success(res, 201, { coupon }, 'Coupon created');
});

exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  success(res, 200, { coupon }, 'Coupon updated');
});

exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  success(res, 200, null, 'Coupon deleted');
});

exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
  if (!coupon) throw new ApiError(404, 'Invalid or inactive coupon');
  if (coupon.expiresAt && new Date() > coupon.expiresAt) throw new ApiError(400, 'Coupon has expired');
  if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) throw new ApiError(400, 'Coupon usage limit reached');
  if (orderTotal < coupon.minOrder) throw new ApiError(400, `Minimum order amount is $${coupon.minOrder}`);
  const discount = coupon.type === 'percent'
    ? Math.round((orderTotal * coupon.value) / 100 * 100) / 100
    : Math.min(coupon.value, orderTotal);
  success(res, 200, { coupon, discount }, 'Coupon valid');
});