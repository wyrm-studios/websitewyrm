// State
const state = {
    currentPage: 'home',
    theme: 'dark',
    siriTimer: null,
    messages: [
        "Design is intelligence made visible.",
        "We don't just build brands. We engineer emotions.",
        "Clean code. Cleaner visuals.",
        "Ready to launch your next big idea?",
        "Simplicity is the ultimate sophistication."
    ]
};

// Logo URLs
const logos = {
    dark: 'https://raw.githubusercontent.com/wyrm-studios/websitewyrm/main/public/assets/white%20logo%20png.png',
    light: 'https://raw.githubusercontent.com/wyrm-studios/websitewyrm/main/public/assets/black%20logo%20png.png'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initNavigation();
    initMobileMenu();
    initThemeToggle();
    initSiri();
});

// Theme Functions
function loadTheme() {
    const saved = localStorage.getItem('wyrm-theme') || 'dark';
    state.theme = saved;
    document.documentElement.setAttribute('data-theme', saved);
    updateLogo(saved);
}

function updateLogo(theme) {
    const logoImg = document.getElementById('logoImg');
    const mobileLogoImg = document.getElementById('mobileLogoImg');
    if (logoImg) logoImg.src = logos[theme];
    if (mobileLogoImg) mobileLogoImg.src = logos[theme];
}

function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    toggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('wyrm-theme', state.theme);
        updateLogo(state.theme);
    });
}

// Navigation
function initNavigation() {
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            switchPage(pageId);
            
            // Update active states
            document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            document.getElementById('mobilePanel').classList.remove('open');
        });
    });
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            setTimeout(() => page.classList.add('active'), 100);
        }
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.getElementById('closeMobileMenu');
    const panel = document.getElementById('mobilePanel');
    
    menuBtn.addEventListener('click', () => panel.classList.add('open'));
    closeBtn.addEventListener('click', () => panel.classList.remove('open'));
    
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !menuBtn.contains(e.target)) {
            panel.classList.remove('open');
        }
    });
}

// Accordion
function toggleAccordion(btn) {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.accordion-item').forEach(acc => acc.classList.remove('active'));
    if (!isActive) item.classList.add('active');
}

// Modal
function openModal() {
    document.getElementById('hireModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('hireModal').classList.remove('active');
    document.body.style.overflow = '';
}

function handleFormSubmit(e) {
    e.preventDefault();
    alert('Thank you! We will contact you within 24 hours.');
    closeModal();
    e.target.reset();
}

// Siri Animation
function initSiri() {
    const siriImg = document.getElementById('siriImg');
    const siriBubble = document.getElementById('siriBubble');
    const siriMascot = document.getElementById('siriMascot');
    
    if (!siriImg || !siriMascot) return;
    
    // Load Siri frames
    const frameUrls = [];
    for (let i = 1; i <= 20; i++) {
        const num = i.toString().padStart(2, '0');
        frameUrls.push(`public/assets/siri/Untitled-4000100${num}.png`);
    }
    
    // Animate Siri
    let frame = 0;
    state.siriTimer = setInterval(() => {
        siriImg.src = frameUrls[frame];
        frame = (frame + 1) % frameUrls.length;
    }, 100);
    
    // Show message on click
    siriMascot.addEventListener('click', () => {
        const msg = state.messages[Math.floor(Math.random() * state.messages.length)];
        siriBubble.textContent = msg;
        siriBubble.classList.add('show');
        setTimeout(() => siriBubble.classList.remove('show'), 5000);
    });
}
