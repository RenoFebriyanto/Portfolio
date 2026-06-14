import { useEffect, useRef } from 'react';
import { HeroCanvas } from '~/components/three/HeroCanvas';

interface Props {
  scrollTo: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function Hero({ scrollTo, containerRef }: Props) {
  const ghostRef = useRef<HTMLSpanElement>(null);

  // Ghost parallax
  useEffect(() => {
    const container = containerRef.current;
    const ghost     = ghostRef.current;
    if (!container || !ghost) return;

    const handler = () => {
      const y = container.scrollTop;
      ghost.style.transform = `translateX(-50%) translateY(${y * 0.25}px)`;
    };
    container.addEventListener('scroll', handler, { passive: true });
    return () => container.removeEventListener('scroll', handler);
  }, [containerRef]);

  return (
    <section className="section hero" id="hero">
      {/* Particle canvas */}
      <HeroCanvas className="hero__canvas" />

      {/* Ghost text */}
      <span className="hero__ghost" ref={ghostRef} aria-hidden>RENO</span>

      {/* Main content */}
      <div className="hero__content">
        <p className="hero__eyebrow">Game Tech · 3D · Interactive Web</p>

        <h1 className="hero__title">
          Reno
          <span className="hero__title-accent">Febriyanto</span>
        </h1>

        <p className="hero__subtitle">
          Developer &amp; creator focused on game technology, 3D art, and premium interactive experiences.
        </p>

        <div className="hero__cta-row">
          <button className="hero__btn hero__btn--primary" onClick={() => scrollTo(2)}>
            View Projects
          </button>
          <button className="hero__btn hero__btn--outline" onClick={() => scrollTo(4)}>
            Get In Touch
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll-hint" aria-hidden>
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}