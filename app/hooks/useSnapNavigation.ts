import { useCallback, useEffect, useRef, useState } from 'react';

export interface SnapPanelDef {
  id:          string;
  label:       string;
  scrollable?: boolean;
}

export interface SnapNavigationOptions {
  panels:              SnapPanelDef[];
  enterEvent?:         string;
  leaveEvent?:         string;
  transitionDuration?: number;
  navCooldown?:        number;
}

const DEFAULT_TRANS_DUR = 650;
const DEFAULT_NAV_COOL  = 800;

function isAtTop(el: HTMLElement) {
  return el.scrollTop <= 4;
}

function isAtBottom(el: HTMLElement) {
  return el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
}

function hasScrollableContent(el: HTMLElement): boolean {
  return el.scrollHeight > el.clientHeight + 8;
}

/**
 * Generic snap-scroll panel navigation engine.
 * Dipakai oleh usePageSnap (homepage) dan useProjectSnap (halaman detail
 * project) — logic wheel/touch/keyboard/goTo identik, hanya beda daftar
 * panel & nama custom event yang di-dispatch.
 */
export function useSnapNavigation({
  panels,
  enterEvent = 'sectionenter',
  leaveEvent = 'sectionleave',
  transitionDuration = DEFAULT_TRANS_DUR,
  navCooldown = DEFAULT_NAV_COOL,
}: SnapNavigationOptions) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const isAnimating   = useRef(false);
  const lastNav       = useRef(0);
  const currentIdxRef = useRef(0);
  const panelsRef     = useRef<Map<string, HTMLElement>>(new Map());

  const panelDefsRef = useRef(panels);
  useEffect(() => {
    panelDefsRef.current = panels;
  }, [panels]);

  const getPanel = useCallback((id: string) => panelsRef.current.get(id), []);

  const setPanelVisible = (el: HTMLElement, visible: boolean) => {
    el.dataset.visible = visible ? 'true' : 'false';
  };

  const goTo = useCallback((toIdx: number, dir?: 'next' | 'prev') => {
    const defs = panelDefsRef.current;
    if (toIdx < 0 || toIdx >= defs.length) return;
    const now = performance.now();
    if (isAnimating.current || now - lastNav.current < navCooldown) return;

    const fromIdx = currentIdxRef.current;
    if (toIdx === fromIdx) return;

    isAnimating.current = true;
    lastNav.current     = now;

    const direction = dir ?? (toIdx > fromIdx ? 'next' : 'prev');
    const from = defs[fromIdx];
    const to   = defs[toIdx];
    const fromEl = getPanel(from.id);
    const toEl   = getPanel(to.id);
    if (!fromEl || !toEl) { isAnimating.current = false; return; }

    const exitY  = direction === 'next' ? '-8%' : '8%';
    const enterY = direction === 'next' ?  '8%' : '-8%';

    window.dispatchEvent(new CustomEvent(leaveEvent, { detail: { id: from.id, direction } }));

    fromEl.style.transition    = `transform ${transitionDuration}ms cubic-bezier(0.4,0,1,1), opacity ${transitionDuration * 0.75}ms ease`;
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

    void toEl.getBoundingClientRect(); // force reflow

    toEl.style.transition = `transform ${transitionDuration}ms cubic-bezier(0.16,1,0.3,1), opacity ${transitionDuration}ms ease`;
    toEl.style.transform  = 'translateY(0)';
    toEl.style.opacity    = '1';

    currentIdxRef.current = toIdx;
    setCurrentIdx(toIdx);

    window.dispatchEvent(new CustomEvent(enterEvent, { detail: { id: to.id, direction } }));

    setTimeout(() => {
      setPanelVisible(fromEl, false);
      fromEl.style.cssText     = '';
      toEl.style.transition    = '';
      toEl.style.pointerEvents = '';
      isAnimating.current      = false;
    }, transitionDuration + 60);
  }, [getPanel, enterEvent, leaveEvent, transitionDuration, navCooldown]);

  const next = useCallback(() => goTo(currentIdxRef.current + 1, 'next'), [goTo]);
  const prev = useCallback(() => goTo(currentIdxRef.current - 1, 'prev'), [goTo]);

  const registerPanel = useCallback((id: string, el: HTMLElement | null) => {
    const defs = panelDefsRef.current;
    if (el) {
      panelsRef.current.set(id, el);
      setPanelVisible(el, id === defs[0]?.id);
    } else {
      panelsRef.current.delete(id);
    }
  }, []);

  /* ── Wheel ── */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isAnimating.current) { e.preventDefault(); return; }

      const idx   = currentIdxRef.current;
      const panel = panelDefsRef.current[idx];
      const el    = getPanel(panel.id);

      if (el && panel.scrollable && hasScrollableContent(el)) {
        if (e.deltaY > 0 && !isAtBottom(el)) return;
        if (e.deltaY < 0 && !isAtTop(el))    return;
      }

      e.preventDefault();
      const now = performance.now();
      if (now - lastNav.current < navCooldown) return;
      if (e.deltaY > 0) next(); else prev();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [next, prev, getPanel, navCooldown]);

  /* ── Touch ── */
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd   = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const dy  = startY - e.changedTouches[0].clientY;
      const now = performance.now();
      if (Math.abs(dy) < 60 || now - lastNav.current < navCooldown) return;

      const idx   = currentIdxRef.current;
      const panel = panelDefsRef.current[idx];
      const el    = getPanel(panel.id);

      if (dy > 0) {
        if (idx >= panelDefsRef.current.length - 1) return;
        if (el && panel.scrollable && hasScrollableContent(el) && !isAtBottom(el)) return;
        next();
      } else {
        if (idx <= 0) return;
        if (el && panel.scrollable && hasScrollableContent(el) && !isAtTop(el)) return;
        prev();
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [next, prev, getPanel, navCooldown]);

  /* ── Keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const now = performance.now();
      if (isAnimating.current || now - lastNav.current < navCooldown) return;

      const idx   = currentIdxRef.current;
      const panel = panelDefsRef.current[idx];
      const el    = getPanel(panel.id);
      const scrollable = !!(el && panel.scrollable && hasScrollableContent(el));

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (scrollable && !isAtBottom(el!)) return;
        e.preventDefault();
        if (idx < panelDefsRef.current.length - 1) next();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (scrollable && !isAtTop(el!)) return;
        e.preventDefault();
        if (idx > 0) prev();
      } else if (e.key === 'Home') {
        e.preventDefault(); goTo(0, 'prev');
      } else if (e.key === 'End') {
        e.preventDefault(); goTo(panelDefsRef.current.length - 1, 'next');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goTo, getPanel]);

  return { currentIdx, goTo, next, prev, registerPanel };
}