/* ============================================================
   CURSOR.JS — Custom cursor: ring (lerp) + dot, glow cyan
   Hover state membesar pada link/button, beda warna di gallery
============================================================ */
(function initCursor() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const ring = document.getElementById('cursorRing');
    const dot  = document.getElementById('cursorDot');
    if (!ring || !dot) return;

    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
    const LERP = 0.16;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        ring.style.opacity = '1';
        dot.style.opacity  = '1';
    });

    document.addEventListener('mouseleave', () => {
        ring.style.opacity = '0';
        dot.style.opacity  = '0';
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        ringX = lerp(ringX, mouseX, LERP);
        ringY = lerp(ringY, mouseY, LERP);
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    /* ---- Hover states ---- */
    function bind(selector, enter, leave) {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('mouseenter', enter);
            el.addEventListener('mouseleave', leave);
        });
    }

    // Link / tombol → ring membesar, isi cyan tipis
    bind('a, button, .filter-btn, .nav-cta, .nav-back', () => {
        ring.style.width = '52px';
        ring.style.height = '52px';
        ring.style.background = 'var(--fs-cyan-dim)';
        ring.style.borderColor = 'var(--fs-cyan)';
    }, () => {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.background = 'transparent';
    });

    // Gallery / lightbox close → ring lebih besar, accent orange (zoom hint)
    bind('.gallery-item, .lightbox-close', () => {
        ring.style.width = '64px';
        ring.style.height = '64px';
        ring.style.borderColor = 'var(--fs-orange)';
    }, () => {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'var(--fs-cyan)';
    });
})();