const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userType: { type: String, required: true }, // طالب أو مالك/وسيط
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nationalId: { type: String, required: true },
  birthDate: { type: String, required: true },
  religion: { type: String, required: true },
  governorate: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);