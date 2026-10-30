const API_URL = 'https://luxe-jewelry-yourname.koyeb.app/api';

// جلب المنتجات والطلبات فور فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadAdminProducts();
    loadAdminOrders();
});

// جلب وعرض المنتجات في لوحة التحكم
async function loadAdminProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();
        const tbody = document.getElementById('products-list-admin');
        
        tbody.innerHTML = products.map(p => `
            <tr>
                <td><img src="${p.image}" width="50" height="50" style="object-fit:cover; border-radius: 4px;"></td>
                <td>${p.name}</td>
                <td>${p.category || '-'}</td>
                <td>${p.price} ج.م</td>
                <td><button class="del-btn" onclick="deleteProduct('${p._id}')">حذف</button></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('خطأ في تحميل المنتجات:', err);
    }
}

// إضافة منتج جديد
async function handleAddProduct(event) {
    event.preventDefault();
    const newProd = {
        name: document.getElementById('prod-name').value,
        category: document.getElementById('prod-category').value,
        price: Number(document.getElementById('prod-price').value),
        description: document.getElementById('prod-desc').value,
        image: document.getElementById('prod-image').value
    };

    try {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProd)
        });
        if (res.ok) {
            alert('تمت إضافة المنتج بنجاح! 🎉');
            document.getElementById('add-product-form').reset();
            loadAdminProducts();
        }
    } catch (err) {
        alert('حدث خطأ أثناء إضافة المنتج.');
    }
}

// حذف منتج
async function deleteProduct(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
        const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('تم حذف المنتج بنجاح!');
            loadAdminProducts();
        }
    } catch (err) {
        alert('حدث خطأ أثناء الحذف.');
    }
}

// جلب وعرض طلبات العملاء
async function loadAdminOrders() {
    try {
        const res = await fetch(`${API_URL}/orders`);
        const orders = await res.json();
        const tbody = document.getElementById('orders-list-admin');

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">لا توجد طلبات واردة حتى الآن.</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>${o.customer?.name || '-'}</td>
                <td>${o.customer?.phone || '-'}</td>
                <td>${o.customer?.address || '-'}</td>
                <td>${o.items ? o.items.map(i => i.name).join(', ') : '-'}</td>
                <td><strong>${o.totalAmount} ج.م</strong></td>
                <td>${new Date(o.createdAt).toLocaleDateString('ar-EG')}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('خطأ في تحميل الطلبات:', err);
    }
}