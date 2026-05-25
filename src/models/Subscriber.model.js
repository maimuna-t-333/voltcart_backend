const { Schema, model } = require('mongoose');

const subscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name:          { type: String, trim: true },
  isConfirmed:   { type: Boolean, default: false },
  confirmToken:  String,
  unsubscribeToken: { type: String, required: true },
}, { timestamps: true });

module.exports = model('Subscriber', subscriberSchema);