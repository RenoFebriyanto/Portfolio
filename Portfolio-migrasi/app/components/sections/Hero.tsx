import { HeroCanvas } from '~/components/three/HeroCanvas';
import { Hero3D }     from '~/components/ui/Hero3D';

interface Props {
  scrollTo: (index: number) => void;
}

export function Hero({ scrollTo }: Props) {
  return (
    <section className="hero" id="hero">
      {/* Particle canvas: absolute behind content, z-index 0 */}
      <HeroCanvas className="hero-particles-canvas" />

      <div className="hero-inner">
        {/* Left: text content */}
        <div className="hero-content">

          {/* Status badge */}
          <div className="hero-status">
            <span className="hero-status-dot" />
            <span className="hero-status-text">Open for opportunities</span>
          </div>

          {/* Heading */}
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
            <a
              href="#projects"
              className="btn-primary"
              onClick={e => { e.preventDefault(); scrollTo(2); }}
            >
              View Projects <span className="btn-arrow">→</span>
            </a>
            <a
              href="#about"
              className="btn-secondary"
              onClick={e => { e.preventDefault(); scrollTo(1); }}
            >
              About Me <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>

        {/* Right: 3D GLB viewer — single instance */}
        <Hero3D />
      </div>

      {/* Decorative ghost text */}
      <span className="hero-number" aria-hidden="true">3D</span>

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