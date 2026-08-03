/* ==========================================================================
   CellMate — script.js
   Theme toggle, nav behaviour, scroll reveals, counters,
   phone crack-to-fixed wipe, testimonial slider, forms
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Theme toggle (light / dark)
  --------------------------------------------------------------------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle') || document.getElementById('themeBtn') || document.querySelector('.cm-theme-btn');
  var STORAGE_KEY = 'cellmate-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var allThemeBtns = document.querySelectorAll('#themeToggle, #themeBtn, .cm-theme-btn');
    allThemeBtns.forEach(function(btn) {
      btn.setAttribute('aria-pressed', theme === 'dark');
    });
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage blocked */ }
    if (saved) {
      applyTheme(saved);
    } else {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  document.querySelectorAll('#themeToggle, #themeBtn, .cm-theme-btn').forEach(function(btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage blocked */ }
    });
  });

  initTheme();

  /* ---------------------------------------------------------------------
     Password Eye Show/Hide Toggle
  --------------------------------------------------------------------- */
  var passwordToggles = document.querySelectorAll('.cm-password-toggle');
  passwordToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var targetId = toggle.getAttribute('data-target');
      var input = targetId ? document.getElementById(targetId) : toggle.previousElementSibling;
      if (!input) return;

      var icon = toggle.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
          icon.classList.remove('bi-eye');
          icon.classList.add('bi-eye-slash');
        }
      } else {
        input.type = 'password';
        if (icon) {
          icon.classList.remove('bi-eye-slash');
          icon.classList.add('bi-eye');
        }
      }
    });
  });


  /* ---------------------------------------------------------------------
     RTL Mode Toggle (LTR / RTL)
  --------------------------------------------------------------------- */
  var rtlToggle = document.getElementById('rtlToggle');
  var RTL_STORAGE_KEY = 'cellmate-rtl';

  function applyRTL(isRTL) {
    if (isRTL) {
      root.setAttribute('dir', 'rtl');
      if (rtlToggle) rtlToggle.classList.add('is-rtl');
    } else {
      root.removeAttribute('dir');
      if (rtlToggle) rtlToggle.classList.remove('is-rtl');
    }
  }

  function initRTL() {
    var savedRTL = null;
    try { savedRTL = localStorage.getItem(RTL_STORAGE_KEY); } catch (e) {}
    applyRTL(savedRTL === 'true');
  }

  if (rtlToggle) {
    rtlToggle.addEventListener('click', function () {
      var isCurrentRTL = root.getAttribute('dir') === 'rtl';
      var nextRTL = !isCurrentRTL;
      applyRTL(nextRTL);
      try { localStorage.setItem(RTL_STORAGE_KEY, nextRTL); } catch (e) {}
    });
  }

  initRTL();


  /* ---------------------------------------------------------------------
     Navbar: solid on scroll + active link highlight
  --------------------------------------------------------------------- */
  var nav = document.getElementById('cmNav');
  var sections = document.querySelectorAll('main section[id], main .cm-hero');
  var navLinks = document.querySelectorAll('.cm-menu__link');

  function onScroll() {
    if (window.scrollY > 24) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    var toTop = document.getElementById('toTop');
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      navLinks.forEach(function (link) {
        var isActive = link.getAttribute('href') === '#' + id || (id === 'top' && link.getAttribute('href') === '#top');
        link.classList.toggle('active', isActive);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  document.querySelectorAll('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
  var topAnchor = document.getElementById('top');
  if (topAnchor) sectionObserver.observe(topAnchor);

  /* ---------------------------------------------------------------------
     Mobile menu
  --------------------------------------------------------------------- */
  var burger = document.getElementById('cmBurger');
  var menu = document.getElementById('cmMenu');

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen);
      burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal (fade + rise)
  --------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll('[data-reveal]');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(function (el) { revealObserver.observe(el); });

  /* ---------------------------------------------------------------------
     Phone hero: crack -> fixed wipe, triggered once in view
  --------------------------------------------------------------------- */
  var phone = document.getElementById('cmPhone');
  if (phone) {
    var phoneObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () { phone.classList.add('is-fixed'); }, 700);
          phoneObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    phoneObserver.observe(phone);

    // Replay the wipe on click/tap for a bit of delight
    phone.addEventListener('click', function () {
      phone.classList.remove('is-fixed');
      // force reflow so the transition restarts
      void phone.offsetWidth;
      setTimeout(function () { phone.classList.add('is-fixed'); }, 120);
    });
  }

  /* ---------------------------------------------------------------------
     Animated counters (stats + trust numbers)
  --------------------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('en-IN') + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-IN') + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { counterObserver.observe(el); });

  /* ---------------------------------------------------------------------
     Testimonial slider
  --------------------------------------------------------------------- */
  var slider = document.getElementById('testimonialSlider');
  if (slider) {
    var slides = slider.querySelectorAll('.cm-testimonial');
    var dotsWrap = document.getElementById('testimonialDots');
    var current = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () { goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('button');

    function goTo(index) {
      slides[current].classList.remove('cm-testimonial--active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('cm-testimonial--active');
      dots[current].classList.add('is-active');
    }

    function resetTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5500);
    }

    resetTimer();
  }

  /* ---------------------------------------------------------------------
     Booking form (front-end only — no backend wired up)
  --------------------------------------------------------------------- */
  var bookingForm = document.getElementById('bookingForm');
  var formStatus = document.getElementById('formStatus');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }
      var name = document.getElementById('fName').value.trim();
      formStatus.textContent = 'Thanks, ' + name + '. A technician will confirm your slot shortly.';
      bookingForm.reset();
    });
  }

  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input');
      if (input && input.checkValidity()) {
        input.value = '';
        input.placeholder = 'Subscribed ✓';
      }
    });
  }

  /* ---------------------------------------------------------------------
     Back to top
  --------------------------------------------------------------------- */
  var toTopBtn = document.getElementById('toTop');
  if (toTopBtn) {
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------
     Repair Services Page (repairs.html) Interactive Features
  --------------------------------------------------------------------- */
  // Diagnostic Filter Tabs
  var diagBtns = document.querySelectorAll('.rep-diag-btn');
  var diagCards = document.querySelectorAll('.rep-diag-card');

  if (diagBtns.length && diagCards.length) {
    diagBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.getAttribute('data-diag-category');
        
        diagBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        diagCards.forEach(function (card) {
          var cardCat = card.getAttribute('data-diag-cat');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Pre-fill booking form when clicking "Book This Repair" button
  var bookTriggers = document.querySelectorAll('[data-repair-target]');
  var repairSelect = document.getElementById('repSelectType');

  if (bookTriggers.length && repairSelect) {
    bookTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        var targetType = trigger.getAttribute('data-repair-target');
        if (targetType) {
          repairSelect.value = targetType;
        }
      });
    });
  }

  // Repair Booking Form handling
  var repBookingForm = document.getElementById('repBookingForm');
  var repFormStatus = document.getElementById('repFormStatus');

  if (repBookingForm && repFormStatus) {
    repBookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!repBookingForm.checkValidity()) {
        repBookingForm.reportValidity();
        return;
      }
      var name = document.getElementById('repName') ? document.getElementById('repName').value.trim() : 'Customer';
      var ticketId = 'CM-' + Math.floor(100000 + Math.random() * 900000);
      
      repFormStatus.style.color = 'var(--success)';
      repFormStatus.innerHTML = '<i class="bi bi-check-circle-fill"></i> Thank you, <strong>' + name + '</strong>! Your repair booking is confirmed (Ticket: <strong>' + ticketId + '</strong>). Our senior technician will contact you shortly.';
      repBookingForm.reset();
    });
  }

})();

