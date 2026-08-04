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

/* ---------------------------------------------------------------------
   Real-Time Search & Shopping Cart Drawer Manager
--------------------------------------------------------------------- */
(function() {
  // Real-Time Search Logic
  var searchBtn = document.getElementById('navSearchBtn');
  var searchOverlay = document.getElementById('cmSearchOverlay');
  var searchCloseBtn = document.getElementById('cmSearchCloseBtn');
  var searchInput = document.getElementById('cmSearchInput');
  var searchResults = document.getElementById('cmSearchResults');

  var searchableDatabase = [
    { title: 'OLED Screen Replacement', category: 'Repair Service', price: '₹1,499+', link: 'repairs.html' },
    { title: 'OEM Battery Renewal', category: 'Repair Service', price: '₹999+', link: 'repairs.html' },
    { title: 'Type-C Charging Port Repair', category: 'Repair Service', price: '₹799+', link: 'repairs.html' },
    { title: 'Water Damage Ultrasound Recovery', category: 'Repair Service', price: '₹1,999+', link: 'repairs.html' },
    { title: 'Silicone MagSafe Case', category: 'Accessory', price: '₹499', link: 'accessories.html' },
    { title: '20W GaN Fast Charger Adapter', category: 'Accessory', price: '₹899', link: 'accessories.html' },
    { title: '240W Heavy Duty Braided Cable', category: 'Accessory', price: '₹349', link: 'accessories.html' },
    { title: '10,000mAh Dual-Port Power Bank', category: 'Accessory', price: '₹1,799', link: 'accessories.html' },
    { title: '9H Sapphire Tempered Glass', category: 'Accessory', price: '₹299', link: 'accessories.html' },
    { title: 'Wireless ANC Earbuds 5.3', category: 'Accessory', price: '₹2,499', link: 'accessories.html' },
    { title: 'Battery Lifespan 80/20 Maintenance Rule', category: 'Tech Guide', price: 'Free Guide', link: 'blog.html' },
    { title: 'ESD Cleanroom Micro-Soldering Process', category: 'Tech Guide', price: 'Free Guide', link: 'blog.html' }
  ];

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('is-active');
    setTimeout(function() { if (searchInput) searchInput.focus(); }, 100);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('is-active');
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSearch();
  });

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', function() {
      var query = searchInput.value.toLowerCase().trim();
      if (!query) {
        searchResults.innerHTML = '<p class="text-center text-muted py-4">Type to start searching CellMate services &amp; accessories...</p>';
        return;
      }

      var matches = searchableDatabase.filter(function(item) {
        return item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
      });

      if (!matches.length) {
        searchResults.innerHTML = '<p class="text-center text-muted py-4">No matching services or accessories found.</p>';
        return;
      }

      var html = '';
      matches.forEach(function(item) {
        html += '<a href="' + item.link + '" class="cm-search-result-item">' +
          '<div>' +
            '<div class="cm-search-result-title">' + item.title + '</div>' +
            '<div class="cm-search-result-sub">' + item.category + '</div>' +
          '</div>' +
          '<span class="badge bg-primary-subtle text-primary font-monospace">' + item.price + '</span>' +
        '</a>';
      });
      searchResults.innerHTML = html;
    });
  }

  // Shopping Cart Logic
  var cartBtn = document.getElementById('navCartBtn');
  var cartOverlay = document.getElementById('cmCartOverlay');
  var cartDrawer = document.getElementById('cmCartDrawer');
  var cartCloseBtn = document.getElementById('cmCartCloseBtn');
  var cartCountEl = document.getElementById('cartCount');
  var cartItemsEl = document.getElementById('cmCartItems');
  var cartSubtotalEl = document.getElementById('cmCartSubtotal');

  var cart = [
    { id: '1', title: 'Silicone MagSafe Case', price: 499, qty: 1, image: 'https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=700&auto=format&fit=crop' }
  ];

  function openCart() {
    if (!cartOverlay || !cartDrawer) return;
    cartOverlay.classList.add('is-active');
    cartDrawer.classList.add('is-active');
  }

  function closeCart() {
    if (!cartOverlay || !cartDrawer) return;
    cartOverlay.classList.remove('is-active');
    cartDrawer.classList.remove('is-active');
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function renderCart() {
    if (!cartCountEl || !cartItemsEl || !cartSubtotalEl) return;
    
    var totalQty = 0;
    var totalPrice = 0;

    if (!cart.length) {
      cartCountEl.textContent = '0';
      cartItemsEl.innerHTML = '<p class="text-center text-muted py-4">Your cart is currently empty.</p>';
      cartSubtotalEl.textContent = '₹0';
      return;
    }

    var html = '';
    cart.forEach(function(item, index) {
      totalQty += item.qty;
      totalPrice += item.price * item.qty;

      html += '<div class="cm-cart-drawer-item">' +
        '<img src="' + item.image + '" alt="' + item.title + '">' +
        '<div class="cm-cart-drawer-item__info">' +
          '<strong>' + item.title + '</strong>' +
          '<span>₹' + item.price.toLocaleString('en-IN') + ' x ' + item.qty + '</span>' +
        '</div>' +
        '<div class="d-flex align-items-center gap-1">' +
          '<button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="window.changeCartQty(' + index + ', -1)">-</button>' +
          '<span class="fw-bold px-1">' + item.qty + '</span>' +
          '<button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="window.changeCartQty(' + index + ', 1)">+</button>' +
        '</div>' +
      '</div>';
    });

    cartCountEl.textContent = totalQty;
    cartItemsEl.innerHTML = html;
    cartSubtotalEl.textContent = '₹' + totalPrice.toLocaleString('en-IN');
  }

  window.changeCartQty = function(index, delta) {
    if (cart[index]) {
      cart[index].qty += delta;
      if (cart[index].qty <= 0) cart.splice(index, 1);
      renderCart();
    }
  };

  window.addToCart = function(title, price, image) {
    var found = false;
    cart.forEach(function(item) {
      if (item.title === title) {
        item.qty += 1;
        found = true;
      }
    });
    if (!found) {
      cart.push({ id: String(Date.now()), title: title, price: price, qty: 1, image: image });
    }
    renderCart();
    openCart();
  };

  // Attach quick buy listeners to accessories cards
  document.querySelectorAll('.cm-shop-card').forEach(function(card) {
    var titleEl = card.querySelector('h3');
    var priceEl = card.querySelector('.cm-shop-card__price');
    var imgEl = card.querySelector('.cm-shop-card__media img');
    if (titleEl && priceEl && imgEl) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(e) {
        if (e.target.closest('.cm-shop-card__quick')) return;
        var title = titleEl.textContent.trim();
        var priceNum = parseInt(priceEl.textContent.replace(/[^0-9]/g, ''), 10) || 499;
        var imgSrc = imgEl.src;
        window.addToCart(title, priceNum, imgSrc);
      });
    }
  });

  renderCart();
})();