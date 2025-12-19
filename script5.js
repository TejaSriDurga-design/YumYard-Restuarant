let cartItems = [];
let cartCount = 0;

// Navigate to menu page
function goToMenu() {
    window.location.href = "menu5.html";
}

// Add item to cart
function addToCart(itemName, price) {
    cartItems.push({ name: itemName, price: price });
    cartCount++;
    document.getElementById("cartCount").innerText = cartCount;
    alert(itemName + " added to cart 🛒");
}

// Place order
function placeOrder() {
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let total = 0;
    let summary = "<h3>Order Summary</h3><ul>";

    cartItems.forEach(item => {
        summary += `<li>${item.name} - ₹${item.price}</li>`;
        total += item.price;
    });

    summary += `</ul><p><b>Total Amount: ₹${total}</b></p>`;
    summary += "<p>✅ Order Placed Successfully!</p>";

    document.getElementById("orderSummary").innerHTML = summary;

    // Clear cart
    cartItems = [];
    cartCount = 0;
    document.getElementById("cartCount").innerText = 0;
}