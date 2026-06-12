/* ================================================
   SECTION-ANIMATIONS.JS — Replay-on-enter animations
   
   Listens to 'sectionenter' / 'sectionleave' events
   dispatched by pagescroll.js and (re)plays the
   per-section motion: hero reveal, .reveal stagger,
   skill bars, identity shimmer, avatar reveal,
   stat counters, section divider draw, typed eyebrow.
================================================ */

(function () {

    /* ---- Restart a CSS keyframe animation ---- */
    function restartCSS(el) {
        if (!el) return;
        el.style.animation = 'none';
        void el.offsetWidth; // force reflow
        el.style.animation = '';
    }

    /* ---- Toggle a class off/on with reflow ---- */
    function retrigger(el, className, delay = 0) {
        if (!el) return;
        el.classList.remove(className);
        void el.offsetWidth;
        if (delay > 0) {
            setTimeout(() => el.classList.add(className), delay);
        } else {
            requestAnimationFrame(() => el.classList.add(className));
        }
    }


    /* ================================================
       GENERIC: .reveal elements
    ================================================ */
    const EXIT_STAGGER_CLASSES = ['exit-stagger-1', 'exit-stagger-2', 'exit-stagger-3', 'exit-stagger-4', 'exit-stagger-5'];

    function clearExitClasses(el) {
        el.classList.remove('exiting', 'exit-next', 'exit-prev', ...EXIT_STAGGER_CLASSES);
    }

    function enterReveal(sectionEl) {
        sectionEl.querySelectorAll('.reveal').forEach(el => {
            clearExitClasses(el);
            el.classList.remove('visible');
            void el.offsetWidth;
            requestAnimationFrame(() => el.classList.add('visible'));
        });
    }

    /* Animate .reveal elements OUT before the panel slides away.
       direction: 'next' → content drifts up (panel exits upward)
                  'prev' → content drifts down (panel exits downward)
       Keeps the per-element motion continuous with the page swap. */
    function leaveReveal(sectionEl, direction = 'next') {
        const exitClass = direction === 'prev' ? 'exit-prev' : 'exit-next';
        const items = Array.from(sectionEl.querySelectorAll('.reveal'));

        items.forEach((el, i) => {
            clearExitClasses(el);
            const stagger = EXIT_STAGGER_CLASSES[Math.min(i, EXIT_STAGGER_CLASSES.length - 1)];
            el.classList.add('exiting', exitClass, stagger);
        });

        // Clean up once the exit transition has fully finished,
        // so the element is reset for the next 'sectionenter'.
        setTimeout(() => {
            items.forEach(el => {
                el.classList.remove('visible');
                clearExitClasses(el);
            });
        }, 520);
    }


    /* ================================================
       GENERIC: section divider line draw
    ================================================ */
    function drawDivider(sectionEl) {
        const divider = sectionEl.querySelector('.section-divider');
        if (!divider) return;
        retrigger(divider, 'line-drawn');
    }

    function undrawDivider(sectionEl) {
        sectionEl.querySelector('.section-divider')?.classList.remove('line-drawn');
    }


    /* ================================================
       HERO — CSS keyframe entrance animations
    ================================================ */
    const HERO_SELECTORS = [
        '.hero-status',
        '.hero-heading-line span',
        '.hero-desc',
        '.hero-tags',
        '.hero-cta',
        '.hero-scroll',
    ];

    function enterHero(sectionEl) {
        HERO_SELECTORS.forEach(sel => {
            sectionEl.querySelectorAll(sel).forEach(el => {
                el.classList.remove('motion-exit');
                restartCSS(el);
            });
        });
    }

    /* Reverse the entrance animation as the hero panel slides away */
    function leaveHero(sectionEl) {
        HERO_SELECTORS.forEach(sel => {
            sectionEl.querySelectorAll(sel).forEach(el => {
                el.classList.add('motion-exit');
            });
        });
    }


    /* ================================================
       ABOUT — reveal, shimmer, avatar, stat counters
    ================================================ */
    function enterAbout(sectionEl) {
        enterReveal(sectionEl);

        // Identity card shimmer sweep
        const identity = sectionEl.querySelector('.about-identity');
        if (identity) retrigger(identity, 'shimmer-ready');

        // Avatar photo reveal (Ken Burns + corner dot)
        const avatar = sectionEl.querySelector('#avatar-wrap');
        if (avatar) retrigger(avatar, 'photo-ready', 200);

        // Stat counters — count up from 0, support decimal & dynamic values
sectionEl.querySelectorAll('.stat-num').forEach(el => {
    const card   = el.closest('.stat-card');
    const rawKey = el.dataset.raw || '';  // special key dari about-render

    card?.classList.remove('counted');

    /* Resolve nilai terkini setiap kali section muncul */
    let resolvedNum;
    if (rawKey === 'YEARS_ACTIVE') {
        // Hitung ulang realtime
        const d    = window.ABOUT_DATA || {};
        const startYear  = d.startYear  || 2022;
        const startMonth = (d.startMonth || 1) - 1;
        const start      = new Date(startYear, startMonth, 1);
        const diffYears  = (Date.now() - start) / (1000 * 60 * 60 * 24 * 365.25);
        resolvedNum = diffYears.toFixed(1);
    } else if (rawKey === 'PROJECT_COUNT') {
        resolvedNum = String(Array.isArray(window.PROJECTS_DATA) ? window.PROJECTS_DATA.length : 0);
    } else {
        // Nilai statis — ambil dari teks, skip '∞'
        const raw = el.textContent.replace(/[^0-9.]/g, '');
        resolvedNum = raw || null;
    }

    const accentEl = el.querySelector('.stat-accent');
    const suffix   = accentEl ? accentEl.outerHTML : '';

    /* Angka infinity / non-numerik — tampilkan langsung tanpa animasi */
    if (!resolvedNum || isNaN(parseFloat(resolvedNum))) {
        card?.classList.add('counted');
        return;
    }

    const isDecimal = resolvedNum.includes('.');
    const end       = parseFloat(resolvedNum);
    const decimals  = isDecimal ? (resolvedNum.split('.')[1]?.length || 1) : 0;

    el.innerHTML = (0).toFixed(decimals) + suffix;

    const duration  = 900;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 2);
        const current  = eased * end;
        el.innerHTML   = current.toFixed(decimals) + suffix;
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.innerHTML = end.toFixed(decimals) + suffix;
            card?.classList.add('counted');
        }
    }
    requestAnimationFrame(tick);
});
    }

    function leaveAbout(sectionEl, direction) {
        leaveReveal(sectionEl, direction);
        sectionEl.querySelector('.about-identity')?.classList.remove('shimmer-ready');
        sectionEl.querySelector('#avatar-wrap')?.classList.remove('photo-ready');
    }


    /* ================================================
       PROJECTS — reveal + divider
    ================================================ */
    function enterProjects(sectionEl) {
        enterReveal(sectionEl);
        drawDivider(sectionEl);
    }

    function leaveProjects(sectionEl, direction) {
        leaveReveal(sectionEl, direction);
        undrawDivider(sectionEl);

        // Reset any active 3D tilt so cards don't return mid-tilt
        sectionEl.querySelectorAll('.project-card').forEach(card => {
            card.style.transform = '';
            card.classList.remove('tilting');
        });
    }


    /* ================================================
       SKILLS — reveal + divider + skill bars
    ================================================ */
    function enterSkills(sectionEl) {
        enterReveal(sectionEl);
        drawDivider(sectionEl);

        sectionEl.querySelectorAll('.skill-group').forEach(group => {
            retrigger(group, 'visible');
        });
    }

    function leaveSkills(sectionEl, direction) {
        leaveReveal(sectionEl, direction);
        undrawDivider(sectionEl);
        sectionEl.querySelectorAll('.skill-group').forEach(g => g.classList.remove('visible'));
    }


    /* ================================================
       CONTACT — reveal + divider + typed eyebrow
    ================================================ */
    let typingTimer = null;

    function enterContact(sectionEl) {
        enterReveal(sectionEl);
        drawDivider(sectionEl);

        const el = sectionEl.querySelector('.contact-eyebrow');
        if (!el) return;

        if (!el.dataset.fullText) {
            el.dataset.fullText = el.textContent.trim();
        }
        const fullText = el.dataset.fullText;

        clearTimeout(typingTimer);
        el.textContent = '';
        el.classList.add('motion-typed');

        let charIdx = 0;
        function type() {
            if (charIdx < fullText.length) {
                el.textContent = fullText.slice(0, ++charIdx);
                typingTimer = setTimeout(type, 38 + Math.random() * 22);
            } else {
                typingTimer = setTimeout(() => el.classList.remove('motion-typed'), 1800);
            }
        }
        typingTimer = setTimeout(type, 400);
    }

    function leaveContact(sectionEl, direction) {
        leaveReveal(sectionEl, direction);
        undrawDivider(sectionEl);
        clearTimeout(typingTimer);
    }


    /* ================================================
       DISPATCH TABLE
    ================================================ */
    const ENTER = {
        hero:     enterHero,
        about:    enterAbout,
        projects: enterProjects,
        skills:   enterSkills,
        contact:  enterContact,
    };

    const LEAVE = {
        hero:     leaveHero,
        about:    leaveAbout,
        projects: leaveProjects,
        skills:   leaveSkills,
        contact:  leaveContact,
    };

    window.addEventListener('sectionenter', (e) => {
        const id = e.detail?.id;
        const sectionEl = document.getElementById(id);
        if (!sectionEl) return;
        ENTER[id]?.(sectionEl, e.detail?.direction);
    });

    window.addEventListener('sectionleave', (e) => {
        const id = e.detail?.id;
        const sectionEl = document.getElementById(id);
        if (!sectionEl) return;
        LEAVE[id]?.(sectionEl, e.detail?.direction);
    });

})();