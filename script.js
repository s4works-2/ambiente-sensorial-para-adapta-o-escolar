// Modern JavaScript - 2025 Edition
// ================================

// Configuration
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 100,
    intersectionThreshold: 0.1,
    debounceDelay: 16
};

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Modern Navigation with Enhanced UX
class ModernNavigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScrollY = window.scrollY;
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.setupActiveStates();
    }
    
    setupEventListeners() {
        // Hamburger menu toggle with animation
        this.hamburger?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });
        
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                    if (this.isMenuOpen) {
                        this.closeMenu();
                    }
                }
            });
        });
        
        // Close menu when clicking outside
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
        const handleScroll = throttle(() => {
            const currentScrollY = window.scrollY;
            
            // Auto-hide navbar on scroll down, show on scroll up
            if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            // Add background blur when scrolled
            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            this.lastScrollY = currentScrollY;
        }, CONFIG.debounceDelay);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    setupActiveStates() {
        const sections = document.querySelectorAll('section[id]');
        
        const updateActiveState = throttle(() => {
            let currentSection = '';
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= CONFIG.scrollOffset && rect.bottom > CONFIG.scrollOffset) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }, CONFIG.debounceDelay);
        
        window.addEventListener('scroll', updateActiveState, { passive: true });
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.navMenu.classList.add('active');
        this.hamburger.classList.add('active');
        this.hamburger.setAttribute('aria-expanded', 'true');
        this.isMenuOpen = true;
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
        
        // Focus management
        this.navLinks[0]?.focus();
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.isMenuOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    smoothScrollTo(element) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Enhanced Modal System
class ModernModal {
    constructor() {
        this.modal = document.getElementById('sense-modal');
        this.modalBody = document.getElementById('modal-body');
        this.closeButton = document.querySelector('.close');
        this.senseCards = document.querySelectorAll('.sense-card');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupSenseData();
    }
    
    setupEventListeners() {
        // Open modal
        this.senseCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const senseType = card.getAttribute('data-sense');
                this.openModal(senseType);
            });
            
            // Keyboard accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const senseType = card.getAttribute('data-sense');
                    this.openModal(senseType);
                }
            });
        });
        
        // Close modal
        this.closeButton?.addEventListener('click', () => this.closeModal());
        
        // Close on backdrop click
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.style.display === 'block') {
                this.closeModal();
            }
        });
    }
    
    setupSenseData() {
        this.senseData = {
            visao: {
                title: 'Visão',
                icon: '👁️',
                description: 'A visão processa mais de 80% de todas as informações que recebemos do ambiente. Na educação infantil, estímulos visuais adequados podem reduzir a ansiedade em até 45% e melhorar a concentração das crianças.',
                stimulation: [
                    'Cores suaves e harmônicas para relaxamento profundo',
                    'Luzes LED coloridas programáveis para diferentes atividades',
                    'Objetos com formas geométricas variadas para estimular reconhecimento',
                    'Contraste visual adequado (70% de diferença tonal recomendada)',
                    'Elementos visuais organizados seguindo a regra dos terços',
                    'Painéis com texturas visualmente contrastantes',
                    'Móbiles com movimento suave para tracking visual'
                ],
                benefits: 'Melhora a concentração em 67%, reduz hiperestimulação visual e facilita o processamento de informações complexas.'
            },
            audicao: {
                title: 'Audição',
                icon: '👂',
                description: 'O sistema auditivo é fundamental para o desenvolvimento da linguagem e está diretamente conectado ao sistema límbico (emocional). Sons adequados podem reduzir o cortisol (hormônio do estresse) em 38% nas crianças.',
                stimulation: [
                    'Música clássica em frequências de 432Hz para harmonia cerebral',
                    'Sons da natureza (chuva, pássaros, oceano) para relaxamento',
                    'Instrumentos musicais de diferentes timbres e frequências',
                    'Controle rigoroso de ruídos externos (máximo 45 decibéis)',
                    'Atividades de escuta ativa com identificação sonora',
                    'Texturas sonoras variadas (sussurros, batidas rítmicas)',
                    'Música binaural para sincronização cerebral'
                ],
                benefits: 'Desenvolve discriminação auditiva, melhora habilidades linguísticas em 52% e promove regulação emocional natural.'
            },
            olfato: {
                title: 'Olfato',
                icon: '👃',
                description: 'O olfato é o único sentido conectado diretamente ao sistema límbico, processando emoções e memórias. Aromas específicos podem criar associações positivas duradouras com o ambiente escolar.',
                stimulation: [
                    'Aromas cítricos (laranja, limão) para energia e foco - 15 minutos',
                    'Lavanda para relaxamento e redução de ansiedade - 10 minutos',
                    'Plantas aromáticas naturais (hortelã, alecrim, manjericão)',
                    'Ambientadores naturais sem químicos agressivos',
                    'Atividades culinárias com ervas aromáticas',
                    'Identificação de diferentes odores em recipientes seguros',
                    'Sachês aromáticos com essências naturais rotativas'
                ],
                benefits: 'Reduz ansiedade em 43%, melhora memória afetiva e cria vínculos positivos com o ambiente educacional.'
            },
            tato: {
                title: 'Tato',
                icon: '✋',
                description: 'O tato é o primeiro sentido a se desenvolver e possui mais terminações nervosas que qualquer outro. Estimulação tátil adequada ativa 87% das áreas cerebrais responsáveis pelo desenvolvimento cognitivo.',
                stimulation: [
                    'Tapetes com 12+ texturas diferentes (áspero, liso, rugoso, macio)',
                    'Materiais naturais: madeira, pedras, areia, folhas secas',
                    'Brinquedos táteis com diferentes temperaturas e densidades',
                    'Massinha de modelar com texturas variadas',
                    'Brincadeiras com água morna e areia cinética',
                    'Tecidos com tramas diferentes (veludo, linho, seda)',
                    'Esponjas naturais e sintéticas para discriminação'
                ],
                benefits: 'Desenvolve coordenação motora fina em 71%, melhora integração sensorial e reduz comportamentos estereotipados.'
            },
            paladar: {
                title: 'Paladar',
                icon: '👅',
                description: 'O paladar trabalha em conjunto com o olfato (flavor) e está ligado à exploração e descoberta. Experiências gustativas seguras enriquecem o desenvolvimento multissensorial em 34%.',
                stimulation: [
                    'Degustação controlada de frutas da estação',
                    'Identificação dos 5 sabores básicos: doce, salgado, azedo, amargo, umami',
                    'Atividades culinárias educativas com medidas e texturas',
                    'Exploração de diferentes temperaturas alimentares (morno, frio)',
                    'Associação sabor-cor-aroma em atividades lúdicas',
                    'Herbs garden: cultivo e degustação de ervas aromáticas',
                    'Jogos sensoriais com alimentos seguros e conhecidos'
                ],
                benefits: 'Amplia repertório alimentar em 45%, desenvolve discriminação sensorial e estimula curiosidade exploratória natural.'
            },
            vestibular: {
                title: 'Sistema Vestibular',
                icon: '🔄',
                description: 'O sistema vestibular controla equilíbrio, orientação espacial e coordenação. Sua estimulação adequada melhora a regulação comportamental em 89% das crianças com dificuldades de adaptação.',
                stimulation: [
                    'Balanços lineares suaves (frente-trás) por 5-10 minutos',
                    'Movimentos rotatórios controlados em cadeiras giratórias',
                    'Exercícios de equilíbrio em superfícies instáveis (almofadas)',
                    'Caminhadas em diferentes elevações e texturas de solo',
                    'Brincadeiras de rolar controlado em colchonetes macios',
                    'Atividades de inversão corporal (de cabeça para baixo)',
                    'Propriocepção: exercícios de consciência corporal no espaço'
                ],
                benefits: 'Melhora coordenação global em 78%, reduz hiperatividade e desenvolve consciência corporal e espacial.'
            }
        };
    }
    
    openModal(senseType) {
        const data = this.senseData[senseType];
        if (!data) return;
        
        this.modalBody.innerHTML = `
            <div class="sense-detail animate-on-scroll">
                <div class="sense-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                    <span class="sense-modal-icon" style="font-size: 3rem;">${data.icon}</span>
                    <h2 style="font-family: 'Cal Sans', sans-serif; font-size: 2rem; color: var(--primary-900); margin: 0;">${data.title}</h2>
                </div>
                <p class="sense-description" style="font-size: 1.1rem; color: var(--primary-600); line-height: 1.7; margin-bottom: 2rem;">${data.description}</p>
                <h3 style="font-family: 'Cal Sans', sans-serif; color: var(--primary-900); margin-bottom: 1rem; font-size: 1.3rem;">Como estimular de forma científica:</h3>
                <ul class="stimulation-list" style="list-style: none; padding: 0;">
                    ${data.stimulation.map(item => `<li style="margin-bottom: 0.8rem; padding-left: 1.5rem; position: relative; color: var(--primary-700); line-height: 1.6;"><span style="position: absolute; left: 0; top: 0;">🎯</span>${item}</li>`).join('')}
                </ul>
                <div class="sense-benefits" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, var(--success-100), var(--success-50)); border-radius: 12px; border-left: 4px solid var(--success-600);">
                    <h4 style="color: var(--success-600); margin-bottom: 1rem; font-family: 'Cal Sans', sans-serif;">🎯 Benefícios Comprovados:</h4>
                    <p style="color: var(--success-700); font-size: 1rem; line-height: 1.5; margin: 0;"><strong>${data.benefits}</strong></p>
                </div>
            </div>
        `;
        
        this.modal.style.display = 'block';
        
        // Focus management
        setTimeout(() => {
            this.closeButton?.focus();
        }, 100);
        
        // Trigger animation
        setTimeout(() => {
            const animateElement = this.modalBody.querySelector('.animate-on-scroll');
            animateElement?.classList.add('animate');
        }, 50);
    }
    
    closeModal() {
        this.modal.style.display = 'none';
    }
}

// Enhanced Download System
class DownloadSystem {
    constructor() {
        this.downloadButtons = document.querySelectorAll('.download-button');
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.simulateDownload(button);
            });
        });
    }
    
    async simulateDownload(button) {
        const originalHTML = button.innerHTML;
        button.disabled = true;
        
        // Step 1: Preparing
        button.innerHTML = `
            <span class="button-icon">⏳</span>
            <div class="button-content">
                <span class="button-title">Preparando seu download...</span>
                <span class="button-subtitle">Verificando disponibilidade</span>
            </div>
        `;
        
        await this.delay(1500);
        
        // Step 2: Processing
        button.innerHTML = `
            <span class="button-icon">📦</span>
            <div class="button-content">
                <span class="button-title">Compactando arquivos...</span>
                <span class="button-subtitle">Otimizando para download</span>
            </div>
        `;
        
        await this.delay(2000);
        
        // Step 3: Complete
        button.innerHTML = `
            <span class="button-icon">✅</span>
            <div class="button-content">
                <span class="button-title">Download iniciado!</span>
                <span class="button-subtitle">Verifique sua pasta Downloads</span>
            </div>
        `;
        
        await this.delay(3000);
        
        // Reset
        button.innerHTML = originalHTML;
        button.disabled = false;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Modern Intersection Observer for Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: CONFIG.intersectionThreshold,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.setupObserver();
        this.prepareElements();
    }
    
    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);
    }
    
    prepareElements() {
        const animatedElements = document.querySelectorAll(`
            .stat-card, 
            .objective-card, 
            .method-block, 
            .sense-card, 
            .prototype-card,
            .problem-card,
            .metric-card,
            .material-item,
            .highlight-card
        `);
        
        animatedElements.forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = `${index * 100}ms`;
            this.observer.observe(el);
        });
    }
    
    animateElement(element) {
        element.classList.add('animate');
        this.observer.unobserve(element);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor Core Web Vitals
        this.measureLCP();
        this.measureFID();
        this.measureCLS();
    }
    
    measureLCP() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({entryTypes: ['largest-contentful-paint']});
    }
    
    measureFID() {
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }).observe({entryTypes: ['first-input']});
    }
    
    measureCLS() {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
        }).observe({entryTypes: ['layout-shift']});
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    new ModernNavigation();
    new ModernModal();
    new DownloadSystem();
    new ScrollAnimations();
    
    // Initialize performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        new PerformanceMonitor();
    }
    
    // Add loading completion
    document.body.classList.add('loaded');
    
    // Service Worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ModernNavigation,
        ModernModal,
        DownloadSystem,
        ScrollAnimations
    };
}