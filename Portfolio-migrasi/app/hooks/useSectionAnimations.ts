import { useEffect, useRef } from 'react';

/**
 * Port of vanilla section-animations.js.
 * Listens to 'sectionenter' / 'sectionleave' CustomEvents dispatched by usePageSnap.
 *
 * KEY FIX: Uses '.visible' class (matching vanilla + animations.css .reveal.visible)
 * NOT '.revealed' which was causing reveal animations to not trigger.
 */
export function useSectionAnimations() {
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    /* ── Helpers ── */
    const EXIT_STAGGER = [
      'exit-stagger-1', 'exit-stagger-2', 'exit-stagger-3',
      'exit-stagger-4', 'exit-stagger-5',
    ];

    function clearExitClasses(el: Element) {
      el.classList.remove('exiting', 'exit-next', 'exit-prev', ...EXIT_STAGGER);
    }

    function enterReveal(sectionEl: HTMLElement) {
      sectionEl.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
        clearExitClasses(el);
        el.classList.remove('visible');
        void el.offsetWidth; // force reflow
        requestAnimationFrame(() => el.classList.add('visible'));
      });
    }

    function leaveReveal(sectionEl: HTMLElement, direction: string = 'next') {
      const exitClass = direction === 'prev' ? 'exit-prev' : 'exit-next';
      const items = Array.from(sectionEl.querySelectorAll('.reveal'));
      items.forEach((el, i) => {
        clearExitClasses(el);
        const stagger = EXIT_STAGGER[Math.min(i, EXIT_STAGGER.length - 1)];
        el.classList.add('exiting', exitClass, stagger);
      });
      setTimeout(() => {
        items.forEach(el => {
          el.classList.remove('visible');
          clearExitClasses(el);
        });
      }, 520);
    }

    function retrigger(el: Element, cls: string, delay = 0) {
      el.classList.remove(cls);
      void (el as HTMLElement).offsetWidth;
      if (delay > 0) setTimeout(() => el.classList.add(cls), delay);
      else requestAnimationFrame(() => el.classList.add(cls));
    }

    function drawDivider(sectionEl: HTMLElement) {
      const divider = sectionEl.querySelector<HTMLElement>('.section-divider');
      if (divider) retrigger(divider, 'line-drawn');
    }

    function undrawDivider(sectionEl: HTMLElement) {
      sectionEl.querySelector('.section-divider')?.classList.remove('line-drawn');
    }

    /* ── HERO ── */
    const HERO_SELECTORS = [
      '.hero-status',
      '.hero-heading-line span',
      '.hero-desc',
      '.hero-tags',
      '.hero-cta',
      '.hero-scroll',
    ];

    function enterHero(sectionEl: HTMLElement) {
      sectionEl.querySelectorAll<HTMLElement>(HERO_SELECTORS.join(',')).forEach(el => {
        el.classList.remove('motion-exit');
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });
    }

    function leaveHero(sectionEl: HTMLElement) {
      HERO_SELECTORS.forEach(sel => {
        sectionEl.querySelectorAll<HTMLElement>(sel).forEach(el => {
          el.classList.add('motion-exit');
        });
      });
    }

    /* ── ABOUT ── */
    function enterAbout(sectionEl: HTMLElement) {
      enterReveal(sectionEl);

      // Identity card shimmer
      const identity = sectionEl.querySelector('.about-identity');
      if (identity) retrigger(identity, 'shimmer-ready');

      // Avatar photo reveal
      const avatar = sectionEl.querySelector<HTMLElement>('#avatar-wrap');
      if (avatar) retrigger(avatar, 'photo-ready', 200);

      // Stat counters — count up from 0
      sectionEl.querySelectorAll<HTMLElement>('.stat-num').forEach(el => {
        const card   = el.closest('.stat-card');
        const rawKey = el.dataset.raw ?? '';
        card?.classList.remove('counted');

        let resolvedNum: string;
        if (rawKey === 'YEARS_ACTIVE') {
          const d         = (window as unknown as Record<string, { startYear?: number; startMonth?: number }>).ABOUT_DATA ?? {};
          const startYear  = d.startYear  ?? 2023;
          const startMonth = (d.startMonth ?? 1) - 1;
          const start      = new Date(startYear, startMonth, 1);
          const diffYears  = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          resolvedNum = diffYears.toFixed(1);
        } else if (rawKey === 'PROJECT_COUNT') {
          const pd = (window as unknown as Record<string, unknown[]>).PROJECTS_DATA;
          resolvedNum = String(Array.isArray(pd) ? pd.length : 6);
        } else {
          const raw = el.textContent?.replace(/[^0-9.]/g, '') ?? '';
          resolvedNum = raw || '';
        }

        const accentEl = el.querySelector('.stat-accent');
        const suffix   = accentEl ? accentEl.outerHTML : '';

        if (!resolvedNum || isNaN(parseFloat(resolvedNum))) {
          card?.classList.add('counted');
          return;
        }

        const isDecimal = resolvedNum.includes('.');
        const end       = parseFloat(resolvedNum);
        const decimals  = isDecimal ? (resolvedNum.split('.')[1]?.length ?? 1) : 0;
        el.innerHTML    = `${(0).toFixed(decimals)}${suffix}`;

        const duration  = 900;
        const startTime = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 2);
          el.innerHTML   = `${(eased * end).toFixed(decimals)}${suffix}`;
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.innerHTML = `${end.toFixed(decimals)}${suffix}`;
            card?.classList.add('counted');
          }
        }
        requestAnimationFrame(tick);
      });
    }

    function leaveAbout(sectionEl: HTMLElement, direction?: string) {
      leaveReveal(sectionEl, direction);
      sectionEl.querySelector('.about-identity')?.classList.remove('shimmer-ready');
      sectionEl.querySelector('#avatar-wrap')?.classList.remove('photo-ready');
    }

    /* ── PROJECTS ── */
    function enterProjects(sectionEl: HTMLElement) {
      enterReveal(sectionEl);
      drawDivider(sectionEl);
    }

    function leaveProjects(sectionEl: HTMLElement, direction?: string) {
      leaveReveal(sectionEl, direction);
      undrawDivider(sectionEl);
      sectionEl.querySelectorAll<HTMLElement>('.project-card').forEach(card => {
        card.style.transform = '';
        card.classList.remove('tilting');
      });
    }

    /* ── SKILLS ── */
    function enterSkills(sectionEl: HTMLElement) {
      enterReveal(sectionEl);
      drawDivider(sectionEl);
      sectionEl.querySelectorAll<HTMLElement>('.skill-group').forEach(group => {
        retrigger(group, 'visible');
      });
    }

    function leaveSkills(sectionEl: HTMLElement, direction?: string) {
      leaveReveal(sectionEl, direction);
      undrawDivider(sectionEl);
      sectionEl.querySelectorAll('.skill-group').forEach(g => g.classList.remove('visible'));
    }

    /* ── CONTACT ── */
    function enterContact(sectionEl: HTMLElement) {
      enterReveal(sectionEl);
      drawDivider(sectionEl);

      const el = sectionEl.querySelector<HTMLElement>('.contact-eyebrow');
      if (!el) return;

      if (!el.dataset.fullText) {
        el.dataset.fullText = el.textContent?.trim() ?? '';
      }
      const fullText = el.dataset.fullText ?? '';

      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      el.textContent = '';
      el.classList.add('motion-typed');

      let charIdx = 0;
      const type = () => {
        if (charIdx < fullText.length) {
          el.textContent = fullText.slice(0, ++charIdx);
          typingTimerRef.current = setTimeout(type, 38 + Math.random() * 22);
        } else {
          typingTimerRef.current = setTimeout(() => el.classList.remove('motion-typed'), 1800);
        }
      };
      typingTimerRef.current = setTimeout(type, 400);
    }

    function leaveContact(sectionEl: HTMLElement, direction?: string) {
      leaveReveal(sectionEl, direction);
      undrawDivider(sectionEl);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    }

    /* ── Dispatch table ── */
    const ENTER: Record<string, (el: HTMLElement, dir?: string) => void> = {
      hero:     enterHero,
      about:    enterAbout,
      projects: enterProjects,
      skills:   enterSkills,
      contact:  enterContact,
    };

    const LEAVE: Record<string, (el: HTMLElement, dir?: string) => void> = {
      hero:     leaveHero,
      about:    leaveAbout,
      projects: leaveProjects,
      skills:   leaveSkills,
      contact:  leaveContact,
    };

    const onEnter = (e: Event) => {
      const detail    = (e as CustomEvent).detail as { id?: string; direction?: string };
      const id        = detail?.id;
      const direction = detail?.direction;
      const sec       = id ? document.getElementById(id) : null;
      if (sec && id) ENTER[id]?.(sec, direction);
    };

    const onLeave = (e: Event) => {
      const detail    = (e as CustomEvent).detail as { id?: string; direction?: string };
      const id        = detail?.id;
      const direction = detail?.direction;
      const sec       = id ? document.getElementById(id) : null;
      if (sec && id) LEAVE[id]?.(sec, direction);
    };

    window.addEventListener('sectionenter', onEnter);
    window.addEventListener('sectionleave', onLeave);

    // Trigger hero entrance on mount
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('sectionenter', { detail: { id: 'hero' } }));
    });

    return () => {
      window.removeEventListener('sectionenter', onEnter);
      window.removeEventListener('sectionleave', onLeave);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);
}