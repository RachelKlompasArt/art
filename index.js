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

document.addEventListener('DOMContentLoaded', () => {
    const designPanel = document.querySelector('.design-panel');
    const artPanel = document.querySelector('.art-panel');
    const centerLogo = document.getElementById('main-logo');

    if (designPanel && artPanel && centerLogo) {
        // When hovering the Design side
        designPanel.addEventListener('mouseenter', () => {
            centerLogo.classList.add('hover-design');
        });
        designPanel.addEventListener('mouseleave', () => {
            centerLogo.classList.remove('hover-design');
        });

        // When hovering the Art side
        artPanel.addEventListener('mouseenter', () => {
            centerLogo.classList.add('hover-art');
        });
        artPanel.addEventListener('mouseleave', () => {
            centerLogo.classList.remove('hover-art');
        });
    }
});