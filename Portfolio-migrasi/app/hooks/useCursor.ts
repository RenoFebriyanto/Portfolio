import { useEffect } from 'react';

export function useCursor() {
  useEffect(() => {
    // Bail on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ring = document.querySelector<HTMLElement>('.cursor-ring');
    const dot  = document.querySelector<HTMLElement>('.cursor-dot');
    if (!ring || !dot) return;

    let mx = 0, my = 0;       // real mouse
    let rx = 0, ry = 0;       // ring lerp
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top  = `${my}px`;
      ring.classList.remove('hidden');
      dot.classList.remove('hidden');
    };

    const onLeave = () => {
      ring.classList.add('hidden');
      dot.classList.add('hidden');
    };

    const onHoverIn  = () => { ring.classList.add('hovered'); dot.classList.add('hovered'); };
    const onHoverOut = () => { ring.classList.remove('hovered'); dot.classList.remove('hovered'); };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top  = `${ry}px`;
    };

    const attachHover = () => {
      document.querySelectorAll<HTMLElement>('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onHoverIn);
        el.addEventListener('mouseleave', onHoverOut);
      });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    tick();
    attachHover();

    // Re-attach when DOM changes (for dynamically rendered elements)
    const mo = new MutationObserver(attachHover);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      mo.disconnect();
    };
  }, []);
}