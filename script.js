// ===============================
// CART DATA
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartCount();
renderCart();

// ===============================
// DARK MODE
function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    // IMPORTANT: sync button too
    const btn = document.getElementById("themeBtn");
    if (!btn) return;

    btn.innerHTML =
        theme === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    const btn = document.getElementById("themeBtn");
    if (btn) {
        btn.innerHTML = isDark ? "☀️" : "🌙";
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// apply on load
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);



// CART FUNCTIONS
// ===============================

function addToCart(name, price) {

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();

    showToast(name + " added to cart 🛒");
}

function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();
}

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    saveCart();
}

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    showToast("Item removed");
}

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();
}

function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) return;

    let count = 0;

    cart.forEach(item => {
        count += item.quantity;
    });

    cartCount.innerText = count;
}

// ===============================
// RENDER CART
// ===============================

function renderCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `

        <div class="cart-item">

          <div>

    <strong>${item.name}</strong>

    <p>
        ₹${item.price}
    </p>

</div>

            <div>

                <div class="quantity-controls">

                    <button
                    onclick="decreaseQuantity(${index})">
                    -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                    onclick="increaseQuantity(${index})">
                    +
                    </button>

                </div>

                <br>

                <button
                class="remove-btn"
                onclick="removeItem(${index})">
                🗑 Remove
                </button>

            </div>

        </div>

        `;
    });

    cartTotal.innerText = total;
}

// ===============================
// SIDEBAR
// ===============================

function toggleCart() {

    const sidebar =
        document.getElementById("cartSidebar");

    if (!sidebar) return;

    sidebar.classList.toggle("active");
}

// ===============================
// SEARCH
// ===============================

function searchFood() {

    const input =
        document.getElementById("searchBox")
        .value
        .toLowerCase();

    const cards =
        document.querySelectorAll(".menu-card");

    cards.forEach(card => {

        const title =
            card.querySelector("h3")
            .innerText
            .toLowerCase();

        if (title.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
}

// ===============================
// FILTERS
// ===============================

function filterFood(category) {

    const cards =
        document.querySelectorAll(".menu-card");

    cards.forEach(card => {

        if (category === "all") {

            card.style.display = "block";

        } else {

            if (
                card.classList.contains(category)
            ) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        }

    });
}

// ===============================
// PLACE ORDER
// ===============================

function placeOrder() {

    if (cart.length === 0) {

        showToast("Cart is empty!");

        return;
    }

    let orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];

    const order = {

        date:
            new Date()
            .toLocaleString(),

       items: JSON.parse(JSON.stringify(cart)) ,

        total:
            cart.reduce(
                (sum, item) =>
                sum +
                item.price *
                item.quantity,
                0
            )
    };

    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    cart = [];

    localStorage.removeItem("cart");

    saveCart();

    showToast(
        "✅ Order placed successfully!"
    );
}

// ===============================
// ORDER HISTORY
// ===============================

    
    function loadOrderHistory() {

    const container = document.getElementById("historyContainer");
    if (!container) return;

    container.innerHTML = ""; // IMPORTANT FIX

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-history">
                🥺 No orders yet. Start ordering delicious food!
            </div>
        `;
        return;
    }

    orders.reverse().forEach(order => {

        let itemsHTML = "";

        order.items.forEach(item => {
            itemsHTML += `
                <li>${item.name} × ${item.quantity} - ₹${item.price}</li>
            `;
        });

        container.innerHTML += `
            <div class="order-card">
                <h3>📅 ${order.date}</h3>

                <ul>${itemsHTML}</ul>

                <div class="order-total">
                    Total: ₹${order.total}
                </div>
            </div>
        `;
    });
}
        

// ===============================
// RECEIPT DOWNLOAD
// ===============================

function downloadReceipt() {

    if (cart.length === 0) {

        showToast("Cart is empty");

        return;
    }

    let receipt =
        "===== YUMYARD RECEIPT =====\n\n";

    let total = 0;

    cart.forEach(item => {

        let amount =
            item.price *
            item.quantity;

        total += amount;

        receipt +=
        `${item.name}
Qty:${item.quantity}
₹${amount}\n\n`;
    });

    receipt +=
    `Total Amount: ₹${total}`;

    const blob =
        new Blob(
            [receipt],
            { type: "text/plain" }
        );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "Yumyard_Receipt.txt";

    link.click();
}
function showRecommendations(){

    const title =
    document.getElementById(
    "recommendationTitle");

    const text =
    document.getElementById(
    "recommendationText");

    if(!title || !text) return;

    const hour =
    new Date().getHours();

    // Morning

    if(hour >= 6 && hour < 11){

        title.innerHTML =
        "🍳 Good Morning!";

        text.innerHTML =
        "Try our Idli, Dosa, Poori and Upma.";
    }

    // Lunch

    else if(hour >= 11 && hour < 16){

        title.innerHTML =
        "🍛 Lunch Specials";

        text.innerHTML =
        "Chicken Biryani, Veg Biryani and Veg Meals are popular right now.";
    }

    // Evening Snacks

    else if(hour >= 16 && hour < 19){

        title.innerHTML =
        "🍔 Evening Snacks";

        text.innerHTML =
        "Veg Burger, Paneer Pizza and Chicken Popcorn are perfect for this time.";
    }

    // Dinner

    else{

        title.innerHTML =
        "🌙 Dinner Time";

        text.innerHTML =
        "Enjoy Prawn Biryani, Chicken Curry and Paneer Butter Masala.";
    }
}

// ===============================
// TOAST
// ===============================
function filterCategory(category){

    const cards =
    document.querySelectorAll(".menu-card");

    cards.forEach(card => {

        if(category === "all"){

            card.style.display = "block";
        }
        else{

            if(card.classList.contains(category)){

                card.style.display = "block";
            }
            else{

                card.style.display = "none";
            }
        }

    });
}
function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}

// ===============================
// AUTO LOAD HISTORY PAGE
// ===============================

window.addEventListener("DOMContentLoaded", () => {
    loadOrderHistory();
    showRecommendations();
});