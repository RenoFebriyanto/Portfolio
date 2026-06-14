/* ============================================================
   SCROLLYTELLING.JS — Full-page snap navigation
   Hero ↔ Overview dengan video reverse literal

   Alur:
   - Hero: tampil normal, semua animasi jalan
   - Scroll down → hero slide up & fade out
                 → overview snap in dari bawah
                 → Godd2.mp4 play forward sebagai bg
   - Scroll up → video playbackRate = -1 (reverse literal)
               → setelah video selesai / threshold → kembali ke hero
               → hero slide down fade in
============================================================ */

(function initScrollytelling() {

  /* ── CONFIG ── */
  const TRANS_MS      = 700;    // durasi slide transition CSS
  const VIDEO_SRC     = '../../Assets/project/game/ForbiddenSpace/Motion/Godd2.mp4';  // path dari forbidden-space.html
  const REVERSE_SPEED = 2.5;    // kecepatan playback reverse (lebih cepat = lebih dramatis)
  const FORWARD_SPEED = 1.0;

  /* ── STATE ── */
  let currentSection = 'hero';  // 'hero' | 'overview'
  let isAnimating    = false;
  let lastWheel      = 0;
  const COOL         = 900;     // cooldown antara navigasi (ms)

  /* ── ELEMENTS ── */
  const heroEl      = document.getElementById('hero');
  const overviewEl  = document.getElementById('overview');
  const restEl      = document.getElementById('rest-sections'); // wrapper semua section setelah overview
  if (!heroEl || !overviewEl) return;

  /* ── BUILD VIDEO BACKGROUND ── */
  const videoWrap = document.createElement('div');
  videoWrap.className = 'overview-video-bg';

  const video = document.createElement('video');
  video.src      = VIDEO_SRC;
  video.muted    = true;
  video.playsInline = true;
  video.preload  = 'auto';
  video.loop     = false;
  video.className = 'overview-bg-video';

  const videoOverlay = document.createElement('div');
  videoOverlay.className = 'overview-video-overlay';

  videoWrap.appendChild(video);
  videoWrap.appendChild(videoOverlay);
  overviewEl.insertAdjacentElement('afterbegin', videoWrap);

  /* ── PRELOAD video ── */
  video.load();

  /* ── SETUP INITIAL STATES ── */
  // Hero: tampil normal
  heroEl.classList.add('snap-active');

  // Overview: siap di bawah, tersembunyi
  overviewEl.classList.add('snap-hidden-below');
  overviewEl.classList.remove('snap-active');

  /* ── BODY: enable snap mode ── */
  document.body.classList.add('snap-mode');

  /* ── WRAPPER semua section setelah overview ── */
  // Wrap section setelah overview agar bisa di-scroll normal setelah overview muncul
  const afterSections = [];
  let sibling = overviewEl.nextElementSibling;
  while (sibling) {
    afterSections.push(sibling);
    sibling = sibling.nextElementSibling;
  }

  // Buat rest wrapper kalau belum ada
  let restWrapper = document.getElementById('rest-sections');
  if (!restWrapper && afterSections.length) {
    restWrapper = document.createElement('div');
    restWrapper.id = 'rest-sections';
    afterSections[0].parentNode.insertBefore(restWrapper, afterSections[0]);
    afterSections.forEach(el => restWrapper.appendChild(el));
  }

  /* ────────────────────────────────────────────
     VIDEO CONTROL
  ──────────────────────────────────────────── */

  function playForward() {
    if (!video.src) return;
    video.playbackRate = FORWARD_SPEED;
    // Kalau video sudah hampir habis, reset ke awal
    if (video.currentTime >= video.duration - 0.1) {
      video.currentTime = 0;
    }
    video.play().catch(() => {});
  }

  function playReverse() {
    if (!video.src || video.duration === 0) return;

    // Kalau video di awal, langsung complete
    if (video.currentTime <= 0.05) {
      video.pause();
      onReverseComplete();
      return;
    }

    // Pause dulu, lalu frame-by-frame reverse via RAF
    video.pause();
    let reverseRaf;

    function stepReverse() {
      if (video.currentTime <= 0) {
        video.currentTime = 0;
        cancelAnimationFrame(reverseRaf);
        onReverseComplete();
        return;
      }
      // Step mundur ~60fps
      video.currentTime = Math.max(0, video.currentTime - (1 / 60) * REVERSE_SPEED);
      reverseRaf = requestAnimationFrame(stepReverse);
    }

    // Simpan ref RAF agar bisa di-cancel
    video._reverseRaf = reverseRaf;
    reverseRaf = requestAnimationFrame(stepReverse);
    video._reverseRaf = reverseRaf; // update ref
  }

  // Cancel reverse kalau user scroll lagi ke bawah sebelum selesai
  function cancelReverse() {
    if (video._reverseRaf) {
      cancelAnimationFrame(video._reverseRaf);
      video._reverseRaf = null;
    }
  }

  /* ── CALLBACK: reverse selesai → kembali ke hero ── */
  function onReverseComplete() {
    transitionToHero();
  }

  /* ────────────────────────────────────────────
     TRANSITIONS
  ──────────────────────────────────────────── */

  function transitionToOverview() {
    if (isAnimating || currentSection === 'overview') return;
    isAnimating = true;

    // 1. Hero slide up & fade out
    heroEl.classList.remove('snap-active');
    heroEl.classList.add('snap-exit-up');

    // 2. Overview snap in dari bawah
    overviewEl.classList.remove('snap-hidden-below');
    overviewEl.classList.add('snap-enter-up', 'snap-active');

    // 3. Play video forward
    cancelReverse();
    playForward();

    setTimeout(() => {
      heroEl.classList.remove('snap-exit-up');
      overviewEl.classList.remove('snap-enter-up');
      currentSection = 'overview';
      isAnimating    = false;
    }, TRANS_MS);
  }

  function transitionToHero() {
    if (isAnimating || currentSection === 'hero') return;
    isAnimating = true;

    // 1. Overview exit ke bawah
    overviewEl.classList.remove('snap-active');
    overviewEl.classList.add('snap-exit-down', 'snap-hidden-below');

    // 2. Hero kembali dari atas ke posisi normal
    heroEl.classList.add('snap-enter-down', 'snap-active');

    // 3. Fade out video overlay (video sudah reverse)
    videoWrap.classList.add('video-fading');

    setTimeout(() => {
      overviewEl.classList.remove('snap-exit-down');
      heroEl.classList.remove('snap-enter-down');
      videoWrap.classList.remove('video-fading');
      video.pause();
      currentSection = 'hero';
      isAnimating    = false;
    }, TRANS_MS);
  }

  /* ────────────────────────────────────────────
     SCROLL & INPUT DETECTION
  ──────────────────────────────────────────── */

  function handleScrollDown() {
    if (currentSection === 'hero') {
      transitionToOverview();
    }
    // Kalau sudah di overview → scroll normal (rest sections)
  }

  function handleScrollUp() {
    if (currentSection === 'overview') {
      // Cek apakah overview sudah di scroll paling atas
      const scrollTop = overviewEl.scrollTop || 0;
      if (scrollTop > 10) return; // biarkan scroll internal dulu

      // Mulai reverse video → setelah reverse complete → kembali ke hero
      cancelReverse();
      playReverse();
      // transitionToHero akan dipanggil oleh onReverseComplete
      // Tapi juga trigger transisi CSS sekarang agar terasa responsif
      transitionToHero();
    }
  }

  /* ── WHEEL ── */
  let wheelAcc = 0;
  const WHEEL_THRESHOLD = 80;

  window.addEventListener('wheel', (e) => {
    const now = Date.now();
    if (isAnimating) { e.preventDefault?.(); return; }

    // Kalau di overview dan belum di paling atas saat scroll up → biarkan
    if (currentSection === 'overview' && e.deltaY < 0) {
      const scrollTop = overviewEl.scrollTop || window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 20) return;
    }

    wheelAcc += e.deltaY;

    if (now - lastWheel > COOL) {
      wheelAcc = e.deltaY;
    }
    lastWheel = now;

    if (Math.abs(wheelAcc) >= WHEEL_THRESHOLD) {
      if (wheelAcc > 0) handleScrollDown();
      else              handleScrollUp();
      wheelAcc = 0;
    }
  }, { passive: true });

  /* ── TOUCH ── */
  let touchStartY = 0;
  const SWIPE_MIN = 55;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (isAnimating) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < SWIPE_MIN) return;

    if (dy > 0) handleScrollDown();
    else        handleScrollUp();
  }, { passive: true });

  /* ── KEYBOARD ── */
  document.addEventListener('keydown', (e) => {
    if (isAnimating) return;
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') handleScrollDown();
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   handleScrollUp();
  });

  /* ── NAV LINK: "View Project" btn di hero → langsung ke overview ── */
  document.querySelectorAll('a[href="#overview"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentSection !== 'overview') transitionToOverview();
    });
  });

  /* ── SCROLL CUE click ── */
  const scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      if (currentSection === 'hero') transitionToOverview();
    });
  }

  /* ── BACK TO PORTFOLIO nav ── */
  const navBack = document.querySelector('.nav-back');
  if (navBack) {
    // nav-back sudah href ke portfolio, biarkan default
  }

  /* ── VIDEO: saat video habis dimainkan forward, loop atau freeze ── */
  video.addEventListener('ended', () => {
    // Freeze di frame terakhir saat forward (biarkan tetap terlihat)
    video.currentTime = video.duration;
    video.pause();
  });

  /* ── REDUCED MOTION: skip animasi video ── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Tetap snapping tapi tanpa video
    videoWrap.style.display = 'none';
  }

  /* ── PUBLIC API ── */
  window.SnapNav = {
    toOverview: transitionToOverview,
    toHero:     transitionToHero,
    current:    () => currentSection,
  };

})();