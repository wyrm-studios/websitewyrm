const state = {
    currentPage: 'home',
    theme: 'dark',
    siriFrame: 0,
    siriTimer: null,
    messages: [
        "Design is intelligence made visible.",
        "We don't just build brands. We engineer emotions.",
        "Clean code. Cleaner visuals.",
        "Ready to launch your next big idea?",
        "Simplicity is the ultimate sophistication.",
        "Let's turn your vision into a digital legacy."
    ]
};

let els = {};
let modelViewer = null;

document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    loadTheme();
    initNav();
    initMobileNav();
    initSiri();
    initTheme();
    initFilter();
    initVideoPlayer();
    initModal();
    initButtonHoverEffects();
    init3DModel();
});

function cacheElements() {
    els = {
        pages: document.querySelectorAll('.page'),
        navLinks: document.querySelectorAll('.nav-link'),
        mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
        themeToggle: document.getElementById('themeToggle'),
        siriImg: document.getElementById('siriImg'),
        siriBubble: document.getElementById('siriBubble'),
        siriMascot: document.getElementById('siriMascot'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        projects: document.querySelectorAll('.project-card'),
        // Mobile nav
        mobilePanel: document.getElementById('mobilePanel'),
        openMobilePanel: document.getElementById('openMobilePanel'),
        closeMobilePanel: document.getElementById('closeMobilePanel'),
        // Modal
        hireModal: document.getElementById('hireModal'),
        openHireModal: document.getElementById('openHireModal'),
        openHireModalMobile: document.getElementById('openHireModalMobile'),
        openHireModalContact: document.getElementById('openHireModalContact'),
        closeHireModal: document.getElementById('closeHireModal'),
        hireForm: document.getElementById('hireForm'),
        formSuccess: document.getElementById('formSuccess'),
        closeSuccess: document.getElementById('closeSuccess')
    };
}

/* ========== NAVIGATION ========== */
function initNav() {
    // Desktop nav links
    document.addEventListener('click', (e) => {
        const navLink = e.target.closest('.nav-link');
        if (!navLink) return;
        e.preventDefault();
        const pageId = navLink.getAttribute('data-page');
        if (pageId) switchPage(pageId);
    });
    
    // Mobile nav links
    els.mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            if (pageId) {
                switchPage(pageId);
                closeMobilePanel();
            }
        });
    });
}

function switchPage(pageId) {
    els.pages.forEach(page => {
        if(page.classList.contains('active')) {
            page.style.opacity = '0';
            page.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                page.classList.remove('active');
                page.style.transform = 'translateY(20px)';
                
                const targetPage = document.getElementById(pageId);
                if (targetPage) {
                    targetPage.classList.add('active');
                    void targetPage.offsetWidth;
                    targetPage.style.opacity = '1';
                    targetPage.style.transform = 'translateY(0)';
                    
                    if (pageId === 'work') {
                        const container = document.querySelector('.portfolio-container');
                        if (container) container.scrollTop = 0;
                    }
                    
                    // Disable 3D model when leaving About page
                    if (pageId !== 'about' && modelViewer) {
                        disable3DModel();
                    }
                    // Enable 3D model when entering About page
                    if (pageId === 'about') {
                        setTimeout(enable3DModel, 500);
                    }
                }
            }, 300);
        }
    });
    
    // Update desktop nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageId);
    });
    
    // Update mobile nav active state
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageId);
    });
}

/* ========== MOBILE PANEL NAV ========== */
function initMobileNav() {
    els.openMobilePanel.addEventListener('click', openMobilePanel);
    els.closeMobilePanel.addEventListener('click', closeMobilePanel);
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (els.mobilePanel.classList.contains('open') && 
            !els.mobilePanel.contains(e.target) && 
            !els.openMobilePanel.contains(e.target)) {
            closeMobilePanel();
        }
    });
}

function openMobilePanel() {
    els.mobilePanel.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobilePanel() {
    els.mobilePanel.classList.remove('open');
    document.body.style.overflow = '';
}

/* ========== THEME TOGGLE ========== */
function initTheme() {
    if (els.themeToggle) {
        els.themeToggle.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', state.theme);
            localStorage.setItem('wyrm-theme', state.theme);
        });
    }
}

function loadTheme() {
    const saved = localStorage.getItem('wyrm-theme');
    if (saved) {
        state.theme = saved;
        document.documentElement.setAttribute('data-theme', saved);
    }
}

/* ========== VIDEO PLAYER ========== */
function initVideoPlayer() {
    const video = document.getElementById('introVideo');
    const playButton = document.getElementById('playButton');
    
    if (video && playButton) {
        playButton.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playButton.style.opacity = '0';
            } else {
                video.pause();
                playButton.style.opacity = '1';
            }
        });
        
        video.addEventListener('play', () => { playButton.style.opacity = '0'; });
        video.addEventListener('pause', () => { playButton.style.opacity = '1'; });
    }
}

/* ========== SIRI ========== */
function initSiri() {
    if (!els.siriImg) return;
    const frameUrls = [];
    for (let i = 1; i <= 20; i++) {
        const num = i.toString().padStart(2, '0');
        const url = `public/assets/siri/Untitled-4000100${num}.png`;
        frameUrls.push(url);
    }
    frameUrls.forEach(url => { const img = new Image(); img.src = url; });
    state.siriTimer = setInterval(() => {
        state.siriFrame = (state.siriFrame + 1) % frameUrls.length;
        els.siriImg.src = frameUrls[state.siriFrame];
    }, 100);
    setInterval(() => showSiriMessage(), 10000);
    if (els.siriMascot) els.siriMascot.addEventListener('click', showSiriMessage);
}

function showSiriMessage() {
    if (!els.siriBubble) return;
    const msg = state.messages[Math.floor(Math.random() * state.messages.length)];
    els.siriBubble.textContent = msg;
    els.siriBubble.classList.add('show');
    setTimeout(() => els.siriBubble.classList.remove('show'), 5000);
}

/* ========== PORTFOLIO FILTER ========== */
function initFilter() {
    els.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            els.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            els.projects.forEach(project => {
                const category = project.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    project.classList.remove('hidden');
                    project.classList.add('show');
                } else {
                    project.classList.remove('show');
                    project.classList.add('hidden');
                }
            });
        });
    });
}

/* ========== ACCORDION ========== */
function toggleAccordion(element) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.accordion-item').forEach(acc => acc.classList.remove('active'));
    if (!isActive) item.classList.add('active');
}

/* ========== BUTTON HOVER LINE ANIMATION ========== */
function initButtonHoverEffects() {
    document.querySelectorAll('.nav-cta-btn, .minimal-btn, .filter-btn, .accordion-header, .footer-link, .modal-submit-btn').forEach(btn => {
        btn.classList.add('has-hover-line');
    });
}

/* ========== 3D MODEL - ONLY ACTIVE ON ABOUT PAGE ========== */
function init3DModel() {
    modelViewer = document.getElementById('aboutModel');
    
    if (modelViewer) {
        // Disable controls initially (only enable on About page)
        disable3DModel();
    }
}

function enable3DModel() {
    if (modelViewer) {
        // Enable camera controls and auto-rotate only on About page
        modelViewer.cameraControls = true;
        modelViewer.autoRotate = true;
        modelViewer.shadowIntensity = 1;
    }
}

function disable3DModel() {
    if (modelViewer) {
        // Disable camera controls and auto-rotate when not on About page
        modelViewer.cameraControls = false;
        modelViewer.autoRotate = false;
        modelViewer.shadowIntensity = 0;
    }
}

/* ========== MODAL FORM ========== */
function initModal() {
    // Open modal triggers
    const openTriggers = [els.openHireModal, els.openHireModalMobile, els.openHireModalContact].filter(Boolean);
    openTriggers.forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
    });
    
    // Close modal
    els.closeHireModal.addEventListener('click', closeModal);
    els.closeSuccess.addEventListener('click', () => {
        closeModal();
        resetForm();
    });
    
    // Close on outside click
    els.hireModal.addEventListener('click', (e) => {
        if (e.target === els.hireModal) {
            closeModal();
            resetForm();
        }
    });
    
    // Form submit
    els.hireForm.addEventListener('submit', handleFormSubmit);
}

function openModal() {
    els.hireModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetForm();
}

function closeModal() {
    els.hireModal.classList.remove('active');
    document.body.style.overflow = '';
}

function resetForm() {
    els.hireForm.reset();
    els.hireForm.style.display = 'flex';
    els.formSuccess.classList.remove('active');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        brandName: document.getElementById('brandName').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        budget: document.getElementById('budget').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Send via email (mailto)
    const subject = `New Inquiry from ${formData.brandName}`;
    const body = `Name: ${formData.name}
Email: ${formData.email}
Service: ${formData.service}
Budget: ${formData.budget}
Message: ${formData.message}`;
    
    // Open mail client
    window.location.href = `mailto:contact.wyrmstudio@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Show success message
    els.hireForm.style.display = 'none';
    els.formSuccess.classList.add('active');
    
    console.log('Form submitted:', formData);
}
