const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  country: { type: String, },
  skinAnalysis: { type: mongoose.Types.ObjectId, ref: 'SkinAnalysis' },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// Generate password reset token
UserSchema.methods.generateVerificationToken = function () {
  // const resetToken = randomBytes(20).toString("hex");
  const resetToken = Math.floor(100000 + Math.random() * 900000);
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  this.save();
  return resetToken;
};
const User = mongoose.model('User', UserSchema);

module.exports = User;
