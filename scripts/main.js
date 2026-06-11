/* ================================================
   MAIN.JS — Core interactions
   Add new section-specific scripts here or import
   separate modules as the project grows.
================================================ */

// --- Nav: add .scrolled class on scroll ---
(function initNav() {
    const nav = document.getElementById('nav');
    const scroller = document.getElementById('scroll-container');
    if (!nav || !scroller) return;

    let ticking = false;

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                nav.classList.toggle('scrolled', scroller.scrollTop > 20);
                ticking = false;
            });
            ticking = true;
        }
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
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
    const scroller = document.getElementById('scroll-container');
    if (!btn || !scroller) return;
    btn.addEventListener('click', () => {
        scroller.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// --- Contact Form: EmailJS Integration ---
(function initContactForm() {

    const EMAILJS_SERVICE_ID = 'service_4gmph37';   // ← ganti
    const EMAILJS_TEMPLATE_ID = 'template_hutxwgq';  // ← ganti
    const EMAILJS_PUBLIC_KEY = 'FNCDIzpu7wl-Zh3FB';        // ← ganti

    // Init EmailJS
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    const form = document.getElementById('contact-form');
    const btn = document.getElementById('form-submit-btn');
    const success = document.getElementById('form-success');
    if (!form) return;

    // Helper: highlight field error
    function setFieldError(selector, hasError) {
        const el = form.querySelector(selector);
        if (!el) return;
        el.style.borderColor = hasError ? 'rgba(255,80,80,0.6)' : '';
        el.style.boxShadow = hasError ? '0 0 0 3px rgba(255,80,80,0.12)' : '';
        if (hasError) {
            el.addEventListener('input', () => {
                el.style.borderColor = '';
                el.style.boxShadow = '';
            }, { once: true });
        }
    }

    // Helper: button state
    function setBtnState(state) {
        const states = {
            idle: { text: 'Send Message <span class="form-submit-arrow">&#8594;</span>', disabled: false, bg: '', color: '' },
            loading: { text: 'Sending...', disabled: true, bg: '', color: '' },
            error: { text: 'Failed — Try Again', disabled: false, bg: 'rgba(220,60,60,0.85)', color: '#fff' },
        };
        const s = states[state];
        btn.innerHTML = s.text;
        btn.disabled = s.disabled;
        btn.style.background = s.bg;
        btn.style.color = s.color;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.querySelector('#cf-name').value.trim();
        const email = form.querySelector('#cf-email').value.trim();
        const subject = form.querySelector('#cf-subject')?.value.trim() || '(No subject)';
        const message = form.querySelector('#cf-message').value.trim();

        // Validation
        let hasError = false;
        if (!name) { setFieldError('#cf-name', true); hasError = true; }
        if (!email) { setFieldError('#cf-email', true); hasError = true; }
        if (!message) { setFieldError('#cf-message', true); hasError = true; }
        if (hasError) return;

        setBtnState('loading');

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                reply_to: email,        // reply langsung ke pengirim dari Gmail
            });

            // ✅ Berhasil
            form.style.display = 'none';
            success.classList.add('visible');

        } catch (err) {
            console.error('[EmailJS Error]', err);
            setBtnState('error');

            // Reset ke idle setelah 3 detik
            setTimeout(() => setBtnState('idle'), 3000);
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