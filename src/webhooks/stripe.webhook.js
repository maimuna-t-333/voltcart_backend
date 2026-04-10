const stripe = require('../config/stripe');
const Order  = require('../models/Order.model');
const Product= require('../models/Product.model');
const { sendOrderConfirmationEmail } = require('../services/email.service');

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent  = event.data.object;
    const order   = await Order.findByIdAndUpdate(
      intent.metadata.orderId,
      { status: 'confirmed', $push: { statusHistory: { status: 'confirmed', note: 'Payment received' } } },
      { new: true }
    ).populate('user');
    // Decrement stock for each item
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product, 'variants.sku': item.variantSku },
        { $inc: { 'variants.$.stock': -item.quantity, soldCount: item.quantity } }
      );
    }
    await sendOrderConfirmationEmail(order);
  }
  res.json({ received: true });
};
