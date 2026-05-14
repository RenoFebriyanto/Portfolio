/* ================================================
   CURSOR.JS — Custom ring cursor with lerp
   Attach to: links, buttons, cards, inputs
================================================ */

(function initCursor() {
    // Skip on touch / coarse pointer devices
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // Current mouse position
    let mouseX = -100, mouseY = -100;
    // Ring lerp position
    let ringX  = -100, ringY  = -100;
    // Lerp speed (0–1): lower = more lag
    const LERP = 0.12;

    // Track raw mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        document.body.classList.remove('cursor-hidden');
    });

    // Hide when mouse exits viewport
    document.addEventListener('mouseleave', () => {
        document.body.classList.add('cursor-hidden');
    });
    document.addEventListener('mouseenter', () => {
        document.body.classList.remove('cursor-hidden');
    });

    // Click ripple
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    // RAF loop — lerp ring toward mouse
    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        ringX = lerp(ringX, mouseX, LERP);
        ringY = lerp(ringY, mouseY, LERP);
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);


    // ---- Hover state management ----

    // Interactive: links, buttons, filter/nav items
    const INTERACTIVE = 'a, button, .filter-btn, .nav-cta, .nav-links a, .social-link, .footer-back-top, label, input, textarea, .tag';
    // Cards: project cards, skill groups
    const CARDS = '.project-card, .skill-group, .stat-card, .about-doing-chip';

    function addHover(selector, bodyClass) {
        document.querySelectorAll(selector).forEach((el) => {
            el.addEventListener('mouseenter', () => document.body.classList.add(bodyClass));
            el.addEventListener('mouseleave', () => document.body.classList.remove(bodyClass));
        });
    }

    // Run once DOM is ready, and also after any filter toggle (project cards shown/hidden)
    function attachHoverStates() {
        addHover(INTERACTIVE, 'cursor-hover');
        addHover(CARDS, 'cursor-card');
    }

    attachHoverStates();

    // Re-attach after filter toggles reveal new cards
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            setTimeout(attachHoverStates, 50);
        });
    });

})();