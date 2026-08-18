// ============================================
// CHAMPION SPORTS ACADEMY — HOME 2 SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  /* ---------- Theme Toggle ---------- */
  const themeToggle       = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const iconMoon  = document.getElementById('icon-moon');
  const iconSun   = document.getElementById('icon-sun');
  const iconMoonM = document.querySelector('.icon-moon-m');
  const iconSunM  = document.querySelector('.icon-sun-m');

  function reflectThemeIcons(theme) {
    const isLight = theme === 'light';
    iconMoon  && iconMoon.classList.toggle('hidden', isLight);
    iconSun   && iconSun.classList.toggle('hidden', !isLight);
    iconMoonM && iconMoonM.classList.toggle('hidden', isLight);
    iconSunM  && iconSunM.classList.toggle('hidden', !isLight);
  }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('csa-theme', t);
    reflectThemeIcons(t);
  }
  reflectThemeIcons(root.getAttribute('data-theme') || 'dark');
  themeToggle       && themeToggle.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  themeToggleMobile && themeToggleMobile.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  /* ---------- RTL Toggle ---------- */
  const rtlToggle       = document.getElementById('rtl-toggle');
  const rtlToggleMobile = document.getElementById('rtl-toggle-mobile');
  function toggleRTL() {
    const isRTL = root.getAttribute('dir') !== 'rtl';
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    localStorage.setItem('csa-rtl', String(isRTL));
    if (rtlToggle) rtlToggle.setAttribute('aria-pressed', String(isRTL));
    if (rtlToggleMobile) rtlToggleMobile.setAttribute('aria-pressed', String(isRTL));
  }
  rtlToggle       && rtlToggle.addEventListener('click', toggleRTL);
  rtlToggleMobile && rtlToggleMobile.addEventListener('click', toggleRTL);

  /* ---------- Mobile navigation ---------- */
  const menuToggle = document.getElementById('menuToggle') || document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobileMenu') || document.getElementById('mobile-menu');
  const iconMenu = document.getElementById('iconMenu');
  const iconClose = document.getElementById('iconClose');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      mobileMenu.classList.toggle('hidden', !isOpen);
      mobileMenu.classList.toggle('flex', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      iconMenu && iconMenu.classList.toggle('hidden', isOpen);
      iconClose && iconClose.classList.toggle('hidden', !isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuToggle.setAttribute('aria-expanded', 'false');
        iconMenu && iconMenu.classList.remove('hidden');
        iconClose && iconClose.classList.add('hidden');
      });
    });
  }

  /* ---------- Sports Cards Carousel ---------- */
  const sportTrack = document.getElementById('sportCardsTrack');
  const sportPrev  = document.getElementById('sportPrev');
  const sportNext  = document.getElementById('sportNext');

  if (sportTrack && sportPrev && sportNext) {
    const getCardWidth = () => {
      const card = sportTrack.querySelector('.sport-card');
      if (!card) return 300;
      const trackStyle = window.getComputedStyle(sportTrack);
      const gap = parseFloat(trackStyle.gap) || 16;
      return card.offsetWidth + gap;
    };

    const scrollNext = () => {
      const maxScroll = sportTrack.scrollWidth - sportTrack.clientWidth;
      if (sportTrack.scrollLeft >= maxScroll - 12) {
        sportTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sportTrack.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
      }
    };

    const scrollPrev = () => {
      const maxScroll = sportTrack.scrollWidth - sportTrack.clientWidth;
      if (sportTrack.scrollLeft <= 12) {
        sportTrack.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        sportTrack.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
      }
    };

    sportPrev.addEventListener('click', scrollPrev);
    sportNext.addEventListener('click', scrollNext);

    // Auto-advance every 3.8s with smooth looping (pause on hover / touch)
    let autoRotateTimer = null;
    const startAutoRotate = () => {
      stopAutoRotate();
      autoRotateTimer = setInterval(scrollNext, 3800);
    };
    const stopAutoRotate = () => {
      if (autoRotateTimer) {
        clearInterval(autoRotateTimer);
        autoRotateTimer = null;
      }
    };

    startAutoRotate();

    sportTrack.addEventListener('mouseenter', stopAutoRotate);
    sportTrack.addEventListener('mouseleave', startAutoRotate);
    sportTrack.addEventListener('touchstart', stopAutoRotate, { passive: true });
    sportTrack.addEventListener('touchend', () => {
      setTimeout(startAutoRotate, 3000);
    }, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
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

  /* ---------- Batch schedule data + tab switching ---------- */
  const schedules = {
    football: [
      { day: 'MON', title: 'Football Skills', time: '5:30 PM – 7:00 PM' },
      { day: 'TUE', title: 'Fitness Development', time: '5:30 PM – 6:30 PM' },
      { day: 'WED', title: 'Football Training', time: '5:30 PM – 7:00 PM' },
      { day: 'THU', title: 'Recovery / Personal Practice', time: 'Flexible' },
      { day: 'FRI', title: 'Match Preparation', time: '5:30 PM – 7:00 PM' },
      { day: 'SAT', title: 'Game Session', time: '9:00 AM – 11:00 AM' },
      { day: 'SUN', title: 'Rest Day', time: '—', rest: true },
    ],
    basketball: [
      { day: 'MON', title: 'Ball Handling', time: '5:00 PM – 6:30 PM' },
      { day: 'TUE', title: 'Shooting Drills', time: '5:00 PM – 6:30 PM' },
      { day: 'WED', title: 'Team Offense', time: '5:00 PM – 6:30 PM' },
      { day: 'THU', title: 'Strength & Conditioning', time: '5:00 PM – 6:00 PM' },
      { day: 'FRI', title: 'Defense & Strategy', time: '5:00 PM – 6:30 PM' },
      { day: 'SAT', title: 'Scrimmage Match', time: '9:00 AM – 11:00 AM' },
      { day: 'SUN', title: 'Rest Day', time: '—', rest: true },
    ],
    badminton: [
      { day: 'MON', title: 'Footwork & Movement', time: '4:30 PM – 6:00 PM' },
      { day: 'TUE', title: 'Racket Technique', time: '4:30 PM – 6:00 PM' },
      { day: 'WED', title: 'Rally Practice', time: '4:30 PM – 6:00 PM' },
      { day: 'THU', title: 'Recovery / Personal Practice', time: 'Flexible' },
      { day: 'FRI', title: 'Match Preparation', time: '4:30 PM – 6:00 PM' },
      { day: 'SAT', title: 'Doubles Session', time: '9:00 AM – 10:30 AM' },
      { day: 'SUN', title: 'Rest Day', time: '—', rest: true },
    ],
    athletics: [
      { day: 'MON', title: 'Sprint Technique', time: '6:00 AM – 7:30 AM' },
      { day: 'TUE', title: 'Strength Training', time: '6:00 AM – 7:00 AM' },
      { day: 'WED', title: 'Endurance Run', time: '6:00 AM – 7:30 AM' },
      { day: 'THU', title: 'Recovery / Mobility', time: 'Flexible' },
      { day: 'FRI', title: 'Track Drills', time: '6:00 AM – 7:30 AM' },
      { day: 'SAT', title: 'Time Trials', time: '7:00 AM – 9:00 AM' },
      { day: 'SUN', title: 'Rest Day', time: '—', rest: true },
    ],
  };

  const scheduleTable = document.getElementById('scheduleTable');
  const sportTabs = document.querySelectorAll('.sport-tab');

  function renderSchedule(sport) {
    if (!scheduleTable) return;
    const data = schedules[sport] || schedules.football;
    scheduleTable.innerHTML = data.map(d => `
      <div class="sched-col ${d.rest ? 'is-rest' : ''}">
        <p class="sched-day">${d.day}</p>
        <p class="sched-title">${d.title}</p>
        ${!d.rest ? `<p class="sched-time">${d.time}</p>` : ''}
      </div>
    `).join('');
  }

  sportTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sportTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      renderSchedule(tab.dataset.sport);
    });
  });

  renderSchedule('football');

  /* ---------- Scroll reveal ---------- */
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
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- Level path hover-as-active on desktop ---------- */
  const levelBlocks = document.querySelectorAll('.level-block');
  levelBlocks.forEach(block => {
    block.addEventListener('mouseenter', () => {
      levelBlocks.forEach(b => b.classList.remove('is-active'));
      block.classList.add('is-active');
    });
  });

});
