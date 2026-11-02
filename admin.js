const API_BASE_URL = 'https://luxe-jewelry-eight.vercel.app/api';

// التحقق عند تحميل الصفحة لو الأدمن مسجل دخوله مسبقاً
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }
});

// تسجيل دخول الأدمن
async function loginAdmin() {
    const password = document.getElementById('admin-password').value;
    if (!password) {
        alert('يرجى إدخال كلمة المرور.');
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        if (data.success) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
        } else {
            alert('كلمة المرور غير صحيحة!');
        }
    } catch (error) {
        console.error('خطأ في الاتصال:', error);
        alert('حدث خطأ أثناء الاتصال بالسيرفر.');
    }
}

// تسجيل الخروج
function logoutAdmin() {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
}

// إظهار لوحة التحكم وتحميل البيانات
function showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    loadProducts();
    loadOrders();
}

// التنقل بين التبويبات
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).style.display = 'block';
    event.target.classList.add('active');
}

// جلب وعرض المنتجات
async function loadProducts() {
    try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const products = await res.json();

        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">لا توجد منتجات مسجلة حتى الآن.</td></tr>';
            return;
        }

        tbody.innerHTML = products.map(p => `
            <tr>
                <td><img src="${p.image}" width="50" height="50" style="object-fit:cover; border-radius:4px;" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td>${p.price} ج.م</td>
                <td>
                    <button class="btn-danger" onclick="deleteProduct('${p._id}')">حذف</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('فشل تحميل المنتجات:', err);
    }
}

// إضافة منتج جديد (مع إظهار سبب الخطأ بدقة لو حدث)
async function handleAddProduct(event) {
    event.preventDefault();

    const productData = {
        name: document.getElementById('prod-name').value,
        category: document.getElementById('prod-category').value,
        price: Number(document.getElementById('prod-price').value),
        description: document.getElementById('prod-desc').value,
        image: document.getElementById('prod-image').value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/admin/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        const data = await res.json();
        if (data.success) {
            alert('تم إضافة المنتج بنجاح! 🎉');
            document.getElementById('add-product-form').reset();
            loadProducts();
            switchTab('products');
        } else {
            // عرض تفاصيل الخطأ القادم من السيرفر مباشرة
            alert('خطأ من السيرفر: ' + (data.error || 'فشل إضافة المنتج.'));
        }
    } catch (err) {
        console.error('خطأ:', err);
        alert('حدث خطأ أثناء الاتصال.');
    }
}

// حذف منتج
async function deleteProduct(id) {
    if (!confirm('هل أنتِ متأكدة من حذف هذا المنتج؟')) return;

    try {
        const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
            method: 'DELETE'
        });

        const data = await res.json();
        if (data.success) {
            alert('تم حذف المنتج بنجاح.');
            loadProducts();
        } else {
            alert('فشل حذف المنتج.');
        }
    } catch (err) {
        console.error('خطأ:', err);
    }
}

// جلب وعرض طلبات العملاء
async function loadOrders() {
    try {
        const res = await fetch(`${API_BASE_URL}/admin/orders`);
        const orders = await res.json();

        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">لا توجد طلبات مسجلة حتى الآن.</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>${new Date(o.createdAt).toLocaleDateString('ar-EG')}</td>
                <td>${o.customer ? o.customer.name : 'غير محدد'}</td>
                <td>${o.customer ? o.customer.phone : '-'}</td>
                <td>${o.customer ? o.customer.address : '-'}</td>
                <td><strong style="color:#d4af37;">${o.totalPrice} ج.م</strong></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('فشل تحميل الطلبات:', err);
    }
}