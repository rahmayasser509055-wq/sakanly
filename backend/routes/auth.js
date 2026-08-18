const express = require('express');
const router = express.Router();
const User = require('../models/User');

// مسار إنشاء حساب جديد
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;

    // التأكد من عدم تكرار البريد الإلكتروني
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'البريد الإلكتروني مُسجل بالفعل!' });
    }

    // حفظ البيانات
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({ message: 'تم إنشاء الحساب بنجاح! 🎉', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر أثناء التسجيل' });
  }
});

module.exports = router;