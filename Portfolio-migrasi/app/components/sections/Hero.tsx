import { useEffect, useRef } from 'react';
import { HeroCanvas } from '~/components/three/HeroCanvas';

interface Props {
  scrollTo: (index: number) => void;
}

export function Hero({ scrollTo }: Props) {
  const ghostRef = useRef<HTMLSpanElement>(null);

  // Ghost parallax — listen to panelscroll events
  useEffect(() => {
    const handler = () => {
      // Ghost parallax driven by section-animations' ghost text
      // (Already handled by motion.js port in useSectionAnimations)
    };
    window.addEventListener('panelscroll', handler, { passive: true });
    return () => window.removeEventListener('panelscroll', handler);
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Particle canvas behind content */}
      <HeroCanvas className="" />

      <div className="hero-inner">
        {/* Left: text content */}
        <div className="hero-content">

          {/* Status badge */}
          <div className="hero-status">
            <span className="hero-status-dot" />
            <span className="hero-status-text">Open for opportunities</span>
          </div>

          {/* Heading — each line wrapped for reveal animation */}
          <h1 className="hero-heading">
            <span className="hero-heading-line"><span>Game Tech</span></span>
            <span className="hero-heading-line"><span>& <span className="accent">3D</span></span></span>
            <span className="hero-heading-line"><span>Creator.</span></span>
          </h1>

          {/* Description */}
          <p className="hero-desc">
            Building immersive experiences at the intersection of game technology,
            real-time 3D, and interactive web. Turning ideas into playable, visual realities.
          </p>

          {/* Tags */}
          <div className="hero-tags">
            {['Game Dev', '3D Artist', '2D Artist', 'Designer', 'Programmer', 'Web 3'].map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hero-cta">
            <a href="#projects" className="btn-primary" onClick={e => { e.preventDefault(); scrollTo(2); }}>
              View Projects <span className="btn-arrow">→</span>
            </a>
            <a href="#about" className="btn-secondary" onClick={e => { e.preventDefault(); scrollTo(1); }}>
              About Me <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>

        {/* Right: 3D sphere canvas (injected by hero3d.js equiv — kept as div for GLB loader) */}
        <div id="hero-3d-canvas" aria-hidden />
      </div>

      {/* Decorative ghost text */}
      <span className="hero-number" ref={ghostRef} aria-hidden>3D</span>

      {/* Scroll indicator */}
      <div
        className="hero-scroll"
        role="button"
        tabIndex={0}
        aria-label="Scroll to projects"
        onClick={() => scrollTo(2)}
        onKeyDown={e => e.key === 'Enter' && scrollTo(2)}
      >
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
