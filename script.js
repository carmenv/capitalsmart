// ========================================
// SCRIPT.JS - FUNCIONALIDADES INTERACTIVAS
// ========================================

// ========================================
// 1. SMOOTH SCROLL NAVIGATION
// ========================================
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

// ========================================
// 2. HEADER STICKY EFFECT
// ========================================
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ========================================
// 3. COURSE CARD INTERACTIONS
// ========================================
const courseCards = document.querySelectorAll('.course-card');

courseCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });

    const exploreBtn = card.querySelector('.btn-small');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const courseName = card.querySelector('h3').textContent;
            console.log(`Explorar curso: ${courseName}`);
            // Aquí puedes agregar lógica para ir a página de curso
            alert(`Redirigiendo a ${courseName}...`);
        });
    }
});

// ========================================
// 4. SEARCH BAR FUNCTIONALITY
// ========================================
const searchInput = document.querySelector('.search-input');
const searchSelect = document.querySelector('.search-select');
const searchBtn = document.querySelector('.search-btn');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const category = searchSelect.value;
        const query = searchInput.value;
        console.log(`Búsqueda: ${query} en ${category}`);
        // Aquí irá la lógica de búsqueda
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// ========================================
// 5. BUTTON INTERACTIONS
// ========================================
const primaryButtons = document.querySelectorAll('.btn-primary');
const secondaryButtons = document.querySelectorAll('.btn-secondary');

primaryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Efecto ripple simple
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,255,0.5)';
        ripple.style.width = ripple.style.height = '20px';
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ========================================
// 6. OBSERVER PARA ANIMACIONES EN SCROLL
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animar tarjetas cuando entran en viewport
[...courseCards, ...document.querySelectorAll('.benefit-card')].forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// ========================================
// 7. COUNTERS ANIMADOS (STATS SECTION)
// ========================================
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : element.textContent.includes('%') ? '%' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('+') ? '+' : element.textContent.includes('%') ? '%' : '');
        }
    };
    
    updateCounter();
}

// Animar stats cuando se vean
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            
            const stats = entry.target.querySelectorAll('.stat-number');
            stats.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                animateCounter(stat, number);
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statObserver.observe(statsSection);
}

// ========================================
// 8. MODAL / POPUP SIMPLE
// ========================================
function showModal(message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        z-index: 9999;
        max-width: 500px;
        animation: slideIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <p style="margin-bottom: 1.5rem; color: #333;">${message}</p>
        <button style="
            background: #7c3aed;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
        ">Cerrar</button>
    `;
    
    modal.querySelector('button').addEventListener('click', () => {
        modal.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });
    
    document.body.appendChild(modal);
}

// ========================================
// 9. TRACKING Y EVENTOS (ANALYTICS)
// ========================================
function trackEvent(category, action, label) {
    if (window.gtag) {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log(`Event: ${category} - ${action} - ${label}`);
}

// Track clicks en botones principales
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('engagement', 'button_click', btn.textContent.trim());
    });
});

// ========================================
// 10. KEYBOARD SHORTCUTS
// ========================================
document.addEventListener('keydown', (e) => {
    // Presionar 's' para ir a búsqueda
    if (e.key === 's' || e.key === 'S') {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Presionar 'c' para ir a cursos
    if (e.key === 'c' || e.key === 'C') {
        const cursosSection = document.querySelector('#cursos');
        if (cursosSection) {
            cursosSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ========================================
// 11. TEMA OSCURO (OPCIONAL)
// ========================================
function initDarkMode() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDarkMode) {
        document.documentElement.style.setProperty('--bg-primary', '#0f172a');
        document.documentElement.style.setProperty('--bg-secondary', '#1e293b');
        document.documentElement.style.setProperty('--text-primary', '#f1f5f9');
        document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
        document.documentElement.style.setProperty('--border', '#334155');
    }
}

// Descomenta para habilitar dark mode automático
// initDarkMode();

// ========================================
// 12. PERFORMANCE: LAZY LOADING
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// 13. FORM VALIDATION (SI ES NECESARIO)
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================================
// 14. INIT FUNCTION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 TechMastery Landing Page Cargada');
    
    // Agregar animaciones de entrada
    document.body.style.animation = 'fadeIn 0.5s ease';
});

// ========================================
// ESTILOS DINÁMICOS PARA ANIMACIONES
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .btn-primary, .btn-secondary {
        position: relative;
    }
`;

document.head.appendChild(style);
