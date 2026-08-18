const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  rooms: { type: Number, default: 1 },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  image: { type: String, default: '' }, // الصورة المفردة القديمة (للتوافق)
  images: [{ type: String }],          // مصفوفة صور السكن الجديدة المتعددة 
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Apartment', apartmentSchema);