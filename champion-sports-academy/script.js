document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ---------- Header scroll shadow ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu toggle ---------- */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  menuBtn && menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileMenu.classList.toggle('hidden', !isOpen);
    mobileMenu.classList.toggle('flex', isOpen);
  });
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open', 'flex');
      mobileMenu.classList.add('hidden');
    });
  });

  /* ---------- Hero entrance animation ---------- */
  const heroItems = document.querySelectorAll('[data-hero-item]');
  if (prefersReducedMotion) {
    heroItems.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  } else {
    heroItems.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, 150 + i * 140);
    });
  }

  /* ---------- Counters (animate once each, on scroll into view) ---------- */
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (counter) => {
    const target = parseInt(counter.dataset.target, 10);
    if (prefersReducedMotion) {
      counter.textContent = target + '+';
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      counter.textContent = value + '+';
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target + '+';
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && !prefersReducedMotion && counters.length) {
    const counterIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIo.observe(c));
  } else {
    counters.forEach(c => animateCounter(c));
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Journey connector line draw ---------- */
  const journeyLines = document.querySelectorAll('.journey-line');
  if ('IntersectionObserver' in window && !prefersReducedMotion && journeyLines.length) {
    const lineIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          journeyLines.forEach((line, i) => {
            setTimeout(() => line.classList.add('drawn'), i * 250);
          });
          lineIo.disconnect();
        }
      });
    }, { threshold: 0.4 });
    lineIo.observe(journeyLines[0].closest('div').parentElement);
  } else {
    journeyLines.forEach(line => line.classList.add('drawn'));
  }

  /* =====================================================
     ABOUT PAGE — Our Journey circular photographic timeline
     ===================================================== */
  const aboutTrack = document.querySelector('.about-timeline-track');
  if (aboutTrack) {
    const milestones = aboutTrack.querySelectorAll('.timeline-milestone');
    const revealTimeline = () => {
      aboutTrack.classList.add('drawn');
      milestones.forEach((m, i) => {
        setTimeout(() => m.classList.add('in-view'), i * 180);
      });
    };
    if (prefersReducedMotion) {
      revealTimeline();
    } else if ('IntersectionObserver' in window) {
      const timelineIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealTimeline();
            timelineIo.disconnect();
          }
        });
      }, { threshold: 0.3 });
      timelineIo.observe(aboutTrack);
    } else {
      revealTimeline();
    }
  }

  /* =====================================================
     ABOUT PAGE — Life at the Academy collage stagger reveal
     ===================================================== */
  const collageTiles = document.querySelectorAll('.collage-tile');
  if (collageTiles.length) {
    if (prefersReducedMotion) {
      collageTiles.forEach(t => t.classList.add('in-view'));
    } else if ('IntersectionObserver' in window) {
      const collageIo = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('in-view'), i * 120);
            collageIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      collageTiles.forEach(t => collageIo.observe(t));
    } else {
      collageTiles.forEach(t => t.classList.add('in-view'));
    }
  }
});
