const title = document.getElementById("title");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const total = document.getElementById("total");
const ads = document.getElementById("ads");
const discount = document.getElementById("discount");
const category = document.getElementById("category");
const count = document.getElementById("count");
const submit = document.getElementById("submit");
const tbody = document.querySelector("tbody");
const deleteAllBtn = document.getElementById("deleteAll");
const search = document.getElementById("search");
const searchTitleBtn = document.getElementById("searchtitle");
const searchCategoryBtn = document.getElementById("searchcategory");

// clear data
function clearData(){
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    title.value = "";
    category.value = "";
    count.value = "";
    total.innerHTML = "";
}

// get total
function getTotal(){
    if(price.value !=""){
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
    }
}

let editingProductId = null;
submit.addEventListener("click", function() {
    // التحقق من أن جميع الحقول مملوءة
    if (title.value === "" || price.value === "" || taxes.value === "" || ads.value === "" || discount.value === "" || category.value === "" || count.value === "") {
        alert("يرجى ملء جميع البيانات");
        return;
    }
    // استرجاع البيانات القديمة من Local Storage
    let products = JSON.parse(localStorage.getItem("products")) || [];
    // إنشاء كائن لتخزين البيانات
    let product = {
        id: editingProductId || products.length + 1, 
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        category: category.value,
        count: count.value
    };
    if (editingProductId) {
        // تحديث المنتج الموجود
        products = products.map(p => p.id === editingProductId ? product : p);
        editingProductId = null;
        submit.textContent = "Create"; // إعادة النص إلى "Create"
        // إعادة تحميل الصفحة
        location.reload();
    } else {
        // إضافة المنتج الجديد إلى المصفوفة بعدد المرات المحددة في count
        for (let i = 0; i < product.count; i++) {
            products.push({ ...product, id: products.length + 1 }); // استخدام معرف فريد لكل منتج
        }
    }
    // حفظ المصفوفة المحدثة في Local Storage
    localStorage.setItem("products", JSON.stringify(products));
    // تحديث الجدول
    tbody.innerHTML = "";
    products.forEach(product => addProductToTable(product));
    // مسح القيم في حقول الإدخال
    clearData();
    // إظهار زر "Delete All" إذا كان هناك منتجات
    if (products.length > 0) {
        deleteAllBtn.style.display = "block";
    }
});

function addProductToTable(product) {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.taxes}</td>
        <td>${product.ads}</td>
        <td>${product.discount}</td>
        <td>${product.total}</td>
        <td>${product.category}</td>
        <td><button id="edit" onclick="editProduct(${product.id})">Update</button></td>
        <td><button id="delet" onclick="deleteProduct(${product.id})">Delete</button></td>
    `;
    tbody.appendChild(row);
}

function editProduct(id) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let product = products.find(p => p.id === id);
    if (product) {
        title.value = product.title;
        price.value = product.price;
        taxes.value = product.taxes;
        ads.value = product.ads;
        discount.value = product.discount;
        category.value = product.category;
        count.value = product.count;
        total.innerHTML = product.total;
        editingProductId = id;
        submit.textContent = "Update"; // تغيير النص إلى "Update"
    }
}

function deleteProduct(id) {
    if (confirm("هل تريد حذف المنتج؟")) {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        products = products.filter(p => p.id !== id);
        localStorage.setItem("products", JSON.stringify(products));
        // تحديث الجدول
        tbody.innerHTML = "";
        products.forEach(product => addProductToTable(product));
        // إعادة تحميل الصفحة
        location.reload();
    }
}

deleteAllBtn.addEventListener("click", function() {
    if (confirm("هل تريد حذف جميع المنتجات؟")) {
        localStorage.removeItem("products");
        // تحديث الجدول
        tbody.innerHTML = "";
        // إعادة تحميل الصفحة
        location.reload();
    }
});

searchTitleBtn.addEventListener("click", function() {
    search.focus();
    search.placeholder = "Search by title...";
    search.oninput = function() {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        let filteredProducts = products.filter(p => p.title.toLowerCase().includes(search.value.toLowerCase()));
        tbody.innerHTML = "";
        filteredProducts.forEach(product => addProductToTable(product));
    };
});

searchCategoryBtn.addEventListener("click", function() {
    search.focus();
    search.placeholder = "Search by category...";
    search.oninput = function() {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        let filteredProducts = products.filter(p => p.category.toLowerCase().includes(search.value.toLowerCase()));
        tbody.innerHTML = "";
        filteredProducts.forEach(product => addProductToTable(product));
    };
});

// استرجاع البيانات من Local Storage عند تحميل الصفحة
window.onload = function() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.forEach(product => addProductToTable(product));

    // إظهار زر "Delete All" إذا كان هناك منتجات
    if (products.length > 0) {
        deleteAllBtn.style.display = "block";
        search.style.display = "block";
    }
};
