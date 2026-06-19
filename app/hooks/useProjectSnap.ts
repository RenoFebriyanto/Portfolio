import { useCallback, useEffect, useRef, useState } from 'react';

export interface ProjectPanel {
  id:          string;
  label:       string;
  scrollable?: boolean;
}

const TRANS_DUR = 650;
const NAV_COOL  = 800;

export const PROJECT_ENTER = 'projectenter';
export const PROJECT_LEAVE = 'projectleave';

function isAtTop(el: HTMLElement)    { return el.scrollTop <= 2; }
function isAtBottom(el: HTMLElement) {
  return el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
}

export function useProjectSnap(panels: ProjectPanel[]) {
  const [currentIdx, setCurrentIdx]  = useState(0);
  const isAnimating   = useRef(false);
  const lastNav       = useRef(0);
  const currentIdxRef = useRef(0);
  const panelsRef     = useRef<Map<string, HTMLElement>>(new Map());

  const getPanel = useCallback((id: string) => panelsRef.current.get(id), []);

  const setPanelVisible = (el: HTMLElement, visible: boolean) => {
    el.dataset.visible = visible ? 'true' : 'false';
  };

  const goTo = useCallback((toIdx: number, dir?: 'next' | 'prev') => {
    if (toIdx < 0 || toIdx >= panels.length) return;
    const now = performance.now();
    if (isAnimating.current || now - lastNav.current < NAV_COOL) return;

    const fromIdx = currentIdxRef.current;
    if (toIdx === fromIdx) return;

    isAnimating.current = true;
    lastNav.current     = now;

    const direction = dir ?? (toIdx > fromIdx ? 'next' : 'prev');
    const from      = panels[fromIdx];
    const to        = panels[toIdx];
    const fromEl    = getPanel(from.id);
    const toEl      = getPanel(to.id);
    if (!fromEl || !toEl) { isAnimating.current = false; return; }

    const exitY  = direction === 'next' ? '-8%' : '8%';
    const enterY = direction === 'next' ?  '8%' : '-8%';

    window.dispatchEvent(new CustomEvent(PROJECT_LEAVE, { detail: { id: from.id, direction } }));

    fromEl.style.transition    = `transform ${TRANS_DUR}ms cubic-bezier(0.4,0,1,1), opacity ${TRANS_DUR * 0.75}ms ease`;
    fromEl.style.transform     = `translateY(${exitY})`;
    fromEl.style.opacity       = '0';
    fromEl.style.pointerEvents = 'none';

    toEl.style.transition    = 'none';
    toEl.style.transform     = `translateY(${enterY})`;
    toEl.style.opacity       = '0';
    toEl.style.pointerEvents = 'none';
    setPanelVisible(toEl, true);

    if (to.scrollable) {
      toEl.scrollTop = direction === 'next' ? 0 : toEl.scrollHeight;
    }

    void toEl.getBoundingClientRect();

    toEl.style.transition    = `transform ${TRANS_DUR}ms cubic-bezier(0.16,1,0.3,1), opacity ${TRANS_DUR}ms ease`;
    toEl.style.transform     = 'translateY(0)';
    toEl.style.opacity       = '1';

    currentIdxRef.current = toIdx;
    setCurrentIdx(toIdx);

    window.dispatchEvent(new CustomEvent(PROJECT_ENTER, { detail: { id: to.id, direction } }));

    setTimeout(() => {
      setPanelVisible(fromEl, false);
      fromEl.style.cssText     = '';
      toEl.style.transition    = '';
      toEl.style.pointerEvents = '';
      isAnimating.current      = false;
    }, TRANS_DUR + 60);
  }, [panels, getPanel]);

  const next = useCallback(() => goTo(currentIdxRef.current + 1, 'next'), [goTo]);
  const prev = useCallback(() => goTo(currentIdxRef.current - 1, 'prev'), [goTo]);

  const registerPanel = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      panelsRef.current.set(id, el);
      setPanelVisible(el, id === panels[0]?.id);
    } else {
      panelsRef.current.delete(id);
    }
  }, [panels]);

  /* ── Wheel ── */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isAnimating.current) { e.preventDefault(); return; }
      const idx   = currentIdxRef.current;
      const panel = panels[idx];
      const el    = getPanel(panel.id);
      if (el && panel.scrollable) {
        if (e.deltaY > 0 && !isAtBottom(el)) return;
        if (e.deltaY < 0 && !isAtTop(el))    return;
      }
      e.preventDefault();
      const now = performance.now();
      if (now - lastNav.current < NAV_COOL) return;
      if (e.deltaY > 0) next(); else prev();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [next, prev, getPanel, panels]);

  /* ── Touch ── */
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd   = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const dy  = startY - e.changedTouches[0].clientY;
      const now = performance.now();
      if (Math.abs(dy) < 60 || now - lastNav.current < NAV_COOL) return;
      const idx   = currentIdxRef.current;
      const panel = panels[idx];
      const el    = getPanel(panel.id);
      if (dy > 0) {
        if (idx >= panels.length - 1) return;
        if (el && panel.scrollable && !isAtBottom(el)) return;
        next();
      } else {
        if (idx <= 0) return;
        if (el && panel.scrollable && !isAtTop(el)) return;
        prev();
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [next, prev, getPanel, panels]);

  /* ── Keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const now = performance.now();
      if (isAnimating.current || now - lastNav.current < NAV_COOL) return;
      const idx   = currentIdxRef.current;
      const panel = panels[idx];
      const el    = getPanel(panel.id);
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (el && panel.scrollable && !isAtBottom(el)) return;
        e.preventDefault();
        if (idx < panels.length - 1) next();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (el && panel.scrollable && !isAtTop(el)) return;
        e.preventDefault();
        if (idx > 0) prev();
      } else if (e.key === 'Home') {
        e.preventDefault(); goTo(0, 'prev');
      } else if (e.key === 'End') {
        e.preventDefault(); goTo(panels.length - 1, 'next');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goTo, getPanel, panels]);

  return { currentIdx, goTo, next, prev, registerPanel };
}