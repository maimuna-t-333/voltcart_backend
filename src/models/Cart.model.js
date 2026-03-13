const { Schema, model } = require('mongoose');

const cartSchema = new Schema({
  user:      { type: Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  items: [{
    product:    { type: Schema.Types.ObjectId, ref: 'Product' },
    variantSku: String,
    quantity:   { type: Number, required: true, min: 1 },
    price:      Number
  }],
  couponCode: String,
  discount:   { type: Number, default: 0 }
}, { timestamps: true });

module.exports = model('Cart', cartSchema);
