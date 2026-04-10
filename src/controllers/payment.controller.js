const Cart    = require('../models/Cart.model');
const Order   = require('../models/Order.model');
const { createPaymentIntent } = require('../services/stripe.service');
const asyncHandler = require('../utils/asyncHandler');
const { success }  = require('../utils/ApiResponse');

exports.createIntent = asyncHandler(async (req, res) => {
  const { shippingMethod } = req.body;
  const cart = await Cart.findOne({ user: req.user?._id });
  const shippingCost = { standard: 5.99, express: 12.99, overnight: 24.99 }[shippingMethod] || 5.99;
  const subtotal  = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total     = subtotal - (cart.discount || 0) + shippingCost;
  // Create a draft order so the webhook can find it
  const order = await Order.create({
    user: req.user?._id, items: cart.items, status: 'pending',
    subtotal, discount: cart.discount, shippingCost,
    total, shippingMethod, couponCode: cart.couponCode
  });
  const intent = await createPaymentIntent(total, { orderId: order._id.toString() });
  await Order.findByIdAndUpdate(order._id, { stripePaymentIntentId: intent.id });
  success(res, 200, { clientSecret: intent.client_secret, orderId: order._id });
});
