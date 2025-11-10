// about.js - Enhanced About Page Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactive elements
    initAboutPage();
});

function initAboutPage() {
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all feature cards and tech items for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .tech-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add click effects to tech stack items
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 150);
        });
    });

    // Add hover sound effect (optional - can be removed if not needed)
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // You could add a subtle sound effect here if desired
            console.log('Feature card hovered:', this.querySelector('h4').textContent);
        });
    });

    // Smooth scrolling for anchor links (if any are added in the future)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Console welcome message
    console.log('%c🎵 Welcome to TuneFolio About Page! %c\nDiscover the story behind your favorite music companion.', 
        'color: #ff6b6b; font-size: 16px; font-weight: bold;', 
        'color: #ffffff; font-size: 14px;');
}

// Export functions for potential future use
window.aboutPage = {
    init: initAboutPage
};