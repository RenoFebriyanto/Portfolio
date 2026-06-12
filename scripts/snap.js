/* ================================================
   SNAP.JS — Smart per-page snap scroll
   
   Strategy:
   - CSS scroll-snap handles base snapping natively
   - JS layer adds:
       1. Section-aware snap (skip snap on tall sections
          until user has scrolled through them)
       2. Dot nav indicator (current section highlight)
       3. Keyboard arrow navigation
       4. Wheel velocity debounce guard (prevent
          accidental double-skip on fast scroll)
   
   Sections: hero, about, projects, skills, contact
================================================ */

(function initSnapScroll() {

    const container = document.getElementById('scroll-container');
    if (!container) return;

    /* ---- Config ---- */
    const SECTIONS    = ['hero', 'about', 'projects', 'skills', 'contact'];
    const SNAP_LABELS = ['Home', 'About', 'Work', 'Skills', 'Contact'];
    const DEBOUNCE_MS = 800;   // min ms between programmatic snaps
    const THRESHOLD   = 0.55;  // IntersectionObserver visibility threshold

    /* ---- State ---- */
    let currentIdx   = 0;
    let isSnapping   = false;
    let lastSnapTime = 0;

    /* ---- Resolve section elements ---- */
    const sections = SECTIONS.map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;


    /* ================================================
       DOT NAV — build & inject
    ================================================ */
    const dotsWrap = document.createElement('nav');
    dotsWrap.className  = 'snap-dots';
    dotsWrap.setAttribute('aria-label', 'Page navigation');
    document.body.appendChild(dotsWrap);

    const dots = sections.map((sec, i) => {
        const dot = document.createElement('button');
        dot.className   = 'snap-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to ${SNAP_LABELS[i]}`);
        dot.setAttribute('title', SNAP_LABELS[i]);
        dot.addEventListener('click', () => snapToIndex(i));
        dotsWrap.appendChild(dot);
        return dot;
    });

    function updateDots(idx) {
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }


    /* ================================================
       SECTION HEIGHT HELPERS
    ================================================ */

    /**
     * Returns true if a section is "tall" —
     * i.e. its content is significantly taller than the viewport.
     * For tall sections, we allow free internal scroll before snapping.
     */
    function isTallSection(sec) {
        return sec.scrollHeight > window.innerHeight * 1.15;
    }

    /**
     * Check whether the user has scrolled to (or past) the
     * bottom of a tall section (within a small threshold).
     */
    function isAtSectionBottom(sec) {
        const rect = sec.getBoundingClientRect();
        // rect.bottom <= viewport height + tolerance
        return rect.bottom <= window.innerHeight + 8;
    }

    /**
     * Check whether we're at the very top of a section.
     */
    function isAtSectionTop(sec) {
        const rect = sec.getBoundingClientRect();
        return Math.abs(rect.top) < 8;
    }


    /* ================================================
       CORE SNAP FUNCTION
    ================================================ */
    function snapToIndex(idx) {
        const target = sections[idx];
        if (!target) return;

        const now = performance.now();
        if (isSnapping || now - lastSnapTime < DEBOUNCE_MS) return;

        isSnapping   = true;
        lastSnapTime = now;
        currentIdx   = idx;

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateDots(idx);

        // Release snap lock after animation completes
        setTimeout(() => { isSnapping = false; }, DEBOUNCE_MS);
    }


    /* ================================================
       INTERSECTION OBSERVER — track active section
       (passive — just for dot updates, not snap logic)
    ================================================ */
    const ioOptions = {
        root: container,
        threshold: [0, 0.3, 0.6, 1.0],
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= THRESHOLD) {
                const idx = sections.indexOf(entry.target);
                if (idx !== -1 && idx !== currentIdx) {
                    currentIdx = idx;
                    updateDots(idx);
                }
            }
        });
    }, ioOptions);

    sections.forEach(sec => observer.observe(sec));


    /* ================================================
       WHEEL EVENT — smart snap gate
       
       Logic:
       - If scrolling DOWN and current section is tall
         and NOT yet at its bottom → let CSS snap handle
         (free scroll inside section).
       - If scrolling DOWN and at bottom of current section
         (or section is short) → snap to next.
       - Reverse logic for UP.
    ================================================ */
    container.addEventListener('wheel', (e) => {
        const now = performance.now();
        if (isSnapping || now - lastSnapTime < DEBOUNCE_MS) return;

        const goingDown = e.deltaY > 0;
        const current   = sections[currentIdx];

        if (goingDown) {
            // Already at last section — do nothing
            if (currentIdx >= sections.length - 1) return;

            const tall = isTallSection(current);

            if (tall && !isAtSectionBottom(current)) {
                // Let user scroll through tall section freely
                return;
            }

            // Snap to next
            e.preventDefault();
            snapToIndex(currentIdx + 1);

        } else {
            // Scrolling UP
            if (currentIdx <= 0) return;

            const tall = isTallSection(current);

            if (tall && !isAtSectionTop(current)) {
                // Still inside tall section, let it scroll freely
                return;
            }

            e.preventDefault();
            snapToIndex(currentIdx - 1);
        }

    }, { passive: false });


    /* ================================================
       KEYBOARD NAVIGATION
    ================================================ */
    document.addEventListener('keydown', (e) => {
        // Don't interfere with form inputs
        const tag = document.activeElement?.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        const now = performance.now();
        if (isSnapping || now - lastSnapTime < DEBOUNCE_MS) return;

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentIdx < sections.length - 1) snapToIndex(currentIdx + 1);

        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentIdx > 0) snapToIndex(currentIdx - 1);

        } else if (e.key === 'Home') {
            e.preventDefault();
            snapToIndex(0);

        } else if (e.key === 'End') {
            e.preventDefault();
            snapToIndex(sections.length - 1);
        }
    });


    /* ================================================
       TOUCH SUPPORT — swipe to snap
    ================================================ */
    let touchStartY = 0;
    let touchStartTime = 0;
    const SWIPE_THRESHOLD = 60; // px

    container.addEventListener('touchstart', (e) => {
        touchStartY    = e.touches[0].clientY;
        touchStartTime = performance.now();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        const dy       = touchStartY - e.changedTouches[0].clientY;
        const elapsed  = performance.now() - touchStartTime;
        const velocity = Math.abs(dy) / elapsed; // px/ms

        // Only trigger snap on deliberate fast swipe
        if (Math.abs(dy) < SWIPE_THRESHOLD || velocity < 0.3) return;

        const now = performance.now();
        if (isSnapping || now - lastSnapTime < DEBOUNCE_MS) return;

        const current = sections[currentIdx];

        if (dy > 0) {
            // Swipe up (scroll down)
            if (currentIdx >= sections.length - 1) return;
            if (isTallSection(current) && !isAtSectionBottom(current)) return;
            snapToIndex(currentIdx + 1);
        } else {
            // Swipe down (scroll up)
            if (currentIdx <= 0) return;
            if (isTallSection(current) && !isAtSectionTop(current)) return;
            snapToIndex(currentIdx - 1);
        }
    }, { passive: true });


    /* ================================================
       NAV LINK OVERRIDE
       Override href="#section" clicks to use snapToIndex
       for smooth consistent behavior.
    ================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        const targetId = link.getAttribute('href').replace('#', '');
        const idx = SECTIONS.indexOf(targetId);
        if (idx === -1) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            snapToIndex(idx);
        });
    });


    /* ================================================
       SCROLL INDICATOR (hero) — snap to #projects
    ================================================ */
    const scrollIndicator = document.querySelector('.hero-scroll');
    if (scrollIndicator) {
        // Remove old listener from main.js and replace
        const newIndicator = scrollIndicator.cloneNode(true);
        scrollIndicator.replaceWith(newIndicator);
        newIndicator.addEventListener('click', () => {
            const projectsIdx = SECTIONS.indexOf('projects');
            if (projectsIdx !== -1) snapToIndex(projectsIdx);
        });
    }


    /* ================================================
       SCROLL POSITION SYNC
       On manual scroll end, sync currentIdx to
       whichever section is most visible.
    ================================================ */
    let scrollEndTimer = null;

    container.addEventListener('scroll', () => {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            // Find section most centered in viewport
            let bestIdx   = currentIdx;
            let bestScore = Infinity;

            sections.forEach((sec, i) => {
                const rect    = sec.getBoundingClientRect();
                const midSec  = rect.top + rect.height / 2;
                const midView = window.innerHeight / 2;
                const dist    = Math.abs(midSec - midView);
                if (dist < bestScore) {
                    bestScore = dist;
                    bestIdx   = i;
                }
            });

            if (bestIdx !== currentIdx) {
                currentIdx = bestIdx;
                updateDots(currentIdx);
            }
        }, 120);
    }, { passive: true });


    /* ================================================
       REDUCED MOTION — disable snap
    ================================================ */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Remove wheel override, leave CSS snap as-is
        container.style.scrollSnapType = 'y proximity';
        return;
    }

})();