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
    console.log('DOM Loaded - Initializing...');
    cacheElements();
    loadTheme();
    initNav();
    initMobileNav();
    initSiri();
    initTheme();
    initFilter();
    initVideoPlayer();
    initModal();
    init3DModel();
    console.log('Initialization complete');
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
        mobilePanel: document.getElementById('mobilePanel'),
        openMobilePanel: document.getElementById('openMobilePanel'),
        closeMobilePanel: document.getElementById('closeMobilePanel'),
        hireModal: document.getElementById('hireModal'),
        openHireModal: document.getElementById('openHireModal'),
        openHireModalMobile: document.getElementById('openHireModalMobile'),
        openHireModalContact: document.getElementById('openHireModalContact'),
        closeHireModal: document.getElementById('closeHireModal'),
        hireForm: document.getElementById('hireForm'),
        formSuccess: document.getElementById('formSuccess'),
        closeSuccess: document.getElementById('closeSuccess')
    };
    
    console.log('Elements cached:', els);
}

/* ========== NAVIGATION ========== */
function initNav() {
    console.log('Initializing navigation...');
    
    // Desktop nav links
    els.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Nav link clicked');
            const pageId = link.getAttribute('data-page');
            if (pageId) switchPage(pageId);
        });
    });
    
    // Mobile nav links
    els.mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Mobile nav link clicked');
            const pageId = link.getAttribute('data-page');
            if (pageId) {
                switchPage(pageId);
                closeMobilePanel();
            }
        });
    });
}

function switchPage(pageId) {
    console.log('Switching to page:', pageId);
    const currentPage = document.querySelector('.page.active');
    const targetPage = document.getElementById(pageId);
    
    if (!targetPage || currentPage?.id === pageId) return;
    
    // Fade out current page
    if (currentPage) {
        currentPage.style.opacity = '0';
        currentPage.style.transform = 'translateY(-20px)';
    }
    
    setTimeout(() => {
        if (currentPage) {
            currentPage.classList.remove('active');
            currentPage.style.transform = 'translateY(20px)';
        }
        
        // Activate new page
        targetPage.classList.add('active');
        void targetPage.offsetWidth;
        targetPage.style.opacity = '1';
        targetPage.style.transform = 'translateY(0)';
        
        if (pageId === 'work') {
            const container = document.querySelector('.portfolio-container');
            if (container) container.scrollTop = 0;
        }
        
        if (pageId !== 'about' && modelViewer) {
            disable3DModel();
        }
        if (pageId === 'about') {
            setTimeout(enable3DModel, 500);
        }
    }, 600);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageId);
    });
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageId);
    });
}

/* ========== MOBILE PANEL ========== */
function initMobileNav() {
    if (!els.openMobilePanel || !els.closeMobilePanel) return;
    
    els.openMobilePanel.addEventListener('click', openMobilePanel);
    els.closeMobilePanel.addEventListener('click', closeMobilePanel);
    
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

/* ========== THEME ========== */
function initTheme() {
    if (!els.themeToggle) return;
    
    els.themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('wyrm-theme', state.theme);
    });
}

function loadTheme() {
    const saved = localStorage.getItem('wyrm-theme');
    if (saved) {
        state.theme = saved;
        document.documentElement.setAttribute('data-theme', saved);
    }
}

/* ========== VIDEO ========== */
function initVideoPlayer() {
    const video = document.getElementById('introVideo');
    const playButton = document.getElementById('playButton');
    
    if (!video || !playButton) return;
    
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

/* ========== SIRI ========== */
function initSiri() {
    console.log('Initializing Siri...');
    if (!els.siriImg || !els.siriMascot) {
        console.log('Siri elements not found');
        return;
    }
    
    const frameUrls = [];
    for (let i = 1; i <= 20; i++) {
        const num = i.toString().padStart(2, '0');
        const url = `public/assets/siri/Untitled-4000100${num}.png`;
        frameUrls.push(url);
    }
    
    // Preload images
    frameUrls.forEach(url => { 
        const img = new Image(); 
        img.src = url;
    });
    
    console.log('Siri frames loaded:', frameUrls.length);
    
    // Animation loop
    state.siriTimer = setInterval(() => {
        state.siriFrame = (state.siriFrame + 1) % frameUrls.length;
        els.siriImg.src = frameUrls[state.siriFrame];
    }, 100);
    
    // Show message every 10 seconds
    setInterval(() => showSiriMessage(), 10000);
    
    // Click to show message
    els.siriMascot.addEventListener('click', () => {
        console.log('Siri clicked');
        showSiriMessage();
    });
    
    console.log('Siri initialized');
}

function showSiriMessage() {
    if (!els.siriBubble) return;
    const msg = state.messages[Math.floor(Math.random() * state.messages.length)];
    els.siriBubble.textContent = msg;
    els.siriBubble.classList.add('show');
    setTimeout(() => els.siriBubble.classList.remove('show'), 5000);
}

/* ========== FILTER ========== */
function initFilter() {
    if (!els.filterBtns || !els.projects) return;
    
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

/* ========== 3D MODEL ========== */
function init3DModel() {
    modelViewer = document.getElementById('aboutModel');
    if (modelViewer) {
        disable3DModel();
    }
}

function enable3DModel() {
    if (modelViewer) {
        modelViewer.cameraControls = true;
        modelViewer.autoRotate = true;
        modelViewer.shadowIntensity = 1;
    }
}

function disable3DModel() {
    if (modelViewer) {
        modelViewer.cameraControls = false;
        modelViewer.autoRotate = false;
        modelViewer.shadowIntensity = 0;
    }
}

/* ========== MODAL ========== */
function initModal() {
    console.log('Initializing modal...');
    
    const openTriggers = [els.openHireModal, els.openHireModalMobile, els.openHireModalContact].filter(Boolean);
    console.log('Modal triggers:', openTriggers.length);
    
    openTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
    
    if (els.closeHireModal) {
        els.closeHireModal.addEventListener('click', closeModal);
    }
    
    if (els.closeSuccess) {
        els.closeSuccess.addEventListener('click', () => {
            closeModal();
            resetForm();
        });
    }
    
    if (els.hireModal) {
        els.hireModal.addEventListener('click', (e) => {
            if (e.target === els.hireModal) {
                closeModal();
                resetForm();
            }
        });
    }
    
    if (els.hireForm) {
        els.hireForm.addEventListener('submit', handleFormSubmit);
    }
    
    console.log('Modal initialized');
}

function openModal() {
    console.log('Opening modal');
    if (els.hireModal) {
        els.hireModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetForm();
    }
}

function closeModal() {
    console.log('Closing modal');
    if (els.hireModal) {
        els.hireModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function resetForm() {
    if (els.hireForm && els.formSuccess) {
        els.hireForm.reset();
        els.hireForm.style.display = 'flex';
        els.formSuccess.classList.remove('active');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        brandName: document.getElementById('brandName').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        budget: document.getElementById('budget').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    const subject = `New Inquiry from ${formData.brandName}`;
    const body = `Name: ${formData.name}
Email: ${formData.email}
Service: ${formData.service}
Budget: ${formData.budget}
Message: ${formData.message}`;
    
    window.location.href = `mailto:contact.wyrmstudio@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    if (els.hireForm && els.formSuccess) {
        els.hireForm.style.display = 'none';
        els.formSuccess.classList.add('active');
    }
    
    console.log('Form submitted:', formData);
}
