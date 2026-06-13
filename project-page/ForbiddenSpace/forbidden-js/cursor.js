/* ================================================
   CURSOR.JS — Custom ring cursor with lerp
   Sama arsitektur dengan portfolio (scripts/cursor.js),
   warna diatur lewat CSS (cursor.css / forbidden-space.css)
================================================ */
(function initCursor() {
    // Skip di touch / coarse pointer device
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    // Posisi mouse mentah
    let mouseX = -100, mouseY = -100;
    // Posisi ring (lerp)
    let ringX  = -100, ringY  = -100;
    const LERP = 0.12;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        document.body.classList.remove('cursor-hidden');
    });

    // Hide saat keluar viewport
    document.addEventListener('mouseleave', () => {
        document.body.classList.add('cursor-hidden');
    });
    document.addEventListener('mouseenter', () => {
        document.body.classList.remove('cursor-hidden');
    });

    // Click state
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    // RAF loop — lerp ring ke posisi mouse
    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        ringX = lerp(ringX, mouseX, LERP);
        ringY = lerp(ringY, mouseY, LERP);
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // ---- Hover state management ----

    // Interactive: link, button, nav, CTA
    const INTERACTIVE = 'a, button, .nav-back, .nav-cta, .btn-primary, .btn-ghost, .lightbox-close';
    // Cards: gallery, mechanic/contribution/team cards
    const CARDS = '.gallery-item, .mechanic-card, .contribution-card, .team-card';

    function addHover(selector, bodyClass) {
        document.querySelectorAll(selector).forEach((el) => {
            el.addEventListener('mouseenter', () => document.body.classList.add(bodyClass));
            el.addEventListener('mouseleave', () => document.body.classList.remove(bodyClass));
        });
    }

    addHover(INTERACTIVE, 'cursor-hover');
    addHover(CARDS, 'cursor-card');
})();