// ============================================
// CHAMPION SPORTS ACADEMY — SPORTS PROGRAMS SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     THEME SYSTEM
     ============================================ */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const iconMoon = document.getElementById('icon-moon');
  const iconSun = document.getElementById('icon-sun');
  const iconMoonM = document.querySelector('.icon-moon-m');
  const iconSunM = document.querySelector('.icon-sun-m');

  function reflectThemeIcons(theme) {
    const isLight = theme === 'light';
    iconMoon && iconMoon.classList.toggle('hidden', isLight);
    iconSun && iconSun.classList.toggle('hidden', !isLight);
    iconMoonM && iconMoonM.classList.toggle('hidden', isLight);
    iconSunM && iconSunM.classList.toggle('hidden', !isLight);
    const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    themeToggle && themeToggle.setAttribute('aria-label', label);
    themeToggleMobile && themeToggleMobile.setAttribute('aria-label', label);
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('csa-theme', theme);
    reflectThemeIcons(theme);
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  reflectThemeIcons(root.getAttribute('data-theme') || 'dark');
  themeToggle && themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile && themeToggleMobile.addEventListener('click', toggleTheme);

  /* ============================================
     RTL SYSTEM
     ============================================ */
  const rtlToggle       = document.getElementById('rtl-toggle');
  const rtlToggleMobile = document.getElementById('rtl-toggle-mobile');

  function reflectRTL(isRTL) {
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    if (rtlToggle) rtlToggle.setAttribute('aria-pressed', String(isRTL));
    if (rtlToggleMobile) rtlToggleMobile.setAttribute('aria-pressed', String(isRTL));
  }

  function toggleRTL() {
    const isRTL = root.getAttribute('dir') !== 'rtl';
    reflectRTL(isRTL);
    localStorage.setItem('csa-rtl', String(isRTL));
  }

  const savedRTL = localStorage.getItem('csa-rtl') === 'true';
  reflectRTL(savedRTL);
  rtlToggle       && rtlToggle.addEventListener('click', toggleRTL);
  rtlToggleMobile && rtlToggleMobile.addEventListener('click', toggleRTL);

  /* ============================================
     MOBILE NAVIGATION
     ============================================ */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileMenu.classList.toggle('hidden', !isOpen);
      mobileMenu.classList.toggle('flex', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open', 'flex');
        mobileMenu.classList.add('hidden');
      });
    });
  }

  /* ============================================
     HEADER SCROLL SHADOW
     ============================================ */
  const header = document.getElementById('site-header');
  function updateHeaderShadow() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });

  /* ============================================
     SPORT DATA
     ============================================ */
  const sportsData = {
    football: {
      name: 'Football Program',
      tagline: 'Technical Precision, Positional Mastery & Fast-Paced Matchplay',
      description: 'A comprehensive curriculum compounding technical touch, passing speed, pressing structure, positional discipline and high-intensity match IQ.',
      age: '5+ years',
      levels: ['Beginner (5-8)', 'Developing (9-13)', 'Advanced (14-16)', 'Elite Squads (17+)'],
      coachRatio: '8:1 Athlete to Coach',
      coachCert: 'UEFA / State Licensed Staff',
      surface: 'FIFA Quality Pro Artificial Turf',
      telemetry: 'Quarterly Speed & Sprint Tracking',
      curriculum: [
        { title: 'Ball Mastery & 1v1 Dominance', desc: 'First touch control, turning, dribbling in tight channels, and defensive shielding.' },
        { title: 'Passing Tempo & Support Angles', desc: 'One-touch distribution, wall passes, switching play, and diagonal penetrations.' },
        { title: 'Tactical Structure & Pressing', desc: 'Compact defensive lines, transition triggers, counter-pressing, and set-piece execution.' }
      ],
      milestones: [
        { stage: 'Stage 1 (Grassroots)', desc: 'Movement literacy, ball coordination and fun competitive small-sided games.' },
        { stage: 'Stage 2 (Foundation)', desc: 'Positional awareness, tactical communication, and structured team play.' },
        { stage: 'Stage 3 (Performance)', desc: 'Full 11v11 matchplay, video review, speed periodization, and regional tournaments.' }
      ],
      standards: [
        { label: 'Coach Credentials', desc: 'UEFA & AFC licensed staff with 8:1 maximum athlete-to-coach ratio.' },
        { label: 'Surface Quality', desc: 'FIFA Quality Pro artificial turf with shock-pad underlayment.' },
        { label: 'Performance Telemetry', desc: 'Laser sprint timing gates, agility metrics & quarterly biometric reports.' }
      ],
      schedule: [
        { day: 'MON', title: 'Skills Training', time: '5:30 PM – 7:00 PM' },
        { day: 'TUE', title: 'Fitness & Agility', time: '5:30 PM – 6:30 PM' },
        { day: 'WED', title: 'Tactical Play', time: '5:30 PM – 7:00 PM' },
        { day: 'THU', title: 'Mobility Work', time: 'Flexible Timings' },
        { day: 'FRI', title: 'Match Practice', time: '5:30 PM – 7:00 PM' },
        { day: 'SAT', title: 'Weekend League', time: '9:00 AM – 11:00 AM' },
        { day: 'SUN', title: 'Active Recovery', time: 'Rest & Recovery', rest: true },
      ],
      scheduleNote: "Schedules vary by age group, level and sport. Here's a sample week for a Developing Football program.",
    },
    basketball: {
      name: 'Basketball Program',
      tagline: 'Handles, Shot Mechanics, Court Vision & Transition Offense',
      description: 'Refining biomechanical shooting form, two-ball dribbling under contact, pick-and-roll reads, fastbreak spacing and perimeter defense.',
      age: '8+ years',
      levels: ['Beginner (8-10)', 'Developing (11-13)', 'Advanced (14-16)', 'Varsity Squad (17+)'],
      coachRatio: '6:1 Athlete to Coach',
      coachCert: 'FIBA / National Certified Coaches',
      surface: 'Shock-Absorbent Maple Wood Hardwood Courts',
      telemetry: 'Vertical Jump & Shot Arc Analysis',
      curriculum: [
        { title: 'Ball Handling & Separation', desc: 'Crossover counters, hesitation moves, retreat dribbles and attacking closeouts.' },
        { title: 'Shooting Form & Catch-and-Shoot', desc: 'Arc optimization, balance hand release, free-throw consistency and pull-up jumpers.' },
        { title: 'Defensive Stance & Help Rotation', desc: 'Denying passing lanes, boxing out, screen coverage and transition defense.' }
      ],
      milestones: [
        { stage: 'Stage 1 (Fundamentals)', desc: 'Dribbling rhythm, layup footwork, passing accuracy and basic court rules.' },
        { stage: 'Stage 2 (Development)', desc: 'Pick-and-roll execution, fastbreak spacing and full-court scrimmage habits.' },
        { stage: 'Stage 3 (Championship)', desc: 'High-tempo 5v5 tournament play, video scouting and collegiate showcase preparation.' }
      ],
      standards: [
        { label: 'Coach Credentials', desc: 'FIBA & National certified coaching staff with 6:1 player-to-coach ratio.' },
        { label: 'Surface Quality', desc: 'Shock-absorbent maple wood hardwood courts with electronic scoreboards.' },
        { label: 'Performance Telemetry', desc: 'Vertical jump testing, shot-release arc analysis & speed telemetry.' }
      ],
      schedule: [
        { day: 'MON', title: 'Ball Handling', time: '5:00 PM – 6:30 PM' },
        { day: 'TUE', title: 'Shooting Reps', time: '5:00 PM – 6:30 PM' },
        { day: 'WED', title: 'Tactical Play', time: '5:00 PM – 6:30 PM' },
        { day: 'THU', title: 'Mobility Work', time: 'Flexible Timings' },
        { day: 'FRI', title: 'Defense Drills', time: '5:00 PM – 6:30 PM' },
        { day: 'SAT', title: 'Weekend League', time: '9:00 AM – 11:00 AM' },
        { day: 'SUN', title: 'Active Recovery', time: 'Rest & Recovery', rest: true },
      ],
      scheduleNote: "Schedules vary by age group, level and sport. Here's a sample week for a Developing Basketball program.",
    },
    badminton: {
      name: 'Badminton Program',
      tagline: 'Explosive Footwork, Racket Speed, Smashes & Rally Control',
      description: 'Developing lightning-quick multi-directional split steps, wrist snap power, net deception, deceptive drops and match stamina.',
      age: '7+ years',
      levels: ['Beginner (7-9)', 'Developing (10-12)', 'Advanced (13-15)', 'Tournament Squad (16+)'],
      coachRatio: '4:1 Athlete to Coach',
      coachCert: 'BWF Certified International Coaches',
      surface: 'BWF Standard Multi-Layered Synthetic Courts',
      telemetry: 'Agility Gate & Smash Speed Telemetry',
      curriculum: [
        { title: '6-Corner Footwork Dynamics', desc: 'Split-step timing, lunging recovery, shadow footwork and court coverage.' },
        { title: 'Shot Variety & Stroke Mechanics', desc: 'Forehand/backhand clears, tumbling net shots, drops, drives and steep smashes.' },
        { title: 'Match Strategy & Tactical Mindset', desc: 'Singles court manipulation, doubles rotation patterns and pressure handling.' }
      ],
      milestones: [
        { stage: 'Stage 1 (Foundation)', desc: 'Grip techniques, balance posture, basic clears and shuttle hand-eye tracking.' },
        { stage: 'Stage 2 (Intermediate)', desc: 'Smash-and-net combinations, serve variations and fast doubles counter-rallies.' },
        { stage: 'Stage 3 (Competitive)', desc: 'State-ranking circuit prep, high-tempo sparring and tactical match video analytics.' }
      ],
      standards: [
        { label: 'Coach Credentials', desc: 'BWF certified international coaches with 4:1 personalized court ratio.' },
        { label: 'Surface Quality', desc: 'BWF standard multi-layered synthetic shock-absorbing mat courts.' },
        { label: 'Performance Telemetry', desc: 'High-speed smash velocity radar, agility gate tests & recovery metrics.' }
      ],
      schedule: [
        { day: 'MON', title: 'Footwork Drills', time: '4:30 PM – 6:00 PM' },
        { day: 'TUE', title: 'Racket Technique', time: '4:30 PM – 6:00 PM' },
        { day: 'WED', title: 'Rally & Control', time: '4:30 PM – 6:00 PM' },
        { day: 'THU', title: 'Mobility Work', time: 'Flexible Timings' },
        { day: 'FRI', title: 'Match Practice', time: '4:30 PM – 6:00 PM' },
        { day: 'SAT', title: 'Weekend Doubles', time: '9:00 AM – 10:30 AM' },
        { day: 'SUN', title: 'Active Recovery', time: 'Rest & Recovery', rest: true },
      ],
      scheduleNote: "Schedules vary by age group, level and sport. Here's a sample week for a Developing Badminton program.",
    },
    athletics: {
      name: 'Athletics & Track Program',
      tagline: 'Sprint Mechanics, Acceleration, Endurance & Core Power',
      description: 'Scientific running biomechanics, block starts, anaerobic power periodization, hurdle agility, pacing strategies and race preparation.',
      age: '8+ years',
      levels: ['Foundation (8-10)', 'Developing (11-13)', 'Advanced (14-16)', 'State Squad (17+)'],
      coachRatio: '8:1 Athlete to Coach',
      coachCert: 'World Athletics Certified Coaches',
      surface: '8-Lane Full Olympic Synthetic Tartan Track',
      telemetry: 'Laser Photocell Sprint Gates',
      curriculum: [
        { title: 'Sprint Biomechanics & Drive Phase', desc: 'Knee drive posture, arm swing velocity, ground contact force and acceleration angles.' },
        { title: 'Endurance & Lactate Threshold', desc: 'Interval tempo runs, aerobic base compounding, pacing splits and breathing rhythm.' },
        { title: 'Explosive Power & Plyometrics', desc: 'Bound drills, box jumps, resistance band sprints and core rotational stability.' }
      ],
      milestones: [
        { stage: 'Stage 1 (Fundamentals)', desc: 'Form posture, stride rhythm, kinetic flexibility and fun obstacle relays.' },
        { stage: 'Stage 2 (Track Development)', desc: 'Starting block mastery, hurdle clearance, baton exchange and 100m-800m splits.' },
        { stage: 'Stage 3 (Elite Timing)', desc: 'National qualifying benchmarks, laser-timed time trials and peak periodization.' }
      ],
      standards: [
        { label: 'Coach Credentials', desc: 'World Athletics certified sprint & endurance coaches with 8:1 cohort ratio.' },
        { label: 'Surface Quality', desc: '8-lane Olympic standard synthetic tartan track with all-weather drainage.' },
        { label: 'Performance Telemetry', desc: 'Laser photocell timing gates (10m, 30m, 100m) & jump height telemetry.' }
      ],
      schedule: [
        { day: 'MON', title: 'Sprint Mechanics', time: '6:00 AM – 7:30 AM' },
        { day: 'TUE', title: 'Strength Training', time: '6:00 AM – 7:00 AM' },
        { day: 'WED', title: 'Endurance Runs', time: '6:00 AM – 7:30 AM' },
        { day: 'THU', title: 'Mobility Work', time: 'Flexible Timings' },
        { day: 'FRI', title: 'Track & Hurdles', time: '6:00 AM – 7:30 AM' },
        { day: 'SAT', title: 'Laser Trials', time: '7:00 AM – 9:00 AM' },
        { day: 'SUN', title: 'Active Recovery', time: 'Rest & Recovery', rest: true },
      ],
      scheduleNote: "Schedules vary by age group, level and sport. Here's a sample week for a Developing Athletics program.",
    },
  };

  let currentSport = 'football';
  let currentLevel = 'beginner';

  /* ============================================
     SPORT SELECTOR & CURRICULUM EXPLORER
     ============================================ */
  const sportTabs = document.querySelectorAll('.sport-tab');
  const sportPanel = document.getElementById('sportPanel');
  const scheduleTable = document.getElementById('scheduleTable');
  const scheduleDesc = document.getElementById('scheduleDesc');
  const levelNote = document.getElementById('levelNote');

  function renderSportPanel(sportKey) {
    const s = sportsData[sportKey];
    if (!s || !sportPanel) return;

    sportPanel.innerHTML = `
      <div class="curriculum-explorer-card bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm reveal-up">
        
        <!-- Header Row -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div class="flex flex-wrap items-center gap-2.5 mb-2">
              <span class="curriculum-badge bg-lime text-navy font-display font-extrabold text-[11.5px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">${s.name}</span>
              <span class="text-muted text-[12.5px] font-semibold">${s.age}</span>
              <span class="text-muted/40 font-bold hidden sm:inline">&bull;</span>
              <span class="text-muted text-[12.5px] font-semibold">${s.coachRatio}</span>
            </div>
            <h3 class="font-display font-extrabold text-[22px] sm:text-[26px] text-dark-text tracking-tight">${s.tagline}</h3>
            <p class="text-muted text-[14.5px] leading-relaxed mt-2 max-w-3xl">${s.description}</p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <a href="contact.html?sport=${sportKey}" class="btn-lime">Book a Trial &rarr;</a>
          </div>
        </div>

        <!-- 3-Column Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-stretch">
          
          <!-- Bento 1: Core Methodology Pillars -->
          <div class="bento-curriculum-col p-5 rounded-xl bg-soft border border-border flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2.5 mb-4">
                <span class="w-8 h-8 rounded-lg bg-lime text-navy flex items-center justify-center font-display font-black text-xs shrink-0 shadow-sm">01</span>
                <h4 class="font-display font-bold text-dark-text text-[15px]">Core Curriculum Pillars</h4>
              </div>
              <div class="space-y-3.5">
                ${s.curriculum.map(c => `
                  <div class="text-left">
                    <p class="text-[13px] font-bold text-dark-text flex items-center gap-1.5">
                      <svg class="text-lime shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      ${c.title}
                    </p>
                    <p class="text-[12px] text-muted leading-relaxed pl-5 mt-0.5">${c.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="pt-4 mt-4 border-t border-border/80 flex items-center justify-between text-xs text-muted">
              <span>Sessions: 75–90 mins</span>
              <span class="font-semibold text-lime">Skill Evaluated</span>
            </div>
          </div>

          <!-- Bento 2: Progression Roadmaps -->
          <div class="bento-curriculum-col p-5 rounded-xl bg-soft border border-border flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2.5 mb-4">
                <span class="w-8 h-8 rounded-lg bg-lime text-navy flex items-center justify-center font-display font-black text-xs shrink-0 shadow-sm">02</span>
                <h4 class="font-display font-bold text-dark-text text-[15px]">Progression Milestones</h4>
              </div>
              <div class="space-y-3.5">
                ${s.milestones.map(m => `
                  <div class="text-left">
                    <p class="text-[13px] font-bold text-dark-text flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-lime shrink-0"></span>
                      ${m.stage}
                    </p>
                    <p class="text-[12px] text-muted leading-relaxed pl-3.5 mt-0.5">${m.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="pt-4 mt-4 border-t border-border/80 flex items-center justify-between text-xs text-muted">
              <span>All 4 Skill Levels</span>
              <span class="font-semibold text-lime">Quarterly Tests</span>
            </div>
          </div>

          <!-- Bento 3: Standards & Facility Specs -->
          <div class="bento-curriculum-col p-5 rounded-xl bg-soft border border-border flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2.5 mb-4">
                <span class="w-8 h-8 rounded-lg bg-lime text-navy flex items-center justify-center font-display font-black text-xs shrink-0 shadow-sm">03</span>
                <h4 class="font-display font-bold text-dark-text text-[15px]">Academy Standards</h4>
              </div>
              <div class="space-y-3.5">
                ${(s.standards || []).map(std => `
                  <div class="text-left">
                    <p class="text-[13px] font-bold text-dark-text flex items-center gap-1.5">
                      <svg class="text-lime shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      ${std.label}
                    </p>
                    <p class="text-[12px] text-muted leading-relaxed pl-5 mt-0.5">${std.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="pt-4 mt-4 border-t border-border/80 flex items-center justify-between text-xs text-muted">
              <span>Verified Safety</span>
              <span class="font-semibold text-lime">Certified Facilities</span>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  const dayIcons = {
    rest: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z" opacity="0"/><path d="M2 20V9a2 2 0 012-2h16a2 2 0 012 2v11M2 20h20M6 12h4v3H6z"/></svg>',
    default: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };

  function renderSchedule(sportKey) {
    const s = sportsData[sportKey];
    if (!s || !scheduleTable) return;
    scheduleTable.innerHTML = s.schedule.map(d => `
      <div class="sched-col ${d.rest ? 'is-rest' : ''}">
        <p class="sched-day-label">${d.day}</p>
        <span class="sched-icon">${d.rest ? dayIcons.rest : dayIcons.default}</span>
        <p class="sched-title">${d.title}</p>
        <p class="sched-time">${d.time}</p>
      </div>
    `).join('');
    if (scheduleDesc) scheduleDesc.textContent = s.scheduleNote;
  }

  function updateLevelNote() {
    if (!levelNote) return;
    const sportName = sportsData[currentSport].name;
    const levelName = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    levelNote.innerHTML = `Showing focus areas for <strong>${levelName} — ${sportName}</strong>.`;
  }

  function selectSport(sportKey) {
    currentSport = sportKey;
    sportTabs.forEach(tab => {
      const isActive = tab.dataset.sport === sportKey;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    renderSportPanel(sportKey);
    renderSchedule(sportKey);
    updateLevelNote();
  }

  sportTabs.forEach(tab => {
    tab.addEventListener('click', () => selectSport(tab.dataset.sport));
  });

  /* ============================================
     PROGRAM LEVELS
     ============================================ */
  const levelCards = document.querySelectorAll('.level-card');
  levelCards.forEach(card => {
    card.addEventListener('click', () => {
      levelCards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
      currentLevel = card.dataset.level;
      updateLevelNote();
    });
  });

  /* ---------- initial render ---------- */
  renderSportPanel(currentSport);
  renderSchedule(currentSport);
  updateLevelNote();

  /* ============================================
     FAQ ACCORDION
     ============================================ */
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

  /* ============================================
     SCROLL REVEAL
     ============================================ */
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
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ============================================
     ACTIVE NAV HIGHLIGHT (scrollspy-lite, in-page anchors)
     ============================================ */
  const navLinks = document.querySelectorAll('.header-link[href^="#"], .mobile-link[href^="#"]');
  if (navLinks.length) {
    // Only relevant when linking within the same page; left minimal by design.
  }

  /* ============================================
     BACK TO TOP
     ============================================ */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

});
