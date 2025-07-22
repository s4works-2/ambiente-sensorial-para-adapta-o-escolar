// ========================================
// AMBIENTE SENSORIAL - JAVASCRIPT MODERNO 2025
// Sistema Otimizado e Responsivo
// ========================================

'use strict';

// ===== CONFIGURAÇÃO GLOBAL =====
const CONFIG = {
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1280
    },
    animation: {
        duration: 300,
        easing: 'ease-out'
    }
};

// ===== UTILITÁRIOS =====
const Utils = {
    // Debounce para performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para scroll
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

    // Smooth scroll
    smoothScrollTo(target, duration = 800) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
};

// ===== LOADING MANAGER =====
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.init();
    }

    init() {
        // Simular carregamento
        setTimeout(() => {
            this.hideLoading();
        }, 1500);

        // Esconder quando tudo carregar
        if (document.readyState === 'complete') {
            setTimeout(() => this.hideLoading(), 800);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.hideLoading(), 800);
            });
        }
    }

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}

// ===== NAVIGATION MANAGER =====
class NavigationManager {
    constructor() {
        this.nav = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.scrollProgress = document.getElementById('scroll-progress');
        this.sections = document.querySelectorAll('section[id]');
        
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateScrollProgress();
        this.updateActiveLink();
    }

    bindEvents() {
        // Toggle menu mobile
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Links de navegação
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Scroll events
        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateScrollProgress();
            this.updateActiveLink();
            this.updateNavBackground();
        }, 16));

        // Fechar menu ao redimensionar
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > CONFIG.breakpoints.mobile && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        }, 250));

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.nav.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.navMenu) {
            this.navMenu.classList.toggle('active', this.isMenuOpen);
        }
        
        if (this.navToggle) {
            this.navToggle.classList.toggle('active', this.isMenuOpen);
        }

        // Prevenir scroll do body
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        if (this.navMenu) this.navMenu.classList.remove('active');
        if (this.navToggle) this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                Utils.smoothScrollTo(targetElement);
                this.closeMobileMenu();
            }
        }
    }

    updateScrollProgress() {
        if (!this.scrollProgress) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        this.scrollProgress.style.width = `${Math.min(scrollPercentage, 100)}%`;
    }

    updateActiveLink() {
        const scrollPos = window.pageYOffset + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    link.classList.toggle('active', href === `#${sectionId}`);
                });
            }
        });
    }

    updateNavBackground() {
        if (!this.nav) return;
        
        const scrolled = window.pageYOffset > 50;
        this.nav.classList.toggle('scrolled', scrolled);
    }
}

// ===== ANIMATION MANAGER =====
class AnimationManager {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        // Inicializar AOS se disponível
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 120,
                delay: 0,
            });
        }

        this.initCounters();
        this.initIntersectionObserver();
    }

    initCounters() {
        const counters = document.querySelectorAll('.stat-number, .metric-number, .highlight-number, .sustain-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            if (!isNaN(target)) {
                counter.setAttribute('data-target', target);
                counter.setAttribute('data-animated', 'false');
            }
        });
    }

    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar contadores
        document.querySelectorAll('[data-target]').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        if (element.hasAttribute('data-target')) {
            this.animateCounter(element);
        }
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = 2000;
        const start = performance.now();
        const originalText = element.textContent;
        const suffix = originalText.replace(/[\d]/g, '');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// ===== INTERACTION MANAGER =====
class InteractionManager {
    constructor() {
        this.backToTopBtn = document.getElementById('back-to-top');
        this.init();
    }

    init() {
        this.initBackToTop();
        this.initDownloadButtons();
        this.initLucideIcons();
    }

    initBackToTop() {
        if (!this.backToTopBtn) return;

        window.addEventListener('scroll', Utils.throttle(() => {
            const scrolled = window.pageYOffset > 300;
            this.backToTopBtn.classList.toggle('visible', scrolled);
        }, 100));

        this.backToTopBtn.addEventListener('click', () => {
            Utils.smoothScrollTo(document.body);
        });
    }

    initDownloadButtons() {
        const downloadBtns = document.querySelectorAll('.download-btn');
        
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i data-lucide="check"></i> Download Iniciado!';
                btn.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.pointerEvents = 'auto';
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 2000);
            });
        });
    }

    initLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// ===== APLICAÇÃO PRINCIPAL =====
class App {
    constructor() {
        this.loadingManager = new LoadingManager();
        this.navigationManager = new NavigationManager();
        this.animationManager = new AnimationManager();
        this.interactionManager = new InteractionManager();
        
        console.log('✅ Ambiente Sensorial - Aplicação inicializada');
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// ===== EXPORT PARA DEBUG =====
if (typeof window !== 'undefined') {
    window.SensoryApp = {
        Utils,
        CONFIG
    };
}