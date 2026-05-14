/* ================================================
   MOTION.JS — Per-section animation logic
   Modules:
     1. Hero particle canvas
     2. Section ghost text parallax
     3. Stat counter (count-up)
     4. Identity card shimmer
     5. Project card 3D tilt
     6. Section divider line draw
     7. Form submit ripple
     8. Contact eyebrow typed effect
================================================ */


/* ========================================
   1. HERO PARTICLES — canvas-based dots
======================================== */
(function initHeroParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'hero-particles';
    hero.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles;
    const COUNT = 55;
    const ACCENT = { r: 255, g: 107, b: 53 };

    function resize() {
        W = canvas.width  = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); buildParticles(); });

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function buildParticles() {
        particles = Array.from({ length: COUNT }, () => ({
            x: rand(0, W),
            y: rand(0, H),
            r: rand(0.8, 2.2),
            vx: rand(-0.12, 0.12),
            vy: rand(-0.18, -0.04),
            alpha: rand(0.08, 0.45),
            pulse: rand(0, Math.PI * 2),
            pulseSpeed: rand(0.006, 0.018),
        }));
    }
    buildParticles();

    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach((p) => {
            // Pulse alpha
            p.pulse += p.pulseSpeed;
            const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

            // Most dots neutral; ~20% tinted orange
            const tinted = p.alpha > 0.3;
            ctx.fillStyle = tinted
                ? `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${a})`
                : `rgba(180,180,220,${a})`;
            ctx.fill();

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap vertically; reset at bottom
            if (p.y < -4) { p.y = H + 2; p.x = rand(0, W); }
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
        });

        requestAnimationFrame(draw);
    }
    draw();
})();


/* ========================================
   2. GHOST TEXT PARALLAX
      Injects large watermark number per section
      and moves it on scroll for depth.
======================================== */
(function initGhostParallax() {
    const sections = [
        { id: 'about',    label: 'ABOUT'   },
        { id: 'projects', label: 'WORK'    },
        { id: 'skills',   label: 'SKILLS'  },
        { id: 'contact',  label: 'HELLO'   },
    ];

    sections.forEach(({ id, label }) => {
        const sec = document.getElementById(id);
        if (!sec) return;

        // Ensure section has relative positioning (already set via CSS)
        const ghost = document.createElement('span');
        ghost.className = 'motion-section-ghost';
        ghost.setAttribute('aria-hidden', 'true');
        ghost.textContent = label;
        sec.appendChild(ghost);
    });

    function onScroll() {
        const scrollY = window.scrollY;
        document.querySelectorAll('.motion-section-ghost').forEach((ghost) => {
            const sec = ghost.parentElement;
            const rect = sec.getBoundingClientRect();
            // Parallax: moves up slower than the section
            const offset = rect.top * 0.08;
            ghost.style.transform = `translateY(calc(-50% + ${offset}px))`;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();


/* ========================================
   3. STAT COUNTER — count-up on reveal
======================================== */
(function initStatCounters() {
    const stats = document.querySelectorAll('.stat-num');
    if (!stats.length) return;

    // Map label → target number
    const targets = { '3': 3, '12': 12, '5': 5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            observer.unobserve(el);

            // Extract number from text (ignore + or ∞)
            const raw = el.textContent.replace(/[^0-9]/g, '');
            const end = parseInt(raw, 10);
            if (!end || isNaN(end)) return;

            // Find accent span if present
            const accentEl = el.querySelector('.stat-accent');
            const suffix   = accentEl ? accentEl.outerHTML : '';

            const duration = 900;
            const startTime = performance.now();

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                // Ease out quad
                const eased = 1 - Math.pow(1 - progress, 2);
                const current = Math.round(eased * end);
                el.innerHTML = current + suffix;
                if (progress < 1) requestAnimationFrame(tick);
                else {
                    el.innerHTML = end + suffix;
                    el.closest('.stat-card')?.classList.add('counted');
                }
            }
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.6 });

    stats.forEach((el) => observer.observe(el));
})();


/* ========================================
   4. IDENTITY CARD SHIMMER
======================================== */
(function initIdentityShimmer() {
    const card = document.querySelector('.about-identity');
    if (!card) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                card.classList.add('shimmer-ready');
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(card);
})();


/* ========================================
   5. PROJECT CARD 3D TILT
======================================== */
(function initCardTilt() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const MAX_TILT = 7; // degrees

    cards.forEach((card) => {
        // Inject glow element
        const glow = document.createElement('div');
        glow.className = 'card-tilt-glow';
        card.appendChild(glow);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
            const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1

            const rotX = -dy * MAX_TILT;
            const rotY =  dx * MAX_TILT;

            card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
            card.classList.add('tilting');

            // Move glow to cursor position (relative to card)
            const gx = ((e.clientX - rect.left) / rect.width)  * 100;
            const gy = ((e.clientY - rect.top)  / rect.height) * 100;
            glow.style.setProperty('--glow-x', `${gx}%`);
            glow.style.setProperty('--glow-y', `${gy}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.classList.remove('tilting');
        });
    });
})();


/* ========================================
   6. SECTION DIVIDER LINE DRAW
======================================== */
(function initDividerDraw() {
    const dividers = document.querySelectorAll('.section-divider');
    if (!dividers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('line-drawn');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    dividers.forEach((d) => observer.observe(d));
})();


/* ========================================
   7. FORM SUBMIT RIPPLE
======================================== */
(function initSubmitRipple() {
    const btn = document.getElementById('form-submit-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'submit-ripple';
        ripple.style.left = (e.clientX - rect.left - 5) + 'px';
        ripple.style.top  = (e.clientY - rect.top  - 5) + 'px';
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
})();


/* ========================================
   8. CONTACT EYEBROW — Typed effect
======================================== */
(function initTypedEyebrow() {
    const el = document.querySelector('.contact-eyebrow');
    if (!el) return;

    const fullText = el.textContent.trim();
    el.textContent = '';
    el.classList.add('motion-typed');

    let started = false;
    let charIdx = 0;

    function type() {
        if (charIdx < fullText.length) {
            el.textContent = fullText.slice(0, ++charIdx);
            setTimeout(type, 38 + Math.random() * 22);
        } else {
            // Remove typing cursor after brief pause
            setTimeout(() => el.classList.remove('motion-typed'), 1800);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !started) {
                started = true;
                setTimeout(type, 400);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.8 });

    observer.observe(el);
})();