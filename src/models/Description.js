const mongoose = require('mongoose');

const descriptionSchema = new mongoose.Schema({
  oilness: { type: String, enum: ['high', 'medium', 'low'], required: true },
  elasticity: { type: String, enum: ['high', 'medium', 'low'], required: true },
  hydration: { type: String, enum: ['high', 'medium', 'low'], required: true },
  description: { type: String, required: true }
});

const Description = mongoose.model('Description', descriptionSchema);

module.exports = Description;
