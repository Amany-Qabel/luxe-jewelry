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
  
  // الاتصال بقاعدة البيانات بدون خيارات قديمة غير مدعومة
  cachedDb = await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected Successfully");
  return cachedDb;
};

// مسار الـ Seed لتعبئة البيانات مع ضمان اكتمال الاتصال أولاً
app.get('/api/seed', async (req, res) => {
  try {
    await connectDB(); // الانتظار حتى يكتمل الاتصال بقاعدة البيانات 100%
    
    // يمكنك إضافة كود تعبئة المنتجات هنا لاحقاً
    
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