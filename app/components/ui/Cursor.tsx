/* Direct DOM cursor dot; the swarm trail is rendered by SwarmRebuild. */
import { useEffect } from 'react';

const INTERACTIVE = 'a, button, .filter-btn, .nav-cta, .nav-links a, .social-link, .footer-back-top, label, input, textarea, .tag';
const CARDS = '.project-card, .skill-group, .stat-card, .about-doing-chip';

export default function Cursor() {
  useEffect(() => {
    // Skip touch/coarse devices
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    // Create elements
    const dot  = document.createElement('div');
    dot.className  = 'cursor-dot';
    dot.style.transform = `translate(${window.innerWidth / 2}px, ${window.innerHeight / 2}px) translate(-50%, -50%)`;
    document.body.appendChild(dot);
    document.body.classList.remove('cursor-hidden');

    const onMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
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
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      dot.remove();
      document.body.classList.remove('cursor-hover', 'cursor-card', 'cursor-click', 'cursor-hidden');
    };
  }, []);

  // Render nothing — cursor elements are injected directly into body.
  return null;
}