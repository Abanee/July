/* ================================================================
   EVENTS.JS — Champion Sports Academy · Events & Tournaments Page
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. THEME TOGGLE — matches existing site behaviour
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
     1b. RTL TOGGLE
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
     2. HEADER SCROLL SHADOW
     ------------------------------------------------------------------ */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     3. MOBILE NAVIGATION
     ------------------------------------------------------------------ */
  const menuBtn   = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen  = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  function closeNav() {
    mobileMenu.classList.remove('open', 'flex');
    mobileMenu.classList.add('hidden');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    menuIconOpen  && menuIconOpen.classList.remove('hidden');
    menuIconClose && menuIconClose.classList.add('hidden');
  }

  menuBtn && menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileMenu.classList.toggle('hidden', !isOpen);
    mobileMenu.classList.toggle('flex', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuIconOpen  && menuIconOpen.classList.toggle('hidden', isOpen);
    menuIconClose && menuIconClose.classList.toggle('hidden', !isOpen);
  });
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  /* ------------------------------------------------------------------
     4. HERO ENTRANCE ANIMATION
     ------------------------------------------------------------------ */
  const heroItems = document.querySelectorAll('[data-hero-item]');
  if (prefersReducedMotion) {
    heroItems.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  } else {
    heroItems.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, 160 + i * 160);
    });
  }

  /* ------------------------------------------------------------------
     5. SCROLL REVEAL
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ------------------------------------------------------------------
     6. COUNTER ANIMATION
     ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.counter');
  function animateCounter(counter) {
    const target = parseInt(counter.dataset.target, 10);
    if (prefersReducedMotion) { counter.textContent = target + '+'; return; }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target) + '+';
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target + '+';
    };
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && !prefersReducedMotion && counters.length) {
    const counterIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounter(entry.target); counterIo.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIo.observe(c));
  } else {
    counters.forEach(c => animateCounter(c));
  }

  /* ------------------------------------------------------------------
     7. EVENT FILTERS
     ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.ev-filter-btn');
  const eventCards = document.querySelectorAll('#events-grid .ev-card');
  const noResultsMsg = document.getElementById('no-events-msg');

  function filterEvents(filterValue) {
    let visible = 0;
    eventCards.forEach((card, idx) => {
      const sport = card.dataset.sport || '';
      const type  = card.dataset.type  || '';
      const combined = (sport + ' ' + type).toLowerCase();
      const match = filterValue === 'all' || combined.includes(filterValue.toLowerCase());
      card.classList.toggle('hidden', !match);
      if (match) {
        visible++;
        // stagger re-entry
        if (!prefersReducedMotion) {
          card.style.transitionDelay = (visible - 1) * 60 + 'ms';
          setTimeout(() => { card.style.transitionDelay = ''; }, 800);
        }
      }
    });
    noResultsMsg && noResultsMsg.classList.toggle('hidden', visible > 0);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      filterEvents(btn.dataset.filter);
    });
  });

  // View All button resets filters
  const viewAllBtn = document.getElementById('view-all-events-btn');
  viewAllBtn && viewAllBtn.addEventListener('click', () => {
    const allBtn = document.querySelector('[data-filter="all"]');
    allBtn && allBtn.click();
    document.getElementById('upcoming-events').scrollIntoView({ behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     8. EVENTS CALENDAR
     ------------------------------------------------------------------ */
  // Map of event dates: "YYYY-M-D" => event info
  const calEvents = {
    '2026-5-24': { name: 'Football Trial Camp',          sport: 'Football',   time: '9:00 AM – 12:00 PM', status: 'Registration Open', type: 'trial' },
    '2026-6-7':  { name: 'Inter-Academy Basketball Cup', sport: 'Basketball', time: '8:30 AM – 6:00 PM',  status: 'Registration Open', type: 'tournament' },
    '2026-6-21': { name: 'Badminton Skill Challenge',    sport: 'Badminton',  time: '10:00 AM – 1:00 PM', status: 'Upcoming',           type: 'tournament' },
    '2026-7-12': { name: 'Athletics Championship',       sport: 'Athletics',  time: '6:00 AM – 11:00 AM', status: 'Upcoming',           type: 'tournament' },
  };

  let calYear  = 2026;
  let calMonth = 4; // 0-indexed: April = 3, May = 4
  let selectedKey = null;

  const calGrid       = document.getElementById('cal-grid');
  const calMonthLabel = document.getElementById('cal-month-label');
  const calEventDetail = document.getElementById('cal-event-detail');
  const calPrev       = document.getElementById('cal-prev');
  const calNext       = document.getElementById('cal-next');

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function getDateKey(y, m1, d) {
    // m1 = 1-indexed month
    return `${y}-${m1}-${d}`;
  }

  function renderCalendar() {
    if (!calGrid) return;
    calMonthLabel.textContent = MONTH_NAMES[calMonth] + ' ' + calYear;

    const firstDay = new Date(calYear, calMonth, 1);
    const lastDay  = new Date(calYear, calMonth + 1, 0);
    const today    = new Date();

    // Monday-indexed start offset (0=Mon … 6=Sun)
    let startOffset = firstDay.getDay(); // 0=Sun
    startOffset = (startOffset === 0) ? 6 : startOffset - 1;

    calGrid.innerHTML = '';

    // Prev month tail
    const prevMonthLast = new Date(calYear, calMonth, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = prevMonthLast - i;
      const cell = createCell(d, true, false, false, null, null);
      calGrid.appendChild(cell);
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const key = getDateKey(calYear, calMonth + 1, d);
      const ev  = calEvents[key] || null;
      const isToday = (calYear === today.getFullYear() && calMonth === today.getMonth() && d === today.getDate());
      const isSelected = key === selectedKey;
      const cell = createCell(d, false, isToday, isSelected, ev, key);
      calGrid.appendChild(cell);
    }

    // Next month head — fill to complete 6 rows (42 cells max)
    const totalCells = startOffset + lastDay.getDate();
    const remainder  = totalCells % 7;
    const nextDays   = remainder === 0 ? 0 : 7 - remainder;
    for (let d = 1; d <= nextDays; d++) {
      const cell = createCell(d, true, false, false, null, null);
      calGrid.appendChild(cell);
    }

    // Show detail for selected
    if (selectedKey && calEvents[selectedKey]) {
      showCalEventDetail(calEvents[selectedKey], selectedKey);
    } else {
      calEventDetail && calEventDetail.classList.add('hidden');
    }
  }

  function createCell(day, otherMonth, isToday, isSelected, event, key) {
    const cell = document.createElement('div');
    cell.className = 'ev-cal-cell';
    cell.setAttribute('role', otherMonth ? 'presentation' : 'gridcell');
    if (!otherMonth) cell.setAttribute('aria-label', `${MONTH_NAMES[calMonth]} ${day}${event ? ', event: ' + event.name : ''}`);

    if (otherMonth)   cell.classList.add('other-month');
    if (isToday)      cell.classList.add('today');
    if (isSelected)   cell.classList.add('selected');
    if (event && !otherMonth) cell.classList.add('has-event');

    cell.textContent = day;

    if (event && !otherMonth) {
      const dot = document.createElement('span');
      dot.className = 'ev-cal-dot ' + (event.type === 'trial' ? 'ev-cal-dot-trial' : 'ev-cal-dot-event');
      dot.setAttribute('aria-hidden', 'true');
      cell.appendChild(dot);

      cell.setAttribute('tabindex', '0');
      const handleSelect = () => {
        selectedKey = key;
        renderCalendar();
      };
      cell.addEventListener('click', handleSelect);
      cell.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(); }
      });
    }
    return cell;
  }

  function showCalEventDetail(ev, key) {
    if (!calEventDetail) return;
    calEventDetail.classList.remove('hidden');
    const parts = key.split('-');
    const dateStr = MONTH_NAMES[parseInt(parts[1]) - 1] + ' ' + parts[2];
    const statusClass = ev.status === 'Registration Open' ? 'ev-status-open' : 'ev-status-upcoming';
    calEventDetail.innerHTML = `
      <div class="ev-cal-ev-sport">${ev.sport}</div>
      <div class="ev-cal-ev-name">${ev.name}</div>
      <div class="ev-cal-ev-meta">
        <span>${dateStr}</span> &nbsp;·&nbsp; <span>${ev.time}</span>
      </div>
      <div class="mt-2">
        <span class="ev-status ${statusClass}" style="font-size:11px;padding:3px 9px;">
          <span class="ev-status-dot" style="width:6px;height:6px;"></span>${ev.status}
        </span>
      </div>
    `;
  }

  calPrev && calPrev.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    selectedKey = null;
    renderCalendar();
  });
  calNext && calNext.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    selectedKey = null;
    renderCalendar();
  });

  renderCalendar();

  /* ------------------------------------------------------------------
     9. EVENT DETAILS MODAL
     ------------------------------------------------------------------ */
  const modal        = document.getElementById('event-modal');
  const modalClose   = document.getElementById('modal-close');

  // Event data map
  const eventDataMap = {};
  document.querySelectorAll('#events-grid .ev-card[data-event-id]').forEach(card => {
    eventDataMap[card.dataset.eventId] = {
      name:        card.dataset.eventName,
      sport:       card.dataset.eventSport,
      date:        card.dataset.eventDate,
      time:        card.dataset.eventTime,
      location:    card.dataset.eventLocation,
      age:         card.dataset.eventAge,
      eligibility: card.dataset.eventEligibility,
      deadline:    card.dataset.eventDeadline,
      status:      card.dataset.eventStatus,
      desc:        card.dataset.eventDesc,
      bring:       card.dataset.eventBring,
    };
  });

  function openModal(id) {
    const ev = eventDataMap[id];
    if (!ev || !modal) return;

    // Populate modal fields
    document.getElementById('modal-event-name').textContent  = ev.name;
    document.getElementById('modal-date').textContent        = ev.date;
    document.getElementById('modal-time').textContent        = ev.time;
    document.getElementById('modal-location').textContent    = ev.location;
    document.getElementById('modal-age').textContent         = ev.age;
    document.getElementById('modal-eligibility').textContent = ev.eligibility;
    document.getElementById('modal-deadline').textContent    = ev.deadline;
    document.getElementById('modal-desc').textContent        = ev.desc;

    // Sport badge
    const sportBadge = document.getElementById('modal-sport-badge');
    sportBadge.textContent  = ev.sport;
    sportBadge.className    = 'ev-card-sport-badge ev-badge-' + ev.sport.toLowerCase().replace(/\s+/g,'-');

    // Status badge
    const statusBadge = document.getElementById('modal-status-badge');
    const statusClass = ev.status === 'Registration Open' ? 'ev-status-open' :
                        ev.status === 'Completed'          ? 'ev-status-completed' :
                        ev.status === 'Cancelled'          ? 'ev-status-cancelled' : 'ev-status-upcoming';
    statusBadge.className  = 'ev-status ' + statusClass;
    statusBadge.innerHTML  = `<span class="ev-status-dot"></span>${ev.status}`;
    statusBadge.setAttribute('aria-label', 'Status: ' + ev.status);

    // What to bring list
    const bringList = document.getElementById('modal-bring-list');
    bringList.innerHTML = ev.bring.split(',').map(item =>
      `<li class="ev-modal-bring-item">${item.trim()}</li>`
    ).join('');

    // Register button
    const regBtn = document.getElementById('modal-register-btn');
    if (ev.status === 'Registration Open') {
      regBtn.style.display = '';
      regBtn.textContent = 'Register Now →';
    } else {
      regBtn.style.display = 'none';
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    modal.focus();
  }

  window.closeModal = function() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  modalClose && modalClose.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal();
  });

  // View Details button delegation
  document.getElementById('events-grid') && document.getElementById('events-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.ev-view-details-btn');
    if (btn) openModal(btn.dataset.eventId);
  });

  /* ------------------------------------------------------------------
     10. FAQ ACCORDION
     ------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('[data-faq]');
  faqItems.forEach(item => {
    const btn    = item.querySelector('.ev-faq-q');
    const answer = item.querySelector('.ev-faq-a');
    if (!btn || !answer) return;
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      faqItems.forEach(other => {
        const ob = other.querySelector('.ev-faq-q');
        const oa = other.querySelector('.ev-faq-a');
        if (ob && oa) { ob.setAttribute('aria-expanded', 'false'); oa.classList.remove('open'); }
      });
      // Toggle clicked
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  /* ------------------------------------------------------------------
     11. KEYBOARD: Focus trap inside modal
     ------------------------------------------------------------------ */
  modal && modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

}); // end DOMContentLoaded
