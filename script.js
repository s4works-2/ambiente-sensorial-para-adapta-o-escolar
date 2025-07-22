// ========================================
// AMBIENTE SENSORIAL - JAVASCRIPT MODERNO 2025
// Funcionalidades Essenciais e Performance Otimizada
// ========================================

'use strict';

// ===== CONFIGURAÇÃO =====
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

// ===== UTILITÁRIOS =====
const Utils = {
    // Debounce para otimização de performance
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

    // Throttle para eventos de scroll
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

    // Verificar se elemento está visível
    isElementInViewport(el, threshold = 0.1) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const vertInView = (rect.top <= windowHeight * (1 - threshold)) && ((rect.top + rect.height) >= windowHeight * threshold);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
        
        return vertInView && horInView;
    },

    // Smooth scroll para âncoras
    smoothScrollTo(target, duration = 800) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 70;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
};

// ===== GERENCIADOR DE LOADING =====
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.minLoadingTime = 1500; // Tempo mínimo de loading
        this.startTime = Date.now();
    }

    init() {
        // Simular carregamento de recursos
        this.preloadResources().then(() => {
            this.hideLoading();
        });
    }

    async preloadResources() {
        const resources = [
            // Preload de fontes críticas
            new Promise(resolve => {
                if (document.fonts) {
                    document.fonts.ready.then(resolve);
                } else {
                    setTimeout(resolve, 1000);
                }
            }),
            // Preload de imagens críticas
            ...this.preloadImages()
        ];

        await Promise.all(resources);
        
        // Garantir tempo mínimo de loading
        const elapsedTime = Date.now() - this.startTime;
        if (elapsedTime < this.minLoadingTime) {
            await new Promise(resolve => setTimeout(resolve, this.minLoadingTime - elapsedTime));
        }
    }

    preloadImages() {
        const imageUrls = [
            // Adicionar URLs de imagens críticas aqui se necessário
        ];

        return imageUrls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve; // Continuar mesmo se imagem falhar
                img.src = url;
            });
        });
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

// ===== GERENCIADOR DE NAVEGAÇÃO =====
class NavigationManager {
    constructor() {
        this.nav = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.scrollProgress = document.getElementById('scroll-progress');
        this.sections = document.querySelectorAll('section[id]');
        
        this.isMenuOpen = false;
        this.currentSection = '';
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
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.navMenu) {
            this.navMenu.classList.toggle('active', this.isMenuOpen);
        }
        
        if (this.navToggle) {
            this.navToggle.classList.toggle('active', this.isMenuOpen);
        }

        // Prevenir scroll do body quando menu aberto
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
                if (this.currentSection !== sectionId) {
                    this.currentSection = sectionId;
                    
                    // Atualizar links ativos
                    this.navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${sectionId}`);
                    });
                }
            }
        });
    }

    updateNavBackground() {
        if (!this.nav) return;
        
        const scrolled = window.pageYOffset > 50;
        this.nav.classList.toggle('scrolled', scrolled);
    }
}

// ===== GERENCIADOR DE CARROSSÉIS =====
class CarouselManager {
    constructor() {
        this.carousels = [];
    }

    init() {
        this.initProblemCarousel();
        this.initPrototypesCarousel();
    }

    initProblemCarousel() {
        const problemSwiper = new Swiper('.problem-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: CONFIG.carousel.autoplay,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });

        this.carousels.push(problemSwiper);
    }

    initPrototypesCarousel() {
        const prototypesSwiper = new Swiper('.prototypes-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: CONFIG.carousel.autoplay + 1000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });

        this.carousels.push(prototypesSwiper);
    }
}

// ===== GERENCIADOR DE ANIMAÇÕES =====
class AnimationManager {
    constructor() {
        this.animatedElements = new Set();
    }

    init() {
        // Inicializar AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 120,
                delay: 0,
            });
        }

        // Animações customizadas
        this.initCustomAnimations();
        this.bindScrollAnimations();
    }

    initCustomAnimations() {
        // Animação de contadores
        this.animateCounters();
        
        // Animação de elementos flutuantes
        this.animateFloatingElements();
    }

    bindScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar elementos com animação
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-animate');
        
        switch (animationType) {
            case 'counter':
                this.animateCounter(element);
                break;
            case 'slide-in':
                this.slideIn(element);
                break;
            case 'fade-in':
                this.fadeIn(element);
                break;
        }
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .metric-number, .highlight-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            if (isNaN(target)) return;
            
            counter.setAttribute('data-animate', 'counter');
            counter.setAttribute('data-target', target);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = 2000;
        const start = performance.now();
        const suffix = element.textContent.replace(/[\d]/g, '');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    slideIn(element) {
        element.style.transform = 'translateX(-50px)';
        element.style.opacity = '0';
        element.style.transition = 'all 0.6s ease-out';
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });
    }

    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.8s ease-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    animateFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            const delay = index * 0.5;
            const duration = 3 + Math.random() * 2;
            
            element.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        });
    }
}

// ===== GERENCIADOR DE INTERAÇÕES =====
class InteractionManager {
    constructor() {
        this.backToTopBtn = document.getElementById('back-to-top');
    }

    init() {
        this.initBackToTop();
        this.initDownloadButtons();
        this.initLucideIcons();
    }

    initBackToTop() {
        if (!this.backToTopBtn) return;

        // Mostrar/ocultar botão baseado no scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrolled = window.pageYOffset > 300;
            this.backToTopBtn.classList.toggle('visible', scrolled);
        }, 100));

        // Click do botão
        this.backToTopBtn.addEventListener('click', () => {
            Utils.smoothScrollTo(document.body);
        });
    }

    initDownloadButtons() {
        const downloadBtns = document.querySelectorAll('.download-btn');
        
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Feedback visual
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i data-lucide="check"></i> Download Iniciado!';
                btn.style.pointerEvents = 'none';
                
                // Simular download (substituir por lógica real)
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.pointerEvents = 'auto';
                    // Reinitialiazar ícones Lucide
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 2000);
                
                // Analytics ou tracking aqui
                this.trackDownload(btn);
            });
        });
    }

    trackDownload(button) {
        const fileName = button.querySelector('.download-name')?.textContent || 'unknown';
        console.log(`Download iniciado: ${fileName}`);
        
        // Implementar tracking real aqui (Google Analytics, etc.)
    }

    initLucideIcons() {
        // Inicializar ícones Lucide quando disponível
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            // Fallback para quando Lucide não carregou
            console.warn('Lucide icons não encontrado');
        }
    }
}

// ===== GERENCIADOR PRINCIPAL =====
class App {
    constructor() {
        this.loadingManager = new LoadingManager();
        this.navigationManager = new NavigationManager();
        this.carouselManager = new CarouselManager();
        this.animationManager = new AnimationManager();
        this.interactionManager = new InteractionManager();
    }

    async init() {
        try {
            // Inicializar loading
            this.loadingManager.init();
            
            // Aguardar DOM estar pronto
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Inicializar módulos
            this.navigationManager.init();
            this.animationManager.init();
            this.interactionManager.init();
            
            // Aguardar Swiper estar disponível
            await this.waitForSwiper();
            this.carouselManager.init();
            
            console.log('✅ Aplicação inicializada com sucesso');
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
        }
    }

    async waitForSwiper() {
        return new Promise((resolve) => {
            if (typeof Swiper !== 'undefined') {
                resolve();
            } else {
                const checkSwiper = () => {
                    if (typeof Swiper !== 'undefined') {
                        resolve();
                    } else {
                        setTimeout(checkSwiper, 100);
                    }
                };
                checkSwiper();
            }
        });
    }
}

// ===== CSS PARA ANIMAÇÕES =====
const animationCSS = `
@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(-5px) rotate(-1deg); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.floating-element {
    animation: float 6s ease-in-out infinite;
}
`;

// Adicionar CSS de animações
const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

// ===== INICIALIZAÇÃO =====
const app = new App();
app.init();

// ===== EXPORTS PARA DEBUG =====
if (typeof window !== 'undefined') {
    window.SensoryApp = {
        app,
        Utils,
        CONFIG
    };
}