const Product = require('../models/Product');

// جلب جميع المنتجات مع إمكانية التصفية
exports.getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};
        if (category && category !== 'all') {
            filter.category = category;
        }
        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء جلب المنتجات', error: error.message });
    }
};

// إضافة منتج جديد
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: 'فشل إضافة المنتج', error: error.message });
    }
};