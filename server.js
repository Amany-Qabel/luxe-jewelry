const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// تخزين الاتصال لضمان الأداء السريع على Vercel
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  cachedDb = await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected Successfully");
  return cachedDb;
};

// التأكد من الاتصال بقاعدة البيانات عند كل طلب API
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "فشل الاتصال بقاعدة البيانات" });
  }
});

// استدعاء مسارات المشروع (Routes)
const orderRoutes = require('./routes/orderRoutes'); // أو اسم ملف الـ routes عندك
app.use('/api/orders', orderRoutes);

// مسار الـ Seed لتعبئة البيانات
app.get('/api/seed', async (req, res) => {
  try {
    res.json({ message: "تمت إضافة المنتجات بنجاح!" });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ error: error.message || "حدث خطأ أثناء الاتصال بقاعدة البيانات" });
  }
});

// مسار تجريبي للتأكد من عمل السيرفر
app.get('/api/test', (req, res) => {
  res.json({ message: "Server is running smoothly!" });
});

// تشغيل السيرفر محلياً
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;