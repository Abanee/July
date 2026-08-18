// ============================================
// CHAMPION SPORTS ACADEMY — HOME 2 SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  /* ---------- Theme Toggle ---------- */
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
  }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('csa-theme', t);
    reflectThemeIcons(t);
  }
  reflectThemeIcons(root.getAttribute('data-theme') || 'dark');
  themeToggle       && themeToggle.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  themeToggleMobile && themeToggleMobile.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  /* ---------- RTL Toggle ---------- */
  const rtlToggle       = document.getElementById('rtl-toggle');
  const rtlToggleMobile = document.getElementById('rtl-toggle-mobile');
  function toggleRTL() {
    const isRTL = root.getAttribute('dir') !== 'rtl';
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    localStorage.setItem('csa-rtl', String(isRTL));
    if (rtlToggle) rtlToggle.setAttribute('aria-pressed', String(isRTL));
    if (rtlToggleMobile) rtlToggleMobile.setAttribute('aria-pressed', String(isRTL));
  }
  rtlToggle       && rtlToggle.addEventListener('click', toggleRTL);
  rtlToggleMobile && rtlToggleMobile.addEventListener('click', toggleRTL);

  /* ---------- Mobile navigation ---------- */
  const menuToggle = document.getElementById('menuToggle') || document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobileMenu') || document.getElementById('mobile-menu');
  const iconMenu = document.getElementById('iconMenu');
  const iconClose = document.getElementById('iconClose');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      mobileMenu.classList.toggle('hidden', !isOpen);
      mobileMenu.classList.toggle('flex', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      iconMenu && iconMenu.classList.toggle('hidden', isOpen);
      iconClose && iconClose.classList.toggle('hidden', !isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuToggle.setAttribute('aria-expanded', 'false');
        iconMenu && iconMenu.classList.remove('hidden');
        iconClose && iconClose.classList.add('hidden');
      });
    });
  }

  /* ---------- Sports Cards Carousel ---------- */
  const sportTrack = document.getElementById('sportCardsTrack');
  const sportPrev  = document.getElementById('sportPrev');
  const sportNext  = document.getElementById('sportNext');

  if (sportTrack && sportPrev && sportNext) {
    const getCardWidth = () => {
      const card = sportTrack.querySelector('.sport-card');
      if (!card) return 300;
      const trackStyle = window.getComputedStyle(sportTrack);
      const gap = parseFloat(trackStyle.gap) || 16;
      return card.offsetWidth + gap;
    };

    const scrollNext = () => {
      const maxScroll = sportTrack.scrollWidth - sportTrack.clientWidth;
      if (sportTrack.scrollLeft >= maxScroll - 12) {
        sportTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sportTrack.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
      }
    };

    const scrollPrev = () => {
      const maxScroll = sportTrack.scrollWidth - sportTrack.clientWidth;
      if (sportTrack.scrollLeft <= 12) {
        sportTrack.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        sportTrack.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
      }
    };

    sportPrev.addEventListener('click', scrollPrev);
    sportNext.addEventListener('click', scrollNext);

    // Auto-advance every 3.8s with smooth looping (pause on hover / touch)
    let autoRotateTimer = null;
    const startAutoRotate = () => {
      stopAutoRotate();
      autoRotateTimer = setInterval(scrollNext, 3800);
    };
    const stopAutoRotate = () => {
      if (autoRotateTimer) {
        clearInterval(autoRotateTimer);
        autoRotateTimer = null;
      }
    };

    startAutoRotate();

    sportTrack.addEventListener('mouseenter', stopAutoRotate);
    sportTrack.addEventListener('mouseleave', startAutoRotate);
    sportTrack.addEventListener('touchstart', stopAutoRotate, { passive: true });
    sportTrack.addEventListener('touchend', () => {
      setTimeout(startAutoRotate, 3000);
    }, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const alreadyOpen = item.classList.contains('is-open');
      faqItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!alreadyOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Batch schedule data + tab switching ---------- */
  const sportsMeta = {
    football: {
      name: 'Football Academy',
      tagline: 'High-Tempo Matchplay & Skill Drills',
      image: 'Assets/Home/home01.jpg',
      badge: 'Active Cohorts',
      age: 'Ages 5 – 18',
      ratio: '8:1 Athlete to Coach',
      facility: 'Full-Size FIFA Certified Turf',
      tags: ['Tactical IQ', 'Ball Mastery', 'Agility & Speed'],
      trialLink: 'contact.html?sport=football',
    },
    basketball: {
      name: 'Basketball Academy',
      tagline: 'Court Vision, Shooting & Playmaking',
      image: 'Assets/Home/home02.jpg',
      badge: 'Open Enrollments',
      age: 'Ages 7 – 18',
      ratio: '6:1 Athlete to Coach',
      facility: 'Indoor Maple Wood Courts',
      tags: ['Ball Handling', 'Shooting Form', 'Defensive Stance'],
      trialLink: 'contact.html?sport=basketball',
    },
    badminton: {
      name: 'Badminton Academy',
      tagline: 'Reflex Speed, Racket Precision & Rallies',
      image: 'Assets/Home/home03.jpg',
      badge: 'Limited Slots',
      age: 'Ages 6 – 17',
      ratio: '4:1 Athlete to Coach',
      facility: 'BWF Standard Synthetic Courts',
      tags: ['Footwork Agility', 'Smash Accuracy', 'Match Fitness'],
      trialLink: 'contact.html?sport=badminton',
    },
    athletics: {
      name: 'Athletics & Track',
      tagline: 'Explosive Acceleration, Stamina & Form',
      image: 'Assets/Home/home04.jpg',
      badge: 'New Season',
      age: 'Ages 8 – 18',
      ratio: '8:1 Athlete to Coach',
      facility: '8-Lane Synthetic Tartan Track',
      tags: ['Sprint Mechanics', 'Laser Telemetry', 'Core Strength'],
      trialLink: 'contact.html?sport=athletics',
    },
  };

  const schedules = {
    football: [
      {
        day: 'MON',
        focus: 'Technique',
        title: 'Ball Mastery & Control',
        drills: ['1v1 Dribble Moves', 'First-Touch Trapping', 'Cone Passing Drills'],
        time: '5:30 – 7:00 PM',
        batch: 'Turf A'
      },
      {
        day: 'TUE',
        focus: 'Fitness',
        title: 'Speed & Agility Reps',
        drills: ['Speed Ladder Drills', 'Acceleration Sprints', 'Core Conditioning'],
        time: '5:30 – 6:30 PM',
        batch: 'Fitness Zone'
      },
      {
        day: 'WED',
        focus: 'Tactical',
        title: 'Passing & Team Shape',
        drills: ['Positional Rondos', 'Transition Triggers', 'Width & Crossing'],
        time: '5:30 – 7:00 PM',
        batch: 'Main Turf'
      },
      {
        day: 'THU',
        focus: 'Recovery',
        title: 'Mobility & Personal Work',
        drills: ['Dynamic Foam Rolling', 'Joint Flexibility', 'Individual Shooting'],
        time: 'Flexible Slots',
        batch: 'Studio & Turf'
      },
      {
        day: 'FRI',
        focus: 'Matchplay',
        title: 'Tactical Set Pieces',
        drills: ['Corner Kick Routines', 'Defensive Pressing', '7v7 Mini Matches'],
        time: '5:30 – 7:00 PM',
        batch: 'Full Pitch'
      },
      {
        day: 'SAT',
        focus: 'League',
        title: 'Competitive Scrimmage',
        drills: ['11v11 Matchplay', 'Referee Officiating', 'Video Analysis Log'],
        time: '9:00 – 11:00 AM',
        batch: 'Stadium Arena'
      },
      {
        day: 'SUN',
        focus: 'Rest',
        title: 'Active Recovery Day',
        drills: ['Hydration Protocol', 'Muscle Decompression', 'Weekly Performance Log'],
        time: 'Rest Day',
        batch: 'All Cohorts',
        rest: true
      },
    ],
    basketball: [
      {
        day: 'MON',
        focus: 'Handles',
        title: 'Dribbling & Control',
        drills: ['2-Ball Dribble Drills', 'Crossover Transitions', 'Pace & Acceleration'],
        time: '5:00 – 6:30 PM',
        batch: 'Court 1'
      },
      {
        day: 'TUE',
        focus: 'Shooting',
        title: 'Shooting Form & Reps',
        drills: ['Catch & Shoot Form', 'Free Throw Routines', 'Off-Dribble Pullups'],
        time: '5:00 – 6:30 PM',
        batch: 'Court 2'
      },
      {
        day: 'WED',
        focus: 'Tactics',
        title: 'Pick & Roll Spacing',
        drills: ['Offensive Spacing', 'Fastbreak Lanes', 'Screening Angles'],
        time: '5:00 – 6:30 PM',
        batch: 'Main Court'
      },
      {
        day: 'THU',
        focus: 'Fitness',
        title: 'Explosive Vertical Jump',
        drills: ['Plyometric Box Jumps', 'Lateral Defensive Slides', 'Core & Stability'],
        time: '5:00 – 6:00 PM',
        batch: 'Gym / Court'
      },
      {
        day: 'FRI',
        focus: 'Defense',
        title: 'Lockdown Guarding',
        drills: ['1v1 Containment Drills', 'Help & Recover Shifts', 'Rebound Boxing Out'],
        time: '5:00 – 6:30 PM',
        batch: 'Main Court'
      },
      {
        day: 'SAT',
        focus: 'Matchplay',
        title: 'Full-Court 5v5 League',
        drills: ['Live Game Simulation', 'Electronic Shot Clock', 'Stat Sheet Review'],
        time: '9:00 – 11:00 AM',
        batch: 'Arena Court'
      },
      {
        day: 'SUN',
        focus: 'Rest',
        title: 'Recovery & Mobility',
        drills: ['Hydration Protocols', 'Static Stretching Routine', 'Injury Prevention Check'],
        time: 'Rest Day',
        batch: 'All Cohorts',
        rest: true
      },
    ],
    badminton: [
      {
        day: 'MON',
        focus: 'Footwork',
        title: '6-Corner Court Agility',
        drills: ['Shadow Split-Step', 'Lunging Recovery Speed', 'Rear Corner Retract'],
        time: '4:30 – 6:00 PM',
        batch: 'Mats 1 & 2'
      },
      {
        day: 'TUE',
        focus: 'Technique',
        title: 'Overhead & Net Control',
        drills: ['Forehand Clear Drills', 'Tight Hairpin Net Shots', 'Deceptive Drops'],
        time: '4:30 – 6:00 PM',
        batch: 'Mats 3 & 4'
      },
      {
        day: 'WED',
        focus: 'Stamina',
        title: 'High-Tempo Rallies',
        drills: ['Multi-Shuttle Feeding', 'Continuous 40-Shot Rallies', 'Counter-Attack Drills'],
        time: '4:30 – 6:00 PM',
        batch: 'All Mats'
      },
      {
        day: 'THU',
        focus: 'Recovery',
        title: 'Wrist & Core Mobility',
        drills: ['Resistance Band Work', 'Shoulder Rotator Rehab', 'Flexibility Stretches'],
        time: 'Flexible Slots',
        batch: 'Warm-up Zone'
      },
      {
        day: 'FRI',
        focus: 'Offense',
        title: 'Power Smash & Intercept',
        drills: ['Jump Smash Angles', 'Net Kill Interceptions', 'Doubles Fast Rotations'],
        time: '4:30 – 6:00 PM',
        batch: 'All Mats'
      },
      {
        day: 'SAT',
        focus: 'Matchplay',
        title: 'Ranked Sparring Matches',
        drills: ['Singles Ladder Matches', 'Doubles Tournament Play', 'Coach Tactical Brief'],
        time: '9:00 – 10:30 AM',
        batch: 'Championship Hall'
      },
      {
        day: 'SUN',
        focus: 'Rest',
        title: 'Joint Decompression',
        drills: ['Foam Roller Routine', 'Hydration & Nutrition', 'Weekly Video Recap'],
        time: 'Rest Day',
        batch: 'All Cohorts',
        rest: true
      },
    ],
    athletics: [
      {
        day: 'MON',
        focus: 'Speed',
        title: 'Sprint Block Mechanics',
        drills: ['Crouch Start Angles', 'Drive Phase Mechanics', 'Arm Action Rhythm'],
        time: '6:00 – 7:30 AM',
        batch: 'Track Lanes 1–4'
      },
      {
        day: 'TUE',
        focus: 'Strength',
        title: 'Explosive Power & Plyo',
        drills: ['Hurdle Hop Reps', 'Weighted Sled Pushes', 'Core Stability Work'],
        time: '6:00 – 7:00 AM',
        batch: 'Track Infield'
      },
      {
        day: 'WED',
        focus: 'Endurance',
        title: 'Aerobic Interval Splits',
        drills: ['400m / 800m Pacing', 'Lactate Threshold Runs', 'Recovery Jog Intervals'],
        time: '6:00 – 7:30 AM',
        batch: 'Full Track'
      },
      {
        day: 'THU',
        focus: 'Mobility',
        title: 'Stride Efficiency Form',
        drills: ['Hip Mobility Drills', 'A-Skip & B-Skip Form', 'Dynamic Flexibility'],
        time: 'Flexible Slots',
        batch: 'Warm-up Strip'
      },
      {
        day: 'FRI',
        focus: 'Track',
        title: 'Curve Running & Relay',
        drills: ['Centrifugal Lean Drills', 'Blind Baton Exchanges', 'Race Simulation Runs'],
        time: '6:00 – 7:30 AM',
        batch: 'Full Track'
      },
      {
        day: 'SAT',
        focus: 'Trials',
        title: 'Laser Timed Sprint Tests',
        drills: ['Photocell 60m/100m Times', 'Jump Distance Metric', 'Coach Data Review'],
        time: '7:00 – 9:00 AM',
        batch: 'Timing Gate'
      },
      {
        day: 'SUN',
        focus: 'Rest',
        title: 'Full Rest & Recovery',
        drills: ['Contrast Bath Routine', 'Sleep Optimization', 'Training Log Entry'],
        time: 'Rest Day',
        batch: 'All Cohorts',
        rest: true
      },
    ],
  };

  const scheduleTable = document.getElementById('scheduleTable');
  const sportImageCard = document.getElementById('sportImageCard');
  const sportTabs = document.querySelectorAll('.sport-tab');

  function renderSchedule(sport) {
    const meta = sportsMeta[sport] || sportsMeta.football;
    const data = schedules[sport] || schedules.football;

    if (sportImageCard) {
      sportImageCard.innerHTML = `
        <div class="sport-image-card bg-white border border-bd rounded-2xl overflow-hidden shadow-sm flex flex-col h-full hover:border-lime transition-all duration-300">
          <div class="relative h-[190px] overflow-hidden group">
            <img src="${meta.image}" alt="${meta.name} training at Champion Sports Academy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-[#061A2E]/85 via-transparent to-transparent"></div>
            <span class="absolute top-3 left-3 bg-[#A8D600] text-[#03111F] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">${meta.badge}</span>
            <span class="absolute bottom-3 left-3 text-white font-display font-extrabold text-[17px] drop-shadow-md">${meta.name}</span>
          </div>
          <div class="p-5 flex flex-col flex-1 justify-between gap-4">
            <div>
              <p class="text-xs font-semibold text-lime-dark tracking-wide uppercase mb-1">${meta.age} &bull; ${meta.ratio}</p>
              <p class="text-muted text-[13px] leading-relaxed">${meta.tagline}</p>
              <div class="flex flex-wrap gap-1.5 mt-3">
                ${meta.tags.map(t => `<span class="text-[11px] font-semibold bg-softbg text-muted px-2.5 py-1 rounded-md border border-bd">${t}</span>`).join('')}
              </div>
            </div>
            <div class="pt-3 border-t border-bd flex items-center justify-between">
              <span class="text-[12px] text-muted flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8D600" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                ${meta.facility}
              </span>
              <a href="${meta.trialLink}" class="text-[12.5px] font-bold text-lime-dark hover:underline flex items-center gap-1">Book Trial &rarr;</a>
            </div>
          </div>
        </div>
      `;
    }

    if (scheduleTable) {
      scheduleTable.innerHTML = data.map(d => `
        <div class="sched-col ${d.rest ? 'is-rest' : ''}">
          <div class="sched-col-header">
            <span class="sched-day">${d.day}</span>
            ${d.focus ? `<span class="sched-pill ${d.rest ? 'sched-pill-rest' : ''}">${d.focus}</span>` : ''}
          </div>
          <h4 class="sched-title">${d.title}</h4>
          <ul class="sched-drills">
            ${(d.drills || []).map(drill => `<li><span class="sched-dot">&bull;</span><span>${drill}</span></li>`).join('')}
          </ul>
          <div class="sched-footer">
            <div class="sched-time-wrap">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="sched-time">${d.time}</span>
            </div>
            ${d.batch ? `<span class="sched-batch">${d.batch}</span>` : ''}
          </div>
        </div>
      `).join('');
    }
  }

  sportTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sportTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      renderSchedule(tab.dataset.sport);
    });
  });

  renderSchedule('football');

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- Level path hover-as-active on desktop ---------- */
  const levelBlocks = document.querySelectorAll('.level-block');
  levelBlocks.forEach(block => {
    block.addEventListener('mouseenter', () => {
      levelBlocks.forEach(b => b.classList.remove('is-active'));
      block.classList.add('is-active');
    });
  });

});
