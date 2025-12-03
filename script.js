// Google Analytics tracking setup
(function() {
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-QY2QSX162L';
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', 'G-MVXJ44FZJV');
})();

// Default image groups
const imageGroups = {
  group1: ['Paintings/Abstract.webp', 'Paintings/Abstract cropped mockup.webp', 'Paintings/Abstract mockup.webp'],
  group2: ['Paintings/black and white water.webp', 'Paintings/black and white water cropped mockup.webp', 'Paintings/black and white water mock up.webp'],
  group3: ['Paintings/blue boys.webp', 'Paintings/blue boys cropped mockup.webp', 'Paintings/blue boys mockup.webp'],
  group4: ['Paintings/roses.webp', 'Paintings/roses cropped mockup.webp', 'Paintings/Roses mockup.webp'],
  group5: ['Paintings/shtetle.webp', 'Paintings/Shtetle cropped mockup.webp', 'Paintings/Shtetle mockup.webp'],
  group6: ['Paintings/textured forest.webp', 'Paintings/textured forest cropped mockup.webp', 'Paintings/textured forest mockup.webp'],
  group7: ['Paintings/waterfall.webp', 'Paintings/waterfall cropped mockup.webp', 'Paintings/waterfall mockup.webp'],
  group8: ['Paintings/Akeida 1.webp', 'Paintings/Akeida 2.webp', 'Paintings/Akeida cropped Mockup.webp', 'Paintings/Akeida Mockup.webp'],
  group9: ['Digital/Ballgown.webp', 'Digital/Face_Paint.webp', 'Digital/Fox.webp', 'Digital/Jade.webp', 'Digital/Light.webp', 'Digital/Raven.webp', 'Digital/Rose.webp', 'Digital/Sunburst.webp', 'Digital/Yerushalayim.webp'],
  group10: ['Paintings/Leaves.webp', 'Paintings/leaves Mockup cropped.webp', 'Paintings/leaves Mockup.webp'],
  group11: ['Paintings/peacefull.webp', 'Paintings/peacefull mockup cropped.webp', 'Paintings/peacefull mockup.webp'],
  group12: ['Paintings/candles.webp', 'Paintings/candles cropped mockup.webp', 'Paintings/candles mockup.webp']
};

// Load uploaded paintings from localStorage and add to imageGroups
const dynamicUploads = JSON.parse(localStorage.getItem("uploadedPaintings") || "[]");
dynamicUploads.forEach((entry) => {
  imageGroups[entry.group] = [entry.main, entry.cropped, entry.mockup];
});

let currentImageIndex = 0;
let currentGroup = [];

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function openModal(clickedImageSrc, groupID) {
  currentGroup = imageGroups[groupID] || [];
  currentImageIndex = currentGroup.indexOf(clickedImageSrc);
  modalImage.src = clickedImageSrc;
  modal.style.display = 'block';
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentGroup.length;
  modalImage.src = currentGroup[currentImageIndex];
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + currentGroup.length) % currentGroup.length;
  modalImage.src = currentGroup[currentImageIndex];
}

closeBtn.addEventListener('click', () => modal.style.display = 'none');
nextBtn.addEventListener('click', nextImage);
prevBtn.addEventListener('click', prevImage);

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

const bodyID = document.body.id;
const domBasedPages = ["digital-page", "marker-page", "ink-page", "pencil-page", "watercolour-page"];

if (bodyID === "gallery-page" || domBasedPages.includes(bodyID)) {
  if (bodyID === "gallery-page") {
    // Use event delegation on the container
    const container = document.querySelector('.main-container');
    container.addEventListener('click', (event) => {
      const galleryContainer = event.target.closest('.gallery-container');
      if (!galleryContainer) return;

      const clickedImage = galleryContainer.querySelector('img');
      if (clickedImage) {
        const groupID = clickedImage.getAttribute('data-modal-group');
        openModal(clickedImage.src, groupID);
      }
    });
  } else {
    // Existing code for other pages
    const selector = '.artwork-container';
    const images = document.querySelectorAll(`${selector} img`);
    currentGroup = Array.from(images).map(img => img.src);
    const containers = document.querySelectorAll(selector);
    containers.forEach(container => {
      container.addEventListener('click', () => {
        const clickedImage = container.querySelector('img');
        if (clickedImage) {
          currentImageIndex = currentGroup.indexOf(clickedImage.src);
          modalImage.src = clickedImage.src;
          modal.style.display = 'block';
        }
      });
    });
  }
}

// Highlight footer icons
document.querySelectorAll('.more-link a').forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const svgIcons = document.querySelectorAll('#footer svg');
    svgIcons.forEach(svg => svg.classList.add('highlight-svg'));
    setTimeout(() => svgIcons.forEach(svg => svg.classList.remove('highlight-svg')), 5000);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  if (popup) {
    popup.style.display = 'flex';
    popup.addEventListener('click', () => {
      window.location.href = "https://rachelklompasart.github.io/art/gallery.html";
    });
  }
});
