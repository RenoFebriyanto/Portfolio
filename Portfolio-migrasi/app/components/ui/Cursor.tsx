/* ================================================
   CURSOR.TSX — Direct DOM lerp cursor (no React state)
   Mirrors vanilla cursor.js exactly:
   - dot follows mouse instantly
   - ring lerps behind mouse (LERP = 0.12)
   - body class toggles for hover/click/card/hidden states
================================================ */
import { useEffect } from 'react';

const LERP = 0.12;
const INTERACTIVE = 'a, button, .filter-btn, .nav-cta, .nav-links a, .social-link, .footer-back-top, label, input, textarea, .tag';
const CARDS = '.project-card, .skill-group, .stat-card, .about-doing-chip';

export default function Cursor() {
  useEffect(() => {
    // Skip touch/coarse devices
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    // Create elements
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
    let rafId: number;

    // Track raw mouse — dot follows instantly
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      document.body.classList.remove('cursor-hidden');
    };

    const onLeave = () => document.body.classList.add('cursor-hidden');
    const onEnter = () => document.body.classList.remove('cursor-hidden');
    const onDown  = () => document.body.classList.add('cursor-click');
    const onUp    = () => document.body.classList.remove('cursor-click');

    document.addEventListener('mousemove',  onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);

    // RAF lerp loop for ring
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      ringX = lerp(ringX, mouseX, LERP);
      ringY = lerp(ringY, mouseY, LERP);
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Hover state helpers
    const addHover = (selector: string, bodyClass: string) => {
      document.querySelectorAll<HTMLElement>(selector).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add(bodyClass));
        el.addEventListener('mouseleave', () => document.body.classList.remove(bodyClass));
      });
    };

    const attachHoverStates = () => {
      addHover(INTERACTIVE, 'cursor-hover');
      addHover(CARDS,       'cursor-card');
    };

    attachHoverStates();

    // Re-attach after filter toggles
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(attachHoverStates, 50);
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      dot.remove();
      ring.remove();
      document.body.classList.remove('cursor-hover', 'cursor-card', 'cursor-click', 'cursor-hidden');
    };
  }, []);

  // Render nothing — elements injected directly into body
  return null;
}