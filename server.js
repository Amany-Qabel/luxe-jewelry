const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/Product');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// تمكين سيرفر Express من خدمة الصور المحلية من مجلد images
app.use('/images', express.static('images'));

// الاتصال بقاعدة البيانات MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ تم الاتصال بنجاح بقاعدة البيانات MongoDB'))
  .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// الصفحة الرئيسية لتأكيد عمل السيرفر
app.get('/', (req, res) => {
  res.send('🚀 السيرفر يعمل بنجاح وقاعدة البيانات متصلة!');
});

// مسار لإضافة كافة المنتجات بالصور الحقيقية المطابقة لملفاتك
app.get('/api/seed', async (req, res) => {
    try {
        // التأكد من جاهزية الاتصال بقاعدة البيانات
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ error: "الاتصال بقاعدة البيانات لم يكتمل بعد، يرجى المحاولة بعد ثوانٍ." });
        }

        // حذف المنتجات القديمة لإعادة إضافة التشكيلة الكاملة
        await Product.deleteMany({});

        const sampleProducts = [
            // --- 1. قسم الخواتم (مجلد gold) ---
            {
                name: "خاتم ذهب أبيض مرصع بالألماس",
                price: 12500,
                description: "خاتم فاخر من الذهب الأبيض عيار 18 مرصع بالألماس النقي.",
                category: "خاتم",
                image: "http://localhost:5000/images/gold/gold1.jpg.jpg"
            },
            {
                name: "خاتم ذهب ملكي فخم",
                price: 10800,
                description: "تصميم كلاسيكي جذاب يمنحكِ إطلالة ساحرة.",
                category: "خاتم",
                image: "http://localhost:5000/images/gold/gold2.jpg.webp"
            },
            {
                name: "خاتم ألماس عصري",
                price: 13200,
                description: "خاتم أنيق بلمسات ماسية عصرية يناسب كل الأوقات.",
                category: "خاتم",
                image: "http://localhost:5000/images/gold/gold3.jpg.webp"
            },
            {
                name: "خاتم ذهب عيار 21",
                price: 9500,
                description: "خاتم راقٍ بتفاصيل ناعمة وجودة عالية.",
                category: "خاتم",
                image: "http://localhost:5000/images/gold/gold4.jpg.webp"
            },
            {
                name: "خاتم ألماس كلاسيك",
                price: 14000,
                description: "بريق لا ينطفئ وتصميم يواكب الموضة.",
                category: "خاتم",
                image: "http://localhost:5000/images/gold/gold5.jpg.webp"
            },

            // --- 2. قسم السلاسل (مجلد chain) ---
            {
                name: "سلسلة ذهب باللؤلؤ الملكي",
                price: 8500,
                description: "سلسلة رقيقة من الذهب الأصفر عيار 18 مرصعة بجمال اللؤلؤ الطبيعي.",
                category: "سلسلة",
                image: "http://localhost:5000/images/chain/chain1.jpg"
            },
            {
                name: "قلادة ماسية أنيقة",
                price: 11200,
                description: "قلادة مميزة تبرز أنوثتكِ في المناسبات السعيدة.",
                category: "سلسلة",
                image: "http://localhost:5000/images/chain/chain2.jpg"
            },
            {
                name: "سلسلة ذهب عيار 18 ناعمة",
                price: 7600,
                description: "سلسلة خفيفة ورقيقة لإطلالة يومية مميزة.",
                category: "سلسلة",
                image: "http://localhost:5000/images/chain/chain3.jpg"
            },
            {
                name: "سلسلة ماسية فاخرة",
                price: 13800,
                description: "تصميم فريد مرصع بحبات الألماس اللامعة.",
                category: "سلسلة",
                image: "http://localhost:5000/images/chain/chain4.jpg"
            },
            {
                name: "قلادة الذهب الأبيض",
                price: 9900,
                description: "لمسة من السحر والأناقة المعاصرة.",
                category: "سلسلة",
                image: "http://localhost:5000/images/chain/chain5.jpg"
            },

            // --- 3. قسم الأساور (مجلد bracelet) ---
            {
                name: "أسورة ذهبية ماسية",
                price: 15000,
                description: "أسورة أنيقة بتصميم عصري راقٍ يناسب كافة المناسبات.",
                category: "أسورة",
                image: "http://localhost:5000/images/bracelet/bracelet1.jpg"
            },
            {
                name: "أسورة ملكية مرصعة",
                price: 16500,
                description: "أسورة فاخرة ببريق الألماس والنقاء العالي.",
                category: "أسورة",
                image: "http://localhost:5000/images/bracelet/bracelet2.jpg"
            },
            {
                name: "أسورة ذهب كلاسيك",
                price: 11000,
                description: "تصميم أنيق وبسيط يعكس الذوق الفاخر.",
                category: "أسورة",
                image: "http://localhost:5000/images/bracelet/bracelet3.jpg"
            },
            {
                name: "أسورة ماسية ناعمة",
                price: 12800,
                description: "أسورة رقيقة تمنح معصمكِ مظهر ساحر.",
                category: "أسورة",
                image: "http://localhost:5000/images/bracelet/bracelet4.jpg"
            },
            {
                name: "أسورة ذهب عيار 18 ممتازة",
                price: 13900,
                description: "جودة استثنائية وتفاصيل دقيقة في التصنيع.",
                category: "أسورة",
                image: "http://localhost:5000/images/bracelet/bracelet5.jpg"
            }
        ];

        await Product.insertMany(sampleProducts);
        res.json({ message: "تمت إضافة جميع المنتجات بنجاح!", count: sampleProducts.length, products: sampleProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// المسارات الخاصة بالمنتجات (Routes)
app.use('/api/products', require('./routes/productRoutes'));

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`);
});
// نموذج الطلبات (Order Model)
const Order = mongoose.model('Order', new mongoose.Schema({
    customer: { name: String, phone: String, address: String },
    items: Array,
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now }
}));

// 1. إضافة منتج جديد
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, description, category, image } = req.body;
        const newProduct = new Product({ name, price, description, category, image });
        await newProduct.save();
        res.status(201).json({ message: "تمت إضافة المنتج بنجاح!", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. حذف منتج
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "تم حذف المنتج بنجاح!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. إنشاء طلب جديد من العميل
app.post('/api/orders', async (req, res) => {
    try {
        const { customer, items, totalAmount } = req.body;
        const newOrder = new Order({ customer, items, totalAmount });
        await newOrder.save();
        res.status(201).json({ message: "تم حفظ الطلب بنجاح!", orderId: newOrder._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. جلب كافة الطلبات للآدمن
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});