document.addEventListener('DOMContentLoaded', () => {
    const artPanel = document.querySelector('.art-panel');
    const centerLogo = document.getElementById('main-logo');

    if (artPanel && centerLogo) {
        // When hovering the Art side, turn the logo grey
        artPanel.addEventListener('mouseenter', () => {
            centerLogo.classList.add('hover-art');
        });
        artPanel.addEventListener('mouseleave', () => {
            centerLogo.classList.remove('hover-art');
        });
    }
});