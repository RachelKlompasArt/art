/* =========================================
   GALLERY PAGE LOGIC (gallery.js)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
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

    // Fetch Gallery Data & Build Panels
    fetch('./gallery_data.json')
        .then(response => response.json())
        .then(artworks => {
            let currentModalArtIndex = 0;
            let currentModalImgIndex = 0;

            artworks.forEach((art, artIndex) => {
                const section = document.createElement('section');
                section.className = 'art-panel';
                const isReverse = artIndex % 2 !== 0 ? 'reverse' : '';
                const bgWordText = art.bgWord || art.title.split(' ')[0] || 'Art';
                const locationText = art.location || 'Israel';
                
                let statusHtml = '';
                if (art.statusMsg && art.statusMsg.trim() !== '') {
                    if (art.statusLink && art.statusLink.trim() !== '') {
                        statusHtml = `<div class="status-overlay"><a href="${art.statusLink}" target="_blank" class="status-link">${art.statusMsg} <span class="link-icon">&#8599;&#xFE0E;</span></a></div>`;
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

                // In-gallery hover carousel arrows
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

            // Modal Add to Cart Button Initialization
            const modalPlaque = document.querySelector('.modal-plaque');
            if (modalPlaque && !document.getElementById('modalAddToCart')) {
                const cartBtn = document.createElement('button');
                cartBtn.id = 'modalAddToCart';
                cartBtn.className = 'add-to-cart-btn';
                cartBtn.innerText = 'Add to Cart';
                
                const modalLocBadge = document.createElement('span');
                modalLocBadge.id = 'modalLocation';
                modalLocBadge.className = 'location-badge';
                
                modalPlaque.insertBefore(modalLocBadge, document.getElementById('modalPrice'));
                modalPlaque.appendChild(cartBtn);

                // This now securely calls the central cart engine in global.js!
                cartBtn.addEventListener('click', () => {
                    const art = artworks[currentModalArtIndex];
                    const added = window.siteCart.addItem({
                        title: art.title,
                        price: art.price,
                        location: art.location || 'Israel'
                    });
                    
                    if(added) {
                        cartBtn.innerText = 'Added to Collection!';
                        cartBtn.style.backgroundColor = 'var(--brand-grey)';
                        setTimeout(() => {
                            cartBtn.innerText = 'Add to Cart';
                            cartBtn.style.backgroundColor = 'var(--brand-green)';
                        }, 2000);
                    } else {
                        alert("This artwork is already in your collection.");
                    }
                });
            }

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
                
                const cartBtn = document.getElementById('modalAddToCart');
                if (art.statusMsg && art.statusMsg.trim() !== '') {
                    cartBtn.style.display = 'none';
                } else {
                    cartBtn.style.display = 'block';
                }

                modal.style.display = 'block';
                document.body.classList.add('modal-open'); 
            };

            document.querySelectorAll('.art-image').forEach(img => {
                img.addEventListener('click', (e) => {
                    openModal(parseInt(e.target.getAttribute('data-art-index')), parseInt(e.target.getAttribute('data-img-index')));
                });
            });

            document.querySelectorAll('.clickable-plaque').forEach(plaque => {
                plaque.addEventListener('click', (e) => {
                    openModal(parseInt(e.currentTarget.getAttribute('data-art-index')), 0); 
                });
            });

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

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open'); 
        });
    }
});