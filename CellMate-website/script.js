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
  var themeToggle = document.getElementById('themeToggle');
  var STORAGE_KEY = 'cellmate-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'dark');
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

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage blocked */ }
    });
  }

  initTheme();

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

})();
