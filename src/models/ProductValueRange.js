const mongoose = require("mongoose");

const ProductValueRangeSchema = new mongoose.Schema({
  low: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  medium: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  high: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
});

module.exports = mongoose.model("ProductValueRange", ProductValueRangeSchema);
