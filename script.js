const API_BASE_URL = 'https://amany-jewelry.vercel.app/api';
let allProducts = [];
let cart = [];

// 1. جلب المنتجات أو عرض البيانات الاحتياطية
async function fetchProducts() {
    try {
        const API_URL = 'https://luxe-jewelry-yourname.koyeb.app/api/products';
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('فشل الاتصال بالسيرفر');
        }
        
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.log('استخدام البيانات المحلية الاحتياطية:', error);
        
        // بيانات تجريبية تظهر فوراً
        allProducts = [
            {
                _id: '1',
                name: 'خاتم ألماس فاخر',
                description: 'خاتم مرصع بفصوص الزريكون البراقة',
                price: 1500,
                category: 'خاتم',
                image: 'images/ring1.jpg'
            },
            {
                _id: '2',
                name: 'سلسلة ذهبية أنيقة',
                description: 'سلسلة مميزة بتصميم عصري راقي',
                price: 2200,
                category: 'سلسلة',
                image: 'images/necklace1.jpg'
            },
            {
                _id: '3',
                name: 'أسورة لؤلؤ',
                description: 'أسورة أنيقة تناسب السهرات والمناسبات',
                price: 1200,
                category: 'أسورة',
                image: 'images/bracelet1.jpg'
            }
        ];
        displayProducts(allProducts);
    }
}

// 2. عرض كروت المنتجات داخل الواجهة
function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">لا توجد منتجات متوفرة في هذا القسم حالياً.</p>';
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250?text=LUXE+JEWELRY'">
            <h3>${product.name}</h3>
            <p>${product.description || ''}</p>
            <span class="price">${product.price} ج.م</span>
            <button onclick="addToCart('${product._id}')">إضافة للسلة</button>
        </div>
    `).join('');
}

// 3. تصفية المنتجات حسب القسم
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => 
            (p.category && p.category.includes(category)) || p.name.includes(category)
        );
        displayProducts(filtered);
    }
}

// 4. إظهار وإخفاء سلة الشراء
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        if (cartModal.style.display === 'flex') {
            cartModal.style.display = 'none';
        } else {
            cartModal.style.display = 'flex';
        }
    }
}

// 5. إضافة منتج إلى السلة
function addToCart(productId) {
    const product = allProducts.find(p => p._id === productId);
    if (product) {
        cart.push(product);
        updateCartUI();
    }
}

// 6. حذف منتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// 7. تحديث واجهة سلة الشراء والإجمالي
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartCount) cartCount.innerText = cart.length;

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-msg">السلة فارغة حالياً</p>';
        } else {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                    <div>
                        <h4 style="margin: 0; font-size: 0.95rem;">${item.name}</h4>
                        <span style="color: #d4af37; font-weight: bold; font-size: 0.85rem;">${item.price} ج.م</span>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">حذف</button>
                </div>
            `).join('');
        }
    }

    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.innerText = `${total} ج.م`;
    }
}

// تشغيل الكود فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', fetchProducts);