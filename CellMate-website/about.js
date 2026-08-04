/* ==========================================================================
   CellMate — about.js
   Theme toggle, nav behaviour, scroll progress, scroll reveals,
   counters, magnetic buttons, timeline reveal, forms, back to top
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Theme toggle (light / dark) — shared storage key with the rest of the site
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
     Navbar: solid on scroll + active link highlight + scroll progress bar
  --------------------------------------------------------------------- */
  var nav = document.getElementById('cmNav');
  var navLinks = document.querySelectorAll('.cm-menu__link');
  var progressBar = document.getElementById('abProgress');

  function onScroll() {
    if (window.scrollY > 24) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    var toTop = document.getElementById('toTop');
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 600);

    if (progressBar) {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var scrollHeight = doc.scrollHeight - doc.clientHeight;
      var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();



  /* ---------------------------------------------------------------------
     Scroll reveal (fade + rise / slide left / slide right)
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
     Animated counters (hero stats + customer stats)
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
     Journey timeline: trigger the connecting line fill once in view
  --------------------------------------------------------------------- */
  var journey = document.querySelector('.ab-journey, .ab-vtimeline');
  if (journey) {
    var journeyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          journeyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    journeyObserver.observe(journey);
  }

  /* ---------------------------------------------------------------------
     Magnetic buttons — subtle pull toward the cursor on desktop pointers
  --------------------------------------------------------------------- */
  var magneticButtons = document.querySelectorAll('.cm-btn--magnetic');
  var supportsHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHover) {
    magneticButtons.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.18) + 'px,' + (y * 0.35) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------------------
     Newsletter form (front-end only — no backend wired up)
  --------------------------------------------------------------------- */
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
     Drop-off enquiry form (front-end only — no backend wired up)
  --------------------------------------------------------------------- */
  var enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!enquiryForm.checkValidity()) {
        enquiryForm.reportValidity();
        return;
      }
      var submitBtn = enquiryForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.querySelector('span').textContent = 'Enquiry Sent ✓';
        submitBtn.disabled = true;
      }
      enquiryForm.reset();
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
