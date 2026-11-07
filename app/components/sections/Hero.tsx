import { useRef } from 'react';
import { gsap, useGSAP } from '~/utils/gsap';
import { HeroCanvas } from '~/components/three/HeroCanvas';

interface Props {
  scrollTo: (index: number) => void;
}

export function Hero({ scrollTo }: Props) {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

  tl.from('.hero-scene-background', { opacity: 0, scale: 1.04, duration: 1.2, ease: 'power2.out' }, 0)
    .from('.hero-object--tablet', { yPercent: 120, rotate: -5, opacity: 0, duration: 1.15, ease: 'power4.out' }, 0.12)
    .from('.hero-object--pen', { xPercent: 115, yPercent: -18, rotate: 8, opacity: 0, duration: 0.95, ease: 'power3.out' }, 0.3)
    .from('.hero-object--suzanne', { yPercent: -115, rotate: -8, opacity: 0, duration: 1, ease: 'power3.out' }, 0.38)
    .from('.hero-object--cube', { xPercent: -125, rotate: -18, opacity: 0, duration: 0.95, ease: 'power3.out' }, 0.48)
    .from('.hero-object--torus', { yPercent: 125, rotate: 18, opacity: 0, duration: 1, ease: 'power3.out' }, 0.58)
    .from('.hero-status', { y: 16, scale: 0.9, opacity: 0, duration: 0.6 }, 0.25)
    .from('.hero-heading-line > span', {
      yPercent: 105,
      scale: 0.82,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
    }, '-=0.25')
    .from('.hero-desc',   { y: 20, scale: 0.94, opacity: 0, duration: 0.6 }, '-=0.35')
    .from('.hero-tags',   { y: 20, scale: 0.94, opacity: 0, duration: 0.6 }, '-=0.45')
    .from('.hero-cta',    { y: 20, scale: 0.94, opacity: 0, duration: 0.6 }, '-=0.45')
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

  let initialEnterFrame = 0;
  window.addEventListener('sectionenter', onEnter);
  window.addEventListener('sectionleave', onLeave);
  initialEnterFrame = window.requestAnimationFrame(() => {
    const heroPanel = heroRef.current?.closest<HTMLElement>('[data-panel-id="hero"]');
    if (heroPanel?.dataset.visible === 'true' && tl.paused() && tl.progress() === 0) {
      tl.play(0);
    }
  });

  return () => {
    window.cancelAnimationFrame(initialEnterFrame);
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

      </div>

      <div className="hero-scene" aria-hidden="true">
        <img className="hero-scene-background" src="/Assets/images/hero-studio-bg.jpg" alt="" />
        <img className="hero-object hero-object--tablet" src="/Assets/images/hero-objects/tablet.png" alt="" />
        <img className="hero-object hero-object--pen" src="/Assets/images/hero-objects/pen.png" alt="" />
        <img className="hero-object hero-object--suzanne" src="/Assets/images/hero-objects/suzanne.png" alt="" />
        <img className="hero-object hero-object--cube" src="/Assets/images/hero-objects/cube.png" alt="" />
        <img className="hero-object hero-object--torus" src="/Assets/images/hero-objects/torus.png" alt="" />
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