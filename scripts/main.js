/* ================================================
   MAIN.JS — Core interactions
   Add new section-specific scripts here or import
   separate modules as the project grows.
================================================ */

// --- Nav: add .scrolled class on scroll ---
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();


// --- Scroll indicator: smooth scroll to #projects ---
(function initScrollIndicator() {
  const scrollBtn = document.querySelector('.hero-scroll');
  if (!scrollBtn) return;

  scrollBtn.addEventListener('click', () => {
    const target = document.getElementById('projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
})();