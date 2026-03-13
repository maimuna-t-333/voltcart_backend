const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  user:         { type: Schema.Types.ObjectId, ref: 'User' },
  guestEmail:   String,
  items: [{
    product:    { type: Schema.Types.ObjectId, ref: 'Product' },
    variantSku: String, name: String, image: String,
    price: Number, quantity: Number
  }],
  status: { type: String,
    enum: ['pending','confirmed','processing','shipped',
           'out_for_delivery','delivered','cancelled','refunded'],
    default: 'pending' },
  statusHistory: [{ status: String, note: String, updatedAt: { type: Date, default: Date.now } }],
  shippingAddress: { line1: String, city: String, state: String, zip: String, country: String },
  shippingMethod:  { type: String, enum: ['standard','express','overnight'] },
  shippingCost: Number, subtotal: Number, discount: { type: Number, default: 0 },
  tax: Number, total: Number, couponCode: String,
  stripePaymentIntentId: { type: String, index: true },
  trackingNumber: String, carrier: String
}, { timestamps: true });

module.exports = model('Order', orderSchema);
