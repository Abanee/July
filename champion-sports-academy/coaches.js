// ============================================================
// CHAMPION SPORTS ACADEMY — COACHES PAGE
// coaches.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const root = document.documentElement;

  // ============================================================
  // THEME SYSTEM
  // ============================================================
  const themeToggle       = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const iconMoon          = document.getElementById('icon-moon');
  const iconSun           = document.getElementById('icon-sun');
  const iconMoonM         = document.querySelector('.icon-moon-m');
  const iconSunM          = document.querySelector('.icon-sun-m');

  function reflectThemeIcons(theme) {
    const isLight = theme === 'light';
    iconMoon  && iconMoon.classList.toggle('hidden', isLight);
    iconSun   && iconSun.classList.toggle('hidden', !isLight);
    iconMoonM && iconMoonM.classList.toggle('hidden', isLight);
    iconSunM  && iconSunM.classList.toggle('hidden', !isLight);
    const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    themeToggle       && themeToggle.setAttribute('aria-label', label);
    themeToggleMobile && themeToggleMobile.setAttribute('aria-label', label);
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('csa-theme', theme);
    reflectThemeIcons(theme);
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  reflectThemeIcons(root.getAttribute('data-theme') || 'dark');
  themeToggle       && themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile && themeToggleMobile.addEventListener('click', toggleTheme);

  // ============================================================
  // RTL SYSTEM
  // ============================================================
  const rtlToggle       = document.getElementById('rtl-toggle');
  const rtlToggleMobile = document.getElementById('rtl-toggle-mobile');

  function reflectRTL(isRTL) {
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    root.setAttribute('lang', root.getAttribute('lang') || 'en');
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

  // ============================================================
  // MOBILE NAVIGATION
  // ============================================================
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu') || document.getElementById('mobile-drawer');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileMenu.classList.toggle('hidden', !isOpen);
      mobileMenu.classList.toggle('flex', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open', 'flex');
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // ============================================================
  // HEADER SCROLL SHADOW
  // ============================================================
  const header = document.getElementById('site-header');
  function updateHeaderShadow() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });

  // ============================================================
  // SPORT FILTER
  // ============================================================
  const filterBtns       = document.querySelectorAll('.filter-btn');
  const allCoachCards    = document.querySelectorAll('.coach-card');
  const headGrid         = document.getElementById('head-coaches-grid');
  const assistGrid       = document.getElementById('assistant-coaches-grid');
  const noResults        = document.getElementById('no-results');

  function applyFilter(filterValue) {
    let visible = 0;
    allCoachCards.forEach(card => {
      const sport = card.dataset.sport;
      const show = filterValue === 'all' || sport === filterValue;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // Hide/show section labels when no cards in that group
    [headGrid, assistGrid].forEach(grid => {
      if (!grid) return;
      const label = grid.previousElementSibling; // .coaches-label
      const visibleInGrid = Array.from(grid.querySelectorAll('.coach-card')).some(c => c.style.display !== 'none');
      grid.style.display = visibleInGrid ? '' : 'none';
      if (label && label.classList.contains('coaches-label')) {
        label.style.display = visibleInGrid ? '' : 'none';
      }
    });

    if (noResults) noResults.classList.toggle('hidden', visible > 0);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      applyFilter(btn.dataset.filter);
    });
  });

  // ============================================================
  // COACH PROFILE MODAL
  // ============================================================
  const modal          = document.getElementById('coach-modal');
  const modalClose     = document.getElementById('modal-close');
  const modalCloseBtn  = document.getElementById('modal-close-btn');
  const modalImg       = document.getElementById('modal-img');
  const modalSportBadge= document.getElementById('modal-sport-badge');
  const modalName      = document.getElementById('modal-name');
  const modalRole      = document.getElementById('modal-role');
  const modalYears     = document.getElementById('modal-years');
  const modalCert      = document.getElementById('modal-cert');
  const modalSpecs     = document.getElementById('modal-specs');
  const modalPhilosophy= document.getElementById('modal-philosophy');
  const modalFocus     = document.getElementById('modal-focus');

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function openModal(card) {
    const data = card.dataset;
    if (!modal) return;

    modalImg.src        = data.image || '';
    modalImg.alt        = `${data.name}, ${data.role}`;
    modalSportBadge.textContent = capitalize(data.sport || '');
    modalName.textContent       = data.name || '';
    modalRole.textContent       = data.role || '';
    modalYears.textContent      = data.years || '';
    modalCert.textContent       = data.cert || '';
    modalPhilosophy.textContent = data.philosophy || '';

    // Specialization tags
    modalSpecs.innerHTML = (data.specs || '').split(',').map(s =>
      `<span class="modal-spec-tag">${s.trim()}</span>`
    ).join('');

    // Focus areas
    modalFocus.innerHTML = (data.focus || '').split(',').map(f =>
      `<div class="modal-focus-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        <span>${f.trim()}</span>
      </div>`
    ).join('');

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap — focus close btn
    setTimeout(() => { modalClose && modalClose.focus(); }, 50);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open modal from card click or Enter/Space key
  allCoachCards.forEach(card => {
    // Clicking anywhere on card
    card.addEventListener('click', (e) => {
      openModal(card);
    });
    // Keyboard accessibility — the view-profile button prevents double-trigger
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
    // Separate view-profile buttons
    const btn = card.querySelector('.coach-view-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // card already handled above via bubbling — actually we want it
        openModal(card);
      });
    }
  });

  modalClose    && modalClose.addEventListener('click', closeModal);
  modalCloseBtn && modalCloseBtn.addEventListener('click', closeModal);

  // Close on overlay click
  modal && modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });

  // Close modal and scroll to trial when "Book a Trial" is clicked
  const modalTrialBtn = document.getElementById('modal-trial-btn');
  if (modalTrialBtn) {
    modalTrialBtn.addEventListener('click', () => {
      closeModal();
      setTimeout(() => {
        const trialEl = document.getElementById('trial');
        if (trialEl) trialEl.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    });
  }

  // ============================================================
  // COUNT-UP ANIMATION FOR IMPACT STATS
  // ============================================================
  function animateCountUp(el, target, suffix) {
    const duration  = 1800;
    const frameRate = 60;
    const frames    = (duration / 1000) * frameRate;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      const progress = count / frames;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      el.textContent = current + (suffix || '');
      if (count >= frames) {
        el.textContent = target + (suffix || '');
        clearInterval(timer);
      }
    }, 1000 / frameRate);
  }

  const impactNums  = document.querySelectorAll('.impact-num[data-target]');
  let countersRan   = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersRan) {
        countersRan = true;
        impactNums.forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          animateCountUp(el, target, suffix);
        });
        countObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const impactSection = document.querySelector('.impact-section');
  if (impactSection) countObserver.observe(impactSection);

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ============================================================
  // BACK TO TOP
  // ============================================================
  const backToTop = document.getElementById('backToTop');

  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  }
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  // ============================================================
  // STAGGERED CARD REVEAL
  // ============================================================
  // Apply stagger delay to cards when grid becomes visible
  const coachGrids = document.querySelectorAll('.coaches-grid');

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.coach-card');
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 80);
          });
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    coachGrids.forEach(grid => {
      // Set initial hidden state
      grid.querySelectorAll('.coach-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(18px)';
        card.style.transition = 'opacity .45s ease, transform .45s ease';
      });
      gridObserver.observe(grid);
    });
  }

  // ============================================================
  // FILTER — also re-trigger stagger on filtered results
  // ============================================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Cards that become visible get a quick re-entry animation
      setTimeout(() => {
        document.querySelectorAll('.coach-card').forEach((card, i) => {
          if (card.style.display !== 'none') {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 60);
          }
        });
      }, 10);
    });
  });

}); // end DOMContentLoaded
