// Funktion zum Hinzufügen eines Artikels in den Warenkorb
document.querySelectorAll('[add-to-cart]').forEach(button => {
    button.addEventListener('click', function () {
        const item = {
            id: this.getAttribute('data-id'),
            name: this.getAttribute('data-name'),
            image: this.getAttribute('data-image'),
            description: this.getAttribute('data-description'),
            price_id: this.getAttribute('data-price_id'),
            price: parseFloat(this.getAttribute('data-price'))
        };

        addToCart(item);  // Diese Funktion ruft setCookie auf
    });
});

// Funktion zum Hinzufügen von Artikeln in den Warenkorb und zum Setzen eines Cookies
function addToCart(item) {
    let cart = getCookie('cart') || [];

    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1; // Menge erhöhen
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            image: item.image,
            description: item.description,
            price: item.price,
            price_id: item.price_id,
            quantity: 1
        });
    }

    // Warenkorb im Cookie speichern
    setCookie('cart', cart, 7); // Cookie für 7 Tage setzen
    alert("Artikel wurde hinzugefügt!");
}

// Funktion zum Setzen eines Cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Ablaufdatum
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
}

// Funktion zum Abrufen eines Cookies
function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name + "=") === 0) {
            return JSON.parse(c.substring(name.length + 1, c.length));
        }
    }
    return null;
}

// Event listener for "Remove from Cart" buttons
function setupRemoveListeners() {
    document.querySelectorAll('[remove-from-cart]').forEach(button => {
        button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-id');
            removeFromCart(itemId);
        });
    });
}

// Funktion zum Entfernen eines Artikels aus dem Warenkorb
function removeFromCart(itemId) {
    let cart = getCookie('cart') || [];
    
    // Filter the cart to remove the item
    cart = cart.filter(item => item.id !== itemId);

    // Update the cookie with the modified cart
    setCookie('cart', cart, 7); // 7 days expiry

    // Re-render the cart after removal
    renderCart();
}

// Function to render the cart
function renderCart() {
    const cart = getCookie('cart') || [];
    const cartContainer = document.getElementById('cart-container');

    // Clear current cart display
    cartContainer.innerHTML = '';

    // Display cart items
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Der Warenkorb ist leer.</p>";
    } else {
        cart.forEach(item => {
            cartContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p>${item.price} €</p>
                        <p>Menge: ${item.quantity}</p>
                        <p>${item.price_id}</p>
                        <button class="button" data-id="${item.id}" remove-from-cart="true">Entfernen</button>
                    </div>
                </div>
            `;
        });
        // Set up listeners again after rendering
        setupRemoveListeners();
    }

    // Update the hidden input field with the cart contents
    updateCartInput();
}

// Function to update the hidden input field with cart contents
function updateCartInput() {
    const cart = getCookie('cart');
    const cartInput = document.getElementById('cart-input');

    console.log("Cart from cookie:", cart); // Debug: Log the cart
    if (cart && cartInput) {
        cartInput.value = JSON.stringify(cart);
        console.log("Cart input updated:", cartInput.value); // Debug: Log the input value
    } else {
        console.warn("Cart is empty or input field not found!");
    }
}

// Update the cart input on page load
window.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded. Updating cart input...");
    renderCart();  // Render the cart when the page is loaded
});

// Monitor changes to the cookie and update the input
let previousCart = getCookie('cart');
setInterval(() => {
    const currentCart = getCookie('cart');
    if (JSON.stringify(previousCart) !== JSON.stringify(currentCart)) {
        console.log("Cart changed. Updating input...");
        renderCart(); // Re-render the cart if it changes
        previousCart = currentCart; // Update the reference
    }
}, 1000); // Check every second