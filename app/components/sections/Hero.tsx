import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '~/utils/gsap';
import { HeroCanvas } from '~/components/three/HeroCanvas';
import { Hero3D } from '~/components/ui/Hero3D';

interface Props {
  scrollTo: (index: number) => void;
}

const ROLES = ['Game Developer', '3D Artist', 'Designer', '2D Artist', 'Programmer'];

export function Hero({ scrollTo }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = window.setInterval(() => {
      setRoleIndex(index => (index + 1) % ROLES.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  useGSAP(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sceneTl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  const heroObjects = gsap.utils.toArray<HTMLElement>('.hero-object');
  const pointerHandlers = heroObjects.map(object => {
    const moveX = gsap.quickTo(object, 'x', { duration: 0.45, ease: 'power3.out' });
    const moveY = gsap.quickTo(object, 'y', { duration: 0.45, ease: 'power3.out' });
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const bounds = object.getBoundingClientRect();
      const pointerX = gsap.utils.clamp(-1, 1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2));
      const pointerY = gsap.utils.clamp(-1, 1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2));
      moveX(pointerX * 12);
      moveY(pointerY * 10);
    };
    const onPointerLeave = () => {
      moveX(0);
      moveY(0);
    };

    object.addEventListener('pointermove', onPointerMove);
    object.addEventListener('pointerleave', onPointerLeave);
    return () => {
      object.removeEventListener('pointermove', onPointerMove);
      object.removeEventListener('pointerleave', onPointerLeave);
    };
  });

  sceneTl.from('.hero-scene-background', { opacity: 0, scale: 1.04, duration: 1.2, ease: 'power2.out' }, 0)
    .from('.hero-object--tablet', {
      xPercent: 38,
      yPercent: 115,
      rotate: -38,
      opacity: 0,
      transformOrigin: '50% 92%',
      duration: 1.35,
      ease: 'power4.out',
    }, 0.12)
    .from('.hero-object--pen', { xPercent: 115, yPercent: -18, rotate: 8, opacity: 0, duration: 0.95, ease: 'power3.out' }, 0.3)
    .from('.hero-object--suzanne', { yPercent: -115, rotate: -8, opacity: 0, duration: 1, ease: 'power3.out' }, 0.38)
    .from('.hero-object--cube', { xPercent: -125, rotate: -18, opacity: 0, duration: 0.95, ease: 'power3.out' }, 0.48)
    .from('.hero-object--torus', { yPercent: 125, rotate: 18, opacity: 0, duration: 1, ease: 'power3.out' }, 0.58)
  tl.from('.hero-status', { y: 16, scale: 0.9, opacity: 0, duration: 0.6 }, 0.25)
    .from('.hero-heading-line > span', {
      yPercent: 105,
      scale: 0.82,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
    }, '-=0.25')
    .from('.hero-role', { y: 18, opacity: 0, duration: 0.55 }, '-=0.15')
    .from('.hero-desc',   { y: 20, scale: 0.94, opacity: 0, duration: 0.6 }, '-=0.35')
    .from('.hero-tags',   { y: 20, scale: 0.94, opacity: 0, duration: 0.6 }, '-=0.45')
    .from('.hero-cta',    { y: 20, scale: 0.94, opacity: 0, duration: 0.6 }, '-=0.45')
    .from('.hero-scroll', { y: 12, opacity: 0, duration: 0.5 }, '-=0.2');

  const onEnter = (e: Event) => {
    if ((e as CustomEvent).detail?.id !== 'hero') return;
    sceneTl.timeScale(1);
    sceneTl.play(0);
    tl.timeScale(1);
    tl.play(0);
  };

  const onLeave = (e: Event) => {
    if ((e as CustomEvent).detail?.id !== 'hero') return;
    heroObjects.forEach(object => gsap.to(object, {
      x: 0,
      y: 0,
      duration: 0.35,
      overwrite: 'auto',
    }));
    sceneTl.timeScale(sceneTl.duration() / 0.55);
    sceneTl.reverse();
    tl.timeScale(tl.duration() / 0.42);
    tl.reverse();
  };

  let initialEnterFrame = 0;
  window.addEventListener('sectionenter', onEnter);
  window.addEventListener('sectionleave', onLeave);
  initialEnterFrame = window.requestAnimationFrame(() => {
    const heroPanel = heroRef.current?.closest<HTMLElement>('[data-panel-id="hero"]');
    if (heroPanel?.dataset.visible === 'true' && tl.paused() && tl.progress() === 0) {
      sceneTl.play(0);
      tl.play(0);
    }
  });

  return () => {
    window.cancelAnimationFrame(initialEnterFrame);
    window.removeEventListener('sectionenter', onEnter);
    window.removeEventListener('sectionleave', onLeave);
    pointerHandlers.forEach(cleanup => cleanup());
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
            <span className="hero-heading-line"><span>I'm Reno</span></span>
            <span className="hero-heading-line"><span>Febriyanto.</span></span>
          </h1>

          <p className="hero-role" aria-label={`I'm a ${ROLES[roleIndex]}`}>
            I'm a <span key={ROLES[roleIndex]} className="hero-role-word">{ROLES[roleIndex]}</span>
          </p>

          <p className="hero-desc">
            Building immersive experiences at the intersection of game technology,
            real-time 3D, and interactive web. Turning ideas into playable, visual realities.
          </p>

          <div className="hero-tags">
            {['Unity', 'Blender', 'VFX Graph', '2D Art', 'Shader Graph', 'UI/UX Design'].map(tag => (
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