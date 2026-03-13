const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
  product:      { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  user:         { type: Schema.Types.ObjectId, ref: 'User',    required: true },
  order:        { type: Schema.Types.ObjectId, ref: 'Order' },
  rating:       { type: Number, required: true, min: 1, max: 5 },
  body:         String,
  images:       [String],
  helpfulCount: { type: Number, default: 0 },
  helpfulVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isVerified:   { type: Boolean, default: false }
}, { timestamps: true });

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
module.exports = model('Review', reviewSchema);
