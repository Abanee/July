(function () {
  'use strict';

  /* ============================================================
     THEME & RTL
     ============================================================ */
  const root = document.documentElement;
  const themeToggles = document.querySelectorAll('#theme-toggle, #sidebar-theme-toggle, #header-theme-toggle');
  const rtlToggles   = document.querySelectorAll('#rtl-toggle, #sidebar-rtl-toggle, #header-rtl-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const moonIcons = document.querySelectorAll('#icon-moon, .icon-moon');
    const sunIcons = document.querySelectorAll('#icon-sun, .icon-sun');
    if (theme === 'light') {
      root.classList.add('light');
      moonIcons.forEach(el => el.classList.add('hidden'));
      sunIcons.forEach(el => el.classList.remove('hidden'));
    } else {
      root.classList.remove('light');
      moonIcons.forEach(el => el.classList.remove('hidden'));
      sunIcons.forEach(el => el.classList.add('hidden'));
    }
    themeToggles.forEach(btn => {
      btn.setAttribute('aria-pressed', theme === 'light');
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
  }

  function applyRTL(isRTL) {
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    rtlToggles.forEach(btn => {
      btn.setAttribute('aria-pressed', String(isRTL));
    });
  }

  const savedTheme = localStorage.getItem('csa-theme') || localStorage.getItem('csa-dashboard-theme');
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');

  const savedRTL = localStorage.getItem('csa-rtl') === 'true';
  applyRTL(savedRTL);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', function () {
      const isLight = root.getAttribute('data-theme') === 'light' || root.classList.contains('light');
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('csa-theme', next);
      localStorage.setItem('csa-dashboard-theme', next);
    });
  });

  rtlToggles.forEach(btn => {
    btn.addEventListener('click', function () {
      const isRTL = root.getAttribute('dir') !== 'rtl';
      applyRTL(isRTL);
      localStorage.setItem('csa-rtl', String(isRTL));
    });
  });

  /* ============================================================
     PAGE NAVIGATION (sidebar switches main content, no reload)
     ============================================================ */
  const pageTitles = {
    overview: { title: 'Overview', subtitle: "Good morning, Alex! Here's your training overview for this week." },
    profile: { title: 'Profile', subtitle: 'Your student information and academy details.' },
    activities: { title: 'Activities', subtitle: 'Your recent activity history and coach feedback.' },
    plan: { title: 'My Plan', subtitle: 'Your current training plan and batch schedule.' },
    attendance: { title: 'Attendance', subtitle: 'Your monthly attendance and skill progress.' },
    events: { title: 'Events', subtitle: 'Upcoming tournaments, trials and opportunities.' },
    settings: { title: 'Settings', subtitle: 'Manage your account preferences.' }
  };

  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const pageSections = document.querySelectorAll('[data-page-content]');
  const pageTitleEl = document.getElementById('page-title');
  const pageSubtitleEl = document.getElementById('page-subtitle');
  const mainContent = document.getElementById('main-content');

  function goToPage(page) {
    if (!pageTitles[page]) page = 'overview';

    pageSections.forEach(function (section) {
      const match = section.getAttribute('data-page-content') === page;
      if (match) {
        section.removeAttribute('hidden');
        section.style.display = 'block';
      } else {
        section.setAttribute('hidden', 'true');
        section.style.display = 'none';
      }
    });

    navItems.forEach(function (item) {
      const isActive = item.getAttribute('data-page') === page;
      item.classList.toggle('active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    if (pageTitleEl && pageTitles[page]) pageTitleEl.textContent = pageTitles[page].title;
    if (pageSubtitleEl && pageTitles[page]) pageSubtitleEl.textContent = pageTitles[page].subtitle;

    if (mainContent && typeof mainContent.scrollTo === 'function') {
      mainContent.scrollTo({ top: 0, behavior: 'auto' });
    }
    window.scrollTo({ top: 0, behavior: 'auto' });

    closeSidebar();
  }

  // Delegated click handler for any data-nav-link
  document.addEventListener('click', function (e) {
    const link = e.target.closest('[data-nav-link]');
    if (link) {
      const page = link.getAttribute('data-page');
      if (page) {
        e.preventDefault();
        goToPage(page);
      }
    }
  });

  /* ============================================================
     MOBILE SIDEBAR DRAWER
     ============================================================ */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const menuBtn = document.getElementById('menu-btn');
  const sidebarClose = document.getElementById('sidebar-close');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* ============================================================
     NOTIFICATIONS DROPDOWN
     ============================================================ */
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  const notifCount = document.getElementById('notif-count');

  function closeNotif() {
    if (notifDropdown) notifDropdown.classList.remove('open');
    if (notifBtn) notifBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleNotif() {
    if (!notifDropdown) return;
    const isOpen = notifDropdown.classList.toggle('open');
    if (notifBtn) notifBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen && notifCount) {
      notifCount.style.display = 'none';
    }
  }

  if (notifBtn) {
    notifBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleNotif();
    });
  }

  document.addEventListener('click', function (e) {
    if (notifDropdown && !notifDropdown.contains(e.target) && e.target !== notifBtn) {
      closeNotif();
    }
  });

  /* ============================================================
     LOGOUT MODAL
     ============================================================ */
  const logoutBtn = document.getElementById('logout-btn');
  const logoutModal = document.getElementById('logout-modal');
  const logoutCancel = document.getElementById('logout-cancel');
  const logoutConfirm = document.getElementById('logout-confirm');

  function openLogoutModal() {
    if (logoutModal) logoutModal.classList.add('open');
    closeSidebar();
    if (logoutCancel) logoutCancel.focus();
  }

  function closeLogoutModal() {
    if (logoutModal) logoutModal.classList.remove('open');
    if (logoutBtn) logoutBtn.focus();
  }

  if (logoutBtn) logoutBtn.addEventListener('click', openLogoutModal);
  if (logoutCancel) logoutCancel.addEventListener('click', closeLogoutModal);
  if (logoutModal) {
    logoutModal.addEventListener('click', function (e) {
      if (e.target === logoutModal) closeLogoutModal();
    });
  }
  if (logoutConfirm) {
    logoutConfirm.addEventListener('click', function () {
      closeLogoutModal();
      window.location.href = 'index.html';
    });
  }

  /* ============================================================
     ESCAPE KEY — closes drawer / notif / modal
     ============================================================ */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (logoutModal && logoutModal.classList.contains('open')) {
      closeLogoutModal();
      return;
    }
    if (notifDropdown && notifDropdown.classList.contains('open')) {
      closeNotif();
      return;
    }
    if (sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  /* ============================================================
     PROGRESS BAR / RING ANIMATE-ON-LOAD
     ============================================================ */
  function animateProgress() {
    document.querySelectorAll('.progress-fill, .stat-bar span').forEach(function (el) {
      const target = el.style.width;
      el.style.width = '0%';
      requestAnimationFrame(function () {
        setTimeout(function () {
          el.style.width = target;
        }, 60);
      });
    });
  }
  animateProgress();

  /* ============================================================
     INITIAL PAGE (supports #hash deep-link, defaults to overview)
     ============================================================ */
  const initialHash = window.location.hash.replace('#', '');
  goToPage(pageTitles[initialHash] ? initialHash : 'overview');

})();
