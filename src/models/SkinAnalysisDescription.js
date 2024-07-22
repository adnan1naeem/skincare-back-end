const mongoose = require('mongoose');

const SkinAnalysisDescriptionScheme = new mongoose.Schema({
    parameter: { type: String, required: true, enum: ['hydration', 'oilness', 'elasticity'] },
    level: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    title: { type: String, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('SkinAnalysisDescription', SkinAnalysisDescriptionScheme);
