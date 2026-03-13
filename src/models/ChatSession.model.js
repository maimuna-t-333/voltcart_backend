const { Schema, model } = require('mongoose');

const chatSessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  user:      { type: Schema.Types.ObjectId, ref: 'User' },
  messages:  [{ role: { type: String, enum: ['user','assistant'] }, content: String, timestamp: { type: Date, default: Date.now } }],
  context:   { currentProductSlug: String, cartItemCount: Number }
}, { timestamps: true });

module.exports = model('ChatSession', chatSessionSchema);
