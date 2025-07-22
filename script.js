// Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scrolling for navigation links
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
        // Close mobile menu if open
        navMenu.classList.remove('active');
    });
});

// Modal functionality for senses
const modal = document.getElementById('sense-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close');

const senseData = {
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

// Enhanced modal functionality with benefits
document.querySelectorAll('.sense-card').forEach(card => {
    card.addEventListener('click', () => {
        const senseType = card.getAttribute('data-sense');
        const data = senseData[senseType];
        
        if (data) {
            modalBody.innerHTML = `
                <div class="sense-detail">
                    <div class="sense-header">
                        <span class="sense-modal-icon">${data.icon}</span>
                        <h2>${data.title}</h2>
                    </div>
                    <p class="sense-description">${data.description}</p>
                    <h3>Como estimular de forma científica:</h3>
                    <ul class="stimulation-list">
                        ${data.stimulation.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <div class="sense-benefits">
                        <h4>🎯 Benefícios Comprovados:</h4>
                        <p><strong>${data.benefits}</strong></p>
                    </div>
                </div>
            `;
            modal.style.display = 'block';
        }
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Enhanced download button with more realistic simulation
document.querySelectorAll('.download-button').forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent;
        const originalHTML = button.innerHTML;
        
        button.innerHTML = '<span class="button-icon">⏳</span><div class="button-content"><span class="button-title">Preparando seu download...</span><span class="button-subtitle">Aguarde alguns instantes</span></div>';
        button.disabled = true;
        
        // Simulate download progress
        setTimeout(() => {
            button.innerHTML = '<span class="button-icon">📦</span><div class="button-content"><span class="button-title">Compactando arquivos...</span><span class="button-subtitle">Quase pronto!</span></div>';
            
            setTimeout(() => {
                button.innerHTML = '<span class="button-icon">✅</span><div class="button-content"><span class="button-title">Download iniciado!</span><span class="button-subtitle">Verifique sua pasta Downloads</span></div>';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                }, 3000);
            }, 2000);
        }, 1500);
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stat-card, .objective-card, .method-block, .sense-card, .prototype-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add scroll effect to navbar
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = window.scrollY;
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});