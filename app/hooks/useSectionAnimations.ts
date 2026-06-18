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

    const ENTER: Record<string, (el: HTMLElement, dir?: string) => void> = {
  projects: enterProjects,
  skills:   enterSkills,
  contact:  enterContact,
};

const LEAVE: Record<string, (el: HTMLElement, dir?: string) => void> = {
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