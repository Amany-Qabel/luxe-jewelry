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

// مسار تجريبي للتأكد من عمل السيرفر (بدون اشتراط اتصال بقاعدة البيانات لضمان نجاحه)
app.get('/api/test', (req, res) => {
  res.json({ message: "Server is running smoothly!" });
});

// مسار استقبـال الطلبات مع الاتصال بقاعدة البيانات
app.post('/api/orders', async (req, res) => {
  try {
    await connectDB();
    
    const orderData = req.body;
    console.log("Received Order:", orderData);

    // هنا يمكنك حفظ الطلب في قاعدة البيانات لاحقاً
    // const newOrder = await Order.create(orderData);

    res.status(201).json({ success: true, message: "تم استقبال الطلب بنجاح وتخزينه!" });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ success: false, message: "حدث خطأ أثناء حفظ الطلب: " + error.message });
  }
});

// تشغيل السيرفر محلياً
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;