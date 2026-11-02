const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// 1. تأمين الـ CORS: السماح فقط لموقعك على GitHub Pages بالتواصل مع السيرفر
const allowedOrigins = ['https://amany-qabel.github.io'];
app.use(cors({
    origin: function (origin, callback) {
        // السماح للطلبات القادمة من موقعك أو بدون origin (مثل طلبات الموبايل أو السيرفر نفسه)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('غير مصرح بهذا النطاق للوصول للـ API'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true
}));

// 2. حماية الـ Rate Limiting: حد أقصى 50 طلب لكل شخص كل 15 دقيقة لمنع الإغراق
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 50, // حد أقصى 50 طلب
    message: { message: 'تم تجاوز عدد المحاولات المسموح بها، يرجى المحاولة لاحقاً.' }
});

app.use('/api/', limiter);
app.use(express.json());

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
.catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

// مسارات الـ API (Routes)
// ... ضعي هنا باقي الـ Routes الخاصة بك مثل /api/orders ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`السيرفر يعمل على المنفذ ${PORT}`));

module.exports = app;