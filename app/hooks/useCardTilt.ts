import { useCallback, useRef } from 'react';

const MAX_TILT = 7;

/**
 * Returns event handlers to attach to a card element
 * for a 3D perspective tilt effect on mouse move.
 * Mirrors motion.js initCardTilt() from the vanilla portfolio.
 */
export function useCardTilt() {
  const cardRef = useRef<HTMLElement | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);

    const rotX = -dy * MAX_TILT;
    const rotY =  dx * MAX_TILT;

    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
    card.classList.add('tilting');

    // Update glow position
    const glow = card.querySelector<HTMLElement>('.card-tilt-glow');
    if (glow) {
      const gx = ((e.clientX - rect.left) / rect.width)  * 100;
      const gy = ((e.clientY - rect.top)  / rect.height) * 100;
      glow.style.setProperty('--glow-x', `${gx}%`);
      glow.style.setProperty('--glow-y', `${gy}%`);
    }
  }, []);

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget as HTMLElement;
    card.style.transform = '';
    card.classList.remove('tilting');
  }, []);

  return { onMouseMove, onMouseLeave, cardRef };
}
