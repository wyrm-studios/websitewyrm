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
let introAudio = null;
let subtitleTimeouts = [];
let siriInteractionState = 0; // 0: default, 1: annoyed, 2: leave me alone
let siriResetTimer = null;

// Subtitle timing data (in milliseconds)
const subtitles = [
  { time: 2062, text: "Hello there, stranger." },
  { time: 4137, text: "If you're reading this, you've found your way here." },
  { time: 7109, text: "Maybe it was luck. Maybe curiosity." },
  { time: 11005, text: "Or maybe you're here because you actually need something built." },
  { time: 13979, text: "However you arrived, stay a while." },
  { time: 17089, text: "Look around. I hope you enjoy what you find." },
  { time: 20901, text: "I'm Wyrm. This is wyrm.studio." },
  { time: 23685, text: "I make brands people remember." },
  { time: 26655, text: "Not just visuals. Not just videos." },
  { time: 29190, text: "I build complete identity systems:" },
  { time: 34127, text: "Brand Strategy • Brand Identity • Brand Films • Motion Design" },
  { time: 37810, text: "Take your time. The good stuff is right here." }
];

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
  init3DModel();
  initAudioIntro();
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
    closeSuccess: document.getElementById('closeSuccess'),
    playIntroBtn: document.getElementById('playIntroBtn'),
    subtitleContainer: document.getElementById('subtitleContainer')
  };
}

function initAudioIntro() {
  introAudio = document.getElementById('introAudio');
  if (els.playIntroBtn && introAudio) {
    els.playIntroBtn.addEventListener('click', toggleAudioIntro);
  }
}

function toggleAudioIntro() {
  if (!introAudio || !els.playIntroBtn || !els.subtitleContainer) return;

  if (introAudio.paused) {
    introAudio.play();
    els.playIntroBtn.classList.add('playing');
    els.playIntroBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
      <span>Playing Introduction...</span>
    `;
    els.subtitleContainer.classList.add('show');

    subtitleTimeouts.forEach(timeout => clearTimeout(timeout));
    subtitleTimeouts = [];

    subtitles.forEach(subtitle => {
      const timeout = setTimeout(() => {
        els.subtitleContainer.innerHTML = `<div class="subtitle-text">${subtitle.text}</div>`;
      }, subtitle.time);
      subtitleTimeouts.push(timeout);
    });

    const endTimeout = setTimeout(() => {
      resetIntroUI();
    }, 55000);
    subtitleTimeouts.push(endTimeout);

  } else {
    introAudio.pause();
    resetIntroUI();
  }
}

function resetIntroUI() {
  if (!els.playIntroBtn || !els.subtitleContainer) return;
  els.subtitleContainer.classList.remove('show');
  els.subtitleContainer.innerHTML = '';
  els.playIntroBtn.classList.remove('playing');
  els.playIntroBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
    <span>Listen to Introduction</span>
  `;
  subtitleTimeouts.forEach(timeout => clearTimeout(timeout));
  subtitleTimeouts = [];
}

function initNav() {
  els.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      if (pageId) switchPage(pageId);
    });
  });

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
  const currentPage = document.querySelector('.page.active');
  const targetPage = document.getElementById(pageId);
  if (!targetPage || currentPage?.id === pageId) return;

  if (currentPage) {
    currentPage.style.opacity = '0';
    currentPage.style.transform = 'translateY(-20px)';
  }

  setTimeout(() => {
    if (currentPage) {
      currentPage.classList.remove('active');
      currentPage.style.transform = 'translateY(20px)';
    }
    
    targetPage.classList.add('active');
    void targetPage.offsetWidth;
    targetPage.style.opacity = '1';
    targetPage.style.transform = 'translateY(0)';
    
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

function initTheme() {
  if (!els.themeToggle) return;
  els.themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('wyrm-theme', state.theme);
    updateLogo(state.theme);
  });
}

function loadTheme() {
  const saved = localStorage.getItem('wyrm-theme');
  if (saved) {
    state.theme = saved;
    document.documentElement.setAttribute('data-theme', saved);
    updateLogo(saved);
  } else {
    updateLogo('dark');
  }
}

function updateLogo(theme) {
  const logos = document.querySelectorAll('.logo-img');
  const whiteLogo = 'https://raw.githubusercontent.com/wyrm-studios/websitewyrm/main/public/assets/white%20logo%20png.png';
  const blackLogo = 'https://raw.githubusercontent.com/wyrm-studios/websitewyrm/main/public/assets/black%20logo%20png.png';
  logos.forEach(logo => {
    logo.style.opacity = '0';
    setTimeout(() => {
      logo.src = theme === 'light' ? blackLogo : whiteLogo;
      logo.onload = () => { logo.style.opacity = '1'; };
    }, 150);
  });
}

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

// ✅ SIRI WITH SOUND EFFECTS
function initSiri() {
  if (!els.siriImg || !els.siriMascot) return;
  
  const frameUrls = [];
  for (let i = 1; i <= 80; i++) {
    const num = 10000 + i;
    const url = `public/assets/siri/Untitled-${num}.png`;
    frameUrls.push(url);
  }

  frameUrls.forEach(url => { 
    const img = new Image(); 
    img.src = url;
  });

  state.siriTimer = setInterval(() => {
    state.siriFrame = (state.siriFrame + 1) % frameUrls.length;
    els.siriImg.src = frameUrls[state.siriFrame];
  }, 100);

  setInterval(() => showSiriMessage(), 10000);

  // Click handler with sound effects and messages
  els.siriMascot.addEventListener('click', () => {
    if (siriInteractionState === 0) {
      // First click: "Huh?"
      playHuhSound();
      showSpecificMessage("what you want more from me");
      siriInteractionState = 1;
    } else if (siriInteractionState === 1) {
      // Second click: "Hahh!"
      playHahhSound();
      showSpecificMessage("leave me alone");
      siriInteractionState = 2;
    } else {
      // If they keep clicking, keep saying "leave me alone"
      playHahhSound();
      showSpecificMessage("leave me alone");
    }

    // Reset state after 5 seconds of inactivity
    clearTimeout(siriResetTimer);
    siriResetTimer = setTimeout(() => {
      siriInteractionState = 0;
    }, 5000);
  });
}

function showSpecificMessage(text) {
  if (!els.siriBubble) return;
  els.siriBubble.textContent = text;
  els.siriBubble.classList.add('show');
  setTimeout(() => els.siriBubble.classList.remove('show'), 5000);
}

function showSiriMessage() {
  if (!els.siriBubble || siriInteractionState !== 0) return;
  const msg = state.messages[Math.floor(Math.random() * state.messages.length)];
  els.siriBubble.textContent = msg;
  els.siriBubble.classList.add('show');
  setTimeout(() => els.siriBubble.classList.remove('show'), 5000);
}

function playHuhSound() {
  const huhAudio = new Audio('public/assets/huh.MP3');
  huhAudio.volume = 0.5;
  huhAudio.play().catch(error => console.log('Audio playback failed:', error));
}

function playHahhSound() {
  const hahhAudio = new Audio('public/assets/hahh.MP3');
  hahhAudio.volume = 0.5;
  hahhAudio.play().catch(error => console.log('Audio playback failed:', error));
}

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

function toggleAccordion(element) {
  const item = element.parentElement;
  const isActive = item.classList.contains('active');
  document.querySelectorAll('.accordion-item').forEach(acc => acc.classList.remove('active'));
  if (!isActive) item.classList.add('active');
}

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

function initModal() {
  const openTriggers = [els.openHireModal, els.openHireModalMobile, els.openHireModalContact].filter(Boolean);
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
}

function openModal() {
  if (els.hireModal) {
    els.hireModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetForm();
  }
}

function closeModal() {
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
  const body = `Name: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\nBudget: ${formData.budget}\nMessage: ${formData.message}`;
  
  window.location.href = `mailto:contact.wyrmstudio@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (els.hireForm && els.formSuccess) {
    els.hireForm.style.display = 'none';
    els.formSuccess.classList.add('active');
  }

  console.log('Form submitted:', formData);
}
