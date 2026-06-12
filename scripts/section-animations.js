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
    function enterReveal(sectionEl) {
        sectionEl.querySelectorAll('.reveal').forEach(el => {
            el.classList.remove('visible');
            void el.offsetWidth;
            requestAnimationFrame(() => el.classList.add('visible'));
        });
    }

    function leaveReveal(sectionEl) {
        sectionEl.querySelectorAll('.reveal').forEach(el => el.classList.remove('visible'));
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
            sectionEl.querySelectorAll(sel).forEach(restartCSS);
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

        // Stat counters — count up from 0 every time
        sectionEl.querySelectorAll('.stat-num').forEach(el => {
            const card = el.closest('.stat-card');
            card?.classList.remove('counted');

            // Cache original target value & suffix on first run
            if (!el.dataset.targetVal) {
                const raw = el.textContent.replace(/[^0-9]/g, '');
                el.dataset.targetVal = raw || '0';
                const accentEl = el.querySelector('.stat-accent');
                el.dataset.suffix = accentEl ? accentEl.outerHTML : '';
            }

            const end    = parseInt(el.dataset.targetVal, 10);
            const suffix = el.dataset.suffix || '';
            if (!end || isNaN(end)) return;

            el.innerHTML = '0' + suffix;

            const duration  = 900;
            const startTime = performance.now();

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased    = 1 - Math.pow(1 - progress, 2);
                const current  = Math.round(eased * end);
                el.innerHTML   = current + suffix;
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.innerHTML = end + suffix;
                    card?.classList.add('counted');
                }
            }
            requestAnimationFrame(tick);
        });
    }

    function leaveAbout(sectionEl) {
        leaveReveal(sectionEl);
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

    function leaveProjects(sectionEl) {
        leaveReveal(sectionEl);
        undrawDivider(sectionEl);
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

    function leaveSkills(sectionEl) {
        leaveReveal(sectionEl);
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

    function leaveContact(sectionEl) {
        leaveReveal(sectionEl);
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
        about:    leaveAbout,
        projects: leaveProjects,
        skills:   leaveSkills,
        contact:  leaveContact,
    };

    window.addEventListener('sectionenter', (e) => {
        const id = e.detail?.id;
        const sectionEl = document.getElementById(id);
        if (!sectionEl) return;
        ENTER[id]?.(sectionEl);
    });

    window.addEventListener('sectionleave', (e) => {
        const id = e.detail?.id;
        const sectionEl = document.getElementById(id);
        if (!sectionEl) return;
        LEAVE[id]?.(sectionEl);
    });

})();