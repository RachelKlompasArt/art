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

    // State variables
    let currentArt = null;
    let currentImgIndex = 0;

    // =========================================
    // SEARCH & FILTER PANEL TOGGLE
    // =========================================
    const searchToggleBtn = document.getElementById('searchToggleBtn');
    const searchFilterPanel = document.getElementById('searchFilterPanel');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchInput = document.getElementById('searchInput');
    const sortPrice = document.getElementById('sortPrice');

    const toggleSearchPanel = () => {
        searchFilterPanel.classList.toggle('open');
        if (searchFilterPanel.classList.contains('open') && searchInput) {
            setTimeout(() => searchInput.focus(), 100); 
        }
    };

    if (searchToggleBtn) {
        searchToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSearchPanel();
        });
    }

    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', () => {
            searchFilterPanel.classList.remove('open');
        });
    }

    document.addEventListener('click', (e) => {
        if (searchFilterPanel && searchFilterPanel.classList.contains('open')) {
            if (!searchFilterPanel.contains(e.target) && !searchToggleBtn.contains(e.target)) {
                searchFilterPanel.classList.remove('open');
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchFilterPanel && searchFilterPanel.classList.contains('open')) {
            searchFilterPanel.classList.remove('open');
        }
    });

    // =========================================
    // MODAL SETUP
    // =========================================
    const modalPlaque = document.querySelector('.modal-plaque');
    let cartBtn = document.getElementById('modalAddToCart');
    let modalLocBadge = document.getElementById('modalLocation');

    if (modalPlaque && !cartBtn) {
        cartBtn = document.createElement('button');
        cartBtn.id = 'modalAddToCart';
        cartBtn.className = 'add-to-cart-btn';
        cartBtn.innerText = 'Add to Cart';

        modalLocBadge = document.createElement('span');
        modalLocBadge.id = 'modalLocation';
        modalLocBadge.className = 'location-badge';

        modalPlaque.insertBefore(modalLocBadge, document.getElementById('modalPrice'));
        modalPlaque.appendChild(cartBtn);

        cartBtn.addEventListener('click', () => {
            if(!currentArt) return;
            const added = window.siteCart.addItem({
                title: currentArt.title,
                price: currentArt.price,
                location: currentArt.location || 'Israel'
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

    const openModal = () => {
        if(!currentArt) return;
        const imagesToUse = currentArt.carouselImages && currentArt.carouselImages.length > 0 ? currentArt.carouselImages : [currentArt.coverImage];

        modalImage.src = imagesToUse[currentImgIndex];
        modalTitle.innerText = currentArt.title;
        modalMedium.innerText = `Medium: ${currentArt.medium}`;
        modalSize.innerText = `Dimensions: ${currentArt.size}`;
        modalPrice.innerText = `Price: ${currentArt.price}`;
        modalBgTitle.innerText = currentArt.bgWord || currentArt.title.split(' ')[0] || 'Art';
        if(modalLocBadge) modalLocBadge.innerText = `Ships from: ${currentArt.location || 'Israel'}`;

        if (currentArt.statusMsg && currentArt.statusMsg.trim() !== '') {
            cartBtn.style.display = 'none';
        } else {
            cartBtn.style.display = 'block';
        }

        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    };

    modalNextBtn.addEventListener('click', () => {
        if(!currentArt) return;
        const imagesToUse = currentArt.carouselImages && currentArt.carouselImages.length > 0 ? currentArt.carouselImages : [currentArt.coverImage];
        currentImgIndex = (currentImgIndex + 1) % imagesToUse.length;
        modalImage.src = imagesToUse[currentImgIndex];
    });

    modalPrevBtn.addEventListener('click', () => {
        if(!currentArt) return;
        const imagesToUse = currentArt.carouselImages && currentArt.carouselImages.length > 0 ? currentArt.carouselImages : [currentArt.coverImage];
        currentImgIndex = (currentImgIndex - 1 + imagesToUse.length) % imagesToUse.length;
        modalImage.src = imagesToUse[currentImgIndex];
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });
    }

    // =========================================
    // DATA FETCH & FILTER ENGINE
    // =========================================
    fetch('./gallery_data.json')
        .then(response => response.json())
        .then(allArtworks => {

            function renderGallery(artworksToRender) {
                galleryContainer.innerHTML = ''; 

                if (artworksToRender.length === 0) {
                    galleryContainer.innerHTML = '<div style="text-align:center; padding:100px 20px; font-family:\'Cinzel\',serif; color:var(--brand-green); font-size:1.5rem;">No artworks found matching your search.</div>';
                    return;
                }

                artworksToRender.forEach((art, artIndex) => {
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
                                <img class="art-image" src="${art.carouselImages[0] || art.coverImage}" alt="${art.title}" data-img-index="0">
                                <span class="nav-arrow carousel-btn next-btn">&#10095;&#xFE0E;</span>
                            </div>
                            <div class="museum-plaque clickable-plaque">
                                <h2>${art.title}</h2>
                                <p>${art.medium}</p>
                                <span class="location-badge">Ships from: ${locationText}</span>
                                <h3>Price: ${art.price}</h3>
                            </div>
                        </div>
                    `;
                    galleryContainer.appendChild(section);

                    // Carousel Logic
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

                    // Modal Listeners
                    imgElement.addEventListener('click', (e) => {
                        currentArt = art;
                        currentImgIndex = parseInt(e.target.getAttribute('data-img-index'));
                        openModal();
                    });

                    section.querySelector('.clickable-plaque').addEventListener('click', () => {
                        currentArt = art;
                        currentImgIndex = 0;
                        openModal();
                    });
                });
            }

            function applyFilters() {
                let filtered = [...allArtworks];
                const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

                if (searchTerm) {
                    filtered = filtered.filter(art =>
                        art.title.toLowerCase().includes(searchTerm) ||
                        art.medium.toLowerCase().includes(searchTerm) ||
                        art.size.toLowerCase().includes(searchTerm)
                    );
                }

                const sortValue = sortPrice ? sortPrice.value : 'default';
                if (sortValue !== 'default') {
                    filtered.sort((a, b) => {
                        const numA = a.price.match(/\d+/);
                        const numB = b.price.match(/\d+/);
                        const priceA = numA ? parseInt(numA[0], 10) : 0;
                        const priceB = numB ? parseInt(numB[0], 10) : 0;

                        if (priceA === 0 && priceB !== 0) return 1;
                        if (priceB === 0 && priceA !== 0) return -1;

                        return sortValue === 'low-high' ? priceA - priceB : priceB - priceA;
                    });
                }

                renderGallery(filtered);
            }

            if (searchInput) searchInput.addEventListener('input', applyFilters);
            if (sortPrice) sortPrice.addEventListener('change', applyFilters);

            // Initial render
            renderGallery(allArtworks);

            // =========================================
            // AUCTION REDIRECT INTERCEPTOR
            // =========================================
            if (window.location.hash === '#malkaella') {
                history.replaceState(null, null, window.location.pathname);
                const redirectBanner = document.createElement('div');
                redirectBanner.innerHTML = `
                    <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); z-index: 999998;"></div>
                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 85%; max-width: 450px; background: rgba(255, 255, 255, 0.98); z-index: 999999; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px 30px; border-left: 4px solid var(--brand-green); box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                        <h2 style="font-family: 'Cinzel', serif; color: var(--brand-green); font-size: 2rem; margin-bottom: 15px;">Heading to the Auction...</h2>
                        <p style="font-family: 'Montserrat', sans-serif; color: var(--brand-grey); font-size: 1rem; line-height: 1.6; margin-bottom: 25px;">You are now leaving Rachel Klompas Art to view <strong>"Akeida"</strong> on the Malka Ella platform.</p>
                        <div style="border: 3px solid rgba(157, 179, 131, 0.2); border-top: 3px solid var(--brand-green); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
                        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                    </div>
                `;
                document.body.appendChild(redirectBanner);
                setTimeout(() => { window.location.href = "https://malkaella.co.za/product/akeida/"; }, 4000);
            }
        })
        .catch(error => console.error("Error loading gallery JSON data:", error));
});