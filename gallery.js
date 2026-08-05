document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. DOM ELEMENTS
    // =========================================
    const galleryContainer = document.getElementById('gallery-container');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalMedium = document.getElementById('modalMedium');
    const modalSize = document.getElementById('modalSize');
    const modalPrice = document.getElementById('modalPrice');
    const modalBgTitle = document.getElementById('modalBgTitle');
    
    const closeBtn = document.querySelector('.close');
    const modalPrevBtn = document.getElementById('prev');
    const modalNextBtn = document.getElementById('next');

    // Cart Elements
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    
    const checkoutEmailBtn = document.getElementById('checkout-email-btn');
    const checkoutWaBtn = document.getElementById('checkout-wa-btn');

    // =========================================
    // 2. CART & ONE-TAP CHECKOUT LOGIC
    // =========================================
    let cart = JSON.parse(localStorage.getItem('artCart')) || [];

    function updateCartUI() {
        // Update bubble count
        if (cartCount) cartCount.innerText = cart.length;

        // Populate sidebar
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

    // Toggle Cart Sidebar
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

    // Helper: Construct Order Summary
    function buildOrderSummary() {
        let text = "Hi Rachel,my adress is:\n\nI would like to purchase the following artwork(s):\n\n";
        cart.forEach((item, index) => {
            text += `${index + 1}. "${item.title}"\n   - Price: ${item.price}\n   - Ships from: ${item.location}\n\n`;
        });
        text += "Please reply with your banking details and the shipping cost to my address.\n\nThank you!";
        return text;
    }

    // Option A: Order via Email
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

    // Option B: Order via WhatsApp
    if (checkoutWaBtn) {
        checkoutWaBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your collection is empty.");
                return;
            }
            const rawText = buildOrderSummary();
            const phoneNumber = "+27768606099"; // Your phone number
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(rawText)}`, '_blank');
        });
    }

    // Initialize cart UI on load
    updateCartUI();

    // =========================================
    // 3. FETCH DATA & BUILD GALLERY
    // =========================================
    fetch('./gallery_data.json')
        .then(response => response.json())
        .then(artworks => {
            let currentModalArtIndex = 0;
            let currentModalImgIndex = 0;

            // Build the Scrolling Gallery
            artworks.forEach((art, artIndex) => {
                const section = document.createElement('section');
                section.className = 'art-panel';
                const isReverse = artIndex % 2 !== 0 ? 'reverse' : '';
                const bgWordText = art.bgWord || art.title.split(' ')[0] || 'Art';
                const locationText = art.location ? art.location : 'Israel'; // Default fallback
                
                let statusHtml = '';
                if (art.statusMsg && art.statusMsg.trim() !== '') {
                    if (art.statusLink && art.statusLink.trim() !== '') {
                        statusHtml = `
                            <div class="status-overlay">
                                <a href="${art.statusLink}" target="_blank" class="status-link">
                                    ${art.statusMsg} <span class="link-icon">&#8599;&#xFE0E;</span>
                                </a>
                            </div>`;
                    } else {
                        statusHtml = `<div class="status-overlay">${art.statusMsg}</div>`;
                    }
                }

                section.innerHTML = `
                    <div class="art-bounding-box ${isReverse}">
                        ${statusHtml}
                        <div class="bg-title">${bgWordText}</div>
                        <div class="image-carousel">
                            <span class="nav-arrow carousel-btn prev-btn">&#10094;&#xFE0E;</span>
                            <img class="art-image" src="${art.carouselImages[0] || art.coverImage}" alt="${art.title}" data-art-index="${artIndex}" data-img-index="0">
                            <span class="nav-arrow carousel-btn next-btn">&#10095;&#xFE0E;</span>
                        </div>
                        <div class="museum-plaque clickable-plaque" data-art-index="${artIndex}">
                            <h2>${art.title}</h2>
                            <p>${art.medium}</p>
                            <span class="location-badge">Ships from: ${locationText}</span>
                            <h3>Price: ${art.price}</h3>
                        </div>
                    </div>
                `;
                galleryContainer.appendChild(section);

                // Wire up the In-Gallery Carousel Hover Arrows
                let localImgIndex = 0;
                const imgElement = section.querySelector('.art-image');
                const localPrevBtn = section.querySelector('.prev-btn');
                const localNextBtn = section.querySelector('.next-btn');
                const imagesToUse = art.carouselImages && art.carouselImages.length > 0 ? art.carouselImages : [art.coverImage];

                localPrevBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    localImgIndex = (localImgIndex - 1 + imagesToUse.length) % imagesToUse.length;
                    imgElement.src = imagesToUse[localImgIndex];
                    imgElement.setAttribute('data-img-index', localImgIndex); 
                });

                localNextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    localImgIndex = (localImgIndex + 1) % imagesToUse.length;
                    imgElement.src = imagesToUse[localImgIndex];
                    imgElement.setAttribute('data-img-index', localImgIndex);
                });
            });

            // Add the "Add to Cart" button to the Modal HTML structure dynamically
            const modalPlaque = document.querySelector('.modal-plaque');
            if (modalPlaque && !document.getElementById('modalAddToCart')) {
                const cartBtn = document.createElement('button');
                cartBtn.id = 'modalAddToCart';
                cartBtn.className = 'add-to-cart-btn';
                cartBtn.innerText = 'Add to Cart';
                
                // Also add a location badge to the modal
                const modalLocBadge = document.createElement('span');
                modalLocBadge.id = 'modalLocation';
                modalLocBadge.className = 'location-badge';
                
                // Insert them into the plaque
                modalPlaque.insertBefore(modalLocBadge, document.getElementById('modalPrice'));
                modalPlaque.appendChild(cartBtn);

                // Bind Cart Button Click
                cartBtn.addEventListener('click', () => {
                    const art = artworks[currentModalArtIndex];
                    // Check if already in cart
                    const exists = cart.find(item => item.title === art.title);
                    if(!exists) {
                        cart.push({
                            title: art.title,
                            price: art.price,
                            location: art.location || 'Israel'
                        });
                        localStorage.setItem('artCart', JSON.stringify(cart));
                        updateCartUI();
                        
                        // Force the sidebar to slide out immediately
                        if (cartSidebar) {
                            cartSidebar.classList.add('open');
                        }
                        
                        // Visual feedback
                        cartBtn.innerText = 'Added to Collection!';
                        cartBtn.style.backgroundColor = 'var(--brand-grey)';
                        setTimeout(() => {
                            cartBtn.innerText = 'Add to Cart';
                            cartBtn.style.backgroundColor = 'var(--brand-green)';
                        }, 2000);
                    } else {
                        // Open cart even if it already exists, as a convenience
                        if (cartSidebar) {
                            cartSidebar.classList.add('open');
                        }
                        alert("This artwork is already in your collection.");
                    }
                });
            }

            // Open Full-Page Modal Function
            const openModal = (artIndex, imgIndex) => {
                currentModalArtIndex = artIndex;
                currentModalImgIndex = imgIndex;
                const art = artworks[currentModalArtIndex];
                const imagesToUse = art.carouselImages && art.carouselImages.length > 0 ? art.carouselImages : [art.coverImage];
                
                modalImage.src = imagesToUse[currentModalImgIndex];
                modalTitle.innerText = art.title;
                modalMedium.innerText = `Medium: ${art.medium}`;
                modalSize.innerText = `Dimensions: ${art.size}`;
                modalPrice.innerText = `Price: ${art.price}`;
                modalBgTitle.innerText = art.bgWord || art.title.split(' ')[0] || 'Art';
                document.getElementById('modalLocation').innerText = `Ships from: ${art.location || 'Israel'}`;
                
                // Logic to hide the "Add to Cart" button if the item is Sold or on Auction
                const cartBtn = document.getElementById('modalAddToCart');
                if (art.statusMsg && art.statusMsg.trim() !== '') {
                    cartBtn.style.display = 'none'; // Hide button if unavailable
                } else {
                    cartBtn.style.display = 'block'; // Show button if available
                }

                modal.style.display = 'block';
                document.body.classList.add('modal-open'); 
            };

            // Modal Click Listeners (Images)
            document.querySelectorAll('.art-image').forEach(img => {
                img.addEventListener('click', (e) => {
                    const artIdx = parseInt(e.target.getAttribute('data-art-index'));
                    const imgIdx = parseInt(e.target.getAttribute('data-img-index'));
                    openModal(artIdx, imgIdx);
                });
            });

            // Modal Click Listeners (Entire Plaque)
            document.querySelectorAll('.clickable-plaque').forEach(plaque => {
                plaque.addEventListener('click', (e) => {
                    const artIdx = parseInt(e.currentTarget.getAttribute('data-art-index'));
                    openModal(artIdx, 0); 
                });
            });

            // Modal Navigation
            modalNextBtn.addEventListener('click', () => {
                const art = artworks[currentModalArtIndex];
                const imagesToUse = art.carouselImages && art.carouselImages.length > 0 ? art.carouselImages : [art.coverImage];
                currentModalImgIndex = (currentModalImgIndex + 1) % imagesToUse.length;
                modalImage.src = imagesToUse[currentModalImgIndex];
            });

            modalPrevBtn.addEventListener('click', () => {
                const art = artworks[currentModalArtIndex];
                const imagesToUse = art.carouselImages && art.carouselImages.length > 0 ? art.carouselImages : [art.coverImage];
                currentModalImgIndex = (currentModalImgIndex - 1 + imagesToUse.length) % imagesToUse.length;
                modalImage.src = imagesToUse[currentModalImgIndex];
            });
        })
        .catch(error => console.error("Error loading gallery JSON data:", error));

    // Close Modal Event
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open'); 
        });
    }

    // =========================================
    // 4. GLOBAL CONTACT WIDGET LOGIC
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
    // 5. NAVIGATION LOGIC
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
    // 6. SMART SCROLL UI HIDING (MAIN WINDOW)
    // =========================================
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        // Targets the home button, the new cart/hamburger nav container, and the contact widget
        const fixedUI = document.querySelectorAll('.back-home-btn, .top-right-nav, #contact-widget-container');
        
        if (currentScrollY > 50 && currentScrollY > lastScrollY) {
            fixedUI.forEach(el => el.classList.add('hidden-on-scroll'));
        } else {
            fixedUI.forEach(el => el.classList.remove('hidden-on-scroll'));
        }
        lastScrollY = currentScrollY;
    });
});