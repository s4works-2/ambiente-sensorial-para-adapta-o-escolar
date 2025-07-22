// ========================================
// MODERN SENSORY ENVIRONMENT WEBSITE - 2025
// Advanced JavaScript for Interactive Experience
// ========================================

'use strict';

// ===== CONFIGURATION =====
const CONFIG = {
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1280
    },
    animation: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 100
    },
    carousel: {
        autoplay: 5000,
        speed: 600
    },
    scroll: {
        offset: 100,
        threshold: 0.1
    }
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // Debounce function for performance optimization
    debounce(func, wait, immediate = false) {
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

    // Throttle function for scroll events
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

    // Check if element is in viewport
    isInViewport(element, threshold = 0.1) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top >= -threshold * windowHeight &&
            rect.bottom <= windowHeight + threshold * windowHeight
        );
    },

    // Get scroll percentage
    getScrollPercentage() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
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

    // Get device type
    getDeviceType() {
        const width = window.innerWidth;
        if (width < CONFIG.breakpoints.mobile) return 'mobile';
        if (width < CONFIG.breakpoints.tablet) return 'tablet';
        return 'desktop';
    },

    // Format number with animation
    animateNumber(element, start, end, duration = 2000) {
        const startTime = performance.now();
        const range = end - start;

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (range * easeOutCubic));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = end;
            }
        }
        
        requestAnimationFrame(updateNumber);
    }
};

// ===== LOADING SCREEN MANAGER =====
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.isLoaded = false;
        this.init();
    }

    init() {
        // Simulate loading time for better UX
        setTimeout(() => {
            this.hideLoading();
        }, 1500);

        // Also hide when everything is actually loaded
        if (document.readyState === 'complete') {
            setTimeout(() => this.hideLoading(), 800);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.hideLoading(), 800);
            });
        }
    }

    hideLoading() {
        if (this.isLoaded) return;
        this.isLoaded = true;

        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
            }, 500);
        }

        // Initialize other components after loading
        this.initializeComponents();
    }

    initializeComponents() {
        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: CONFIG.animation.duration,
                easing: CONFIG.animation.easing,
                once: true,
                offset: 50,
                delay: 100
            });
        }

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// ===== MODERN NAVIGATION =====
class ModernNavigation {
    constructor() {
        this.nav = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.scrollProgress = document.getElementById('scroll-progress');
        
        this.isMenuOpen = false;
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 100;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.setupActiveStates();
        this.updateScrollProgress();
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    Utils.smoothScrollTo(targetElement, CONFIG.scroll.offset);
                    this.closeMenu();
                }
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && this.nav && !this.nav.contains(e.target)) {
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

            // Add scrolled class for styling
            if (currentScrollY > 50) {
                this.nav?.classList.add('scrolled');
            } else {
                this.nav?.classList.remove('scrolled');
            }

            this.lastScrollY = currentScrollY;
            this.updateScrollProgress();
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }

    setupActiveStates() {
        const sections = document.querySelectorAll('section[id]');
        
        if (!sections.length) return;

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

    updateActiveLink(activeId) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updateScrollProgress() {
        if (!this.scrollProgress) return;
        
        const progress = Utils.getScrollPercentage();
        this.scrollProgress.style.transform = `scaleX(${progress})`;
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.navMenu) {
            this.navMenu.classList.toggle('active', this.isMenuOpen);
        }
        
        if (this.navToggle) {
            this.navToggle.classList.toggle('active', this.isMenuOpen);
        }

        // Prevent body scroll when menu is open on mobile
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMenu() {
        this.isMenuOpen = false;
        
        if (this.navMenu) {
            this.navMenu.classList.remove('active');
        }
        
        if (this.navToggle) {
            this.navToggle.classList.remove('active');
        }

        document.body.style.overflow = '';
    }
}

// ===== CAROUSEL MANAGER =====
class CarouselManager {
    constructor() {
        this.carousels = [];
        this.init();
    }

    init() {
        this.initProblemCarousel();
        this.initPrototypesCarousel();
    }

    initProblemCarousel() {
        const problemSwiper = document.querySelector('.problem-swiper');
        if (!problemSwiper) return;

        const swiper = new Swiper(problemSwiper, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: CONFIG.carousel.autoplay,
                disableOnInteraction: false,
            },
            speed: CONFIG.carousel.speed,
            pagination: {
                el: '.problem-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '.problem-swiper .swiper-button-next',
                prevEl: '.problem-swiper .swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            },
            on: {
                init: function() {
                    this.slides.forEach((slide, index) => {
                        slide.style.setProperty('--slide-index', index);
                    });
                }
            }
        });

        this.carousels.push(swiper);
    }

    initPrototypesCarousel() {
        const prototypesSwiper = document.querySelector('.prototypes-swiper');
        if (!prototypesSwiper) return;

        const swiper = new Swiper(prototypesSwiper, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: CONFIG.carousel.autoplay + 1000,
                disableOnInteraction: false,
            },
            speed: CONFIG.carousel.speed,
            pagination: {
                el: '.prototypes-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '.prototypes-swiper .swiper-button-next',
                prevEl: '.prototypes-swiper .swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            },
            effect: 'creative',
            creativeEffect: {
                prev: {
                    shadow: true,
                    translate: [0, 0, -400],
                },
                next: {
                    translate: ['100%', 0, 0],
                },
            }
        });

        this.carousels.push(swiper);
    }

    // Pause all carousels when page is not visible
    handleVisibilityChange() {
        if (document.hidden) {
            this.carousels.forEach(swiper => {
                if (swiper.autoplay) swiper.autoplay.stop();
            });
        } else {
            this.carousels.forEach(swiper => {
                if (swiper.autoplay) swiper.autoplay.start();
            });
        }
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
        this.setupParallaxElements();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: CONFIG.scroll.threshold,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, options);

        // Observe elements with animation classes
        const elementsToAnimate = document.querySelectorAll([
            '.hero-stats .stat-item',
            '.impact-item',
            '.metric-card',
            '.objective-card',
            '.sense-card',
            '.timeline-item'
        ].join(', '));

        elementsToAnimate.forEach(el => observer.observe(el));
    }

    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}, transform ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}`;

        // Trigger animation
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    animateCounters() {
        const counterElements = document.querySelectorAll([
            '.stat-number',
            '.metric-number',
            '.highlight-number',
            '.sustain-number'
        ].join(', '));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                    entry.target.setAttribute('data-animated', 'true');
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => observer.observe(el));
    }

    animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        
        if (isNaN(number)) return;

        const hasPercent = text.includes('%');
        const hasPlus = text.includes('+');
        const hasCurrency = text.includes('R$');

        Utils.animateNumber(element, 0, number, 2000);

        // Add back formatting after animation
        const originalUpdate = element.textContent;
        const observer = new MutationObserver(() => {
            const currentNumber = parseInt(element.textContent);
            let formattedText = currentNumber.toString();
            
            if (hasCurrency) formattedText = `R$ ${formattedText}`;
            if (hasPercent) formattedText += '%';
            if (hasPlus && currentNumber === number) formattedText += '+';
            
            element.textContent = formattedText;
        });

        observer.observe(element, { childList: true, characterData: true });
        
        // Stop observing after animation completes
        setTimeout(() => observer.disconnect(), 2500);
    }

    setupParallaxElements() {
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        if (!parallaxElements.length) return;

        const handleScroll = Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== BACK TO TOP BUTTON =====
class BackToTopButton {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.isVisible = false;
        this.init();
    }

    init() {
        if (!this.button) return;

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        const handleScroll = Utils.throttle(() => {
            const shouldShow = window.scrollY > 300;
            
            if (shouldShow && !this.isVisible) {
                this.show();
            } else if (!shouldShow && this.isVisible) {
                this.hide();
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    show() {
        this.isVisible = true;
        this.button.classList.add('visible');
    }

    hide() {
        this.isVisible = false;
        this.button.classList.remove('visible');
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.preloadCriticalResources();
        this.optimizeImages();
    }

    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        
        if (!images.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const criticalFonts = [
            'Inter',
            'Space Grotesk'
        ];

        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    optimizeImages() {
        // Add loading="lazy" to images below the fold
        const images = document.querySelectorAll('img:not([loading])');
        const firstFoldHeight = window.innerHeight;

        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top > firstFoldHeight) {
                img.loading = 'lazy';
            }
        });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALabels();
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for carousels
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.swiper')) {
                const swiper = e.target.closest('.swiper').swiper;
                
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        swiper?.slidePrev();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        swiper?.slideNext();
                        break;
                    case ' ':
                        e.preventDefault();
                        if (swiper?.autoplay?.running) {
                            swiper.autoplay.stop();
                        } else {
                            swiper?.autoplay?.start();
                        }
                        break;
                }
            }
        });
    }

    setupFocusManagement() {
        // Improve focus visibility
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focus-visible');
            });

            element.addEventListener('blur', () => {
                element.classList.remove('focus-visible');
            });
        });
    }

    setupARIALabels() {
        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            const text = button.textContent.trim();
            if (text) {
                button.setAttribute('aria-label', text);
            }
        });

        // Add ARIA labels to navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const text = link.querySelector('span')?.textContent;
            if (text) {
                link.setAttribute('aria-label', `Navegar para ${text}`);
            }
        });
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Disable autoplay on carousels
            document.querySelectorAll('.swiper').forEach(swiperEl => {
                if (swiperEl.swiper?.autoplay) {
                    swiperEl.swiper.autoplay.stop();
                }
            });

            // Reduce animation durations
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-base', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
        }
    }
}

// ===== ERROR HANDLING =====
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        // Global error handling
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            this.handleError(e.error);
        });

        // Promise rejection handling
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            this.handleError(e.reason);
        });
    }

    handleError(error) {
        // Graceful degradation
        if (error.message?.includes('Swiper')) {
            console.warn('Swiper failed to initialize, falling back to static content');
            this.fallbackForCarousels();
        }

        if (error.message?.includes('AOS')) {
            console.warn('AOS failed to initialize, animations disabled');
        }
    }

    fallbackForCarousels() {
        // Show all slides if Swiper fails
        const swiperContainers = document.querySelectorAll('.swiper-wrapper');
        swiperContainers.forEach(wrapper => {
            wrapper.style.display = 'flex';
            wrapper.style.flexWrap = 'wrap';
            wrapper.style.gap = '1rem';
        });
    }
}

// ===== ANALYTICS & TRACKING =====
class AnalyticsTracker {
    constructor() {
        this.events = [];
        this.init();
    }

    init() {
        this.trackPageView();
        this.trackUserInteractions();
        this.trackPerformanceMetrics();
    }

    trackPageView() {
        const pageData = {
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        this.logEvent('page_view', pageData);
    }

    trackUserInteractions() {
        // Track navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.logEvent('navigation_click', {
                    target: e.target.textContent.trim(),
                    href: e.target.getAttribute('href')
                });
            });
        });

        // Track button clicks
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.logEvent('button_click', {
                    text: e.target.textContent.trim(),
                    type: e.target.className
                });
            });
        });

        // Track carousel interactions
        document.addEventListener('swiper-slide-change', (e) => {
            this.logEvent('carousel_interaction', {
                carousel: e.target.className,
                slideIndex: e.detail?.activeIndex || 0
            });
        });
    }

    trackPerformanceMetrics() {
        // Track Core Web Vitals
        if ('web-vital' in window) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(this.logWebVital.bind(this));
                getFID(this.logWebVital.bind(this));
                getFCP(this.logWebVital.bind(this));
                getLCP(this.logWebVital.bind(this));
                getTTFB(this.logWebVital.bind(this));
            });
        }
    }

    logWebVital(metric) {
        this.logEvent('web_vital', {
            name: metric.name,
            value: metric.value,
            rating: metric.rating
        });
    }

    logEvent(eventName, data) {
        const event = {
            name: eventName,
            data: data,
            timestamp: new Date().toISOString()
        };

        this.events.push(event);
        
        // Log to console in development
        if (window.location.hostname === 'localhost') {
            console.log('Analytics Event:', event);
        }

        // In production, send to analytics service
        // this.sendToAnalytics(event);
    }

    sendToAnalytics(event) {
        // Implementation for sending to analytics service
        // Example: Google Analytics, Adobe Analytics, etc.
    }
}

// ===== MAIN APPLICATION =====
class SensoryEnvironmentApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Initialize core components
        this.components.loadingManager = new LoadingManager();
        this.components.errorHandler = new ErrorHandler();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.components.navigation = new ModernNavigation();
            this.components.carouselManager = new CarouselManager();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.backToTop = new BackToTopButton();
            this.components.performanceOptimizer = new PerformanceOptimizer();
            this.components.accessibilityEnhancer = new AccessibilityEnhancer();
            this.components.analyticsTracker = new AnalyticsTracker();

            this.setupGlobalEventListeners();
            this.isInitialized = true;

            console.log('✅ Sensory Environment App initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.components.errorHandler?.handleError(error);
        }
    }

    setupGlobalEventListeners() {
        // Handle visibility change for performance
        document.addEventListener('visibilitychange', () => {
            this.components.carouselManager?.handleVisibilityChange();
        });

        // Handle resize events
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle orientation change on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });
    }

    handleResize() {
        // Recalculate layouts and update components
        const deviceType = Utils.getDeviceType();
        document.body.setAttribute('data-device', deviceType);

        // Update navigation if needed
        if (this.components.navigation && deviceType === 'desktop') {
            this.components.navigation.closeMenu();
        }

        // Refresh AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Public API for external interactions
    navigateTo(sectionId) {
        const element = document.getElementById(sectionId);
        if (element && this.components.navigation) {
            Utils.smoothScrollTo(element, CONFIG.scroll.offset);
        }
    }

    pauseCarousels() {
        this.components.carouselManager?.carousels.forEach(swiper => {
            if (swiper.autoplay) swiper.autoplay.stop();
        });
    }

    resumeCarousels() {
        this.components.carouselManager?.carousels.forEach(swiper => {
            if (swiper.autoplay) swiper.autoplay.start();
        });
    }
}

// ===== INITIALIZE APPLICATION =====
// Create global app instance
window.SensoryApp = new SensoryEnvironmentApp();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SensoryEnvironmentApp;
}