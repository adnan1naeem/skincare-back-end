const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AnalysisScheme = new mongoose.Schema({
  hydration: { type: Number, required: true },
  oilness: { type: Number, required: true },
  elastcity: { type: Number, required: true },
  skinAge: { type: Number, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User" }
}, {
  timestamps: true
});



const Analysis = mongoose.model('SkinAnalysis', AnalysisScheme);

module.exports = Analysis;
