/* ============================================================
   SCROLLYTELLING.JS  v3 — Forbidden Space
   
   Alur lengkap:
   
   ① HERO ENTRANCE (page load)
      - Semua elemen hero (.hero-enter) animate in bertahap
   
   ② HERO → OVERVIEW
      - Tunggu hero entrance selesai (atau skip jika sudah selesai)
      - Jalankan hero EXIT animation (.hero-leave)
      - Setelah exit selesai → slide panel hero ke atas
      - Overview panel snap dari bawah
      - Video play forward
      - Overview entrance animation (.ov-enter) jalan
   
   ③ OVERVIEW → HERO (reverse)
      - Jalankan overview EXIT animation (.ov-leave)
      - Setelah exit selesai → video mulai reverse frame-by-frame
      - Saat video reverse mencapai 0 → slide panel overview ke bawah
      - Hero panel snap dari atas
      - Hero entrance animation jalan ulang
   
============================================================ */

(function initScrollytelling() {

  /* ── GUARD ── */
  const heroEl     = document.getElementById('hero');
  const overviewEl = document.getElementById('overview');
  if (!heroEl || !overviewEl) return;

  /* ── CONFIG ── */
  const VIDEO_SRC      = '../../Assets/project/game/ForbiddenSpace/Motion/Godd2.mp4';
  const REVERSE_SPEED  = 3.0;         // frame mundur per RAF tick (fps = REVERSE_SPEED * 60 fps efektif)
  const PANEL_DUR      = 700;         // ms durasi slide panel CSS
  const COOL           = 1000;        // cooldown antar navigasi

  /* ── STATE ── */
  let currentSection  = 'hero';
  let isAnimating     = false;
  let heroEntranceDone = false;
  let lastNav         = 0;
  let reverseRafId    = null;

  /* ── TIMING: durasi animasi per fase (ms) ── */
  const HERO_EXIT_DUR     = 650;   // durasi CSS exit animation hero
  const OV_ENTER_DUR      = 800;   // durasi CSS entrance animation overview
  const OV_EXIT_DUR       = 600;   // durasi CSS exit animation overview
  const HERO_ENTER_DUR    = 750;   // durasi CSS entrance animation hero (re-enter)

  /* ══════════════════════════════════════════════════
     VIDEO SETUP
  ══════════════════════════════════════════════════ */
  const videoWrap   = document.createElement('div');
  videoWrap.className = 'ov-video-bg';

  const video = document.createElement('video');
  video.src          = VIDEO_SRC;
  video.muted        = true;
  video.playsInline  = true;
  video.preload      = 'auto';
  video.loop         = false;
  video.className    = 'ov-bg-video';

  const videoOverlay = document.createElement('div');
  videoOverlay.className = 'ov-video-overlay';

  videoWrap.appendChild(video);
  videoWrap.appendChild(videoOverlay);

  const ovSection = overviewEl.querySelector('section.fs-overview') || overviewEl;
  ovSection.style.position = 'relative';
  ovSection.insertAdjacentElement('afterbegin', videoWrap);

  video.load();

  /* ── Saat video selesai forward → freeze di frame terakhir ── */
  video.addEventListener('ended', () => {
    video.currentTime = video.duration || video.currentTime;
    video.pause();
  });

  /* ══════════════════════════════════════════════════
     INITIAL STATE
  ══════════════════════════════════════════════════ */
  document.body.classList.add('snap-mode');

  /* Hero: positioned fixed, mulai state hidden lalu entrance */
  heroEl.style.cssText = `
    position: fixed; inset: 0; width: 100%; height: 100%;
    overflow: hidden; z-index: 10;
    will-change: transform, opacity;
  `;

  /* Overview: positioned fixed, tersembunyi di bawah */
  overviewEl.style.cssText = `
    position: fixed; inset: 0; width: 100%; height: 100%;
    overflow-y: auto; overflow-x: hidden; z-index: 9;
    will-change: transform, opacity;
    transform: translateY(100%); opacity: 0; pointer-events: none;
  `;

  /* Rest sections: di bawah layar, z-index rendah */
  let restWrapper = buildRestSections();

  /* ══════════════════════════════════════════════════
     REST SECTIONS WRAPPER
  ══════════════════════════════════════════════════ */
  function buildRestSections() {
    let wrapper = document.getElementById('rest-sections');
    if (wrapper) return wrapper;

    const siblings = [];
    let sib = overviewEl.nextElementSibling;
    while (sib) {
      siblings.push(sib);
      sib = sib.nextElementSibling;
    }

    if (!siblings.length) return null;

    wrapper = document.createElement('div');
    wrapper.id = 'rest-sections';
    siblings[0].parentNode.insertBefore(wrapper, siblings[0]);
    siblings.forEach(el => wrapper.appendChild(el));
    return wrapper;
  }

  /* ══════════════════════════════════════════════════
     HERO ENTRANCE ANIMATION (page load)
  ══════════════════════════════════════════════════ */
  const HERO_ENTER_ITEMS = [
    { sel: '.fs-hero-meta',     cls: 'hero-anim-enter', delay: 0   },
    { sel: '.fs-hero-title',    cls: 'hero-anim-enter', delay: 120 },
    { sel: '.fs-hero-tagline',  cls: 'hero-anim-enter', delay: 240 },
    { sel: '.fs-hero-role',     cls: 'hero-anim-enter', delay: 340 },
    { sel: '.fs-hero-actions',  cls: 'hero-anim-enter', delay: 440 },
    { sel: '.fs-hero-visual',   cls: 'hero-anim-enter', delay: 150 },
    { sel: '.scroll-cue',       cls: 'hero-anim-enter', delay: 600 },
  ];

  function runHeroEntrance() {
    /* Reset semua elemen ke state hidden */
    HERO_ENTER_ITEMS.forEach(({ sel }) => {
      const el = heroEl.querySelector(sel);
      if (!el) return;
      el.classList.remove('hero-anim-enter', 'hero-anim-leave');
      el.style.opacity   = '0';
      el.style.transform = 'translateY(28px)';
    });

    /* Animasikan masuk satu per satu */
    let maxEnd = 0;
    HERO_ENTER_ITEMS.forEach(({ sel, delay }) => {
      const el = heroEl.querySelector(sel);
      if (!el) return;
      const end = delay + HERO_ENTER_DUR;
      if (end > maxEnd) maxEnd = end;

      setTimeout(() => {
        el.style.transition = `opacity ${HERO_ENTER_DUR}ms cubic-bezier(0.16,1,0.3,1) ${0}ms,
                               transform ${HERO_ENTER_DUR}ms cubic-bezier(0.16,1,0.3,1) ${0}ms`;
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
    });

    return maxEnd; /* total durasi entrance */
  }

  /* Hero EXIT animation — elemen drift ke atas sambil fade */
  function runHeroExit(direction = 'up') {
    return new Promise(resolve => {
      const yDir = direction === 'up' ? '-20px' : '20px';

      HERO_ENTER_ITEMS.forEach(({ sel, delay }, i) => {
        const el = heroEl.querySelector(sel);
        if (!el) return;
        const staggerDelay = i * 30; /* exit cepat, stagger tipis */

        setTimeout(() => {
          el.style.transition = `opacity ${HERO_EXIT_DUR * 0.7}ms ease ${0}ms,
                                 transform ${HERO_EXIT_DUR * 0.8}ms cubic-bezier(0.4,0,1,1) ${0}ms`;
          el.style.opacity   = '0';
          el.style.transform = `translateY(${yDir})`;
        }, staggerDelay);
      });

      setTimeout(resolve, HERO_EXIT_DUR);
    });
  }

  /* ══════════════════════════════════════════════════
     OVERVIEW ENTRANCE ANIMATION
  ══════════════════════════════════════════════════ */
  const OV_ENTER_ITEMS = [
    { sel: '.section-eyebrow',    delay: 0   },
    { sel: '.overview-text h2',   delay: 100 },
    { sel: '.overview-text p',    delay: 200 },
    { sel: '.overview-stats',     delay: 320 },
    { sel: '.stat-item',          delay: 380, stagger: 80 },
    { sel: '.overview-scroll-hint', delay: 700 },
  ];

  function resetOverviewItems() {
    OV_ENTER_ITEMS.forEach(({ sel, stagger }) => {
      if (stagger) {
        overviewEl.querySelectorAll(sel).forEach(el => {
          el.style.opacity   = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = '';
        });
      } else {
        const el = overviewEl.querySelector(sel);
        if (!el) return;
        el.style.opacity   = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = '';
      }
    });
  }

  function runOverviewEntrance() {
    OV_ENTER_ITEMS.forEach(({ sel, delay, stagger }) => {
      if (stagger) {
        overviewEl.querySelectorAll(sel).forEach((el, i) => {
          setTimeout(() => {
            el.style.transition = `opacity ${OV_ENTER_DUR}ms cubic-bezier(0.16,1,0.3,1),
                                   transform ${OV_ENTER_DUR}ms cubic-bezier(0.16,1,0.3,1)`;
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
          }, delay + i * stagger);
        });
      } else {
        const el = overviewEl.querySelector(sel);
        if (!el) return;
        setTimeout(() => {
          el.style.transition = `opacity ${OV_ENTER_DUR}ms cubic-bezier(0.16,1,0.3,1),
                                 transform ${OV_ENTER_DUR}ms cubic-bezier(0.16,1,0.3,1)`;
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
      }
    });
  }

  /* Overview EXIT animation */
  function runOverviewExit() {
    return new Promise(resolve => {
      const items = OV_ENTER_ITEMS.slice().reverse();
      items.forEach(({ sel, stagger }, i) => {
        const delay = i * 40;
        if (stagger) {
          overviewEl.querySelectorAll(sel).forEach((el, j) => {
            setTimeout(() => {
              el.style.transition = `opacity ${OV_EXIT_DUR * 0.7}ms ease,
                                     transform ${OV_EXIT_DUR * 0.7}ms cubic-bezier(0.4,0,1,1)`;
              el.style.opacity   = '0';
              el.style.transform = 'translateY(-16px)';
            }, delay + j * 30);
          });
        } else {
          const el = overviewEl.querySelector(sel);
          if (!el) return;
          setTimeout(() => {
            el.style.transition = `opacity ${OV_EXIT_DUR * 0.7}ms ease,
                                   transform ${OV_EXIT_DUR * 0.7}ms cubic-bezier(0.4,0,1,1)`;
            el.style.opacity   = '0';
            el.style.transform = 'translateY(-16px)';
          }, delay);
        }
      });

      setTimeout(resolve, OV_EXIT_DUR);
    });
  }

  /* ══════════════════════════════════════════════════
     VIDEO CONTROL
  ══════════════════════════════════════════════════ */
  function playVideoForward() {
    cancelReverseRaf();
    video.playbackRate = 1.0;

    if (!video.duration || video.currentTime >= video.duration - 0.05) {
      video.currentTime = 0;
    }

    video.play().catch(() => {});
  }

  function cancelReverseRaf() {
    if (reverseRafId) {
      cancelAnimationFrame(reverseRafId);
      reverseRafId = null;
    }
  }

  /* Reverse video frame-by-frame → returns Promise yang resolve saat currentTime <= 0 */
  function playVideoReverse() {
    return new Promise(resolve => {
      cancelReverseRaf();
      video.pause();

      if (!video.duration || video.currentTime <= 0.05) {
        video.currentTime = 0;
        resolve();
        return;
      }

      const STEP = (1 / 60) * REVERSE_SPEED; /* mundur sekian detik per frame ~60fps */

      function step() {
        if (video.currentTime <= STEP) {
          video.currentTime = 0;
          resolve();
          return;
        }
        video.currentTime = Math.max(0, video.currentTime - STEP);
        reverseRafId = requestAnimationFrame(step);
      }

      reverseRafId = requestAnimationFrame(step);
    });
  }

  /* ══════════════════════════════════════════════════
     PANEL SLIDE HELPERS
  ══════════════════════════════════════════════════ */
  function setPanelStyle(el, props) {
    Object.assign(el.style, props);
  }

  function slidePanel(el, from, to, dur = PANEL_DUR) {
    return new Promise(resolve => {
      setPanelStyle(el, {
        transition: 'none',
        transform:  from.transform  || '',
        opacity:    from.opacity    || '',
      });

      /* Force reflow */
      void el.getBoundingClientRect();

      setPanelStyle(el, {
        transition: `transform ${dur}ms cubic-bezier(0.16,1,0.3,1),
                     opacity   ${dur * 0.8}ms ease`,
        transform:  to.transform || 'translateY(0)',
        opacity:    to.opacity   || '1',
      });

      setTimeout(resolve, dur);
    });
  }

  /* ══════════════════════════════════════════════════
     TRANSITION: HERO → OVERVIEW
  ══════════════════════════════════════════════════ */
  async function transitionToOverview() {
    if (isAnimating || currentSection === 'overview') return;

    const now = performance.now();
    if (now - lastNav < COOL) return;

    isAnimating = true;
    lastNav     = now;

    /* 1. Jalankan hero EXIT animation */
    await runHeroExit('up');

    /* 2. Slide hero panel ke atas sambil overview snap dari bawah */
    resetOverviewItems(); /* pastikan overview items di-reset sebelum visible */

    /* Aktifkan video di-preload/fade-in */
    videoWrap.classList.remove('ov-video-hidden');

    /* Mulai slide kedua panel paralel */
    const slideHeroOut = slidePanel(
      heroEl,
      { transform: 'translateY(0)',    opacity: '0' },
      { transform: 'translateY(-10%)', opacity: '0' }
    );

    /* Overview mulai dari bawah */
    setPanelStyle(overviewEl, {
      transform:    'translateY(100%)',
      opacity:      '0',
      pointerEvents:'none',
      transition:   'none',
    });
    void overviewEl.getBoundingClientRect();

    setPanelStyle(overviewEl, {
      transition: `transform ${PANEL_DUR}ms cubic-bezier(0.16,1,0.3,1),
                   opacity   ${PANEL_DUR * 0.8}ms ease`,
      transform:  'translateY(0)',
      opacity:    '1',
      pointerEvents: 'auto',
    });

    await slideHeroOut;

    /* Sembunyikan hero (tidak perlu render) */
    setPanelStyle(heroEl, { visibility: 'hidden', pointerEvents: 'none' });

    /* 3. Play video forward */
    playVideoForward();

    /* 4. Overview entrance animation (sedikit delay setelah panel muncul) */
    setTimeout(() => {
      runOverviewEntrance();
    }, 80);

    currentSection = 'overview';
    isAnimating    = false;
  }

  /* ══════════════════════════════════════════════════
     TRANSITION: OVERVIEW → HERO
  ══════════════════════════════════════════════════ */
  async function transitionToHero() {
    if (isAnimating || currentSection === 'hero') return;

    const now = performance.now();
    if (now - lastNav < COOL) return;

    isAnimating = true;
    lastNav     = now;

    /* 1. Jalankan overview EXIT animation */
    await runOverviewExit();

    /* 2. Video reverse (paralel dengan panel slide prep) */
    const reversePromise = playVideoReverse();

    /* 3. Prepare hero di belakang overview */
    setPanelStyle(heroEl, {
      visibility:   'visible',
      transform:    'translateY(-8%)',
      opacity:      '0',
      pointerEvents:'none',
      transition:   'none',
    });

    /* 4. Tunggu video reverse selesai */
    await reversePromise;

    /* 5. Slide overview turun keluar, hero masuk dari atas */
    const slideOvOut = slidePanel(
      overviewEl,
      { transform: 'translateY(0)', opacity: '1' },
      { transform: 'translateY(100%)', opacity: '0' }
    );

    /* Hero slide masuk dari atas */
    void heroEl.getBoundingClientRect();
    setPanelStyle(heroEl, {
      transition: `transform ${PANEL_DUR}ms cubic-bezier(0.16,1,0.3,1),
                   opacity   ${PANEL_DUR * 0.8}ms ease`,
      transform:  'translateY(0)',
      opacity:    '1',
    });

    await slideOvOut;

    /* Reset overview */
    setPanelStyle(overviewEl, {
      transform:    'translateY(100%)',
      opacity:      '0',
      pointerEvents:'none',
      transition:   'none',
    });
    videoWrap.classList.add('ov-video-hidden');

    /* 6. Hero entrance animation ulang */
    setPanelStyle(heroEl, { pointerEvents: 'auto' });
    runHeroEntrance();

    currentSection = 'overview'; /* sebelum reset, pastikan logic di bawah benar */
    currentSection = 'hero';
    isAnimating    = false;
  }

  /* ══════════════════════════════════════════════════
     SNAP RELEASE — masuk ke rest sections
  ══════════════════════════════════════════════════ */
  let snapReleased = false;

  function releaseSnap() {
    if (snapReleased) return;
    snapReleased = true;

    /* Lepas overview dari fixed ke flow normal */
    setPanelStyle(overviewEl, {
      position:   'relative',
      transform:  'none',
      opacity:    '1',
      height:     '',
      overflow:   '',
    });

    /* Sembunyikan hero */
    heroEl.style.display = 'none';

    document.body.classList.remove('snap-mode');
    document.body.classList.add('snap-released');

    const rest = document.getElementById('rest-sections');
    if (rest) rest.scrollIntoView({ behavior: 'smooth' });
  }

  function reengageSnap() {
    if (!snapReleased) return;
    snapReleased = false;

    heroEl.style.display = '';
    setPanelStyle(heroEl, {
      position:   'fixed',
      inset:      '0',
      width:      '100%',
      height:     '100%',
      overflow:   'hidden',
      zIndex:     '10',
    });

    document.body.classList.add('snap-mode');
    document.body.classList.remove('snap-released');

    currentSection = 'overview';
  }

  /* ══════════════════════════════════════════════════
     INPUT HANDLERS
  ══════════════════════════════════════════════════ */
  function handleDown() {
    if (currentSection === 'hero') {
      transitionToOverview();
      return;
    }

    if (currentSection === 'overview' && !snapReleased) {
      const atBottom = overviewEl.scrollTop + overviewEl.clientHeight >= overviewEl.scrollHeight - 4;
      const noScroll = overviewEl.scrollHeight <= overviewEl.clientHeight + 4;
      if (atBottom || noScroll) releaseSnap();
    }
  }

  function handleUp() {
    if (snapReleased) {
      const pageTop = window.scrollY || document.documentElement.scrollTop;
      if (pageTop <= 4) reengageSnap();
      return;
    }

    if (currentSection === 'overview') {
      const atTop = (overviewEl.scrollTop || 0) <= 4;
      if (!atTop) return; /* biarkan scroll internal dulu */
      transitionToHero();
    }
  }

  /* Wheel */
  let wheelAcc  = 0;
  let lastWheel = 0;
  const WHEEL_THRESH = 80;
  const WHEEL_COOL   = 500;

  window.addEventListener('wheel', (e) => {
    if (isAnimating) return;

    const now = Date.now();
    if (now - lastWheel > WHEEL_COOL) wheelAcc = 0;
    lastWheel = now;

    /* Kalau di overview & belum di atas, biarkan scroll internal */
    if (currentSection === 'overview' && e.deltaY < 0) {
      if ((overviewEl.scrollTop || 0) > 10) return;
    }

    wheelAcc += e.deltaY;
    if (Math.abs(wheelAcc) >= WHEEL_THRESH) {
      if (wheelAcc > 0) handleDown();
      else              handleUp();
      wheelAcc = 0;
    }
  }, { passive: true });

  /* Touch */
  let touchY = 0;
  const SWIPE_MIN = 55;

  window.addEventListener('touchstart', e => {
    touchY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', e => {
    if (isAnimating) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < SWIPE_MIN) return;
    if (dy > 0) handleDown();
    else        handleUp();
  }, { passive: true });

  /* Keyboard */
  document.addEventListener('keydown', e => {
    if (isAnimating) return;
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') handleDown();
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   handleUp();
  });

  /* Nav links */
  document.querySelectorAll('a[href="#overview"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (currentSection !== 'overview') transitionToOverview();
    });
  });

  /* Scroll cue */
  const scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      if (currentSection === 'hero') transitionToOverview();
    });
  }

  /* ══════════════════════════════════════════════════
     REDUCED MOTION
  ══════════════════════════════════════════════════ */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    videoWrap.style.display = 'none';
  }

  /* ══════════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════════ */
  window.SnapNav = {
    toOverview: transitionToOverview,
    toHero:     transitionToHero,
    current:    () => currentSection,
  };

  /* ══════════════════════════════════════════════════
     START — jalankan hero entrance saat halaman load
  ══════════════════════════════════════════════════ */
  /* Set semua hero items ke opacity 0 dulu */
  HERO_ENTER_ITEMS.forEach(({ sel }) => {
    const el = heroEl.querySelector(sel);
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
  });

  /* Jalankan entrance sedikit setelah DOMContentLoaded */
  const totalEntrance = runHeroEntrance();
  setTimeout(() => {
    heroEntranceDone = true;
  }, totalEntrance + 100);

})();