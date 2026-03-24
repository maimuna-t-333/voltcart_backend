const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true },
  password:         { type: String, select: false },
  googleId:         String,
  role:             { type: String, enum: ['customer','admin'], default: 'customer' },
  isVerified:       { type: Boolean, default: false },
  verifyToken:      String,
  resetToken:       String,
  resetTokenExpiry: Date,
  refreshTokens:    [{ token: String, createdAt: Date }],
  addresses: [{
    label: String, line1: String, city: String,
    state: String, zip: String, country: String, isDefault: Boolean
  }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = model('User', userSchema);


