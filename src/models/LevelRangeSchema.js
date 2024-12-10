const mongoose = require('mongoose');

const LevelRangeSchema = new mongoose.Schema({
    level: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    minValue: { type: Number, required: true },
    maxValue: { type: Number, required: true }
});

const LevelRange = mongoose.model('LevelRange', LevelRangeSchema);

module.exports = LevelRange;
