const Order = require('../models/Order.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { success } = require('../utils/ApiResponse');
const {sendOrderConfirmationEmail, sendOrderShippedEmail, sendOrderCancelledEmail, sendOrderDeliveredEmail} = require('../services/email.service');

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);
  success(res, 200, { orders });
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const isAdmin=req.user?.role==='admin';
  const query=isAdmin
  ? {_id: req.params.id}
  : {_id: req.params.id, user:req.user._id}
  const order = await Order.findOne(query).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found');
  success(res, 200, { order });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  success(res, 200, { orders, total, page: Number(page), pages: Math.ceil(total / limit) });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status, $push: { statusHistory: { status, note: `Status updated to ${status}` } } },
    { new: true }
  ).populate('user', 'name email');

  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user?.email) {
    const emailMap = {
      shipped:   () => sendOrderShippedEmail(order.user, order),
      cancelled: () => sendOrderCancelledEmail(order.user, order),
      delivered: () => sendOrderDeliveredEmail(order.user, order),
    };
    const emailFn = emailMap[status];
    if (emailFn) {
      emailFn().catch(err =>
        console.error(`[updateOrderStatus] Email failed for status "${status}":`, err.message)
      );
    }
  }
  success(res, 200, { order }, 'Order status updated');
});
