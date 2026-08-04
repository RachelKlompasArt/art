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