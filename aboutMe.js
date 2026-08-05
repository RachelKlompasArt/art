document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. NAVIGATION LOGIC
    // =========================================
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (hamburgerIcon && dropdownMenu) {
        hamburgerIcon.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show-menu');
            hamburgerIcon.classList.toggle('active');
        });
    }

    // =========================================
    // 2. CART & ONE-TAP CHECKOUT LOGIC
    // =========================================
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

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('open');
        });
    }
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    function buildOrderSummary() {
        let text = "Hi Rachel,\n\nI would like to purchase the following artwork(s):\n\n";
        cart.forEach((item, index) => {
            text += `${index + 1}. "${item.title}"\n   - Price: ${item.price}\n   - Ships from: ${item.location}\n\n`;
        });
        text += "Please reply with your banking details and the shipping cost to my address.\n\nThank you!";
        return text;
    }

    if (checkoutEmailBtn) {
        checkoutEmailBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your collection is empty.");
                return;
            }
            const rawText = buildOrderSummary();
            const emailAddress = "rachel@rachelklompas.com";
            const subject = "Artwork Purchase Request";
            window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawText)}`;
        });
    }

    if (checkoutWaBtn) {
        checkoutWaBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your collection is empty.");
                return;
            }
            const rawText = buildOrderSummary();
            const phoneNumber = "+27768606099"; 
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(rawText)}`, '_blank');
        });
    }

    updateCartUI();

    // =========================================
    // 3. GLOBAL CONTACT WIDGET LOGIC
    // =========================================
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
        
        setTimeout(() => {
            if(contactGreeting) contactGreeting.classList.remove('show');
        }, 10000);
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
            const phoneNumber = "+27768606099"; 
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }

    if(emailBtn) {
        emailBtn.addEventListener('click', () => {
            const msg = messageBox ? messageBox.value : '';
            const emailAddress = "rachel@rachelklompas.com"; 
            window.location.href = `mailto:${emailAddress}?subject=Website Inquiry&body=${encodeURIComponent(msg)}`;
        });
    }

    // =========================================
    // 4. SMART SCROLL UI HIDING
    // =========================================
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        // Targets the home button, the top right nav, and the contact widget
        const fixedUI = document.querySelectorAll('.back-home-btn, .top-right-nav, #contact-widget-container');
        
        if (currentScrollY > 50 && currentScrollY > lastScrollY) {
            fixedUI.forEach(el => el.classList.add('hidden-on-scroll'));
        } else {
            fixedUI.forEach(el => el.classList.remove('hidden-on-scroll'));
        }
        lastScrollY = currentScrollY;
    });
});