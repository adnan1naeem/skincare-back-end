const mongoose = require('mongoose');

const skincareSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  cleanse: { type: Boolean, default: false },
  hydrate: { type: Boolean, default: false },
  moisturize: { type: Boolean, default: false },
  protection: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('SkincareRoutine', skincareSchema);
