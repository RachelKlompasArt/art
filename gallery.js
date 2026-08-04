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

    // =========================================
    // 2. FETCH DATA & BUILD GALLERY
    // =========================================
    fetch('./gallery_data.json')
        .then(response => response.json())
        .then(artworks => {
            
            let currentModalArtIndex = 0;
            let currentModalImgIndex = 0;

            // Build the Scrolling Gallery with In-Container Carousels
            artworks.forEach((art, artIndex) => {
                const section = document.createElement('section');
                section.className = 'art-panel';
                const isReverse = artIndex % 2 !== 0 ? 'reverse' : '';

                // Provide a fallback in case there is no bgWord
                const bgWordText = art.bgWord || art.title.split(' ')[0] || 'Art';
                
                // Construct the overlay HTML if a status message exists
                const statusHtml = art.statusMsg && art.statusMsg.trim() !== '' 
                    ? `<div class="status-overlay">${art.statusMsg}</div>` 
                    : '';

                section.innerHTML = `
                    <div class="art-bounding-box ${isReverse}">
                        ${statusHtml}
                        <div class="bg-title">${bgWordText}</div>
                        <div class="image-carousel">
                            <span class="nav-arrow carousel-btn prev-btn">&#10094;</span>
                            <img class="art-image" src="${art.carouselImages[0] || art.coverImage}" alt="${art.title}" data-art-index="${artIndex}" data-img-index="0">
                            <span class="nav-arrow carousel-btn next-btn">&#10095;</span>
                        </div>
                        <div class="museum-plaque">
                            <h2>${art.title}</h2>
                            <p>${art.medium}</p>
                            <br>
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
                
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; 
            };

            // Modal Click Listeners
            document.querySelectorAll('.art-image').forEach(img => {
                img.addEventListener('click', (e) => {
                    const artIdx = parseInt(e.target.getAttribute('data-art-index'));
                    const imgIdx = parseInt(e.target.getAttribute('data-img-index'));
                    openModal(artIdx, imgIdx);
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
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; 
    });


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
    // 4. NAVIGATION LOGIC
    // =========================================
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (hamburgerIcon && dropdownMenu) {
        hamburgerIcon.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show-menu');
            hamburgerIcon.classList.toggle('active');
        });
    }
});