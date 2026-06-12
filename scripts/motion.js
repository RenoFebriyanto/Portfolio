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
     9. Avatar photo reveal
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
    const COUNT  = 55;
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
            x:          rand(0, W),
            y:          rand(0, H),
            r:          rand(0.8, 2.2),
            vx:         rand(-0.12, 0.12),
            vy:         rand(-0.18, -0.04),
            alpha:      rand(0.08, 0.45),
            pulse:      rand(0, Math.PI * 2),
            pulseSpeed: rand(0.006, 0.018),
        }));
    }
    buildParticles();

    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach((p) => {
            p.pulse += p.pulseSpeed;
            const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

            const tinted = p.alpha > 0.3;
            ctx.fillStyle = tinted
                ? `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${a})`
                : `rgba(180,180,220,${a})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.y < -4) { p.y = H + 2; p.x = rand(0, W); }
            if (p.x < 0)  p.x = W;
            if (p.x > W)  p.x = 0;
        });

        requestAnimationFrame(draw);
    }
    draw();
})();

/* ========================================
   2. GHOST TEXT PARALLAX
      Injects large watermark number per section
      and moves it based on the active panel's scroll.
======================================== */
(function initGhostParallax() {
    const sectionDefs = [
        { id: 'about',    label: 'ABOUT'  },
        { id: 'projects', label: 'WORK'   },
        { id: 'skills',   label: 'SKILLS' },
        { id: 'contact',  label: 'HELLO'  },
    ];

    const ghosts = [];
    sectionDefs.forEach(({ id, label }) => {
        const sec = document.getElementById(id);
        if (!sec) return;

        const ghost = document.createElement('span');
        ghost.className = 'motion-section-ghost';
        ghost.setAttribute('aria-hidden', 'true');
        ghost.textContent = label;
        sec.appendChild(ghost);
        ghosts.push({ ghost, sec });
    });

    function updateGhosts() {
        const vh = window.innerHeight;

        ghosts.forEach(({ ghost, sec }) => {
            const rect   = sec.getBoundingClientRect();
            const center = rect.top + rect.height / 2 - vh / 2;
            const offset = center * 0.06; // parallax intensity
            ghost.style.transform = `translateY(calc(-50% + ${offset}px))`;
        });
    }

    // pagescroll.js dispatches this on every internal panel scroll
    window.addEventListener('panelscroll', updateGhosts, { passive: true });
    updateGhosts();
})();


/* ========================================
   5. PROJECT CARD 3D TILT
======================================== */
(function initCardTilt() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    if (window.matchMedia('(hover: none)').matches) return;

    const MAX_TILT = 7;

    cards.forEach((card) => {
        // .card-tilt-glow sudah dirender oleh projects-render.js, skip inject
        const glow = card.querySelector('.card-tilt-glow');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const dx   = (e.clientX - cx) / (rect.width  / 2);
            const dy   = (e.clientY - cy) / (rect.height / 2);

            const rotX = -dy * MAX_TILT;
            const rotY =  dx * MAX_TILT;

            card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
            card.classList.add('tilting');

            if (glow) {
                const gx = ((e.clientX - rect.left) / rect.width)  * 100;
                const gy = ((e.clientY - rect.top)  / rect.height) * 100;
                glow.style.setProperty('--glow-x', `${gx}%`);
                glow.style.setProperty('--glow-y', `${gy}%`);
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.classList.remove('tilting');
        });
    });
})();




/* ========================================
   7. FORM SUBMIT RIPPLE
======================================== */
(function initSubmitRipple() {
    const btn = document.getElementById('form-submit-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        const rect   = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className  = 'submit-ripple';
        ripple.style.left = (e.clientX - rect.left  - 5) + 'px';
        ripple.style.top  = (e.clientY - rect.top   - 5) + 'px';
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
})();


