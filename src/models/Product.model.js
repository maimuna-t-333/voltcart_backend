const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const slugify = require('slugify');

const variantSchema = new Schema({
  sku: { type: String, required: true },
  color: String,
  storage: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  images: [String]
});

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  brand: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  subCategory: String,
  tags: [String],
  basePrice: { type: Number, required: true },
  comparePrice: Number,
  variants: [variantSchema],
  specs: [{ key: String, value: String }],
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'draft' },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });

productSchema.pre('save', async function () {
  if (this.isNew || this.isModified('name'))
    this.slug = slugify(this.name, { lower: true, strict: true });
});

module.exports = model('Product', productSchema);
