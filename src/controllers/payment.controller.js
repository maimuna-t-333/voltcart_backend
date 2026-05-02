const Cart = require('../models/Cart.model');
const Order = require('../models/Order.model');
const { createPaymentIntent } = require('../services/stripe.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { success } = require('../utils/ApiResponse');

exports.createIntent = asyncHandler(async (req, res) => {
  const { shippingMethod, items, subtotal, discount, couponCode } = req.body;

  const shippingCost = { standard: 5.99, express: 12.99, overnight: 24.99 }[shippingMethod] || 5.99;

  let orderItems = [];
  let orderSubtotal = 0;
  let orderDiscount = 0;

  // Try to get cart from DB first
  const cart = await Cart.findOne({ user: req.user?._id });

  if (cart && cart.items.length > 0) {
    // Use DB cart
    orderItems = cart.items;
    orderSubtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    orderDiscount = cart.discount || 0;
  } else if (items && items.length > 0) {
    // Use items from request body (frontend Zustand cart)
    orderItems = items.map((item: any) => ({
      product: item.productId,
      variantSku: item.variantSku,
      quantity: item.quantity,
      price: item.price,
    }));
    orderSubtotal = subtotal || items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    orderDiscount = discount || 0;
  } else {
    throw new ApiError(400, 'Cart is empty');
  }

  const total = orderSubtotal - orderDiscount + (orderSubtotal > 50 ? 0 : shippingCost);

  // Create draft order
  const order = await Order.create({
    user: req.user?._id,
    items: orderItems,
    status: 'pending',
    subtotal: orderSubtotal,
    discount: orderDiscount,
    shippingCost: orderSubtotal > 50 ? 0 : shippingCost,
    total,
    shippingMethod,
    couponCode: couponCode || cart?.couponCode,
  });

  const intent = await createPaymentIntent(total, { orderId: order._id.toString() });
  await Order.findByIdAndUpdate(order._id, { stripePaymentIntentId: intent.id });

  success(res, 200, { clientSecret: intent.client_secret, orderId: order._id });
});