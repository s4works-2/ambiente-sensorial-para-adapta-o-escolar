// ========================================
// MODERN JAVASCRIPT - 2025 EDITION
// Advanced Sensory Environment Website
// ========================================

// ===== CONFIGURATION =====
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 100,
    intersectionThreshold: 0.1,
    debounceDelay: 16,
    carouselAutoplay: 4000,
    parallaxStrength: 0.3
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // Modern debounce function
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Modern throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Smooth scroll to element
    smoothScrollTo(element, offset = 0) {
        if (!element) return;
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -threshold * windowHeight &&
            rect.left >= -threshold * windowWidth &&
            rect.bottom <= windowHeight + threshold * windowHeight &&
            rect.right <= windowWidth + threshold * windowWidth
        );
    },

    // Get scroll percentage
    getScrollPercentage() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.min(scrollTop / scrollHeight, 1);
    }
};

// ===== MODERN NAVIGATION CLASS =====
class ModernNavigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScrollY = window.scrollY;
        this.isMenuOpen = false;
        this.scrollThreshold = 100;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.setupActiveStates();
        this.createScrollIndicator();
    }
    
    setupEventListeners() {
        // Hamburger menu toggle
        this.hamburger?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    Utils.smoothScrollTo(targetElement, 100);
                    if (this.isMenuOpen) {
                        this.closeMenu();
                    }
                }
            });
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }
    
    setupScrollBehavior() {
        const handleScroll = Utils.throttle(() => {
            const currentScrollY = window.scrollY;
            
            // Auto-hide navbar
            if (currentScrollY > this.lastScrollY && currentScrollY > this.scrollThreshold) {
                this.hideNavbar();
            } else {
                this.showNavbar();
            }
            
            // Add scrolled class
            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            this.lastScrollY = currentScrollY;
            this.updateScrollIndicator();
        }, 16);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    setupActiveStates() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveLink(entry.target.id);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-600), var(--success-500));
            z-index: 9999;
            transform-origin: left;
            transform: scaleX(0);
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(indicator);
        this.scrollIndicator = indicator;
    }
    
    updateScrollIndicator() {
        const progress = Utils.getScrollPercentage();
        this.scrollIndicator.style.transform = `scaleX(${progress})`;
    }
    
    toggleMenu() {
        this.isMenuOpen ? this.closeMenu() : this.openMenu();
    }
    
    openMenu() {
        this.isMenuOpen = true;
        this.hamburger.classList.add('active');
        this.navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        gsap.fromTo('.nav-menu .nav-link', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 }
        );
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    hideNavbar() {
        this.navbar.classList.add('hidden');
    }
    
    showNavbar() {
        this.navbar.classList.remove('hidden');
    }
    
    updateActiveLink(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }
}

// ===== ADVANCED CAROUSEL MANAGER =====
class CarouselManager {
    constructor() {
        this.carousels = new Map();
        this.init();
    }
    
    init() {
        this.initProblemCarousel();
        this.initPrototypesCarousel();
    }
    
    initProblemCarousel() {
        const problemSwiper = new Swiper('.problem-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: false,
            loop: true,
            autoplay: {
                delay: CONFIG.carouselAutoplay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.problem-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            navigation: {
                nextEl: '.problem-carousel-container .next-btn',
                prevEl: '.problem-carousel-container .prev-btn',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    centeredSlides: false
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    centeredSlides: false
                }
            },
            effect: 'slide',
            speed: 600,
            on: {
                slideChange: function() {
                    this.slides.forEach((slide, index) => {
                        const card = slide.querySelector('.problem-card');
                        if (card) {
                            if (index === this.activeIndex) {
                                gsap.to(card, { scale: 1.02, duration: 0.3 });
                            } else {
                                gsap.to(card, { scale: 1, duration: 0.3 });
                            }
                        }
                    });
                }
            }
        });
        
        this.carousels.set('problem', problemSwiper);
    }
    
    initPrototypesCarousel() {
        const prototypesSwiper = new Swiper('.prototypes-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: CONFIG.carouselAutoplay + 1000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.prototypes-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            navigation: {
                nextEl: '.prototypes-carousel-container .next-btn',
                prevEl: '.prototypes-carousel-container .prev-btn',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    centeredSlides: false
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    centeredSlides: false
                }
            },
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 15,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
            },
            speed: 800,
            on: {
                init: function() {
                    this.slides.forEach(slide => {
                        const card = slide.querySelector('.prototype-card');
                        if (card) {
                            card.addEventListener('mouseenter', () => {
                                gsap.to(card, { 
                                    rotationY: 5, 
                                    rotationX: 2,
                                    duration: 0.3,
                                    ease: "power2.out"
                                });
                            });
                            
                            card.addEventListener('mouseleave', () => {
                                gsap.to(card, { 
                                    rotationY: 0, 
                                    rotationX: 0,
                                    duration: 0.3,
                                    ease: "power2.out"
                                });
                            });
                        }
                    });
                }
            }
        });
        
        this.carousels.set('prototypes', prototypesSwiper);
    }
    
    pauseAll() {
        this.carousels.forEach(carousel => {
            if (carousel.autoplay) {
                carousel.autoplay.pause();
            }
        });
    }
    
    resumeAll() {
        this.carousels.forEach(carousel => {
            if (carousel.autoplay) {
                carousel.autoplay.resume();
            }
        });
    }
}

// ===== ADVANCED ANIMATION MANAGER =====
class AnimationManager {
    constructor() {
        this.animations = [];
        this.intersectionObserver = null;
        this.init();
    }
    
    init() {
        this.setupGSAP();
        this.setupScrollAnimations();
        this.setupHeroAnimations();
        this.setupFloatingElements();
        this.setupParallaxEffects();
    }
    
    setupGSAP() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);
        
        // Set default ease
        gsap.defaults({
            duration: 0.6,
            ease: "power2.out"
        });
    }
    
    setupScrollAnimations() {
        // Animate sections on scroll
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
            
            // Section header animation
            const header = section.querySelector('.section-header');
            if (header) {
                tl.fromTo(header.children, 
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
                );
            }
            
            // Cards animation
            const cards = section.querySelectorAll('.problem-card, .stat-card, .prototype-card:not(.mini)');
            if (cards.length > 0) {
                tl.fromTo(cards,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
                    "-=0.4"
                );
            }
            
            // Mini cards animation
            const miniCards = section.querySelectorAll('.prototype-card.mini, .sustain-stat');
            if (miniCards.length > 0) {
                tl.fromTo(miniCards,
                    { opacity: 0, scale: 0.8, rotation: -5 },
                    { opacity: 1, scale: 1, rotation: 0, duration: 0.5, stagger: 0.1 },
                    "-=0.3"
                );
            }
        });
    }
    
    setupHeroAnimations() {
        const tl = gsap.timeline({ delay: 0.5 });
        
        // Hero badge
        tl.fromTo('.hero-badge',
            { opacity: 0, scale: 0.8, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6 }
        );
        
        // Hero title
        tl.fromTo('.hero-title',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8 },
            "-=0.3"
        );
        
        // Hero subtitle and description
        tl.fromTo(['.hero-subtitle', '.hero-description'],
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 },
            "-=0.4"
        );
        
        // Hero stats
        tl.fromTo('.hero-stat',
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1 },
            "-=0.3"
        );
        
        // Hero actions
        tl.fromTo('.cta-button',
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
            "-=0.2"
        );
        
        // Floating cards
        tl.fromTo('.floating-card',
            { opacity: 0, scale: 0.8, x: -20 },
            { opacity: 1, scale: 1, x: 0, duration: 0.8, stagger: 0.3 },
            "-=0.5"
        );
    }
    
    setupFloatingElements() {
        // Floating shapes animation
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach((shape, index) => {
            gsap.to(shape, {
                y: "random(-20, 20)",
                x: "random(-15, 15)",
                rotation: "random(-10, 10)",
                duration: "random(3, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.5
            });
        });
        
        // Floating cards animation
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            gsap.to(card, {
                y: "random(-15, 15)",
                rotation: "random(-3, 3)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut",
                delay: index * 0.8
            });
        });
    }
    
    setupParallaxEffects() {
        // Hero parallax
        gsap.to('.floating-shape', {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
        
        // Background elements parallax
        const bgElements = document.querySelectorAll('.hero-bg-elements > *');
        bgElements.forEach((element, index) => {
            gsap.to(element, {
                yPercent: -30 * (index + 1),
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        });
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const isPercentage = counter.textContent.includes('%');
            
            ScrollTrigger.create({
                trigger: counter,
                start: "top 80%",
                onEnter: () => {
                    gsap.fromTo(counter, 
                        { textContent: 0 },
                        {
                            textContent: target,
                            duration: 2,
                            ease: "power2.out",
                            snap: { textContent: 1 },
                            onUpdate: function() {
                                const value = Math.round(this.targets()[0].textContent);
                                counter.textContent = isPercentage ? `${value}%` : value;
                            }
                        }
                    );
                }
            });
        });
    }
}

// ===== INTERACTION MANAGER =====
class InteractionManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCardInteractions();
        this.setupButtonEffects();
        this.setupFormValidation();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
    }
    
    setupCardInteractions() {
        // Enhanced card hover effects
        const cards = document.querySelectorAll('.problem-card, .stat-card, .prototype-card, .sustain-stat');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.03,
                    rotationY: 2,
                    rotationX: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Animate card elements
                const icon = card.querySelector('.problem-icon, .stat-icon, .prototype-icon, .sustain-icon');
                if (icon) {
                    gsap.to(icon, {
                        scale: 1.1,
                        rotation: 5,
                        duration: 0.3
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                const icon = card.querySelector('.problem-icon, .stat-icon, .prototype-icon, .sustain-icon');
                if (icon) {
                    gsap.to(icon, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3
                    });
                }
            });
            
            // Click ripple effect
            card.addEventListener('click', (e) => {
                this.createRippleEffect(e, card);
            });
        });
    }
    
    setupButtonEffects() {
        const buttons = document.querySelectorAll('.cta-button, .carousel-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                const icon = button.querySelector('svg');
                if (icon) {
                    gsap.to(icon, {
                        rotation: 10,
                        scale: 1.2,
                        duration: 0.3
                    });
                }
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                const icon = button.querySelector('svg');
                if (icon) {
                    gsap.to(icon, {
                        rotation: 0,
                        scale: 1,
                        duration: 0.3
                    });
                }
            });
            
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });
    }
    
    setupFormValidation() {
        // Future form validation logic
        // This is a placeholder for when forms are added
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    break;
                case 'ArrowDown':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        window.scrollTo({ 
                            top: document.documentElement.scrollHeight, 
                            behavior: 'smooth' 
                        });
                    }
                    break;
            }
        });
    }
    
    setupTouchGestures() {
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleGesture();
        });
        
        this.handleGesture = () => {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe up - could trigger some action
                } else {
                    // Swipe down - could trigger some action
                }
            }
        };
    }
    
    createRippleEffect(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        gsap.to(ripple, {
            scale: 2,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    }
}

// ===== PERFORMANCE MANAGER =====
class PerformanceManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.preloadCriticalResources();
        this.setupServiceWorker();
    }
    
    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    setupImageOptimization() {
        // WebP support detection and fallback
        const supportsWebP = () => {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').indexOf('webp') > -1;
        };
        
        if (supportsWebP()) {
            document.documentElement.classList.add('webp');
        }
    }
    
    preloadCriticalResources() {
        // Preload critical fonts
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
            'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'
        ];
        
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// ===== ACCESSIBILITY MANAGER =====
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupFocusManagement();
        this.setupARIALabels();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
    }
    
    setupFocusManagement() {
        // Focus trap for mobile menu
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.nav-menu.active');
                if (modal) {
                    const focusables = modal.querySelectorAll(focusableElements);
                    const firstFocusable = focusables[0];
                    const lastFocusable = focusables[focusables.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            }
        });
    }
    
    setupARIALabels() {
        // Add ARIA labels to interactive elements
        const carouselBtns = document.querySelectorAll('.carousel-btn');
        carouselBtns.forEach((btn, index) => {
            const isNext = btn.classList.contains('next-btn');
            btn.setAttribute('aria-label', isNext ? 'Próximo slide' : 'Slide anterior');
        });
        
        // Add ARIA labels to navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const text = link.querySelector('span')?.textContent;
            if (text) {
                link.setAttribute('aria-label', `Navegar para seção ${text}`);
            }
        });
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for carousels
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.swiper')) {
                const swiper = e.target.closest('.swiper').swiper;
                if (!swiper) return;
                
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        swiper.slidePrev();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        swiper.slideNext();
                        break;
                    case ' ':
                        e.preventDefault();
                        swiper.autoplay.paused ? swiper.autoplay.resume() : swiper.autoplay.pause();
                        break;
                }
            }
        });
    }
    
    setupScreenReaderSupport() {
        // Live region for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
        
        // Announce carousel changes
        document.addEventListener('slideChange', (e) => {
            const activeSlide = e.detail.activeSlide;
            const slideTitle = activeSlide.querySelector('h3')?.textContent;
            if (slideTitle) {
                liveRegion.textContent = `Slide atual: ${slideTitle}`;
            }
        });
    }
}

// ===== MAIN APPLICATION =====
class SensoryEnvironmentApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }
    
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize all modules
            this.modules.navigation = new ModernNavigation();
            this.modules.carousel = new CarouselManager();
            this.modules.animation = new AnimationManager();
            this.modules.interaction = new InteractionManager();
            this.modules.performance = new PerformanceManager();
            this.modules.accessibility = new AccessibilityManager();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Initialize counters animation
            this.modules.animation.animateCounters();
            
            this.isInitialized = true;
            console.log('🚀 Sensory Environment App initialized successfully!');
            
        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    }
    
    setupGlobalEvents() {
        // Page visibility API for performance optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.modules.carousel?.pauseAll();
            } else {
                this.modules.carousel?.resumeAll();
            }
        });
        
        // Handle resize events
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });
        
        // Error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }
    
    handleResize() {
        // Refresh GSAP ScrollTrigger on resize
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        
        // Update carousel layouts
        Object.values(this.modules.carousel?.carousels || {}).forEach(carousel => {
            carousel.update();
        });
    }
    
    // Public API methods
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            Utils.smoothScrollTo(section, 100);
        }
    }
    
    pauseAnimations() {
        gsap.globalTimeline.pause();
        this.modules.carousel?.pauseAll();
    }
    
    resumeAnimations() {
        gsap.globalTimeline.resume();
        this.modules.carousel?.resumeAll();
    }
    
    getModule(name) {
        return this.modules[name];
    }
}

// ===== INITIALIZE APPLICATION =====
const app = new SensoryEnvironmentApp();

// Make app globally available for debugging
window.SensoryApp = app;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SensoryEnvironmentApp;
}