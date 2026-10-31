const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// دالة الاتصال بقاعدة البيانات MongoDB Atlas
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

// مسار الـ Seed لتعبئة البيانات مع ضمان اكتمال الاتصال أولاً
app.get('/api/seed', async (req, res) => {
  try {
    await connectDB(); // الانتظار حتى يتم الاتصال بقاعدة البيانات تماماً
    
    // إذا كانت لديك دالة أو نموذج للمنتجات يتم إضافته هنا، مثال:
    // const Product = require('./models/Product');
    // await Product.deleteMany({});
    // await Product.insertMany(sampleProducts);

    res.json({ message: "تمت إضافة المنتجات بنجاح!" });
  } catch (error) {
    res.status(500).json({ error: ".الاتصال بقاعدة البيانات لم يكتمل بعد، يرجى المحاولة بعد ثوانٍ" });
  }
});

// مسار تجريبي للتأكد من عمل السيرفر
app.get('/api/test', (req, res) => {
  res.json({ message: "Server is running smoothly!" });
});

// تشغيل السيرفر محلياً (لا يؤثر على عمله في Vercel)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;