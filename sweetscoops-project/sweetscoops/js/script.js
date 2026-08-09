/* =========================================================
   SweetScoops — shared script
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 0: Theme toggle (dark mode) ----------
     The <html> element already has (or lacks) the 'dark' class by the time
     this runs, set by the no-flash inline script in <head>. This block only
     wires up the visible switch(es) and persists the user's explicit choice. */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const getTheme = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const syncToggleA11y = () => {
    const isDark = getTheme() === 'dark';
    themeToggles.forEach(btn => {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  };
  syncToggleA11y();
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) { /* storage unavailable */ }
      syncToggleA11y();
    });
  });

  /* ---------- 0.5: RTL toggle ---------- */
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const syncRtlA11y = () => {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    rtlToggles.forEach(btn => {
      btn.classList.toggle('is-active', isRtl);
      btn.setAttribute('aria-label', isRtl ? 'Switch to LTR' : 'Switch to RTL');
    });
  };
  try {
    if (localStorage.getItem('dir') === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
    }
  } catch(e) {}
  syncRtlA11y();

  rtlToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      const newDir = isRtl ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      try { localStorage.setItem('dir', newDir); } catch(e){}
      syncRtlA11y();
    });
  });

  /* ---------- 0.6: Search modal toggle ---------- */
  const searchToggles = document.querySelectorAll('.search-toggle');
  const searchModal = document.getElementById('searchModal');
  const closeSearch = document.getElementById('closeSearch');
  if (searchModal) {
    searchToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        searchModal.classList.add('is-open');
        const input = searchModal.querySelector('input');
        if (input) input.focus();
      });
    });
    if (closeSearch) {
      closeSearch.addEventListener('click', () => searchModal.classList.remove('is-open'));
    }
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('is-open');
    });
  }

  /* ---------- 1 & 2 & 3: Mobile nav + sticky nav + scroll transform ---------- */
  const nav = document.getElementById('siteNav');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 4: Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-group');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Current nav link highlighting (About page sections) ---------- */
  const navLinks = document.querySelectorAll('.nav-center a[href^="#"]');
  const sectionIds = Array.from(navLinks)
    .map(a => a.getAttribute('href'))
    .filter(href => href.length > 1)
    .map(href => document.querySelector(href))
    .filter(Boolean);

  if (navLinks.length && sectionIds.length) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === id));
        }
      });
    }, { threshold: 0.4, rootMargin: '-80px 0px -50% 0px' });
    sectionIds.forEach(sec => navIo.observe(sec));
  }

  /* ---------- 6 & 8 & 9: Waffle combo builder / dynamic pricing ----------
     Generalized to work with any number of .chip-group sections on the page
     (the Home page uses 3 steps — waffle, ice cream, topping — and Home 2
     uses 4 — waffle, ice cream, topping, sauce). The group whose
     data-group="waffle" supplies the result heading; every other group
     becomes a "+ value" line. Base price is read from resultPrice's
     data-base attribute so each page can set its own starting price. */
  const chipGroups = document.querySelectorAll('.chip-group');
  const resultWaffle = document.getElementById('resultWaffle');
  const resultList = document.getElementById('resultList');
  const resultPrice = document.getElementById('resultPrice');
  const resultImg = document.getElementById('resultImg');

  function renderCombo() {
    if (!resultPrice) return;
    const basePrice = Number(resultPrice.dataset.base || 249);
    let total = basePrice;
    let heading = '';
    const lines = [];

    chipGroups.forEach(group => {
      const active = group.querySelector('.chip.is-active');
      if (!active) return;
      const value = active.dataset.value;
      total += Number(active.dataset.price || 0);

      if (group.dataset.group === 'waffle') {
        heading = `${value} Waffle`;
        if (resultImg && active.dataset.img) resultImg.src = active.dataset.img;
      } else {
        lines.push(`<li>+ ${value}</li>`);
      }
    });

    if (resultWaffle) resultWaffle.textContent = heading;
    if (resultList) resultList.innerHTML = lines.join('\n');
    resultPrice.textContent = `₹${total}`;
  }

  chipGroups.forEach(group => {
    const isMulti = group.dataset.multi === 'true';
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (isMulti) {
          chip.classList.toggle('is-active');
        } else {
          group.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
          chip.classList.add('is-active');
        }
        renderCombo();
        if (typeof renderCelebrationSummary === 'function') renderCelebrationSummary();
      });
    });
  });
  if (resultPrice) renderCombo();

  /* ---------- Flavor ticker (Home 2) ---------- */
  const flavorTrack = document.getElementById('flavorTrack');
  const flavorPrev = document.getElementById('flavorPrev');
  const flavorNext = document.getElementById('flavorNext');
  if (flavorTrack && flavorPrev && flavorNext) {
    flavorPrev.addEventListener('click', () => flavorTrack.scrollBy({ left: -160, behavior: 'smooth' }));
    flavorNext.addEventListener('click', () => flavorTrack.scrollBy({ left: 160, behavior: 'smooth' }));
  }

  /* ---------- Newsletter form (Home 2 footer) ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    const newsletterMsg = document.getElementById('newsletterMsg');
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (newsletterMsg) newsletterMsg.textContent = "You're on the list! 🍨";
      newsletterForm.reset();
    });
  }

  /* ---------- 10: Opening-hours status ---------- */
  const hoursStatus = document.getElementById('hoursStatus');
  if (hoursStatus) {
    const now = new Date();
    const day = now.getDay(); // 0 Sun - 6 Sat
    const hour = now.getHours() + now.getMinutes() / 60;
    const isWeekend = (day === 0 || day === 6);
    const openTime = 10;
    const closeTime = isWeekend ? 23 : 22;
    const isOpen = hour >= openTime && hour < closeTime;

    hoursStatus.textContent = isOpen ? 'Open Today' : 'Closed Now';
    hoursStatus.classList.add(isOpen ? 'status-open' : 'status-closed');
  }

  /* ---------- 11: Smooth scrolling for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = nav ? nav.offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
          window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
        }
      }
    });
  });

  /* ---------- 12: Signature Picks category filter (Menu page) ---------- */
  const cravingRail = document.getElementById('cravingRail');
  const signatureRow = document.getElementById('signatureRow');
  if (cravingRail && signatureRow) {
    const cravingItems = cravingRail.querySelectorAll('.craving-item[data-category]');
    const prodCards = signatureRow.querySelectorAll('[data-cat]');
    cravingItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = item.dataset.category;
        cravingItems.forEach(i => i.classList.toggle('is-selected', i === item));
        prodCards.forEach(card => {
          const show = cat === 'all' || card.dataset.cat === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- 13: Build Your Own Treat — dynamic dessert image (Menu page) ----------
     The generalized chip-group builder above already updates the selected-item
     list and total price for every .chip-group on the page. This adds the
     dessert photo swap, keyed off the Scoop step's data-img attribute. */
  const treatImg = document.getElementById('treatImg');
  const scoopGroup = document.querySelector('.chip-group[data-group="scoop"]');
  if (treatImg && scoopGroup) {
    const setTreatImg = () => {
      const active = scoopGroup.querySelector('.chip.is-active');
      if (active && active.dataset.img) treatImg.src = active.dataset.img;
    };
    scoopGroup.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', setTreatImg));
    setTreatImg();
  }

  /* ---------- 14: Today's Specials swap (Menu page) ---------- */
  const specialMinis = document.querySelectorAll('.special-mini');
  const specialTitle = document.getElementById('specialTitle');
  const specialDesc = document.getElementById('specialDesc');
  const specialPrice = document.getElementById('specialPrice');
  const specialImg = document.getElementById('specialImg');
  if (specialMinis.length && specialTitle && specialImg) {
    specialMinis.forEach(mini => {
      mini.addEventListener('click', () => {
        specialMinis.forEach(m => m.classList.remove('is-active'));
        mini.classList.add('is-active');

        const apply = () => {
          specialTitle.textContent = mini.dataset.title;
          if (specialDesc) specialDesc.textContent = mini.dataset.desc;
          if (specialPrice) specialPrice.textContent = mini.dataset.price;
          specialImg.src = mini.dataset.img;
          specialImg.style.opacity = 1;
        };

        if (prefersReduced) {
          apply();
        } else {
          specialImg.style.opacity = 0;
          setTimeout(apply, 250);
        }
      });
    });
  }

  /* ---------- 16: Gallery — filter, search and lightbox (Gallery page) ---------- */
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    const tiles = Array.from(galleryGrid.querySelectorAll('.gallery-tile'));
    const filterButtons = document.querySelectorAll('#galleryFilters .chip');
    const searchInput = document.getElementById('gallerySearch');
    const searchClear = document.getElementById('gallerySearchClear');
    const countEl = document.getElementById('galleryCount');
    const emptyEl = document.getElementById('galleryEmpty');
    let activeFilter = 'all';

    const applyFilters = () => {
      const term = searchInput.value.trim().toLowerCase();
      searchClear.hidden = term.length === 0;
      let visibleCount = 0;

      tiles.forEach(tile => {
        const matchesCategory = activeFilter === 'all' || tile.dataset.category === activeFilter;
        const haystack = (tile.dataset.tags || '') + ' ' + (tile.querySelector('.gallery-tile-title')?.textContent || '');
        const matchesSearch = term === '' || haystack.toLowerCase().includes(term);
        const show = matchesCategory && matchesSearch;
        tile.classList.toggle('is-hidden', !show);
        if (show) visibleCount += 1;
      });

      countEl.textContent = `Showing ${visibleCount} of ${tiles.length} photos`;
      emptyEl.hidden = visibleCount !== 0;
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        filterButtons.forEach(b => b.classList.toggle('is-active', b === btn));
        applyFilters();
      });
    });

    searchInput.addEventListener('input', applyFilters);
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
      applyFilters();
    });

    applyFilters();

    /* ---- lightbox ---- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCat = document.getElementById('lightboxCat');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let lightboxIndex = -1;

    const visibleTiles = () => tiles.filter(t => !t.classList.contains('is-hidden'));

    const openLightbox = (tile) => {
      const list = visibleTiles();
      lightboxIndex = list.indexOf(tile);
      renderLightbox();
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    };

    const renderLightbox = () => {
      const list = visibleTiles();
      if (!list.length) return;
      if (lightboxIndex < 0) lightboxIndex = 0;
      if (lightboxIndex >= list.length) lightboxIndex = 0;
      const tile = list[lightboxIndex];
      const img = tile.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxTitle.textContent = tile.querySelector('.gallery-tile-title')?.textContent || '';
      lightboxCat.textContent = tile.querySelector('.gallery-tile-cat')?.textContent || '';
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    const step = (dir) => {
      const list = visibleTiles();
      if (!list.length) return;
      lightboxIndex = (lightboxIndex + dir + list.length) % list.length;
      renderLightbox();
    };

    tiles.forEach(tile => tile.addEventListener('click', () => openLightbox(tile)));
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => step(-1));
    lightboxNext.addEventListener('click', () => step(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
  }

  /* ---------- 15: Button micro-interaction (ripple-free press feedback) ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerdown', () => btn.style.transform = 'translateY(0px) scale(.97)');
    btn.addEventListener('pointerup', () => btn.style.transform = '');
    btn.addEventListener('pointerleave', () => btn.style.transform = '');
  });

  /* ---------- 17: Celebrations page — "What Are We Celebrating?" type cards ----------
     Clicking a card marks it selected and auto-fills the enquiry form's Event
     Type field, per spec: "User clicks Birthday → Event Type becomes Birthday." */
  const celebTypeCards = document.querySelectorAll('.celeb-type-card[data-event-type]');
  const eventTypeField = document.getElementById('eventType');
  if (celebTypeCards.length) {
    celebTypeCards.forEach(card => {
      card.addEventListener('click', () => {
        celebTypeCards.forEach(c => c.classList.toggle('is-selected', c === card));
        if (eventTypeField && card.dataset.eventType) {
          eventTypeField.value = card.dataset.eventType;
        }
      });
    });
  }

  /* ---------- 18: Celebrations page — party builder summary ----------
     Reads every .chip-group[data-celeb] on the page (guests = single-select,
     treats/extras = multi-select, style = single-select) and renders a plain
     "no fake price" summary, per spec: show "Custom quote" instead of a total. */
  const celebSummaryList = document.getElementById('celebSummaryList');
  const celebSummaryGuests = document.getElementById('celebSummaryGuests');
  const celebGroups = document.querySelectorAll('.chip-group[data-celeb]');

  function renderCelebrationSummary() {
    if (!celebSummaryList) return;
    let guestsText = '';
    const lines = [];

    celebGroups.forEach(group => {
      const activeChips = Array.from(group.querySelectorAll('.chip.is-active'));
      if (!activeChips.length) return;
      const values = activeChips.map(c => c.dataset.value);

      if (group.dataset.celeb === 'guests') {
        guestsText = `${values[0]} Guests`;
      } else {
        values.forEach(v => lines.push(`<li>${v}</li>`));
      }
    });

    if (celebSummaryGuests) celebSummaryGuests.textContent = guestsText || 'Select your guest count';
    celebSummaryList.innerHTML = lines.length
      ? lines.join('\n')
      : '<li class="celeb-result-empty">Choose your treats, extras and style to build your plan.</li>';
  }
  if (celebSummaryList) renderCelebrationSummary();

  /* ---------- "Send This Plan" — carries the builder summary into the enquiry form ---------- */
  const sendPlanBtn = document.getElementById('sendPlanBtn');
  const enquiryMessage = document.getElementById('enquiryMessage');
  const enquiryGuests = document.getElementById('enquiryGuests');
  if (sendPlanBtn && enquiryMessage) {
    sendPlanBtn.addEventListener('click', () => {
      const guestsText = celebSummaryGuests ? celebSummaryGuests.textContent : '';
      const items = Array.from(celebSummaryList.querySelectorAll('li:not(.celeb-result-empty)')).map(li => li.textContent);
      if (guestsText && enquiryGuests && !enquiryGuests.value) enquiryGuests.value = guestsText;
      if (items.length) {
        enquiryMessage.value = `My celebration plan — ${guestsText}: ${items.join(', ')}.`;
      }
      const enquirySection = document.getElementById('enquiry');
      if (enquirySection) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const top = enquirySection.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
        window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    });
  }

  /* ---------- 19: Celebrations page — enquiry form validation ---------- */
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    const successMsg = document.getElementById('enquirySuccess');
    const requiredFields = enquiryForm.querySelectorAll('[required]');

    const validateField = (field) => {
      const wrap = field.closest('.form-field');
      let valid = field.checkValidity();
      if (valid && field.type === 'tel') {
        valid = /^[0-9+\-\s()]{7,}$/.test(field.value.trim());
      }
      if (wrap) wrap.classList.toggle('has-error', !valid);
      return valid;
    };

    requiredFields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
    });

    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      requiredFields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (allValid) {
        if (successMsg) successMsg.classList.add('is-visible');
        enquiryForm.reset();
        celebTypeCards.forEach(c => c.classList.remove('is-selected'));
      } else {
        const firstError = enquiryForm.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstError) firstError.focus();
        if (successMsg) successMsg.classList.remove('is-visible');
      }
    });
  }

  /* ---------- 20: Celebrations page — FAQ accordion ----------
     Each item toggles independently and starts closed. */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : '0px';
      question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- Celebrations page — package CTA pre-fills Preferred Package ---------- */
  const packageBtns = document.querySelectorAll('.package-choose-btn[data-package]');
  const preferredPackageField = document.getElementById('preferredPackage');
  if (packageBtns.length && preferredPackageField) {
    packageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        preferredPackageField.value = btn.dataset.package;
      });
    });
  }

  /* ---------- Today's Special Countdown Timer ---------- */
  const timerHrs = document.getElementById('timerHrs');
  const timerMins = document.getElementById('timerMins');
  const timerSecs = document.getElementById('timerSecs');

  if (timerHrs && timerMins && timerSecs) {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = Math.max(0, endOfDay - now);

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      timerHrs.textContent = String(hrs).padStart(2, '0');
      timerMins.textContent = String(mins).padStart(2, '0');
      timerSecs.textContent = String(secs).padStart(2, '0');
    };
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

});
