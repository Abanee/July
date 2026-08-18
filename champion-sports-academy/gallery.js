/* ================================================================
   GALLERY.JS — Champion Sports Academy · Gallery Interactivity
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. THEME TOGGLE
     ------------------------------------------------------------------ */
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
    const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    themeToggle       && themeToggle.setAttribute('aria-label', label);
    themeToggleMobile && themeToggleMobile.setAttribute('aria-label', label);
  }

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('csa-theme', t);
    reflectThemeIcons(t);
  }

  reflectThemeIcons(root.getAttribute('data-theme') || 'dark');
  themeToggle       && themeToggle.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  themeToggleMobile && themeToggleMobile.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  /* ------------------------------------------------------------------
     2. RTL TOGGLE
     ------------------------------------------------------------------ */
  const rtlToggle       = document.getElementById('rtl-toggle');
  const rtlToggleMobile = document.getElementById('rtl-toggle-mobile');

  function reflectRTL(isRTL) {
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    if (rtlToggle)       rtlToggle.setAttribute('aria-pressed', String(isRTL));
    if (rtlToggleMobile) rtlToggleMobile.setAttribute('aria-pressed', String(isRTL));
  }

  function toggleRTL() {
    const isRTL = root.getAttribute('dir') !== 'rtl';
    reflectRTL(isRTL);
    localStorage.setItem('csa-rtl', String(isRTL));
  }

  reflectRTL(localStorage.getItem('csa-rtl') === 'true');
  rtlToggle       && rtlToggle.addEventListener('click', toggleRTL);
  rtlToggleMobile && rtlToggleMobile.addEventListener('click', toggleRTL);

  /* ------------------------------------------------------------------
     3. HEADER SCROLL SHADOW
     ------------------------------------------------------------------ */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     4. MOBILE NAVIGATION (HAMBURGER)
     ------------------------------------------------------------------ */
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen  = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  function closeNav() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open', 'flex');
    mobileMenu.classList.add('hidden');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (menuIconOpen)  menuIconOpen.classList.remove('hidden');
    if (menuIconClose) menuIconClose.classList.add('hidden');
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileMenu.classList.toggle('hidden', !isOpen);
      mobileMenu.classList.toggle('flex', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      if (menuIconOpen)  menuIconOpen.classList.toggle('hidden', isOpen);
      if (menuIconClose) menuIconClose.classList.toggle('hidden', !isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  /* ------------------------------------------------------------------
     5. GALLERY FILTERING
     ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.gal-filter-btn');
  const galleryCards = document.querySelectorAll('.gal-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach((card, index) => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        const matches = filterValue === 'all' || categories.includes(filterValue);

        if (matches) {
          card.classList.remove('hidden');
          card.style.display = 'flex';
          card.style.animationDelay = `${(index % 8) * 40}ms`;
          card.classList.add('gal-fade-in');
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });

  /* ------------------------------------------------------------------
     6. VIEW MORE BUTTON (CENTERED)
     ------------------------------------------------------------------ */
  const viewMoreBtn = document.getElementById('gal-view-more-btn');
  const extraCards  = document.querySelectorAll('.gal-card-extra');
  const viewMoreText = document.getElementById('view-more-text');

  if (viewMoreBtn && extraCards.length > 0) {
    let isExpanded = false;

    viewMoreBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;

      extraCards.forEach((card, i) => {
        if (isExpanded) {
          card.classList.remove('hidden');
          card.style.display = 'flex';
          card.style.animationDelay = `${i * 50}ms`;
          card.classList.add('gal-fade-in');
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });

      if (isExpanded) {
        if (viewMoreText) viewMoreText.textContent = 'Show Less Moments';
        viewMoreBtn.classList.add('expanded');
      } else {
        if (viewMoreText) viewMoreText.textContent = 'View More Moments (8 More)';
        viewMoreBtn.classList.remove('expanded');
        // Scroll back to gallery top smoothly
        const galSection = document.getElementById('gallery-grid-section');
        if (galSection) galSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ------------------------------------------------------------------
     7. FULLSCREEN LIGHTBOX MODAL
     ------------------------------------------------------------------ */
  const modalBackdrop = document.getElementById('gal-modal');
  const modalImg      = document.getElementById('gal-modal-img');
  const modalTitle    = document.getElementById('gal-modal-title');
  const modalCategory = document.getElementById('gal-modal-category');
  const modalDate     = document.getElementById('gal-modal-date');
  const modalClose    = document.getElementById('gal-modal-close');
  const modalPrev     = document.getElementById('gal-modal-prev');
  const modalNext     = document.getElementById('gal-modal-next');

  let currentCardIndex = 0;
  const visibleCards = () => Array.from(document.querySelectorAll('.gal-card:not(.hidden)'));

  function openModal(card) {
    const cards = visibleCards();
    currentCardIndex = cards.indexOf(card);
    updateModalContent(card);
    if (modalBackdrop) modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function updateModalContent(card) {
    if (!card) return;
    const imgEl = card.querySelector('.gal-img');
    const titleEl = card.querySelector('.gal-card-title');
    const badgeEl = card.querySelector('.gal-badge');
    const dateEl = card.querySelector('.gal-card-date');

    if (modalImg && imgEl) {
      modalImg.src = imgEl.src;
      modalImg.alt = imgEl.alt || 'Gallery sports moment';
    }
    if (modalTitle && titleEl) modalTitle.textContent = titleEl.textContent;
    if (modalCategory && badgeEl) {
      modalCategory.textContent = badgeEl.textContent;
      modalCategory.className = 'text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ' + (badgeEl.className || '');
    }
    if (modalDate && dateEl) modalDate.textContent = dateEl.textContent;
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateModal(direction) {
    const cards = visibleCards();
    if (cards.length === 0) return;
    currentCardIndex = (currentCardIndex + direction + cards.length) % cards.length;
    updateModalContent(cards[currentCardIndex]);
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalPrev)  modalPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateModal(-1); });
  if (modalNext)  modalNext.addEventListener('click', (e) => { e.stopPropagation(); navigateModal(1); });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!modalBackdrop || !modalBackdrop.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'ArrowLeft') navigateModal(-1);
    else if (e.key === 'ArrowRight') navigateModal(1);
  });
});
