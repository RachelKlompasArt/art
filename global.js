/* =========================================
   GLOBAL SHARED LOGIC (global.js)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. NAVIGATION & HAMBURGER MENU
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    if (hamburgerIcon && dropdownMenu) {
        hamburgerIcon.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show-menu');
            hamburgerIcon.classList.toggle('active');
        });
    }

    // 2. CART & LOCAL STORAGE MANAGEMENT
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    
    const checkoutEmailBtn = document.getElementById('checkout-email-btn');
    const checkoutWaBtn = document.getElementById('checkout-wa-btn');

    let cart = JSON.parse(localStorage.getItem('artCart')) || [];

    function updateCartUI() {
        if (cartCount) cartCount.innerText = cart.length;
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your collection is currently empty.</p>';
            } else {
                cart.forEach((item, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'cart-item';
                    itemDiv.innerHTML = `
                        <div class="cart-item-info">
                            <h4>${item.title}</h4>
                            <p>${item.price} | Ships from: ${item.location}</p>
                        </div>
                        <span class="remove-item" data-index="${index}">&times;</span>
                    `;
                    cartItemsContainer.appendChild(itemDiv);
                });

                // Bind remove buttons
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const idx = e.target.getAttribute('data-index');
                        cart.splice(idx, 1);
                        localStorage.setItem('artCart', JSON.stringify(cart));
                        updateCartUI();
                    });
                });
            }
        }
    }

    if (cartIcon) cartIcon.addEventListener('click', () => cartSidebar.classList.add('open'));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));

    // Global cart helper (This allows gallery.js to easily add items to the cart)
    window.siteCart = {
        addItem: (item) => {
            const exists = cart.find(i => i.title === item.title);
            if (!exists) {
                cart.push(item);
                localStorage.setItem('artCart', JSON.stringify(cart));
                updateCartUI();
                if (cartSidebar) cartSidebar.classList.add('open');
                return true;
            } else {
                if (cartSidebar) cartSidebar.classList.add('open');
                return false;
            }
        }
    };

    updateCartUI();

    // 3. DUAL CHECKOUT HANDLERS (EMAIL & WHATSAPP)
    function buildOrderSummary() {
        let text = "Hi Rachel,\n\nI would like to purchase the following artwork(s):\n\n";
        cart.forEach((item, index) => {
            text += `${index + 1}. "${item.title}"\n   - Price: ${item.price}\n   - Ships from: ${item.location}\n\n`;
        });
        text += "My shipping address is:\n[Please enter address here]\n\nPlease reply with your banking details and the shipping cost to my address.\n\nThank you!";
        return text;
    }

    if (checkoutEmailBtn) {
        checkoutEmailBtn.addEventListener('click', () => {
            if (cart.length === 0) { alert("Your collection is empty."); return; }
            const rawText = buildOrderSummary();
            window.location.href = `mailto:rachel@rachelklompas.com?subject=${encodeURIComponent("Artwork Purchase Request")}&body=${encodeURIComponent(rawText)}`;
        });
    }

    if (checkoutWaBtn) {
        checkoutWaBtn.addEventListener('click', () => {
            if (cart.length === 0) { alert("Your collection is empty."); return; }
            const rawText = buildOrderSummary();
            window.open(`https://wa.me/+27768606099?text=${encodeURIComponent(rawText)}`, '_blank');
        });
    }

    // 4. GLOBAL CONTACT WIDGET
    const contactBubble = document.getElementById('contact-bubble');
    const contactPopup = document.getElementById('contact-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const contactGreeting = document.getElementById('contact-greeting'); 
    
    const waBtn = document.querySelector('.wa-btn');
    const emailBtn = document.querySelector('.email-btn');
    const messageBox = document.getElementById('contact-message');
    
    setTimeout(() => { 
        if(contactBubble) contactBubble.classList.add('show'); 
        if(contactGreeting) contactGreeting.classList.add('show');
        setTimeout(() => { if(contactGreeting) contactGreeting.classList.remove('show'); }, 10000);
    }, 3000);
    
    if(contactBubble) {
        contactBubble.addEventListener('click', () => {
            contactPopup.classList.add('open');
            contactBubble.style.display = 'none';
            if(contactGreeting) contactGreeting.classList.remove('show'); 
        });
    }
    
    if(closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            contactPopup.classList.remove('open');
            contactBubble.style.display = 'flex';
        });
    }

    if(waBtn) {
        waBtn.addEventListener('click', () => {
            const msg = messageBox ? messageBox.value : '';
            window.open(`https://wa.me/+27768606099?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }

    if(emailBtn) {
        emailBtn.addEventListener('click', () => {
            const msg = messageBox ? messageBox.value : '';
            window.location.href = `mailto:rachel@rachelklompas.com?subject=Website Inquiry&body=${encodeURIComponent(msg)}`;
        });
    }

    // 5. SMART SCROLL UI HIDING
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const fixedUI = document.querySelectorAll('.back-home-btn, .top-right-nav, #contact-widget-container');
        if (currentScrollY > 50 && currentScrollY > lastScrollY) {
            fixedUI.forEach(el => el.classList.add('hidden-on-scroll'));
        } else {
            fixedUI.forEach(el => el.classList.remove('hidden-on-scroll'));
        }
        lastScrollY = currentScrollY;
    });
});