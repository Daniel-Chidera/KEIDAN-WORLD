
// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navCenter = document.querySelector('.nav-center');
const navRight = document.querySelector('.nav-right');

menuToggle.addEventListener('click', () => {
    navCenter.classList.toggle('active');
    navRight.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Close mobile menu after click
        navCenter.classList.remove('active');
        navRight.classList.remove('active');
    });
});
