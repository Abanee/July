/* ==========================================================================
   CellMate — script.js
   Theme toggle, nav behaviour, scroll reveals, counters,
   phone crack-to-fixed wipe, testimonial slider, forms, RTL & Auth helpers
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------------------------------------------------------------------
     Theme Toggle (light / dark)
  --------------------------------------------------------------------- */
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
  var navLinks = document.querySelectorAll('.cm-menu__link');

  function onScroll() {
    if (nav) {
      if (window.scrollY > 24) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
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
        var href = link.getAttribute('href') || '';
        var isActive = href === '#' + id || (id === 'top' && (href === '#top' || href === 'index.html'));
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
  if (revealTargets.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

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

    phone.addEventListener('click', function () {
      phone.classList.remove('is-fixed');
      void phone.offsetWidth;
      setTimeout(function () { phone.classList.add('is-fixed'); }, 120);
    });
  }

  /* ---------------------------------------------------------------------
     Animated counters (stats + trust numbers)
  --------------------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1600;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
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
  }

  /* ---------------------------------------------------------------------
     Testimonial slider
  --------------------------------------------------------------------- */
  var slider = document.getElementById('testimonialSlider');
  var dotsWrap = document.getElementById('testimonialDots');
  if (slider && dotsWrap) {
    var slides = slider.querySelectorAll('.cm-testimonial');
    var current = 0;
    var timer = null;

    if (slides.length) {
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
        if (dots[current]) dots[current].classList.remove('is-active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('cm-testimonial--active');
        if (dots[current]) dots[current].classList.add('is-active');
      }

      function resetTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(function () { goTo(current + 1); }, 5500);
      }

      resetTimer();
    }
  }

  /* ---------------------------------------------------------------------
     Booking form (front-end only)
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
      var nameEl = document.getElementById('fName');
      var name = nameEl ? nameEl.value.trim() : 'Customer';
      if (formStatus) formStatus.textContent = 'Thanks, ' + name + '. A technician will confirm your slot shortly.';
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

  var bookTriggers = document.querySelectorAll('[data-repair-target]');
  var repairSelect = document.getElementById('repSelectType');

  if (bookTriggers.length && repairSelect) {
    bookTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var targetType = trigger.getAttribute('data-repair-target');
        if (targetType) {
          repairSelect.value = targetType;
        }
      });
    });
  }

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

  /* ---------------------------------------------------------------------
     Interactive Hero Before/After Phone Split Slider
  --------------------------------------------------------------------- */
  var comparePhone = document.querySelector('.cm-compare-phone');
  var crackedHalf = document.querySelector('.cm-compare-half--cracked');
  var divider = document.querySelector('.cm-compare-divider');

  if (comparePhone && crackedHalf && divider) {
    var isDragging = false;

    function setSliderPosition(x) {
      var rect = comparePhone.getBoundingClientRect();
      var offsetX = x - rect.left;
      var percentage = Math.max(5, Math.min(95, (offsetX / rect.width) * 100));

      crackedHalf.style.width = percentage + '%';
      divider.style.left = percentage + '%';
    }

    comparePhone.addEventListener('mousedown', function (e) {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
    });

    comparePhone.addEventListener('touchstart', function (e) {
      if (e.touches.length) setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    comparePhone.addEventListener('touchmove', function (e) {
      if (e.touches.length) setSliderPosition(e.touches[0].clientX);
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Gallery Page (gallery.html) Before/After Comparison Sliders
  --------------------------------------------------------------------- */
  var baSliders = document.querySelectorAll('[data-ba-slider]');
  baSliders.forEach(function (slider) {
    var beforeImg = slider.querySelector('.gal-ba-img--before');
    var divider = slider.querySelector('.gal-ba-divider');

    if (!beforeImg || !divider) return;

    var active = false;

    function move(x) {
      var rect = slider.getBoundingClientRect();
      var offsetX = x - rect.left;
      var pct = Math.max(5, Math.min(95, (offsetX / rect.width) * 100));

      beforeImg.style.width = pct + '%';
      divider.style.left = pct + '%';
    }

    slider.addEventListener('mousedown', function (e) {
      active = true;
      move(e.clientX);
    });

    window.addEventListener('mousemove', function (e) {
      if (!active) return;
      move(e.clientX);
    });

    window.addEventListener('mouseup', function () {
      active = false;
    });

    slider.addEventListener('touchstart', function (e) {
      if (e.touches.length) move(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchmove', function (e) {
      if (e.touches.length) move(e.touches[0].clientX);
    }, { passive: true });
  });

  /* ---------------------------------------------------------------------
     4x6 Filter-Based Gallery Interaction
  --------------------------------------------------------------------- */
  var filterBtns = document.querySelectorAll('.gal-filter-btn');
  var galItems = document.querySelectorAll('.gal-card-item');

  if (filterBtns.length && galItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        galItems.forEach(function (item) {
          var cat = item.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            item.style.display = 'block';
            setTimeout(function () {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(function () {
              if (item.style.opacity === '0') item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Blog Page (blog.html) Article Filter Interaction
  --------------------------------------------------------------------- */
  var blgFilterBtns = document.querySelectorAll('.blg-filter-btn');
  var blgItems = document.querySelectorAll('.blg-item');

  if (blgFilterBtns.length && blgItems.length) {
    blgFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-blg-filter');

        blgFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        blgItems.forEach(function (item) {
          var cat = item.getAttribute('data-blg-cat');
          if (filter === 'all' || cat === filter) {
            item.style.display = 'block';
            setTimeout(function () {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(function () {
              if (item.style.opacity === '0') item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Repairs Page (repairs.html) Brand Filter Interaction
  --------------------------------------------------------------------- */
  var repBrandBtns = document.querySelectorAll('#repBrandFilter .rep-filter-btn');
  var repItems = document.querySelectorAll('.rep-item');

  if (repBrandBtns.length && repItems.length) {
    repBrandBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var brand = btn.getAttribute('data-rep-brand');

        repBrandBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        repItems.forEach(function (item) {
          var itemBrand = item.getAttribute('data-rep-brand');
          if (brand === 'all' || itemBrand === brand) {
            item.style.display = 'block';
            setTimeout(function () { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(function () { if (item.style.opacity === '0') item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Accessories Page (accessories.html) Brand Filter Interaction
  --------------------------------------------------------------------- */
  var accBrandBtns = document.querySelectorAll('#accBrandFilter .acc-filter-btn');
  var accItems = document.querySelectorAll('.acc-item');

  if (accBrandBtns.length && accItems.length) {
    accBrandBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var brand = btn.getAttribute('data-acc-brand');

        accBrandBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        accItems.forEach(function (item) {
          var itemBrand = item.getAttribute('data-acc-brand');
          if (brand === 'all' || itemBrand === brand) {
            item.style.display = 'block';
            setTimeout(function () { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(function () { if (item.style.opacity === '0') item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

})();

/* ---------------------------------------------------------------------
   Instant Repair Cost Estimator Logic (Home Page)
--------------------------------------------------------------------- */
function updateEstimate() {
  var brandEl = document.getElementById('estBrand');
  var repairEl = document.getElementById('estRepair');
  var priceEl = document.getElementById('estPrice');
  var timeEl = document.getElementById('estTime');
  var warrantyEl = document.getElementById('estWarranty');

  if (!brandEl || !repairEl || !priceEl) return;

  var brand = brandEl.value;
  var repair = repairEl.value;

  var prices = {
    screen: { apple: '₹2,499 - ₹4,999', samsung: '₹2,199 - ₹4,499', pixel: '₹1,999 - ₹3,999', xiaomi: '₹1,499 - ₹2,499', oneplus: '₹1,799 - ₹3,299' },
    battery: { apple: '₹1,299 - ₹1,999', samsung: '₹1,199 - ₹1,799', pixel: '₹1,099 - ₹1,699', xiaomi: '₹899 - ₹1,299', oneplus: '₹999 - ₹1,499' },
    port: { apple: '₹999 - ₹1,499', samsung: '₹899 - ₹1,299', pixel: '₹899 - ₹1,299', xiaomi: '₹699 - ₹999', oneplus: '₹799 - ₹1,199' },
    camera: { apple: '₹1,899 - ₹2,999', samsung: '₹1,599 - ₹2,499', pixel: '₹1,499 - ₹2,299', xiaomi: '₹1,199 - ₹1,799', oneplus: '₹1,299 - ₹1,999' },
    water: { apple: '₹1,999 - ₹3,499', samsung: '₹1,799 - ₹2,999', pixel: '₹1,699 - ₹2,799', xiaomi: '₹1,299 - ₹1,999', oneplus: '₹1,399 - ₹2,199' }
  };

  var times = {
    screen: '25 - 35 Minutes',
    battery: '20 - 30 Minutes',
    port: '30 - 45 Minutes',
    camera: '25 - 40 Minutes',
    water: 'Same Day Diagnostic'
  };

  if (prices[repair] && prices[repair][brand]) {
    priceEl.textContent = prices[repair][brand];
  }
  if (times[repair]) {
    timeEl.textContent = times[repair];
  }
}