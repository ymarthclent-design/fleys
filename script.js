function addToCart(name, price, quantity = 1) {

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    quantity = parseInt(quantity);

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    showNotification(`${quantity} x ${name} added to cart!`);
}



function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCart(cart);
}



function updateCart(cart) {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p class='empty-cart'>Your cart is empty</p>";
        updateTotals(0);
        return;
    }

    let html = '';

    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <span>
                    ${item.name} (₱${item.price.toFixed(2)}) x ${item.quantity}
                </span>
                <button onclick="removeFromCart('${item.name}')">
                    Remove
                </button>
            </div>
        `;
    });

    cartContainer.innerHTML = html;

    const subtotal = cart.reduce((sum, item) => 
        sum + item.price * item.quantity, 0);

    updateTotals(subtotal);
}



function updateTotals(subtotal) {

    const subtotalEl = document.getElementById('subtotal');
    const deliveryEl = document.getElementById('deliveryFee');
    const totalEl = document.getElementById('total');

    if (!subtotalEl || !deliveryEl || !totalEl) return;

    const deliveryOption = document.querySelector('input[name="delivery"]:checked');
    const deliveryFee = deliveryOption ? parseFloat(deliveryOption.dataset.price) : 0;

    subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
    deliveryEl.textContent = `₱${deliveryFee.toFixed(2)}`;
    totalEl.textContent = `₱${(subtotal + deliveryFee).toFixed(2)}`;
}



function removeFromCart(name) {

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart = cart.filter(item => item.name !== name);

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCart(cart);

    showNotification(`${name} removed from cart.`);
}



function showNotification(msg) {

    const notif = document.createElement('div');

    notif.innerText = msg;
    notif.style.position = 'fixed';
    notif.style.top = '20px';
    notif.style.right = '20px';
    notif.style.backgroundColor = '#ffb6c1';
    notif.style.padding = '10px 20px';
    notif.style.borderRadius = '8px';
    notif.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
    notif.style.zIndex = '1000';

    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 2000);
}



document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('cartItems')) {

        loadCart();

        const deliveryOptions = document.querySelectorAll('input[name="delivery"]');

        deliveryOptions.forEach(option => 
            option.addEventListener('change', () => {

                let cart = JSON.parse(localStorage.getItem('cart')) || [];

                const subtotal = cart.reduce((sum, item) => 
                    sum + item.price * item.quantity, 0);

                updateTotals(subtotal);
            })
        );

        const checkoutForm = document.getElementById('checkoutForm');

        if (checkoutForm) {
            checkoutForm.addEventListener('submit', function(e) {

                e.preventDefault();

                let cart = JSON.parse(localStorage.getItem('cart')) || [];

                if (cart.length === 0) {
                    alert('Your cart is empty!');
                    return;
                }

                alert('Order placed! Thank you.');

                localStorage.removeItem('cart');

                loadCart();

                checkoutForm.reset();
            });
        }
    }
});