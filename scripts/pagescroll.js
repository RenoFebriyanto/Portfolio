/* ================================================
   PAGESCROLL.JS — Full-page panel navigation
   
   Tiap <section> dibungkus jadi .snap-panel full-viewport.
   Hanya 1 panel aktif (.panel-visible) pada satu waktu.
   Pindah halaman = slide transform + fade, bukan scroll
   fisik continuous.

   Panel dengan konten > viewport (.snap-panel--scroll)
   tetap bisa di-scroll internal — baru pindah ke
   page berikutnya saat user mencapai ujung atas/bawah.

   Sections: hero, about, projects, skills, contact
================================================ */

(function initPageScroll() {

    const wrapper = document.getElementById('scroll-container');
    if (!wrapper) return;

    /* ---- Config ---- */
    const SECTION_DEFS = [
        { id: 'hero',     label: 'Home',    scrollable: false },
        { id: 'about',    label: 'About',   scrollable: true  },
        { id: 'projects', label: 'Work',    scrollable: true  },
        { id: 'skills',   label: 'Skills',  scrollable: true  },
        { id: 'contact',  label: 'Contact', scrollable: true  },
    ];

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TRANS_DUR = REDUCED_MOTION ? 1 : 650;
    const NAV_COOL  = REDUCED_MOTION ? 50 : 800;

    /* ---- State ---- */
    let currentIdx  = 0;
    let isAnimating = false;
    let lastNav     = 0;


    /* ================================================
       WRAP SECTIONS INTO PANELS
    ================================================ */
    const sections = [];

    SECTION_DEFS.forEach((def) => {
        const el = document.getElementById(def.id);
        if (!el) return;

        const panel = document.createElement('div');
        panel.className  = 'snap-panel' + (def.scrollable ? ' snap-panel--scroll' : '');
        panel.dataset.id = def.id;

        el.parentNode.insertBefore(panel, el);
        panel.appendChild(el);

        sections.push({ ...def, el, panel });
    });

    if (!sections.length) return;

    // First panel visible on load
    sections[0].panel.classList.add('panel-visible');


    /* ================================================
       DOT NAV — build & inject
    ================================================ */
    const dotsWrap = document.createElement('nav');
    dotsWrap.className = 'snap-dots';
    dotsWrap.setAttribute('aria-label', 'Page navigation');
    document.body.appendChild(dotsWrap);

    const dots = sections.map((sec, i) => {
        const dot = document.createElement('button');
        dot.className = 'snap-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to ${sec.label}`);
        dot.setAttribute('title', sec.label);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
        return dot;
    });

    function updateDots() {
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));
    }


    /* ================================================
       NAV BAR — toggle .scrolled background
    ================================================ */
    const nav = document.getElementById('nav');

    function updateNav() {
        if (!nav) return;
        const sec = sections[currentIdx];
        const scrolledInPanel = sec.scrollable && sec.panel.scrollTop > 20;
        nav.classList.toggle('scrolled', currentIdx > 0 || scrolledInPanel);
    }


    /* ================================================
       SCROLL EDGE HELPERS
    ================================================ */
    function isAtTop(panel) {
        return panel.scrollTop <= 2;
    }

    function isAtBottom(panel) {
        return panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4;
    }

function goTo(toIdx, dir) {
    if (toIdx < 0 || toIdx >= sections.length) return;
    if (toIdx === currentIdx) return;

    const now = performance.now();
    if (isAnimating || now - lastNav < NAV_COOL) return;

    isAnimating = true;
    lastNav     = now;

    const direction = dir || (toIdx > currentIdx ? 'next' : 'prev');
    const fromSec   = sections[currentIdx];
    const fromPanel = fromSec.panel;
    const toSec     = sections[toIdx];
    const toPanel   = toSec.panel;

    const exitY  = direction === 'next' ? '-12%' : '12%';
    const enterY = direction === 'next' ? '12%'  : '-12%';

    // Reset animasi section yang ditinggalkan
    window.dispatchEvent(new CustomEvent('sectionleave', { detail: { id: fromSec.id, direction } }));

    // Exit current panel
    fromPanel.style.transition = `transform ${TRANS_DUR}ms cubic-bezier(0.4,0,1,1), opacity ${TRANS_DUR * 0.75}ms ease`;
    fromPanel.style.transform  = `translateY(${exitY})`;
    fromPanel.style.opacity    = '0';

    // Prepare next panel
    toPanel.style.transition    = 'none';
    toPanel.style.transform     = `translateY(${enterY})`;
    toPanel.style.opacity       = '0';
    toPanel.style.pointerEvents = 'none';
    toPanel.classList.add('panel-visible');

    if (toSec.scrollable) {
        toPanel.scrollTop = direction === 'next' ? 0 : toPanel.scrollHeight;
    }

    // Force reflow, then animate in
    toPanel.getBoundingClientRect();
    toPanel.style.transition = `transform ${TRANS_DUR}ms cubic-bezier(0.16,1,0.3,1), opacity ${TRANS_DUR}ms ease`;
    toPanel.style.transform  = 'translateY(0)';
    toPanel.style.opacity    = '1';

    // Mainkan animasi section yang baru muncul — bersamaan dengan slide-in
    window.dispatchEvent(new CustomEvent('sectionenter', { detail: { id: toSec.id, direction } }));

    setTimeout(() => {
        fromPanel.classList.remove('panel-visible');
        fromPanel.style.cssText = '';

        toPanel.style.transition    = '';
        toPanel.style.transform     = '';
        toPanel.style.opacity       = '';
        toPanel.style.pointerEvents = '';

        currentIdx  = toIdx;
        isAnimating = false;

        updateDots();
        updateNav();
    }, TRANS_DUR + 60);
}
    function next() { goTo(currentIdx + 1, 'next'); }
    function prev() { goTo(currentIdx - 1, 'prev'); }


    /* ================================================
       PER-PANEL SCROLL — nav state + ghost parallax hook
    ================================================ */
    sections.forEach((sec) => {
        if (!sec.scrollable) return;

        sec.panel.addEventListener('scroll', () => {
            if (sections[currentIdx] === sec) updateNav();
            window.dispatchEvent(new Event('panelscroll'));
        }, { passive: true });
    });


    /* ================================================
       WHEEL NAVIGATION
    ================================================ */
    wrapper.addEventListener('wheel', (e) => {
        if (isAnimating) { e.preventDefault(); return; }

        const sec   = sections[currentIdx];
        const panel = sec.panel;

        if (sec.scrollable) {
            const goingDown = e.deltaY > 0;
            const goingUp   = e.deltaY < 0;

            if (goingDown && !isAtBottom(panel)) return; // let it scroll freely
            if (goingUp   && !isAtTop(panel))    return;
        }

        e.preventDefault();

        const now = performance.now();
        if (now - lastNav < NAV_COOL) return;

        if (e.deltaY > 0) {
            if (currentIdx < sections.length - 1) next();
        } else {
            if (currentIdx > 0) prev();
        }
    }, { passive: false });


    /* ================================================
       KEYBOARD NAVIGATION
    ================================================ */
    document.addEventListener('keydown', (e) => {
        const tag = document.activeElement?.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        const now = performance.now();
        if (isAnimating || now - lastNav < NAV_COOL) return;

        const sec   = sections[currentIdx];
        const panel = sec.panel;

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            if (sec.scrollable && !isAtBottom(panel)) return;
            e.preventDefault();
            if (currentIdx < sections.length - 1) next();

        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            if (sec.scrollable && !isAtTop(panel)) return;
            e.preventDefault();
            if (currentIdx > 0) prev();

        } else if (e.key === 'Home') {
            e.preventDefault();
            goTo(0, 'prev');

        } else if (e.key === 'End') {
            e.preventDefault();
            goTo(sections.length - 1, 'next');
        }
    });


    /* ================================================
       TOUCH SUPPORT — swipe to navigate
    ================================================ */
    let touchStartY = 0;
    let touchStartTime = 0;
    const SWIPE_THRESHOLD = 60; // px

    wrapper.addEventListener('touchstart', (e) => {
        touchStartY    = e.touches[0].clientY;
        touchStartTime = performance.now();
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        const dy       = touchStartY - e.changedTouches[0].clientY;
        const elapsed  = performance.now() - touchStartTime;
        const velocity = Math.abs(dy) / elapsed;

        if (Math.abs(dy) < SWIPE_THRESHOLD || velocity < 0.3) return;

        const now = performance.now();
        if (isAnimating || now - lastNav < NAV_COOL) return;

        const sec   = sections[currentIdx];
        const panel = sec.panel;

        if (dy > 0) {
            // Swipe up → next
            if (currentIdx >= sections.length - 1) return;
            if (sec.scrollable && !isAtBottom(panel)) return;
            next();
        } else {
            // Swipe down → prev
            if (currentIdx <= 0) return;
            if (sec.scrollable && !isAtTop(panel)) return;
            prev();
        }
    }, { passive: true });


    /* ================================================
       NAV LINK OVERRIDE — href="#section" → goTo
    ================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        const targetId = link.getAttribute('href').replace('#', '');
        const idx = sections.findIndex(s => s.id === targetId);
        if (idx === -1) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            goTo(idx, idx > currentIdx ? 'next' : 'prev');
        });
    });


    /* ================================================
       HERO SCROLL INDICATOR → goes to #projects
    ================================================ */
    const scrollIndicator = document.querySelector('.hero-scroll');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const idx = sections.findIndex(s => s.id === 'projects');
            if (idx !== -1) goTo(idx, 'next');
        });
    }


    /* ================================================
       PUBLIC API — used by main.js (back-to-top, etc.)
    ================================================ */
    window.PageNav = {
        goTo,
        next,
        prev,
        getIndex: () => currentIdx,
    };


    /* ---- Initial state ---- */
    updateDots();
    updateNav();


    // Mainkan animasi untuk section pertama saat halaman dimuat
    requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('sectionenter', { detail: { id: sections[0].id } }));
    });

    
})();