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


// --- Projects Filter ---
(function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  const countEl = document.getElementById('project-visible-count');
  if (!filterBtns.length) return;

  const updateCount = () => {
    const visible = document.querySelectorAll('.project-card:not(.hidden)').length;
    if (countEl) countEl.textContent = visible;
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
      });

      updateCount();
    });
  });
})();


// --- Footer: Dynamic year ---
(function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


// --- Footer: Back to top ---
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// --- Contact Form: UX (validation + submit state) ---
// NOTE: Wire up to a real service before going live.
// Option A — Formspree: add action="https://formspree.io/f/YOUR_ID" to the <form>
// Option B — EmailJS: call emailjs.send() inside the fetch block below
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const btn    = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#cf-name').value.trim();
    const email   = form.querySelector('#cf-email').value.trim();
    const message = form.querySelector('#cf-message').value.trim();

    if (!name || !email || !message) return;

    // Loading state
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      // --- Swap this fetch for your real endpoint ---
      // await fetch('https://formspree.io/f/YOUR_ID', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, message }),
      // });

      // Simulated delay (remove once real endpoint is wired)
      await new Promise((r) => setTimeout(r, 1200));

      // Show success
      form.style.display = 'none';
      success.classList.add('visible');

    } catch {
      btn.disabled = false;
      btn.innerHTML = 'Send Message <span class="form-submit-arrow">&#8594;</span>';
    }
  });
})();



(function initSkillBars() {
  const groups = document.querySelectorAll('.skill-group');
  if (!groups.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  groups.forEach((g) => observer.observe(g));
})();


// --- Scroll Reveal: IntersectionObserver for .reveal elements ---
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal so it doesn't re-trigger
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
})();