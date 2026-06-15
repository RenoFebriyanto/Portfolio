import { useEffect, useRef } from 'react';

/**
 * Port of section-animations.js.
 * Listens to 'sectionenter' / 'sectionleave' CustomEvents dispatched by usePageSnap
 * and triggers per-section animations: reveal stagger, skill bars, stat counters, typing effect.
 */
export function useSectionAnimations() {
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // ── Helpers ──────────────────────────────────────────────
    function retrigger(el: Element, cls: string, delay = 0) {
      el.classList.remove(cls);
      void (el as HTMLElement).offsetWidth;
      if (delay > 0) setTimeout(() => el.classList.add(cls), delay);
      else requestAnimationFrame(() => el.classList.add(cls));
    }

    function enterReveal(sectionEl: HTMLElement) {
  sectionEl.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
    el.classList.remove('visible', 'revealed', 'exiting');
    void el.offsetWidth;
    requestAnimationFrame(() => el.classList.add('visible'));   // <-- ganti ke 'visible'
  });
}

    function leaveReveal(sectionEl: HTMLElement) {
      sectionEl.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
        el.classList.remove('revealed');
      });
    }

    function drawDivider(sectionEl: HTMLElement) {
      const divider = sectionEl.querySelector<HTMLElement>('.section-divider');
      if (divider) retrigger(divider, 'line-drawn');
    }

    function undrawDivider(sectionEl: HTMLElement) {
      sectionEl.querySelector('.section-divider')?.classList.remove('line-drawn');
    }

    // ── HERO ─────────────────────────────────────────────────
    const HERO_SELECTORS = [
      '.hero-status', '.hero-heading-line span',
      '.hero-desc', '.hero-tags', '.hero-cta', '.hero-scroll',
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
        sectionEl.querySelectorAll<HTMLElement>(sel).forEach(el => el.classList.add('motion-exit'));
      });
    }

    // ── ABOUT ────────────────────────────────────────────────
    function enterAbout(sectionEl: HTMLElement) {
      enterReveal(sectionEl);

      const identity = sectionEl.querySelector('.about-identity, .about__card');
      if (identity) retrigger(identity, 'shimmer-ready');

      const avatar = sectionEl.querySelector<HTMLElement>('#avatar-wrap, .avatar-wrap');
      if (avatar) retrigger(avatar, 'photo-ready', 200);

      // Stat counters
      sectionEl.querySelectorAll<HTMLElement>('.stat-num, .about__stat-value').forEach(el => {
        const raw = el.dataset.count ?? el.textContent?.replace(/[^\d.]/g, '') ?? '';
        if (!raw || isNaN(parseFloat(raw))) return;

        const isDecimal = raw.includes('.');
        const end       = parseFloat(raw);
        const decimals  = isDecimal ? (raw.split('.')[1]?.length ?? 1) : 0;
        const accentEl  = el.querySelector('.stat-accent');
        const suffix    = accentEl ? accentEl.outerHTML : '';

        el.innerHTML = `${(0).toFixed(decimals)}${suffix}`;

        const startTime = performance.now();
        const duration  = 900;

        (function tick(now: number) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 2);
          el.innerHTML   = `${(eased * end).toFixed(decimals)}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
          else el.innerHTML = `${end.toFixed(decimals)}${suffix}`;
        })(performance.now());
      });
    }

    function leaveAbout(sectionEl: HTMLElement) {
      leaveReveal(sectionEl);
      sectionEl.querySelector('.about-identity, .about__card')?.classList.remove('shimmer-ready');
      sectionEl.querySelector('#avatar-wrap, .avatar-wrap')?.classList.remove('photo-ready');
    }

    // ── PROJECTS ─────────────────────────────────────────────
    function enterProjects(sectionEl: HTMLElement) {
      enterReveal(sectionEl);
      drawDivider(sectionEl);
    }

    function leaveProjects(sectionEl: HTMLElement) {
      leaveReveal(sectionEl);
      undrawDivider(sectionEl);
      sectionEl.querySelectorAll<HTMLElement>('.project-card').forEach(card => {
        card.style.transform = '';
        card.classList.remove('tilting');
      });
    }

    // ── SKILLS ───────────────────────────────────────────────
    function enterSkills(sectionEl: HTMLElement) {
      enterReveal(sectionEl);
      drawDivider(sectionEl);
      sectionEl.querySelectorAll<HTMLElement>('.skill-group, .skills__category').forEach(group => {
        retrigger(group, 'visible');
      });
      // Animate skill bars
      sectionEl.querySelectorAll<HTMLElement>('.skill-item__bar').forEach(bar => {
        bar.classList.remove('animated');
        void bar.offsetWidth;
        requestAnimationFrame(() => bar.classList.add('animated'));
      });
    }

    function leaveSkills(sectionEl: HTMLElement) {
      leaveReveal(sectionEl);
      undrawDivider(sectionEl);
      sectionEl.querySelectorAll('.skill-group, .skills__category').forEach(g => g.classList.remove('visible'));
      sectionEl.querySelectorAll('.skill-item__bar').forEach(b => b.classList.remove('animated'));
    }

    // ── CONTACT ──────────────────────────────────────────────
    function enterContact(sectionEl: HTMLElement) {
      enterReveal(sectionEl);
      drawDivider(sectionEl);

      const el = sectionEl.querySelector<HTMLElement>('.contact-eyebrow, .contact__eyebrow');
      if (!el) return;

      if (!el.dataset.fullText) el.dataset.fullText = el.textContent?.trim() ?? '';
      const fullText = el.dataset.fullText;

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

    function leaveContact(sectionEl: HTMLElement) {
      leaveReveal(sectionEl);
      undrawDivider(sectionEl);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    }

    // ── Dispatch table ────────────────────────────────────────
    const ENTER: Record<string, (el: HTMLElement) => void> = {
      hero:     enterHero,
      about:    enterAbout,
      projects: enterProjects,
      skills:   enterSkills,
      contact:  enterContact,
    };

    const LEAVE: Record<string, (el: HTMLElement) => void> = {
      hero:     leaveHero,
      about:    leaveAbout,
      projects: leaveProjects,
      skills:   leaveSkills,
      contact:  leaveContact,
    };

    const onEnter = (e: Event) => {
      const id  = (e as CustomEvent).detail?.id as string;
      const sec = document.getElementById(id);
      if (sec) ENTER[id]?.(sec);
    };

    const onLeave = (e: Event) => {
      const id  = (e as CustomEvent).detail?.id as string;
      const sec = document.getElementById(id);
      if (sec) LEAVE[id]?.(sec);
    };

    window.addEventListener('sectionenter', onEnter);
    window.addEventListener('sectionleave', onLeave);

    // Trigger first section on mount
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
