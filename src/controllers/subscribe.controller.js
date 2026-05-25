const crypto     = require('crypto');
const Subscriber = require('../models/Subscriber.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError   = require('../utils/ApiError');
const { success } = require('../utils/ApiResponse');
const {
  sendSubscriptionConfirmEmail,
  sendSubscriptionWelcomeEmail,
} = require('../services/email.service');

exports.subscribe = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  if (!email) throw new ApiError(400, 'Email is required');

  const existing = await Subscriber.findOne({ email });

  if (existing?.isConfirmed) {
    return success(res, 200, null, 'You are already subscribed!');
  }

  if (existing && !existing.isConfirmed) {
    const confirmUrl = `${process.env.CLIENT_URL}/newsletter/confirm?token=${existing.confirmToken}`;
    await sendSubscriptionConfirmEmail(email, name, confirmUrl);
    return success(res, 200, null, 'Confirmation email resent. Please check your inbox.');
  }

  const confirmToken    = crypto.randomBytes(32).toString('hex');
  const unsubscribeToken = crypto.randomBytes(32).toString('hex');

  await Subscriber.create({
    email,
    name:  name || null,
    confirmToken,
    unsubscribeToken,
  });

  const confirmUrl = `${process.env.CLIENT_URL}/newsletter/confirm?token=${confirmToken}`;

  try {
    await sendSubscriptionConfirmEmail(email, name, confirmUrl);
  } catch (err) {
    console.error('[subscribe] Confirmation email failed:', err.message);
  }

  success(res, 201, null, 'Almost there! Check your email to confirm your subscription.');
});

exports.confirmSubscription = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) throw new ApiError(400, 'Token is required');

  const subscriber = await Subscriber.findOne({ confirmToken: token });
  if (!subscriber) throw new ApiError(400, 'Invalid or expired confirmation link');

  subscriber.isConfirmed  = true;
  subscriber.confirmToken = undefined;  // remove after use
  await subscriber.save();

  // Send welcome email
  try {
    await sendSubscriptionWelcomeEmail(subscriber.email, subscriber.name);
  } catch (err) {
    console.error('[confirmSubscription] Welcome email failed:', err.message);
  }

  success(res, 200, null, 'Subscription confirmed! Welcome to VoltCart.');
});

exports.unsubscribe = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) throw new ApiError(400, 'Token is required');

  const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
  if (!subscriber) throw new ApiError(400, 'Invalid unsubscribe link');

  await Subscriber.findByIdAndDelete(subscriber._id);

  success(res, 200, null, 'You have been unsubscribed successfully.');
});