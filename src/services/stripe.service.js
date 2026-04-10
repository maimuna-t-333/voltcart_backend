const stripe = require('../config/stripe');

exports.createPaymentIntent = async (amount, metadata = {}) =>
  stripe.paymentIntents.create({
    amount:   Math.round(amount * 100),
    currency: 'usd',
    metadata,
    automatic_payment_methods: { enabled: true }
  });

exports.createRefund = async (paymentIntentId, amount = null) => {
  const params = { payment_intent: paymentIntentId };
  if (amount) params.amount = Math.round(amount * 100);
  return stripe.refunds.create(params);
};
