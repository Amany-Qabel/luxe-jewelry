const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// 1. إعدادات CORS للحماية
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// 2. Rate Limiting لحماية الـ API
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'تم تجاوز عدد المحاولات المسموح بها، يرجى المحاولة لاحقاً.' }
});

app.use('/api/', limiter);
app.use(express.json());

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
.catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

// ----------------------------------------------------
// Schemas & Models (نماذج البيانات)
// ----------------------------------------------------

const orderSchema = new mongoose.Schema({
    customer: {
        name: String,
        phone: String,
        address: String
    },
    items: Array,
    totalPrice: Number,
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: String,
    createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);


// ----------------------------------------------------
// API Routes (المسارات)
// ----------------------------------------------------

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "luxeAdmin2026";

// 🔑 مسار تسجيل دخول الأدمن
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        return res.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
    }
    return res.status(401).json({ success: false, message: 'كلمة المرور غير صحيحة' });
});

// جلب جميع المنتجات
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'خطأ في جلب المنتجات' });
    }
});

// إضافة منتج جديد (مع رسالة خطأ مفصلة للاكتشاف السريع)
app.post('/api/admin/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, product: newProduct });
    } catch (err) {
        console.error('تفاصيل خطأ الإضافة:', err.message);
        res.status(400).json({ success: false, error: err.message });
    }
});

// حذف منتج (للأدمن)
app.delete('/api/admin/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
    } catch (err) {
        res.status(500).json({ error: 'فشل حذف المنتج' });
    }
});

// تسجل طلب جديد (من العميل)
app.post('/api/orders', async (req, res) => {
    try {
        const { items, customer } = req.body;
        const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
        
        const newOrder = new Order({ items, customer, totalPrice });
        await newOrder.save();
        
        res.status(201).json({ success: true, order: newOrder });
    } catch (err) {
        res.status(500).json({ error: 'فشل تسجيل الطلب' });
    }
});

// جلب كافة الطلبات (للأدمن)
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'خطأ في جلب الطلبات' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`السيرفر يعمل على المنفذ ${PORT}`));

module.exports = app;