const { Schema, model } = require('mongoose');

const couponSchema = new Schema({
  code:      { type: String, required: true, unique: true, uppercase: true },
  type:      { type: String, enum: ['percent','fixed'], required: true },
  value:     { type: Number, required: true },
  minOrder:  { type: Number, default: 0 },
  maxUses:   { type: Number, default: null },
  usesCount: { type: Number, default: 0 },
  expiresAt: Date,
  isActive:  { type: Boolean, default: true }
}, { timestamps: true });

module.exports = model('Coupon', couponSchema);
