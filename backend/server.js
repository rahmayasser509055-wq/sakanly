const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // تحميل ملف .env لقراءة رابط الداتابيز

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// تأكيد وجود مجلد رفع الصور uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// إعداد Multer لتخزين الصور المرفوعة
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).any();

// ==========================================
// 1. Schema والـ Model الخاص بالمستخدمين (Users)
// ==========================================
const userSchema = new mongoose.Schema({
  userType: { type: String, required: true }, // طالب أو مالك/وسيط
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nationalId: { type: String, unique: true, sparse: true },
  birthDate: { type: String },
  religion: { type: String },
  governorate: { type: String },
  address: { type: String },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ==========================================
// 2. Schema والـ Model الخاص بالسكن (Apartments)
// ==========================================
const apartmentSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  rooms: Number,
  beds: Number,
  description: String,
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

const Apartment = mongoose.model('Apartment', apartmentSchema);

// ==========================================
// 3. APIs الخاصة بالحسابات وتسجيل الدخول (Auth)
// ==========================================

// فحص الرقم القومي أثناء الكتابة (قبل التسجيل)
app.post('/api/auth/check-national-id', async (req, res) => {
  try {
    const { nationalId } = req.body;
    if (!nationalId) {
      return res.status(400).json({ exists: false });
    }
    const existingUser = await User.findOne({ nationalId });
    if (existingUser) {
      return res.json({ exists: true, message: 'هذا الرقم القومي مسجل بالفعل من قبل' });
    }
    res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
});

// تسجيل حساب جديد مع التحقق من البريد والرقم القومي
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, userType, nationalId, birthDate, religion, governorate, address } = req.body;

    // 1. التأكد إذا كان البريد مستخدم سابقاً
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    }

    // 2. التأكد إذا كان الرقم القومي مسجل مسبقاً
    if (nationalId) {
      const existingUserById = await User.findOne({ nationalId });
      if (existingUserById) {
        return res.status(400).json({ message: 'هذا الرقم القومي مسجل بالفعل لدينا' });
      }
    }

    const newUser = new User({
      userType,
      fullName,
      phone,
      email,
      nationalId,
      birthDate,
      religion,
      governorate,
      address,
      password 
    });

    await newUser.save();
    console.log('✅ تم تسجيل مستخدم جديد بنجاح في Atlas:', newUser.email, `(${newUser.userType})`);
    
    res.status(201).json({ 
      message: 'تم إنشاء الحساب بنجاح', 
      user: newUser,
      token: 'fake-jwt-token-for-demo' 
    });
  } catch (error) {
    console.error('خطأ في تسجيل حساب:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب', error: error.message });
  }
});

// تسجيل الدخول
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      user,
      token: 'fake-jwt-token-for-demo'
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول', error: error.message });
  }
});

// ==========================================
// 4. APIs الخاصة بالأسكان/العقارات (Apartments)
// ==========================================

app.post('/api/apartments', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('خطأ في رفع الصور:', err);
      return res.status(400).json({ message: 'حدث خطأ أثناء رفع الصور', error: err.message });
    }

    try {
      const { title, location, price, rooms, beds, description } = req.body;
      const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

      const newApartment = new Apartment({
        title,
        location,
        price,
        rooms,
        beds,
        description,
        images: imagePaths
      });

      await newApartment.save();
      console.log('✅ تم حفظ السكن بنجاح في Atlas:', newApartment._id);
      res.status(201).json({ message: 'تم إضافة السكن بنجاح', apartment: newApartment });
    } catch (error) {
      console.error('خطأ أثناء الحفظ:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء إضافة السكن', error: error.message });
    }
  });
});

app.get('/api/apartments', async (req, res) => {
  try {
    const apartments = await Apartment.find().sort({ createdAt: -1 });
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب البيانات', error: error.message });
  }
});

// ==========================================
// 5. تشغيل السيرفر والاتصال بـ MongoDB Atlas
// ==========================================
const startServer = async () => {
  try {
    // الاتصال بقاعدة البيانات الحقيقية من ملف .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ تم الاتصال بـ MongoDB Atlas بنجاح!');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 السيرفر شغال على المنفذ ${PORT}`);
    });
  } catch (err) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err);
  }
};

startServer();