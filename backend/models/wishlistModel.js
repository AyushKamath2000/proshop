import mongoose from 'mongoose';

const wishlistItemSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
  addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

