import { useEffect, useRef, useState, useCallback } from 'react';

export interface SectionDef {
  id:         string;
  label:      string;
  scrollable: boolean;
}

const SECTIONS: SectionDef[] = [
  { id: 'hero',     label: 'Home',    scrollable: false },
  { id: 'about',    label: 'About',   scrollable: true  },
  { id: 'projects', label: 'Work',    scrollable: true  },
  { id: 'skills',   label: 'Skills',  scrollable: true  },
  { id: 'contact',  label: 'Contact', scrollable: true  },
];

const TRANS_DUR  = 650; // ms
const NAV_COOL   = 800; // cooldown between navigations

function isAtTop(el: HTMLElement)    { return el.scrollTop <= 2; }
function isAtBottom(el: HTMLElement) {
  return el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
}

export function usePageSnap() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const isAnimating = useRef(false);
  const lastNav     = useRef(0);

  // Map sectionId → panel element
  const panelsRef = useRef<Map<string, HTMLElement>>(new Map());

  const getPanel = useCallback((id: string) => panelsRef.current.get(id), []);

  /** Navigate to section by index */
  const goTo = useCallback((toIdx: number, dir?: 'next' | 'prev') => {
    if (toIdx < 0 || toIdx >= SECTIONS.length) return;

    const now = performance.now();
    if (isAnimating.current || now - lastNav.current < NAV_COOL) return;

    setCurrentIdx(prev => {
      if (toIdx === prev) return prev;

      isAnimating.current = true;
      lastNav.current     = now;

      const direction = dir ?? (toIdx > prev ? 'next' : 'prev');
      const fromSec   = SECTIONS[prev];
      const toSec     = SECTIONS[toIdx];
      const fromPanel = getPanel(fromSec.id);
      const toPanel   = getPanel(toSec.id);

      if (!fromPanel || !toPanel) {
        isAnimating.current = false;
        return prev;
      }

      const exitY  = direction === 'next' ? '-12%' : '12%';
      const enterY = direction === 'next' ?  '12%' : '-12%';

      // Dispatch custom events (for section-specific animations)
      window.dispatchEvent(new CustomEvent('sectionleave',  { detail: { id: fromSec.id, direction } }));

      // Exit current
      fromPanel.style.transition = `transform ${TRANS_DUR}ms cubic-bezier(0.4,0,1,1), opacity ${TRANS_DUR * 0.75}ms ease`;
      fromPanel.style.transform  = `translateY(${exitY})`;
      fromPanel.style.opacity    = '0';

      // Prepare & enter next
      toPanel.style.transition    = 'none';
      toPanel.style.transform     = `translateY(${enterY})`;
      toPanel.style.opacity       = '0';
      toPanel.style.pointerEvents = 'none';
      toPanel.dataset.visible     = 'true';

      if (toSec.scrollable) {
        toPanel.scrollTop = direction === 'next' ? 0 : toPanel.scrollHeight;
      }

      void toPanel.getBoundingClientRect(); // force reflow

      toPanel.style.transition = `transform ${TRANS_DUR}ms cubic-bezier(0.16,1,0.3,1), opacity ${TRANS_DUR}ms ease`;
      toPanel.style.transform  = 'translateY(0)';
      toPanel.style.opacity    = '1';

      window.dispatchEvent(new CustomEvent('sectionenter', { detail: { id: toSec.id, direction } }));

      setTimeout(() => {
        fromPanel.dataset.visible   = 'false';
        fromPanel.style.cssText     = '';
        toPanel.style.pointerEvents = '';
        toPanel.style.transition    = '';
        isAnimating.current         = false;
      }, TRANS_DUR + 60);

      return toIdx;
    });
  }, [getPanel]);

  const next = useCallback(() => goTo(currentIdx + 1, 'next'), [currentIdx, goTo]);
  const prev = useCallback(() => goTo(currentIdx - 1, 'prev'), [currentIdx, goTo]);

  /** Register a panel DOM element */
  const registerPanel = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      panelsRef.current.set(id, el);
      // Initial state
      el.dataset.visible = id === SECTIONS[0].id ? 'true' : 'false';
    } else {
      panelsRef.current.delete(id);
    }
  }, []);

  // Wheel handler
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isAnimating.current) { e.preventDefault(); return; }

      const sec   = SECTIONS[currentIdx];
      const panel = getPanel(sec.id);

      if (panel && sec.scrollable) {
        if (e.deltaY > 0 && !isAtBottom(panel)) return;
        if (e.deltaY < 0 && !isAtTop(panel))    return;
      }

      e.preventDefault();
      const now = performance.now();
      if (now - lastNav.current < NAV_COOL) return;

      if (e.deltaY > 0 && currentIdx < SECTIONS.length - 1) next();
      else if (e.deltaY < 0 && currentIdx > 0) prev();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [currentIdx, next, prev, getPanel]);

  // Touch handler
  useEffect(() => {
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };

    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const dy   = startY - e.changedTouches[0].clientY;
      const now  = performance.now();
      if (Math.abs(dy) < 60 || now - lastNav.current < NAV_COOL) return;

      const sec   = SECTIONS[currentIdx];
      const panel = getPanel(sec.id);

      if (dy > 0) {
        if (currentIdx >= SECTIONS.length - 1) return;
        if (panel && sec.scrollable && !isAtBottom(panel)) return;
        next();
      } else {
        if (currentIdx <= 0) return;
        if (panel && sec.scrollable && !isAtTop(panel)) return;
        prev();
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [currentIdx, next, prev, getPanel]);

  // Keyboard handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const now   = performance.now();
      if (isAnimating.current || now - lastNav.current < NAV_COOL) return;

      const sec   = SECTIONS[currentIdx];
      const panel = getPanel(sec.id);

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (panel && sec.scrollable && !isAtBottom(panel)) return;
        e.preventDefault();
        if (currentIdx < SECTIONS.length - 1) next();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (panel && sec.scrollable && !isAtTop(panel)) return;
        e.preventDefault();
        if (currentIdx > 0) prev();
      } else if (e.key === 'Home') {
        e.preventDefault(); goTo(0, 'prev');
      } else if (e.key === 'End') {
        e.preventDefault(); goTo(SECTIONS.length - 1, 'next');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentIdx, next, prev, goTo, getPanel]);

  return { currentIdx, sections: SECTIONS, goTo, next, prev, registerPanel };
}
