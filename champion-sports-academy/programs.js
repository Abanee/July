// ============================================
// CHAMPION SPORTS ACADEMY — SPORTS PROGRAMS SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     THEME SYSTEM
     ============================================ */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const iconMoon = document.getElementById('icon-moon');
  const iconSun = document.getElementById('icon-sun');
  const iconMoonM = document.querySelector('.icon-moon-m');
  const iconSunM = document.querySelector('.icon-sun-m');

  function reflectThemeIcons(theme) {
    const isLight = theme === 'light';
    iconMoon && iconMoon.classList.toggle('hidden', isLight);
    iconSun && iconSun.classList.toggle('hidden', !isLight);
    iconMoonM && iconMoonM.classList.toggle('hidden', isLight);
    iconSunM && iconSunM.classList.toggle('hidden', !isLight);
    const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    themeToggle && themeToggle.setAttribute('aria-label', label);
    themeToggleMobile && themeToggleMobile.setAttribute('aria-label', label);
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('csa-theme', theme);
    reflectThemeIcons(theme);
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  reflectThemeIcons(root.getAttribute('data-theme') || 'dark');
  themeToggle && themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile && themeToggleMobile.addEventListener('click', toggleTheme);

  /* ============================================
     RTL SYSTEM
     ============================================ */
  const rtlToggle       = document.getElementById('rtl-toggle');
  const rtlToggleMobile = document.getElementById('rtl-toggle-mobile');

  function reflectRTL(isRTL) {
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    if (rtlToggle) rtlToggle.setAttribute('aria-pressed', String(isRTL));
    if (rtlToggleMobile) rtlToggleMobile.setAttribute('aria-pressed', String(isRTL));
  }

  function toggleRTL() {
    const isRTL = root.getAttribute('dir') !== 'rtl';
    reflectRTL(isRTL);
    localStorage.setItem('csa-rtl', String(isRTL));
  }

  const savedRTL = localStorage.getItem('csa-rtl') === 'true';
  reflectRTL(savedRTL);
  rtlToggle       && rtlToggle.addEventListener('click', toggleRTL);
  rtlToggleMobile && rtlToggleMobile.addEventListener('click', toggleRTL);

  /* ============================================
     MOBILE NAVIGATION
     ============================================ */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    menuBackdrop.classList.remove('hidden');
    requestAnimationFrame(() => menuBackdrop.classList.add('is-open'));
    menuBtn.setAttribute('aria-expanded', 'true');
    menuIconOpen.classList.add('hidden');
    menuIconClose.classList.remove('hidden');
  }
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    menuBackdrop.classList.remove('is-open');
    setTimeout(() => menuBackdrop.classList.add('hidden'), 200);
    menuBtn.setAttribute('aria-expanded', 'false');
    menuIconOpen.classList.remove('hidden');
    menuIconClose.classList.add('hidden');
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    menuBackdrop.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ============================================
     HEADER SCROLL SHADOW
     ============================================ */
  const header = document.getElementById('site-header');
  function updateHeaderShadow() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });

  /* ============================================
     SPORT DATA
     ============================================ */
  const sportsData = {
    football: {
      name: 'Football',
      description: 'Structured football coaching focused on ball control, passing, movement, decision-making and match awareness.',
      age: '5+ years',
      levels: ['Beginner', 'Developing', 'Advanced', 'Competitive'],
      focus: ['Technical Skills', 'Game Awareness', 'Fitness', 'Match Practice'],
      schedule: [
        { day: 'MON', title: 'Skills Training', time: '5:30 PM – 7:00 PM' },
        { day: 'TUE', title: 'Fitness Development', time: '5:30 PM – 6:30 PM' },
        { day: 'WED', title: 'Technical Training', time: '5:30 PM – 7:00 PM' },
        { day: 'THU', title: 'Recovery / Mobility', time: 'Flexible' },
        { day: 'FRI', title: 'Match Practice', time: '5:30 PM – 7:00 PM' },
        { day: 'SAT', title: 'Game Session', time: '9:00 AM – 11:00 AM' },
        { day: 'SUN', title: 'Rest & Recovery', time: '—', rest: true },
      ],
      scheduleNote: "Schedules vary by age group, level and sport. Here's a sample week for a Developing Football program.",
    },
    basketball: {
      name: 'Basketball',
      description: 'Build basketball fundamentals through ball handling, shooting, passing, movement and game situations.',
      age: '8+ years',
      levels: ['Beginner', 'Developing', 'Advanced', 'Competitive'],
      focus: ['Ball Handling', 'Shooting Technique', 'Team Play', 'Game Practice'],
      schedule: [
        { day: 'MON', title: 'Ball Handling', time: '5:00 PM – 6:30 PM' },
        { day: 'TUE', title: 'Shooting Drills', time: '5:00 PM – 6:30 PM' },
        { day: 'WED', title: 'Team Offense', time: '5:00 PM – 6:30 PM' },
        { day: 'THU', title: 'Strength & Conditioning', time: '5:00 PM – 6:00 PM' },
        { day: 'FRI', title: 'Defense & Strategy', time: '5:00 PM – 6:30 PM' },
        { day: 'SAT', title: 'Scrimmage Match', time: '9:00 AM – 11:00 AM' },
        { day: 'SUN', title: 'Rest & Recovery', time: '—', rest: true },
      ],
      scheduleNote: "Schedules vary by age group, level and sport. Here's a sample week for a Developing Basketball program.",
    },
    badminton: {
      name: 'Badminton',
      description: 'Develop footwork, racket control, shot technique, movement and match confidence through structured practice.',
      age: '7+ years',
      levels: ['Beginner', 'Developing', 'Advanced', 'Competitive'],
      focus: ['Footwork', 'Racket Technique', 'Rally Consistency', 'Match Practice'],
      schedule: [
        { day: 'MON', title: 'Footwork & Movement', time: '4:30 PM – 6:00 PM' },
        { day: 'TUE', title: 'Racket Technique', time: '4:30 PM – 6:00 PM' },
        { day: 'WED', title: 'Rally Practice', time: '4:30 PM – 6:00 PM' },
        { day: 'THU', title: 'Recovery / Mobility', time: 'Flexible' },
        { day: 'FRI', title: 'Match Practice', time: '4:30 PM – 6:00 PM' },
        { day: 'SAT', title: 'Doubles Session', time: '9:00 AM – 10:30 AM' },
        { day: 'SUN', title: 'Rest & Recovery', time: '—', rest: true },
      ],
      scheduleNote: "Schedules vary by age group, level and sport. Here's a sample week for a Developing Badminton program.",
    },
    athletics: {
      name: 'Athletics',
      description: 'Develop speed, endurance, coordination and running technique through age-appropriate athletics training.',
      age: '8+ years',
      levels: ['Foundation', 'Developing', 'Advanced', 'Competitive'],
      focus: ['Sprint Technique', 'Endurance', 'Coordination', 'Track Drills'],
      schedule: [
        { day: 'MON', title: 'Sprint Technique', time: '6:00 AM – 7:30 AM' },
        { day: 'TUE', title: 'Strength Training', time: '6:00 AM – 7:00 AM' },
        { day: 'WED', title: 'Endurance Run', time: '6:00 AM – 7:30 AM' },
        { day: 'THU', title: 'Recovery / Mobility', time: 'Flexible' },
        { day: 'FRI', title: 'Track Drills', time: '6:00 AM – 7:30 AM' },
        { day: 'SAT', title: 'Time Trials', time: '7:00 AM – 9:00 AM' },
        { day: 'SUN', title: 'Rest & Recovery', time: '—', rest: true },
      ],
      scheduleNote: "Schedules vary by age group, level and sport. Here's a sample week for a Developing Athletics program.",
    },
  };

  let currentSport = 'football';
  let currentLevel = 'beginner';

  /* ============================================
     SPORT SELECTOR
     ============================================ */
  const sportTabs = document.querySelectorAll('.sport-tab');
  const sportPanel = document.getElementById('sportPanel');
  const scheduleTable = document.getElementById('scheduleTable');
  const scheduleDesc = document.getElementById('scheduleDesc');
  const levelNote = document.getElementById('levelNote');

  function renderSportPanel(sportKey) {
    const s = sportsData[sportKey];
    if (!s || !sportPanel) return;
    sportPanel.innerHTML = `
      <div class="sp-fade">
        <p class="sp-description">${s.description}</p>
        <div class="sp-meta-row">
          <div>
            <p class="sp-meta-label">Recommended Age</p>
            <p class="sp-meta-value">${s.age}</p>
          </div>
          <div>
            <p class="sp-meta-label">Sport</p>
            <p class="sp-meta-value">${s.name}</p>
          </div>
        </div>
        <p class="sp-meta-label" style="margin-bottom:10px;">Available Levels</p>
        <div class="sp-levels">
          ${s.levels.map(l => `<span class="sp-level-chip">${l}</span>`).join('')}
        </div>
      </div>
      <div class="sp-focus-box sp-fade">
        <p class="sp-focus-title">Training Focus</p>
        <div class="sp-focus-list">
          ${s.focus.map(f => `
            <div class="sp-focus-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const dayIcons = {
    rest: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z" opacity="0"/><path d="M2 20V9a2 2 0 012-2h16a2 2 0 012 2v11M2 20h20M6 12h4v3H6z"/></svg>',
    default: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };

  function renderSchedule(sportKey) {
    const s = sportsData[sportKey];
    if (!s || !scheduleTable) return;
    scheduleTable.innerHTML = s.schedule.map(d => `
      <div class="sched-col ${d.rest ? 'is-rest' : ''}">
        <p class="sched-day-label">${d.day}</p>
        <span class="sched-icon">${d.rest ? dayIcons.rest : dayIcons.default}</span>
        <p class="sched-title">${d.title}</p>
        ${!d.rest ? `<p class="sched-time">${d.time}</p>` : ''}
      </div>
    `).join('');
    if (scheduleDesc) scheduleDesc.textContent = s.scheduleNote;
  }

  function updateLevelNote() {
    if (!levelNote) return;
    const sportName = sportsData[currentSport].name;
    const levelName = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    levelNote.innerHTML = `Showing focus areas for <strong>${levelName} — ${sportName}</strong>.`;
  }

  function selectSport(sportKey) {
    currentSport = sportKey;
    sportTabs.forEach(tab => {
      const isActive = tab.dataset.sport === sportKey;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    renderSportPanel(sportKey);
    renderSchedule(sportKey);
    updateLevelNote();
  }

  sportTabs.forEach(tab => {
    tab.addEventListener('click', () => selectSport(tab.dataset.sport));
  });

  /* ============================================
     PROGRAM LEVELS
     ============================================ */
  const levelCards = document.querySelectorAll('.level-card');
  levelCards.forEach(card => {
    card.addEventListener('click', () => {
      levelCards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
      currentLevel = card.dataset.level;
      updateLevelNote();
    });
  });

  /* ---------- initial render ---------- */
  renderSportPanel(currentSport);
  renderSchedule(currentSport);
  updateLevelNote();

  /* ============================================
     FAQ ACCORDION
     ============================================ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const alreadyOpen = item.classList.contains('is-open');
      faqItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!alreadyOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ============================================
     SCROLL REVEAL
     ============================================ */
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ============================================
     ACTIVE NAV HIGHLIGHT (scrollspy-lite, in-page anchors)
     ============================================ */
  const navLinks = document.querySelectorAll('.header-link[href^="#"], .mobile-link[href^="#"]');
  if (navLinks.length) {
    // Only relevant when linking within the same page; left minimal by design.
  }

  /* ============================================
     BACK TO TOP
     ============================================ */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

});
