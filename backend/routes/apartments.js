const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Apartment = require('../models/Apartment');

// إعداد مكان حفظ الصور
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 1. جلب العقارات
router.get('/', async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. إضافة عقار جديد (بالصور)
router.post('/', upload.array('imageFiles', 5), async (req, res) => {
  try {
    const { title, location, price, rooms, bedrooms, bathrooms, description } = req.body;
    
    // تحويل مسارات الصور المرفوعة إلى مصفوفة
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newApartment = new Apartment({
      title,
      location,
      price: Number(price),
      rooms: Number(rooms) || Number(bedrooms) || 1,
      bedrooms: Number(rooms) || Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      images: imagePaths, // حفظ مصفوفة الصور هنا
      image: imagePaths[0] || '', // حفظ أول صورة في الحقل القديم للتوافق
      description: description || ''
    });

    const savedApartment = await newApartment.save();
    res.status(201).json(savedApartment);
  } catch (err) {
    console.error("خطأ أثناء حفظ العقار:", err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;