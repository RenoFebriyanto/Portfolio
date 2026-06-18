import { useEffect, useRef, useState } from 'react';

/* ─── Cyan Cursor Override ───────────────────────────────────────────────── */
function useFSCursor() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'fs-cursor-override';
    style.textContent = `
      [data-page="forbidden-space"] ~ * .cursor-dot,
      body.fs-page-active .cursor-dot {
        background: #00c8ff !important;
        box-shadow: 0 0 8px #00c8ff, 0 0 16px rgba(0,200,255,0.4) !important;
      }
      body.fs-page-active .cursor-ring {
        border-color: #00c8ff !important;
      }
      body.fs-page-active.cursor-hover .cursor-ring {
        border-color: #00c8ff !important;
        background: rgba(0,200,255,0.08) !important;
        width: 56px !important;
        height: 56px !important;
      }
      body.fs-page-active .cursor-dot { background: #00c8ff !important; }
    `;
    document.head.appendChild(style);
    document.body.classList.add('fs-page-active');

    return () => {
      style.remove();
      document.body.classList.remove('fs-page-active');
    };
  }, []);
}

/* ─── Page Transition ────────────────────────────────────────────────────── */
function usePageTransition() {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');

  useEffect(() => {
    // Enter animation
    const t1 = setTimeout(() => setPhase('visible'), 80);
    return () => clearTimeout(t1);
  }, []);

  const exit = (cb: () => void) => {
    setPhase('exit');
    setTimeout(cb, 700);
  };

  return { phase, exit };
}

/* ─── Particle Canvas ────────────────────────────────────────────────────── */
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    const CYAN   = { r: 0,   g: 200, b: 255 };
    const ORANGE = { r: 255, g: 107, b: 53  };
    const COUNT  = 120;

    type P = { x: number; y: number; r: number; vy: number; vx: number; alpha: number; pulse: number; ps: number; tint: typeof CYAN };

    let particles: P[] = [];
    let rafId = 0;

    function resize() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function rand(a: number, b: number) { return Math.random() * (b - a) + a; }

    particles = Array.from({ length: COUNT }, () => ({
      x: rand(0, W), y: rand(0, H),
      r: rand(0.5, 2.2),
      vy: rand(0.015, 0.10), vx: rand(-0.03, 0.03),
      alpha: rand(0.06, 0.45),
      pulse: rand(0, Math.PI * 2),
      ps: rand(0.003, 0.012),
      tint: Math.random() < 0.1 ? ORANGE : CYAN,
    }));

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.pulse += p.ps;
        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.tint.r},${p.tint.g},${p.tint.b},${a})`;
        ctx!.fill();
        p.x += p.vx; p.y -= p.vy;
        if (p.y < -4)    { p.y = H + 4; p.x = rand(0, W); }
        if (p.x < -4)    p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
      });
      rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
}

/* ─── Reveal on scroll ───────────────────────────────────────────────────── */
function useRevealOnScroll() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.fs-reveal');
    if (!items.length) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('fs-revealed');
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    items.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Glitch text effect ─────────────────────────────────────────────────── */
function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`fs-glitch ${className}`} data-text={text}>
      {text}
    </span>
  );
}

/* ─── Lightbox ───────────────────────────────────────────────────────────── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fs-lightbox" onClick={onClose}>
      <button className="fs-lightbox__close" onClick={onClose}>✕</button>
      <div className="fs-lightbox__frame" onClick={e => e.stopPropagation()}>
        <div className="fs-lightbox__scan" />
        <img src={src} alt="Screenshot" className="fs-lightbox__img" />
        <div className="fs-lightbox__corner fs-lightbox__corner--tl" />
        <div className="fs-lightbox__corner fs-lightbox__corner--tr" />
        <div className="fs-lightbox__corner fs-lightbox__corner--bl" />
        <div className="fs-lightbox__corner fs-lightbox__corner--br" />
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export function ForbiddenSpaceDetail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const { phase } = usePageTransition();

  useFSCursor();
  useParticles(canvasRef);
  useRevealOnScroll();

  const screenshots = [
    'https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5NDQ3MS5wbmc=/original/RVvsqd.png',
    'https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MTk2MC5wbmc=/original/G5mEIZ.png',
    'https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MTkyNy5wbmc=/original/tQvQJg.png',
    'https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MzI4OS5wbmc=/original/nxHC5y.png',
    'https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MzI5Mi5wbmc=/original/rW0scz.png',
    'https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MzI5My5wbmc=/original/NJ7BSU.png',
    'https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MzI4OC5wbmc=/original/q2KVKO.png',
    'https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MzI5MC5wbmc=/original/kZKuG9.png',
  ];

  const contributions = [
    {
      num: '01',
      title: 'Boss Fight Programming',
      icon: '⬡',
      tags: ['C#', 'Unity', 'Boss AI', 'UI System'],
      desc: 'Designed and implemented the entire boss encounter system — multi-phase AI state machines, attack logic, and in-game UI for boss health & phase indicators.',
    },
    {
      num: '02',
      title: 'Boss VFX Artist',
      icon: '◈',
      tags: ['VFX Graph', 'Shader Graph'],
      desc: 'Created all visual effects for the boss fight — portal summons, slam shockwaves, laser beams, projectile effects, hit reactions, and death VFX.',
    },
  ];

  const team = [
    { initials: 'RFK', name: 'Robbani Fadhillah Kafura', role: 'Game Designer · Programmer', isMe: false },
    { initials: 'RF',  name: 'Reno Febriyanto',           role: 'Programmer · VFX Artist',   isMe: true  },
    { initials: 'AFK', name: 'Adinda Fadilla Kirana Dewi', role: 'Game Artist 2D',            isMe: false },
    { initials: 'PP',  name: 'Putu Pande',                 role: 'Game Artist 2D',            isMe: false },
  ];

  const stats = [
    { value: '2D',    label: 'Art Style'    },
    { value: '∞',     label: 'Time Loops'   },
    { value: '4',     label: 'Team Members' },
    { value: 'HTML5', label: 'Platform'     },
  ];

  return (
    <>
      {/* ── Injected styles ── */}
      <style>{`
        /* ── Token Layer ── */
        [data-page="forbidden-space"] {
          --fs-void:        #010b0f;
          --fs-deep:        #011218;
          --fs-dark:        #021820;
          --fs-panel:       #041e28;
          --fs-panel-hi:    #062633;
          --fs-border:      rgba(0,200,255,0.10);
          --fs-border-hi:   rgba(0,200,255,0.28);
          --fs-cyan:        #00c8ff;
          --fs-cyan-dim:    rgba(0,200,255,0.12);
          --fs-cyan-glow:   rgba(0,200,255,0.35);
          --fs-cyan-hard:   rgba(0,200,255,0.70);
          --fs-orange:      #FF6B35;
          --fs-orange-dim:  rgba(255,107,53,0.12);
          --fs-text:        #cce8f0;
          --fs-text-2:      #6da8b8;
          --fs-text-3:      #2e5a68;
          --fs-ease:        cubic-bezier(0.16,1,0.3,1);
        }

        /* ── Page-enter / exit transition ── */
        .fs-wrapper {
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity   0.65s var(--fs-ease),
            transform 0.65s var(--fs-ease);
        }
        .fs-wrapper.phase-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .fs-wrapper.phase-exit {
          opacity: 0;
          transform: translateY(-18px);
          transition:
            opacity   0.45s ease,
            transform 0.45s ease;
        }

        /* ── Scanline overlay ── */
        .fs-scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.018) 2px, rgba(0,0,0,0.018) 4px
          );
        }

        /* ── Particle canvas ── */
        .fs-canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.55;
        }

        /* ── Grid background ── */
        .fs-grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(0,200,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.024) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, rgba(0,0,0,0.7) 0%, transparent 75%);
        }

        /* ── Top glow ── */
        .fs-top-glow {
          position: fixed;
          top: -300px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,200,255,0.055) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Nav ── */
        .fs-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          border-bottom: 1px solid rgba(0,200,255,0.05);
          background: linear-gradient(to bottom, rgba(1,11,15,0.96) 0%, transparent 100%);
          backdrop-filter: blur(12px);
        }
        .fs-nav__back {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--fs-text-2);
          text-decoration: none;
          transition: color 0.2s;
        }
        .fs-nav__back:hover { color: var(--fs-cyan); }
        .fs-nav__back-arrow {
          display: inline-block;
          transition: transform 0.2s;
        }
        .fs-nav__back:hover .fs-nav__back-arrow { transform: translateX(-3px); }
        .fs-nav__center {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .fs-nav__badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          padding: 4px 10px;
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.28);
          border-radius: 3px;
          color: var(--fs-cyan);
          text-transform: uppercase;
        }
        .fs-nav__title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--fs-text);
          text-transform: uppercase;
        }
        .fs-nav__cta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          color: var(--fs-cyan);
          border: 1px solid rgba(0,200,255,0.18);
          padding: 8px 18px;
          border-radius: 4px;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .fs-nav__cta:hover {
          background: rgba(0,200,255,0.08);
          border-color: rgba(0,200,255,0.4);
        }

        /* ── Content wrapper ── */
        .fs-content {
          position: relative;
          z-index: 2;
          background: var(--fs-void);
          min-height: 100vh;
          color: var(--fs-text);
          overflow: hidden;
        }

        /* ── Hero ── */
        .fs-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 140px 80px 100px;
          gap: 72px;
          position: relative;
        }
        .fs-hero__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 28px;
        }
        .fs-hero__tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          padding: 5px 12px;
          border-radius: 3px;
          text-transform: uppercase;
        }
        .fs-hero__tag--cyan {
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.3);
          color: var(--fs-cyan);
        }
        .fs-hero__tag--orange {
          background: rgba(255,107,53,0.08);
          border: 1px solid rgba(255,107,53,0.3);
          color: var(--fs-orange);
        }
        .fs-hero__tag--neutral {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--fs-text-2);
        }
        .fs-hero__heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(72px, 10vw, 130px);
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .fs-hero__heading-line1 {
          display: block;
          color: var(--fs-text);
        }
        .fs-hero__heading-line2 {
          display: block;
          color: transparent;
          -webkit-text-stroke: 2px var(--fs-cyan);
          text-shadow:
            0 0 40px rgba(0,200,255,0.5),
            0 0 80px rgba(0,200,255,0.2);
        }
        .fs-hero__tagline {
          font-size: 1.05rem;
          color: var(--fs-text-2);
          max-width: 400px;
          margin-bottom: 20px;
          font-style: italic;
          line-height: 1.7;
        }
        .fs-hero__role-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 44px;
        }
        .fs-hero__role-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          color: var(--fs-text-3);
          text-transform: uppercase;
        }
        .fs-hero__role-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          color: var(--fs-cyan);
          letter-spacing: 0.04em;
        }
        .fs-hero__cta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .fs-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 30px;
          background: var(--fs-cyan);
          color: #010b0f;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          font-weight: 600;
          border-radius: 4px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          text-transform: uppercase;
        }
        .fs-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,200,255,0.3);
        }
        .fs-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 30px;
          border: 1px solid var(--fs-border-hi);
          color: var(--fs-text-2);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          border-radius: 4px;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
          text-transform: uppercase;
        }
        .fs-btn-outline:hover {
          border-color: var(--fs-cyan);
          color: var(--fs-cyan);
          transform: translateY(-2px);
        }

        /* ── Hero image panel ── */
        .fs-hero__img-wrap {
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--fs-border-hi);
          box-shadow:
            0 0 0 1px rgba(0,200,255,0.06),
            0 40px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(0,200,255,0.08);
        }
        .fs-hero__img-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(105deg, transparent, rgba(0,200,255,0.06) 45%, rgba(0,200,255,0.12) 50%, rgba(0,200,255,0.06) 55%, transparent);
          pointer-events: none;
          animation: fs-shimmer 4s ease-in-out 1s infinite;
          z-index: 2;
        }
        @keyframes fs-shimmer { to { left: 140%; } }
        .fs-hero__img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,200,255,0.06) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }
        .fs-hero__img {
          width: 100%;
          display: block;
          position: relative;
          z-index: 0;
        }
        /* Corner brackets */
        .fs-hero__img-wrap .fs-corner { position: absolute; width: 16px; height: 16px; z-index: 3; }
        .fs-hero__img-wrap .fs-corner--tl { top: 8px;  left: 8px;  border-top: 1.5px solid var(--fs-cyan); border-left: 1.5px solid var(--fs-cyan); }
        .fs-hero__img-wrap .fs-corner--tr { top: 8px;  right: 8px; border-top: 1.5px solid var(--fs-cyan); border-right: 1.5px solid var(--fs-cyan); }
        .fs-hero__img-wrap .fs-corner--bl { bottom: 8px; left: 8px;  border-bottom: 1.5px solid var(--fs-cyan); border-left: 1.5px solid var(--fs-cyan); }
        .fs-hero__img-wrap .fs-corner--br { bottom: 8px; right: 8px; border-bottom: 1.5px solid var(--fs-cyan); border-right: 1.5px solid var(--fs-cyan); }

        /* ── Glitch text ── */
        .fs-glitch {
          position: relative;
          display: inline-block;
        }
        .fs-glitch::before,
        .fs-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
        }
        .fs-glitch::before {
          color: var(--fs-cyan);
          animation: fs-glitch-top 6s infinite linear;
          opacity: 0;
        }
        .fs-glitch::after {
          color: var(--fs-orange);
          clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
          animation: fs-glitch-bot 6s infinite linear;
          opacity: 0;
        }
        @keyframes fs-glitch-top {
          0%,93%,95.5%,100% { transform: translate(0); opacity: 0; }
          94%   { transform: translate(-3px, 1px); opacity: 0.7; }
          95%   { transform: translate(3px, -1px); opacity: 0.7; }
        }
        @keyframes fs-glitch-bot {
          0%,93%,95.5%,100% { transform: translate(0); opacity: 0; }
          94%   { transform: translate(3px, 1px);  opacity: 0.7; }
          95%   { transform: translate(-3px,-1px); opacity: 0.7; }
        }

        /* ── Section layout ── */
        .fs-section {
          padding: 110px 0;
          position: relative;
          z-index: 2;
        }
        .fs-section--dark {
          background: linear-gradient(to bottom, var(--fs-void), var(--fs-dark));
        }
        .fs-section--darker {
          background: linear-gradient(to bottom, var(--fs-dark), var(--fs-deep));
        }
        .fs-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 64px;
        }
        .fs-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          color: var(--fs-cyan);
          opacity: 0.7;
          text-transform: uppercase;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .fs-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: var(--fs-cyan);
          opacity: 0.5;
        }

        /* ── Story section ── */
        .fs-story-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 64px;
          align-items: start;
        }
        .fs-story__heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          line-height: 1.05;
          margin-bottom: 36px;
          color: var(--fs-text);
        }
        .fs-story__p {
          color: var(--fs-text-2);
          line-height: 1.8;
          margin-bottom: 18px;
          font-size: 0.95rem;
        }
        .fs-story__p em { color: var(--fs-cyan); font-style: normal; }
        .fs-story__p strong { color: var(--fs-text); font-weight: 500; }

        /* Stats grid */
        .fs-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          border: 1px solid var(--fs-border);
          border-radius: 6px;
          overflow: hidden;
        }
        .fs-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          background: var(--fs-panel);
          text-align: center;
          transition: background 0.2s;
        }
        .fs-stat:hover { background: var(--fs-panel-hi); }
        .fs-stat__val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2.4rem;
          font-weight: 800;
          color: var(--fs-cyan);
          line-height: 1;
          margin-bottom: 8px;
        }
        .fs-stat__label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          color: var(--fs-text-2);
          text-transform: uppercase;
        }

        /* ── Video embed ── */
        .fs-video-wrap {
          max-width: 800px;
        }
        .fs-video-frame {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--fs-border-hi);
          box-shadow:
            0 0 0 1px rgba(0,200,255,0.04),
            0 32px 80px rgba(0,0,0,0.5);
        }
        .fs-video-frame iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .fs-video-caption {
          margin-top: 14px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          color: var(--fs-text-3);
        }

        /* ── Screenshots gallery ── */
        .fs-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .fs-gallery__item {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          border: 1px solid var(--fs-border);
          cursor: zoom-in;
          background: var(--fs-panel);
        }
        .fs-gallery__item--tall {
          grid-row: span 2;
        }
        .fs-gallery__item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,200,255,0.06) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .fs-gallery__item:hover::after { opacity: 1; }
        .fs-gallery__item:hover { border-color: rgba(0,200,255,0.25); }
        .fs-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .fs-gallery__item:hover img { transform: scale(1.04); }
        /* Zoom icon */
        .fs-gallery__item::before {
          content: '⊕';
          position: absolute;
          top: 10px;
          right: 12px;
          font-size: 1rem;
          color: var(--fs-cyan);
          opacity: 0;
          z-index: 2;
          transition: opacity 0.2s;
        }
        .fs-gallery__item:hover::before { opacity: 0.7; }

        /* ── Lightbox ── */
        .fs-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(1,11,15,0.96);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fs-lb-in 0.25s ease forwards;
        }
        @keyframes fs-lb-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fs-lightbox__close {
          position: absolute;
          top: 28px;
          right: 36px;
          background: none;
          border: none;
          font-size: 1.4rem;
          color: var(--fs-text-2);
          cursor: pointer;
          transition: color 0.2s;
          font-family: monospace;
        }
        .fs-lightbox__close:hover { color: var(--fs-cyan); }
        .fs-lightbox__frame {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 4px;
          overflow: hidden;
          animation: fs-lb-scale 0.3s var(--fs-ease, cubic-bezier(0.16,1,0.3,1)) forwards;
        }
        @keyframes fs-lb-scale {
          from { transform: scale(0.94); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .fs-lightbox__img {
          display: block;
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 4px;
          border: 1px solid var(--fs-border-hi);
        }
        .fs-lightbox__scan {
          position: absolute;
          top: -4px; left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--fs-cyan), transparent);
          z-index: 3;
          opacity: 0.6;
          animation: fs-scan 2.2s linear infinite;
        }
        @keyframes fs-scan {
          from { top: -4px; }
          to   { top: 100%; }
        }
        .fs-lightbox__corner {
          position: absolute;
          width: 18px;
          height: 18px;
          z-index: 4;
        }
        .fs-lightbox__corner--tl { top: 6px;    left: 6px;   border-top: 1.5px solid var(--fs-cyan); border-left: 1.5px solid var(--fs-cyan); }
        .fs-lightbox__corner--tr { top: 6px;    right: 6px;  border-top: 1.5px solid var(--fs-cyan); border-right: 1.5px solid var(--fs-cyan); }
        .fs-lightbox__corner--bl { bottom: 6px; left: 6px;   border-bottom: 1.5px solid var(--fs-cyan); border-left: 1.5px solid var(--fs-cyan); }
        .fs-lightbox__corner--br { bottom: 6px; right: 6px;  border-bottom: 1.5px solid var(--fs-cyan); border-right: 1.5px solid var(--fs-cyan); }

        /* ── Contribution cards ── */
        .fs-contrib-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        .fs-contrib-card {
          padding: 44px 40px;
          background: var(--fs-panel);
          border: 1px solid var(--fs-border);
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, background 0.3s;
        }
        .fs-contrib-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--fs-cyan), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .fs-contrib-card:hover { background: var(--fs-panel-hi); border-color: var(--fs-border-hi); }
        .fs-contrib-card:hover::before { opacity: 1; }

        .fs-contrib-card__num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 5rem;
          font-weight: 800;
          color: rgba(0,200,255,0.08);
          line-height: 1;
          margin-bottom: 20px;
          user-select: none;
        }
        .fs-contrib-card__icon {
          font-size: 1.4rem;
          color: var(--fs-cyan);
          margin-bottom: 14px;
          display: block;
          opacity: 0.6;
        }
        .fs-contrib-card__title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--fs-text);
          margin-bottom: 14px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .fs-contrib-card__desc {
          font-size: 0.9rem;
          line-height: 1.75;
          color: var(--fs-text-2);
          margin-bottom: 24px;
        }
        .fs-contrib-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .fs-contrib-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          padding: 3px 10px;
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.2);
          border-radius: 3px;
          color: var(--fs-cyan);
          text-transform: uppercase;
        }

        /* ── Team grid ── */
        .fs-team-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
        }
        .fs-team-card {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 24px 32px;
          background: var(--fs-panel);
          border: 1px solid var(--fs-border);
          position: relative;
          transition: border-color 0.2s, background 0.2s;
        }
        .fs-team-card:hover {
          background: var(--fs-panel-hi);
          border-color: rgba(0,200,255,0.16);
        }
        .fs-team-card--me {
          border-color: rgba(0,200,255,0.28) !important;
        }
        .fs-team-card__avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .fs-team-card__avatar--me {
          background: rgba(0,200,255,0.12);
          border: 1px solid var(--fs-cyan);
          color: var(--fs-cyan);
        }
        .fs-team-card__avatar--other {
          background: var(--fs-dark);
          border: 1px solid var(--fs-border);
          color: var(--fs-text-2);
        }
        .fs-team-card__name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--fs-text);
          margin-bottom: 3px;
        }
        .fs-team-card__role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.67rem;
          color: var(--fs-text-2);
          letter-spacing: 0.04em;
        }
        .fs-team-card__you {
          position: absolute;
          top: 12px;
          right: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          padding: 2px 8px;
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.28);
          border-radius: 3px;
          color: var(--fs-cyan);
          text-transform: uppercase;
        }

        /* ── CTA section ── */
        .fs-cta {
          text-align: center;
          padding: 120px 0;
          position: relative;
          z-index: 2;
          background: var(--fs-void);
        }
        .fs-cta::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(0,200,255,0.4));
        }
        .fs-cta__tagline {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          color: var(--fs-cyan);
          margin-bottom: 18px;
          font-style: italic;
        }
        .fs-cta__heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.8rem, 4vw, 3.2rem);
          font-weight: 700;
          line-height: 1.1;
          color: var(--fs-text);
          margin-bottom: 44px;
        }
        .fs-cta__buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ── Footer ── */
        .fs-footer {
          position: relative;
          z-index: 2;
          padding: 28px 0;
          border-top: 1px solid rgba(0,200,255,0.06);
          background: var(--fs-void);
        }
        .fs-footer__inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .fs-footer__copy {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          color: var(--fs-text-3);
          letter-spacing: 0.06em;
        }
        .fs-footer__links {
          display: flex;
          gap: 28px;
        }
        .fs-footer__link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          color: var(--fs-text-2);
          text-decoration: none;
          letter-spacing: 0.06em;
          transition: color 0.2s;
        }
        .fs-footer__link:hover { color: var(--fs-cyan); }

        /* ── Reveal animation ── */
        .fs-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s var(--fs-ease, cubic-bezier(0.16,1,0.3,1)),
                      transform 0.7s var(--fs-ease, cubic-bezier(0.16,1,0.3,1));
        }
        .fs-reveal.fs-revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .fs-reveal.fs-delay-1 { transition-delay: 0.1s; }
        .fs-reveal.fs-delay-2 { transition-delay: 0.2s; }
        .fs-reveal.fs-delay-3 { transition-delay: 0.3s; }

        /* ── Decorative animated line ── */
        .fs-h-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.3) 30%, rgba(0,200,255,0.3) 70%, transparent);
          margin: 0;
        }

        /* ── Pulsing dot ── */
        .fs-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--fs-cyan);
          box-shadow: 0 0 8px rgba(0,200,255,0.6);
          animation: fs-pulse 2.5s ease-in-out infinite;
        }
        @keyframes fs-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.75); }
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .fs-hero { grid-template-columns: 1fr; padding: 120px 40px 80px; }
          .fs-story-grid { grid-template-columns: 1fr; gap: 48px; }
          .fs-contrib-grid { grid-template-columns: 1fr; }
          .fs-team-grid { grid-template-columns: 1fr; }
          .fs-container { padding: 0 32px; }
          .fs-footer__inner { padding: 0 32px; }
          .fs-nav { padding: 16px 24px; }
          .fs-nav__title { display: none; }
        }
        @media (max-width: 600px) {
          .fs-gallery { grid-template-columns: repeat(2, 1fr); }
          .fs-gallery__item--tall { grid-row: span 1; }
          .fs-hero__heading { font-size: clamp(52px, 14vw, 90px); }
        }
      `}</style>

      <div data-page="forbidden-space">
        {/* ── Atmosphere layers ── */}
        <canvas ref={canvasRef} className="fs-canvas" />
        <div className="fs-scanlines" />
        <div className="fs-grid-bg" />
        <div className="fs-top-glow" />

        {/* ── Nav ── */}
        <nav className="fs-nav">
          <a href="/" className="fs-nav__back">
            <span className="fs-nav__back-arrow">←</span>
            Back to Portfolio
          </a>
          <div className="fs-nav__center">
            <span className="fs-nav__badge">Game</span>
            <span className="fs-nav__title">Forbidden Space</span>
          </div>
          <a
            href="https://wubblyduby.itch.io/forbidden-space"
            target="_blank"
            rel="noopener noreferrer"
            className="fs-nav__cta"
          >
            Play on itch.io ↗
          </a>
        </nav>

        {/* ── Page wrapper with transition ── */}
        <div className={`fs-wrapper phase-${phase}`}>
          <div className="fs-content">

            {/* ════════════════ HERO ════════════════ */}
            <section className="fs-hero">
              <div>
                <div className="fs-hero__tags">
                  <span className="fs-hero__tag fs-hero__tag--cyan">ROGUELIKE · 2D · SHOOTER</span>
                  <span className="fs-hero__tag fs-hero__tag--orange">Unity</span>
                  <span className="fs-hero__tag fs-hero__tag--neutral">Released · 2026</span>
                </div>

                <h1 className="fs-hero__heading">
                  <span className="fs-hero__heading-line1">
                    <GlitchText text="FORBIDDEN" />
                  </span>
                  <span className="fs-hero__heading-line2">SPACE</span>
                </h1>

                <p className="fs-hero__tagline">
                  A cosmic time-loop roguelike where death resets the universe.
                </p>

                <div className="fs-hero__role-row">
                  <span className="fs-dot" />
                  <span className="fs-hero__role-label">My Role</span>
                  <span className="fs-hero__role-value">Programmer · VFX Artist</span>
                </div>

                <div className="fs-hero__cta">
                  <a
                    href="https://wubblyduby.itch.io/forbidden-space"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fs-btn-primary"
                  >
                    Play Free on itch.io ↗
                  </a>
                  <a href="#overview" className="fs-btn-outline">
                    Case Study ↓
                  </a>
                </div>
              </div>

              <div className="fs-hero__img-wrap">
                <img
                  src="/Assets/project/game/ForbiddenSpace/ForbiddenSpacePreview.png"
                  alt="Forbidden Space Preview"
                  className="fs-hero__img"
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                />
                <div className="fs-corner fs-corner--tl" />
                <div className="fs-corner fs-corner--tr" />
                <div className="fs-corner fs-corner--bl" />
                <div className="fs-corner fs-corner--br" />
              </div>
            </section>

            <div className="fs-h-line" />

            {/* ════════════════ STORY ════════════════ */}
            <section className="fs-section fs-section--dark" id="overview">
              <div className="fs-container">
                <p className="fs-eyebrow fs-reveal">01 — Story</p>
                <div className="fs-story-grid">
                  <div className="fs-reveal fs-delay-1">
                    <h2 className="fs-story__heading">Trapped in a Cosmic Loop</h2>
                    <p className="fs-story__p">
                      In a remote corner of the universe lies a mysterious place known as{' '}
                      <em>"The Forbidden Space."</em> It is the domain of a four-dimensional
                      extraterrestrial being capable of manipulating time itself.
                    </p>
                    <p className="fs-story__p">
                      Players take control of a spacecraft named{' '}
                      <strong>J4-RW0 — "Jarwo"</strong> — who accidentally enters The Forbidden Space.
                      Trapped within, Jarwo becomes nothing more than a plaything for the powerful
                      entity, which endlessly resets and repeats time.
                    </p>
                  </div>
                  <div className="fs-stats-grid fs-reveal fs-delay-2">
                    {stats.map(s => (
                      <div key={s.label} className="fs-stat">
                        <div className="fs-stat__val">{s.value}</div>
                        <div className="fs-stat__label">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="fs-h-line" />

            {/* ════════════════ VIDEO ════════════════ */}
            <section className="fs-section fs-section--darker">
              <div className="fs-container">
                <p className="fs-eyebrow fs-reveal">02 — Gameplay</p>
                <div className="fs-video-wrap fs-reveal fs-delay-1">
                  <div className="fs-video-frame">
                    <iframe
                      src="https://www.youtube.com/embed/jWMfVkl7hZA"
                      title="Forbidden Space Gameplay"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="fs-video-caption">Gameplay Trailer — Forbidden Space · 2026</p>
                </div>
              </div>
            </section>

            <div className="fs-h-line" />

            {/* ════════════════ SCREENSHOTS ════════════════ */}
            <section className="fs-section fs-section--dark">
              <div className="fs-container">
                <p className="fs-eyebrow fs-reveal">03 — Screenshots</p>
                <div className="fs-gallery fs-reveal fs-delay-1">
                  {screenshots.map((src, i) => (
                    <div
                      key={i}
                      className={`fs-gallery__item${i === 0 || i === 3 ? ' fs-gallery__item--tall' : ''}`}
                      onClick={() => setLightboxSrc(src)}
                    >
                      <img src={src} alt={`Screenshot ${i + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="fs-h-line" />

            {/* ════════════════ CONTRIBUTION ════════════════ */}
            <section className="fs-section fs-section--darker">
              <div className="fs-container">
                <p className="fs-eyebrow fs-reveal">04 — My Contribution</p>
                <div className="fs-contrib-grid">
                  {contributions.map(c => (
                    <div key={c.num} className="fs-contrib-card fs-reveal fs-delay-1">
                      <div className="fs-contrib-card__num">{c.num}</div>
                      <span className="fs-contrib-card__icon">{c.icon}</span>
                      <h3 className="fs-contrib-card__title">{c.title}</h3>
                      <p className="fs-contrib-card__desc">{c.desc}</p>
                      <div className="fs-contrib-card__tags">
                        {c.tags.map(t => (
                          <span key={t} className="fs-contrib-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="fs-h-line" />

            {/* ════════════════ TEAM ════════════════ */}
            <section className="fs-section fs-section--dark">
              <div className="fs-container">
                <p className="fs-eyebrow fs-reveal">05 — Team</p>
                <div className="fs-team-grid fs-reveal fs-delay-1">
                  {team.map(m => (
                    <div
                      key={m.initials}
                      className={`fs-team-card${m.isMe ? ' fs-team-card--me' : ''}`}
                    >
                      <div className={`fs-team-card__avatar${m.isMe ? ' fs-team-card__avatar--me' : ' fs-team-card__avatar--other'}`}>
                        {m.initials}
                      </div>
                      <div>
                        <div className="fs-team-card__name">{m.name}</div>
                        <div className="fs-team-card__role">{m.role}</div>
                      </div>
                      {m.isMe && <span className="fs-team-card__you">You</span>}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ════════════════ CTA ════════════════ */}
            <div className="fs-cta">
              <p className="fs-cta__tagline fs-reveal">The loop awaits.</p>
              <h2 className="fs-cta__heading fs-reveal fs-delay-1">
                Ready to enter<br />The Forbidden Space?
              </h2>
              <div className="fs-cta__buttons fs-reveal fs-delay-2">
                <a
                  href="https://wubblyduby.itch.io/forbidden-space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fs-btn-primary"
                >
                  Play Free Now — itch.io ↗
                </a>
                <a href="/" className="fs-btn-outline">
                  ← Back to Portfolio
                </a>
              </div>
            </div>

            {/* ════════════════ FOOTER ════════════════ */}
            <footer className="fs-footer">
              <div className="fs-footer__inner">
                <span className="fs-footer__copy">© 2026 Reno Febriyanto</span>
                <div className="fs-footer__links">
                  {[
                    ['GitHub',   'https://github.com/RenoFebriyanto'],
                    ['itch.io',  'https://catmounth.itch.io'],
                    ['LinkedIn', 'https://linkedin.com/in/renofebriyanto/'],
                  ].map(([label, href]) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="fs-footer__link">
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </footer>

          </div>
        </div>

        {/* ── Lightbox ── */}
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
      </div>
    </>
  );
}