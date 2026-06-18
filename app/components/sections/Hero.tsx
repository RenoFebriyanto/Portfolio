import { useRef } from 'react';
import { gsap, useGSAP } from '~/utils/gsap';
import { HeroCanvas } from '~/components/three/HeroCanvas';
import { Hero3D }     from '~/components/ui/Hero3D';

interface Props {
  scrollTo: (index: number) => void;
}

export function Hero({ scrollTo }: Props) {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

  tl.from('.hero-status', { y: 16, opacity: 0, duration: 0.6 })
    .from('.hero-heading-line span', {
      yPercent: 105,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
    }, '-=0.25')
    .from('.hero-desc',   { y: 20, opacity: 0, duration: 0.6 }, '-=0.35')
    .from('.hero-tags',   { y: 20, opacity: 0, duration: 0.6 }, '-=0.45')
    .from('.hero-cta',    { y: 20, opacity: 0, duration: 0.6 }, '-=0.45')
    .from('.hero-scroll', { y: 12, opacity: 0, duration: 0.5 }, '-=0.2');

  const onEnter = (e: Event) => {
    if ((e as CustomEvent).detail?.id !== 'hero') return;
    tl.timeScale(1);
    tl.play(0);
  };

  const onLeave = (e: Event) => {
    if ((e as CustomEvent).detail?.id !== 'hero') return;
    // Reverse timeline yang sama — bukan tween terpisah dengan overwrite:true.
    // overwrite:true sebelumnya bisa kill child tween di dalam tl kalau exit
    // terjadi saat intro masih jalan, dan tween yang sudah ke-kill lepas
    // permanen dari tl sehingga play(0) berikutnya tidak bisa animasikan
    // properti itu lagi — itu penyebab heading hilang selamanya.
    tl.timeScale(2.4); // exit lebih cepat dari intro
    tl.reverse();
  };

  window.addEventListener('sectionenter', onEnter);
  window.addEventListener('sectionleave', onLeave);

  return () => {
    window.removeEventListener('sectionenter', onEnter);
    window.removeEventListener('sectionleave', onLeave);
  };
}, { scope: heroRef });

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <HeroCanvas className="hero-particles-canvas" />

      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-status">
            <span className="hero-status-dot" />
            <span className="hero-status-text">Open for opportunities</span>
          </div>

          <h1 className="hero-heading">
            <span className="hero-heading-line"><span>Game Tech</span></span>
            <span className="hero-heading-line"><span>& <span className="accent">3D</span></span></span>
            <span className="hero-heading-line"><span>Creator.</span></span>
          </h1>

          <p className="hero-desc">
            Building immersive experiences at the intersection of game technology,
            real-time 3D, and interactive web. Turning ideas into playable, visual realities.
          </p>

          <div className="hero-tags">
            {['Game Dev', '3D Artist', '2D Artist', 'Designer', 'Programmer', 'Web 3'].map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          <div className="hero-cta">
            <a href="#projects" className="btn-primary" onClick={e => { e.preventDefault(); scrollTo(2); }}>
              View Projects <span className="btn-arrow">→</span>
            </a>
            <a href="#about" className="btn-secondary" onClick={e => { e.preventDefault(); scrollTo(1); }}>
              About Me <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>

        <Hero3D />
      </div>

      <span className="hero-number" aria-hidden="true">3D</span>

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