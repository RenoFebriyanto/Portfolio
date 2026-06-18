import { useEffect, useRef, useState } from 'react';

/* ─── Particle Canvas ────────────────────────────────────────────────────── */
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    const COUNT = 80;
    type P = { x: number; y: number; r: number; vy: number; vx: number; alpha: number; pulse: number; ps: number };
    let particles: P[] = [];
    let rafId = 0;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    function rand(a: number, b: number) { return Math.random() * (b - a) + a; }
    particles = Array.from({ length: COUNT }, () => ({
      x: rand(0, W), y: rand(0, H),
      r: rand(0.3, 1.4),
      vy: rand(0.01, 0.06), vx: rand(-0.02, 0.02),
      alpha: rand(0.04, 0.25),
      pulse: rand(0, Math.PI * 2),
      ps: rand(0.004, 0.01),
    }));

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.pulse += p.ps;
        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(180,220,255,${a})`;
        ctx!.fill();
        p.x += p.vx; p.y -= p.vy;
        if (p.y < -4) { p.y = H + 4; p.x = rand(0, W); }
        if (p.x < -4) p.x = W + 4;
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

/* ─── Scroll-triggered reveal ───────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.bh-reveal');
    if (!items.length) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('bh-revealed');
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    items.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Parallax on hero images ───────────────────────────────────────────── */
function useParallax() {
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const heroImg = document.querySelector<HTMLElement>('.bh-hero__img-wrap');
      if (heroImg) {
        heroImg.style.transform = `translateY(${scrollY * 0.12}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

/* ─── Lightbox ───────────────────────────────────────────────────────────── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="bh-lightbox" onClick={onClose}>
      <button className="bh-lightbox__close" onClick={onClose}>✕</button>
      <div className="bh-lightbox__frame" onClick={e => e.stopPropagation()}>
        <img src={src} alt="Render" className="bh-lightbox__img" />
      </div>
    </div>
  );
}

/* ─── Annotation pin ─────────────────────────────────────────────────────── */
function Pin({ x, y, label, desc }: { x: string; y: string; label: string; desc: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bh-pin" style={{ left: x, top: y }} onClick={() => setOpen(!open)}>
      <div className="bh-pin__dot" />
      <div className="bh-pin__line" />
      {open && (
        <div className="bh-pin__tooltip">
          <div className="bh-pin__tooltip-label">{label}</div>
          <div className="bh-pin__tooltip-desc">{desc}</div>
        </div>
      )}
    </div>
  );
}

/* ─── Counter animation ──────────────────────────────────────────────────── */
function Counter({ to, suffix = '', duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export function BiographHorizonDetail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useParticles(canvasRef);
  useReveal();
  useParallax();

  const specs = [
    { label: 'Software', value: 'Blender 4.x' },
    { label: 'Renderer', value: 'Cycles' },
    { label: 'Samples', value: '1024 px' },
    { label: 'Shading', value: 'PBR / Studio HDRI' },
    { label: 'Geometry', value: 'Hard-surface' },
    { label: 'Textures', value: 'Substance Painter' },
  ];

  const renders = [
    { src: '/Assets/images/BiographHorizon.png', label: 'Hero Overview' },
    { src: '/Assets/images/BiographHorizonFront.png', label: 'Front View' },
    { src: '/Assets/images/BiographHorizonSide.png', label: 'Side View' },
  ];

  const process = [
    {
      num: '01',
      title: 'Reference & Blockout',
      desc: 'Gathered technical schematics and orthographic reference of the Siemens Biograph Horizon PET/CT scanner. Built a base blockout matching real-world proportions using modular hard-surface primitives.',
    },
    {
      num: '02',
      title: 'Hard-Surface Modeling',
      desc: 'Detailed topology pass — gantry bore, patient table rail system, control panel. Used subdivision modifier workflow with sharp edge creasing for clean rounded silhouettes without excess geometry.',
    },
    {
      num: '03',
      title: 'Material & Texturing',
      desc: 'PBR material pipeline in Substance Painter. White matte body with subtle surface imperfections, brushed plastic finish, and branded label decals for Siemens Healthineers identity elements.',
    },
    {
      num: '04',
      title: 'Lighting & Rendering',
      desc: 'Studio HDRI environment with supplemental area lights for controlled highlights and soft shadow fill. Final output at 4K in Cycles with ACES filmic tone mapping for accurate clinical white reproduction.',
    },
  ];

  return (
    <>
      <style>{`
        /* ════ TOKEN LAYER ════ */
        [data-page="biograph-horizon"] {
          --bh-void:       #07080c;
          --bh-deep:       #0c0e14;
          --bh-surface:    #111318;
          --bh-panel:      #161820;
          --bh-panel-hi:   #1c1f28;
          --bh-border:     rgba(160,200,255,0.09);
          --bh-border-hi:  rgba(160,200,255,0.22);
          --bh-ice:        #a8d8f0;
          --bh-ice-dim:    rgba(168,216,240,0.10);
          --bh-ice-glow:   rgba(168,216,240,0.28);
          --bh-gold:       #c8973a;
          --bh-gold-dim:   rgba(200,151,58,0.12);
          --bh-text:       #dce8f0;
          --bh-text-2:     #6a8a9a;
          --bh-text-3:     #2a404c;
          --bh-ease:       cubic-bezier(0.16,1,0.3,1);
          font-family: 'DM Sans', sans-serif;
          color: var(--bh-text);
          background: var(--bh-void);
        }

        /* ════ CANVAS / ATMOSPHERE ════ */
        .bh-canvas {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.4;
        }
        .bh-grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(168,216,240,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,216,240,0.022) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, rgba(0,0,0,0.7) 0%, transparent 75%);
        }
        .bh-top-glow {
          position: fixed; top: -250px; left: 50%; transform: translateX(-50%);
          width: 800px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(168,216,240,0.04) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .bh-scanlines {
          position: fixed; inset: 0; pointer-events: none; z-index: 1;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px);
        }

        /* ════ NAV ════ */
        .bh-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 60px;
          border-bottom: 1px solid rgba(168,216,240,0.05);
          background: linear-gradient(to bottom, rgba(7,8,12,0.95) 0%, transparent 100%);
          backdrop-filter: blur(16px);
        }
        .bh-nav__back {
          display: flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.1em; color: var(--bh-text-2);
          text-decoration: none; transition: color 0.2s;
        }
        .bh-nav__back:hover { color: var(--bh-ice); }
        .bh-nav__back:hover .bh-nav__back-arrow { transform: translateX(-3px); }
        .bh-nav__back-arrow { display: inline-block; transition: transform 0.2s; }
        .bh-nav__center { display: flex; align-items: center; gap: 12px; }
        .bh-nav__badge {
          font-family: 'JetBrains Mono', monospace; font-size: 0.58rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 3px;
          background: var(--bh-gold-dim); border: 1px solid rgba(200,151,58,0.3); color: var(--bh-gold);
        }
        .bh-nav__title {
          font-family: 'Barlow Condensed', sans-serif; font-size: 1rem;
          font-weight: 700; letter-spacing: 0.06em; color: var(--bh-text); text-transform: uppercase;
        }
        .bh-nav__cta {
          font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
          letter-spacing: 0.08em; color: var(--bh-ice);
          border: 1px solid var(--bh-border-hi); padding: 8px 18px;
          border-radius: 4px; text-decoration: none; transition: background 0.2s, border-color 0.2s;
        }
        .bh-nav__cta:hover { background: var(--bh-ice-dim); border-color: rgba(168,216,240,0.4); }

        /* ════ CONTENT WRAPPER ════ */
        .bh-content {
          position: relative; z-index: 2;
          background: var(--bh-void); min-height: 100vh; overflow: hidden;
        }

        /* ════ HERO ════ */
        .bh-hero {
          min-height: 100vh;
          display: grid; grid-template-columns: 1fr 1.1fr;
          align-items: center; gap: 80px;
          padding: 160px 80px 100px;
          position: relative; overflow: hidden;
        }
        .bh-hero::before {
          content: 'BIOGRAPH';
          position: absolute; right: -40px; top: 50%; transform: translateY(-50%);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(100px, 14vw, 200px); font-weight: 800;
          letter-spacing: 0.05em; text-transform: uppercase;
          color: rgba(168,216,240,0.018); line-height: 1;
          pointer-events: none; user-select: none;
        }
        .bh-hero__eyebrow {
          display: flex; align-items: center; gap: 12px;
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.16em; text-transform: uppercase; color: var(--bh-ice);
          opacity: 0.65; margin-bottom: 24px;
        }
        .bh-hero__eyebrow::before {
          content: ''; display: block; width: 28px; height: 1px;
          background: var(--bh-ice); opacity: 0.5;
        }
        .bh-hero__heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(68px, 9vw, 120px); font-weight: 800;
          line-height: 0.92; letter-spacing: -0.01em; text-transform: uppercase;
          margin-bottom: 32px;
        }
        .bh-hero__heading-line1 { display: block; color: var(--bh-text); }
        .bh-hero__heading-line2 {
          display: block; color: transparent;
          -webkit-text-stroke: 1.5px var(--bh-ice);
          text-shadow: 0 0 40px rgba(168,216,240,0.4), 0 0 80px rgba(168,216,240,0.15);
        }
        .bh-hero__desc {
          font-size: 1rem; line-height: 1.75; color: var(--bh-text-2);
          max-width: 420px; margin-bottom: 36px; font-weight: 300;
        }
        .bh-hero__tags {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 44px;
        }
        .bh-hero__tag {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 3px;
        }
        .bh-tag--ice {
          background: var(--bh-ice-dim); border: 1px solid rgba(168,216,240,0.25); color: var(--bh-ice);
        }
        .bh-tag--gold {
          background: var(--bh-gold-dim); border: 1px solid rgba(200,151,58,0.25); color: var(--bh-gold);
        }
        .bh-tag--neutral {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: var(--bh-text-2);
        }
        .bh-hero__meta {
          display: flex; align-items: center; gap: 28px;
        }
        .bh-hero__meta-item { display: flex; flex-direction: column; gap: 3px; }
        .bh-hero__meta-label {
          font-family: 'JetBrains Mono', monospace; font-size: 0.58rem;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--bh-text-3);
        }
        .bh-hero__meta-val {
          font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
          color: var(--bh-text); letter-spacing: 0.03em;
        }
        .bh-meta-divider { width: 1px; height: 32px; background: var(--bh-border); flex-shrink: 0; }

        /* Hero image */
        .bh-hero__img-wrap {
          position: relative; border-radius: 8px; overflow: hidden;
          border: 1px solid var(--bh-border-hi);
          box-shadow: 0 0 0 1px rgba(168,216,240,0.04), 0 48px 96px rgba(0,0,0,0.7), 0 0 80px rgba(168,216,240,0.06);
          will-change: transform;
        }
        .bh-hero__img-wrap::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(168,216,240,0.05) 0%, transparent 50%);
          pointer-events: none; z-index: 1;
        }
        /* Shimmer sweep */
        .bh-hero__img-wrap::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 55%; height: 100%;
          background: linear-gradient(105deg, transparent, rgba(168,216,240,0.06) 45%, rgba(168,216,240,0.1) 50%, rgba(168,216,240,0.06) 55%, transparent);
          pointer-events: none; z-index: 2;
          animation: bh-shimmer 5s ease-in-out 2s infinite;
        }
        @keyframes bh-shimmer { to { left: 140%; } }
        .bh-hero__img { width: 100%; display: block; position: relative; z-index: 0; }
        /* Corner brackets */
        .bh-corner { position: absolute; width: 14px; height: 14px; z-index: 3; }
        .bh-corner--tl { top: 8px; left: 8px; border-top: 1.5px solid var(--bh-ice); border-left: 1.5px solid var(--bh-ice); opacity: 0.5; }
        .bh-corner--tr { top: 8px; right: 8px; border-top: 1.5px solid var(--bh-ice); border-right: 1.5px solid var(--bh-ice); opacity: 0.5; }
        .bh-corner--bl { bottom: 8px; left: 8px; border-bottom: 1.5px solid var(--bh-ice); border-left: 1.5px solid var(--bh-ice); opacity: 0.5; }
        .bh-corner--br { bottom: 8px; right: 8px; border-bottom: 1.5px solid var(--bh-ice); border-right: 1.5px solid var(--bh-ice); opacity: 0.5; }

        /* ════ ANNOTATION PINS ════ */
        .bh-pin {
          position: absolute; cursor: pointer; z-index: 10;
        }
        .bh-pin__dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--bh-ice); box-shadow: 0 0 0 3px rgba(168,216,240,0.2), 0 0 12px rgba(168,216,240,0.5);
          transition: transform 0.2s;
        }
        .bh-pin:hover .bh-pin__dot { transform: scale(1.3); }
        .bh-pin__line {
          position: absolute; top: 4px; left: 9px;
          width: 28px; height: 1px; background: rgba(168,216,240,0.35);
        }
        .bh-pin__tooltip {
          position: absolute; left: 44px; top: -14px;
          background: rgba(7,8,12,0.92); border: 1px solid var(--bh-border-hi);
          border-radius: 4px; padding: 10px 14px;
          backdrop-filter: blur(12px); white-space: nowrap; z-index: 20;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .bh-pin__tooltip-label {
          font-family: 'JetBrains Mono', monospace; font-size: 0.65rem;
          letter-spacing: 0.08em; color: var(--bh-ice); text-transform: uppercase; margin-bottom: 3px;
        }
        .bh-pin__tooltip-desc {
          font-size: 0.78rem; color: var(--bh-text-2); max-width: 180px; white-space: normal;
        }

        /* ════ H-LINE ════ */
        .bh-h-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168,216,240,0.18) 30%, rgba(168,216,240,0.18) 70%, transparent);
          position: relative; z-index: 2;
        }

        /* ════ SECTION BASE ════ */
        .bh-section {
          padding: 100px 0; position: relative; z-index: 2;
        }
        .bh-section--dark { background: linear-gradient(to bottom, var(--bh-void), var(--bh-deep)); }
        .bh-section--panel { background: linear-gradient(to bottom, var(--bh-deep), var(--bh-surface)); }
        .bh-container { max-width: 1100px; margin: 0 auto; padding: 0 80px; }
        .bh-eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 0.62rem;
          letter-spacing: 0.18em; color: var(--bh-ice); opacity: 0.65;
          text-transform: uppercase; margin-bottom: 28px;
          display: flex; align-items: center; gap: 12px;
        }
        .bh-eyebrow::before {
          content: ''; display: block; width: 22px; height: 1px;
          background: var(--bh-ice); opacity: 0.5;
        }

        /* ════ RENDER VIEWER (annotated) ════ */
        .bh-viewer { position: relative; margin-bottom: 56px; }
        .bh-viewer__img-wrap {
          position: relative; border-radius: 6px; overflow: hidden;
          border: 1px solid var(--bh-border-hi);
          box-shadow: 0 0 0 1px rgba(168,216,240,0.03), 0 32px 80px rgba(0,0,0,0.6);
        }
        .bh-viewer__img { width: 100%; display: block; }
        .bh-viewer__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(168,216,240,0.03) 0%, transparent 60%);
          pointer-events: none;
        }
        .bh-viewer__label {
          position: absolute; bottom: 16px; left: 20px;
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--bh-ice); opacity: 0.5;
          background: rgba(7,8,12,0.6); padding: 4px 10px; border-radius: 3px;
          backdrop-filter: blur(8px);
        }

        /* ════ RENDER GALLERY GRID ════ */
        .bh-gallery {
          display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 48px;
        }
        .bh-gallery__item {
          position: relative; overflow: hidden; border-radius: 4px;
          border: 1px solid var(--bh-border); cursor: zoom-in;
          background: var(--bh-panel); transition: border-color 0.3s;
        }
        .bh-gallery__item:hover { border-color: var(--bh-border-hi); }
        .bh-gallery__item img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.5s var(--bh-ease);
        }
        .bh-gallery__item:hover img { transform: scale(1.03); }
        .bh-gallery__item::after {
          content: '⊕'; position: absolute; top: 12px; right: 14px;
          font-size: 1.1rem; color: var(--bh-ice); opacity: 0;
          transition: opacity 0.2s; z-index: 2;
        }
        .bh-gallery__item:hover::after { opacity: 0.6; }

        /* ════ STATS ROW ════ */
        .bh-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 2px; border: 1px solid var(--bh-border); border-radius: 6px; overflow: hidden;
        }
        .bh-stat {
          padding: 36px 28px; background: var(--bh-panel); text-align: center;
          transition: background 0.25s;
        }
        .bh-stat:hover { background: var(--bh-panel-hi); }
        .bh-stat__val {
          font-family: 'Barlow Condensed', sans-serif; font-size: 2.6rem;
          font-weight: 800; color: var(--bh-ice); line-height: 1; margin-bottom: 8px;
          display: block;
        }
        .bh-stat__label {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--bh-text-2);
        }

        /* ════ PROCESS CARDS ════ */
        .bh-process-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
        }
        .bh-process-card {
          padding: 44px 40px; background: var(--bh-panel);
          border: 1px solid var(--bh-border); position: relative; overflow: hidden;
          transition: border-color 0.3s, background 0.3s;
        }
        .bh-process-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, var(--bh-ice), transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .bh-process-card:hover { background: var(--bh-panel-hi); border-color: var(--bh-border-hi); }
        .bh-process-card:hover::before { opacity: 0.6; }
        .bh-process-card__num {
          font-family: 'Barlow Condensed', sans-serif; font-size: 4.5rem;
          font-weight: 800; color: rgba(168,216,240,0.06);
          line-height: 1; margin-bottom: 20px; user-select: none;
        }
        .bh-process-card__title {
          font-family: 'Barlow Condensed', sans-serif; font-size: 1.3rem;
          font-weight: 700; color: var(--bh-text); text-transform: uppercase;
          letter-spacing: 0.03em; margin-bottom: 14px;
        }
        .bh-process-card__desc {
          font-size: 0.88rem; line-height: 1.78; color: var(--bh-text-2);
        }

        /* ════ SPEC TABLE ════ */
        .bh-specs-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0;
          border: 1px solid var(--bh-border); border-radius: 6px; overflow: hidden;
        }
        .bh-spec-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 28px; border-bottom: 1px solid var(--bh-border);
          transition: background 0.2s;
        }
        .bh-spec-row:hover { background: var(--bh-panel-hi); }
        .bh-spec-row:nth-last-child(-n+2) { border-bottom: none; }
        .bh-spec-label {
          font-family: 'JetBrains Mono', monospace; font-size: 0.62rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--bh-text-3);
        }
        .bh-spec-val {
          font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;
          color: var(--bh-text); letter-spacing: 0.03em;
        }

        /* ════ SIDE-BY-SIDE COMPARISON ════ */
        .bh-compare {
          display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
        }
        .bh-compare__item {
          position: relative; overflow: hidden; border-radius: 4px;
          border: 1px solid var(--bh-border); cursor: zoom-in;
          transition: border-color 0.3s;
        }
        .bh-compare__item:hover { border-color: var(--bh-border-hi); }
        .bh-compare__item img {
          width: 100%; display: block;
          transition: transform 0.5s var(--bh-ease);
          filter: brightness(0.92) saturate(0.9);
        }
        .bh-compare__item:hover img {
          transform: scale(1.02);
          filter: brightness(1) saturate(1);
        }
        .bh-compare__label {
          position: absolute; bottom: 14px; left: 16px;
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--bh-ice); opacity: 0.7;
          background: rgba(7,8,12,0.65); padding: 4px 10px; border-radius: 3px;
          backdrop-filter: blur(8px);
        }

        /* ════ CTA ════ */
        .bh-cta {
          text-align: center; padding: 110px 0;
          position: relative; z-index: 2; background: var(--bh-void);
        }
        .bh-cta::before {
          content: ''; position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(168,216,240,0.35));
        }
        .bh-cta__heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 700;
          line-height: 1.1; color: var(--bh-text); margin-bottom: 44px;
        }
        .bh-cta__heading em {
          font-style: normal; color: transparent;
          -webkit-text-stroke: 1.5px var(--bh-ice);
        }
        .bh-cta__buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .bh-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 30px; background: var(--bh-ice); color: #07080c;
          font-family: 'JetBrains Mono', monospace; font-size: 0.76rem;
          letter-spacing: 0.06em; font-weight: 600; border-radius: 4px;
          text-decoration: none; text-transform: uppercase;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .bh-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(168,216,240,0.25); }
        .bh-btn-outline {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 30px; border: 1px solid var(--bh-border-hi); color: var(--bh-text-2);
          font-family: 'JetBrains Mono', monospace; font-size: 0.76rem;
          letter-spacing: 0.06em; border-radius: 4px; text-decoration: none;
          text-transform: uppercase;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .bh-btn-outline:hover { border-color: var(--bh-ice); color: var(--bh-ice); transform: translateY(-2px); }

        /* ════ FOOTER ════ */
        .bh-footer {
          position: relative; z-index: 2; padding: 28px 0;
          border-top: 1px solid rgba(168,216,240,0.06); background: var(--bh-void);
        }
        .bh-footer__inner {
          max-width: 1100px; margin: 0 auto; padding: 0 80px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .bh-footer__copy {
          font-family: 'JetBrains Mono', monospace; font-size: 0.65rem;
          color: var(--bh-text-3); letter-spacing: 0.06em;
        }
        .bh-footer__links { display: flex; gap: 28px; }
        .bh-footer__link {
          font-family: 'JetBrains Mono', monospace; font-size: 0.65rem;
          color: var(--bh-text-2); text-decoration: none; letter-spacing: 0.06em;
          transition: color 0.2s;
        }
        .bh-footer__link:hover { color: var(--bh-ice); }

        /* ════ LIGHTBOX ════ */
        .bh-lightbox {
          position: fixed; inset: 0; background: rgba(7,8,12,0.96); z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          animation: bh-lb-in 0.22s ease forwards;
        }
        @keyframes bh-lb-in { from { opacity: 0; } to { opacity: 1; } }
        .bh-lightbox__close {
          position: absolute; top: 28px; right: 36px;
          background: none; border: none; font-size: 1.4rem;
          color: var(--bh-text-2); cursor: pointer; transition: color 0.2s; font-family: monospace;
        }
        .bh-lightbox__close:hover { color: var(--bh-ice); }
        .bh-lightbox__frame {
          border-radius: 4px; overflow: hidden;
          animation: bh-lb-scale 0.3s var(--bh-ease, cubic-bezier(0.16,1,0.3,1)) forwards;
          border: 1px solid var(--bh-border-hi);
        }
        @keyframes bh-lb-scale {
          from { transform: scale(0.94); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .bh-lightbox__img {
          display: block; max-width: 90vw; max-height: 88vh; object-fit: contain; border-radius: 4px;
        }

        /* ════ REVEAL ANIMATION ════ */
        .bh-reveal {
          opacity: 0; transform: translateY(22px);
          transition: opacity 0.75s var(--bh-ease, cubic-bezier(0.16,1,0.3,1)),
                      transform 0.75s var(--bh-ease, cubic-bezier(0.16,1,0.3,1));
        }
        .bh-reveal.bh-revealed { opacity: 1; transform: translateY(0); }
        .bh-reveal.bh-d1 { transition-delay: 0.1s; }
        .bh-reveal.bh-d2 { transition-delay: 0.2s; }
        .bh-reveal.bh-d3 { transition-delay: 0.3s; }

        /* ════ RESPONSIVE ════ */
        @media (max-width: 1000px) {
          .bh-hero { grid-template-columns: 1fr; padding: 130px 48px 80px; gap: 56px; }
          .bh-container { padding: 0 40px; }
          .bh-process-grid { grid-template-columns: 1fr; }
          .bh-specs-grid { grid-template-columns: 1fr; }
          .bh-stats { grid-template-columns: 1fr 1fr; }
          .bh-footer__inner { padding: 0 40px; }
          .bh-nav { padding: 16px 32px; }
          .bh-nav__title { display: none; }
        }
        @media (max-width: 640px) {
          .bh-hero { padding: 120px 24px 60px; gap: 40px; }
          .bh-container { padding: 0 24px; }
          .bh-gallery { grid-template-columns: 1fr; }
          .bh-compare { grid-template-columns: 1fr; }
          .bh-hero__meta { flex-wrap: wrap; gap: 18px; }
          .bh-meta-divider { display: none; }
          .bh-stats { grid-template-columns: 1fr 1fr; }
          .bh-footer__inner { padding: 0 24px; flex-direction: column; gap: 16px; align-items: flex-start; }
        }
      `}</style>

      <div data-page="biograph-horizon">
        {/* ── Atmosphere ── */}
        <canvas ref={canvasRef} className="bh-canvas" />
        <div className="bh-scanlines" />
        <div className="bh-grid-bg" />
        <div className="bh-top-glow" />

        {/* ── Nav ── */}
        <nav className="bh-nav">
          <a href="/" className="bh-nav__back">
            <span className="bh-nav__back-arrow">←</span>
            Back to Portfolio
          </a>
          <div className="bh-nav__center">
            <span className="bh-nav__badge">3D Art</span>
            <span className="bh-nav__title">Biograph Horizon</span>
          </div>
          <a href="/" className="bh-nav__cta">View More Work ↗</a>
        </nav>

        {/* ── Content ── */}
        <div className="bh-content">

          {/* ════ HERO ════ */}
          <section className="bh-hero">
            <div>
              <p className="bh-hero__eyebrow">3D Product Render · Blender · 2025</p>
              <h1 className="bh-hero__heading">
                <span className="bh-hero__heading-line1">BIOGRAPH</span>
                <span className="bh-hero__heading-line2">HORIZON</span>
              </h1>
              <p className="bh-hero__desc">
                A high-fidelity product visualization of the Siemens Healthineers Biograph Horizon PET/CT scanner.
                Hard-surface modeling, PBR materials, and studio lighting — built in Blender with Cycles rendering.
              </p>
              <div className="bh-hero__tags">
                <span className="bh-hero__tag bh-tag--ice">Hard-Surface Modeling</span>
                <span className="bh-hero__tag bh-tag--gold">Blender · Cycles</span>
                <span className="bh-hero__tag bh-tag--neutral">Product Visualization</span>
                <span className="bh-hero__tag bh-tag--neutral">2025</span>
              </div>
              <div className="bh-hero__meta">
                <div className="bh-hero__meta-item">
                  <span className="bh-hero__meta-label">Software</span>
                  <span className="bh-hero__meta-val">Blender 4.x</span>
                </div>
                <div className="bh-meta-divider" />
                <div className="bh-hero__meta-item">
                  <span className="bh-hero__meta-label">Renderer</span>
                  <span className="bh-hero__meta-val">Cycles</span>
                </div>
                <div className="bh-meta-divider" />
                <div className="bh-hero__meta-item">
                  <span className="bh-hero__meta-label">Type</span>
                  <span className="bh-hero__meta-val">Product Render</span>
                </div>
              </div>
            </div>

            {/* Annotated image */}
            <div className="bh-hero__img-wrap">
              <img
                src="/Assets/images/BiographHorizon.png"
                alt="Biograph Horizon Side Render"
                className="bh-hero__img"
                onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
              />
              <div className="bh-corner bh-corner--tl" />
              <div className="bh-corner bh-corner--tr" />
              <div className="bh-corner bh-corner--bl" />
              <div className="bh-corner bh-corner--br" />
              {/* Annotation pins */}
              <Pin x="62%" y="18%" label="Gantry" desc="PET/CT bore housing with scanner array" />
              <Pin x="78%" y="48%" label="Siemens Label" desc="Branded decal — texture-painted in Substance" />
              <Pin x="30%" y="72%" label="Patient Table" desc="Motorized rail system, modular geometry" />
            </div>
          </section>

          <div className="bh-h-line" />

          {/* ════ STATS ════ */}
          <section className="bh-section bh-section--dark">
            <div className="bh-container">
              <div className="bh-stats bh-reveal">
                <div className="bh-stat">
                  <span className="bh-stat__val">
                    <Counter to={4} suffix="K" />
                  </span>
                  <span className="bh-stat__label">Output Resolution</span>
                </div>
                <div className="bh-stat">
                  <span className="bh-stat__val">
                    <Counter to={1024} />
                  </span>
                  <span className="bh-stat__label">Render Samples</span>
                </div>
                <div className="bh-stat">
                  <span className="bh-stat__val">
                    <Counter to={2} />
                  </span>
                  <span className="bh-stat__label">Final Renders</span>
                </div>
                <div className="bh-stat">
                  <span className="bh-stat__val">PBR</span>
                  <span className="bh-stat__label">Shading Pipeline</span>
                </div>
              </div>
            </div>
          </section>

          <div className="bh-h-line" />

          {/* ════ RENDER GALLERY ════ */}
          <section className="bh-section bh-section--panel">
            <div className="bh-container">
              <p className="bh-eyebrow bh-reveal">01 — Render Gallery</p>

              {/* Main featured render — front view annotated */}
              <div className="bh-viewer bh-reveal bh-d1">
                <div className="bh-viewer__img-wrap" style={{ position: 'relative' }}>
                  <img
                    src="/Assets/images/BiographHorizonFront.png"
                    alt="Biograph Horizon Front View"
                    className="bh-viewer__img"
                    onClick={() => setLightboxSrc('/Assets/images/BiographHorizonFront.png')}
                    style={{ cursor: 'zoom-in' }}
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0.1'; }}
                  />
                  <div className="bh-viewer__overlay" />
                  <div className="bh-viewer__label">Front View — Studio Light</div>
                  <Pin x="47%" y="22%" label="Gantry Front" desc="Circular bore opening, dual scanning rings" />
                  <Pin x="68%" y="55%" label="Branding" desc="BIOGRAPH Horizon nameplate — gold decal" />
                  <Pin x="34%" y="78%" label="Base Unit" desc="Table cradle & floor anchor geometry" />
                </div>
              </div>

              {/* Side by side comparison */}
              <div className="bh-compare bh-reveal bh-d2">
                <div
                  className="bh-compare__item"
                  onClick={() => setLightboxSrc('/Assets/images/BiographHorizonFront.png')}
                >
                  <img
                    src="/Assets/images/BiographHorizonFront.png"
                    alt="Front View"
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0.1'; }}
                  />
                  <span className="bh-compare__label">FRONT VIEW</span>
                </div>
                <div
                  className="bh-compare__item"
                  onClick={() => setLightboxSrc('/Assets/images/BiographHorizon.png')}
                >
                  <img
                    src="/Assets/images/BiographHorizon.png"
                    alt="Side View"
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0.1'; }}
                  />
                  <span className="bh-compare__label">SIDE / 3/4 VIEW</span>
                </div>
              </div>
            </div>
          </section>

          <div className="bh-h-line" />

          {/* ════ PROCESS ════ */}
          <section className="bh-section bh-section--dark">
            <div className="bh-container">
              <p className="bh-eyebrow bh-reveal">02 — Production Process</p>
              <div className="bh-process-grid">
                {process.map((step, i) => (
                  <div key={step.num} className={`bh-process-card bh-reveal bh-d${Math.min(i + 1, 3)}`}>
                    <div className="bh-process-card__num">{step.num}</div>
                    <h3 className="bh-process-card__title">{step.title}</h3>
                    <p className="bh-process-card__desc">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="bh-h-line" />

          {/* ════ TECH SPECS ════ */}
          <section className="bh-section bh-section--panel">
            <div className="bh-container">
              <p className="bh-eyebrow bh-reveal">03 — Technical Specs</p>
              <div className="bh-specs-grid bh-reveal bh-d1">
                {specs.map(s => (
                  <div key={s.label} className="bh-spec-row">
                    <span className="bh-spec-label">{s.label}</span>
                    <span className="bh-spec-val">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ════ CTA ════ */}
          <div className="bh-cta">
            <h2 className="bh-cta__heading bh-reveal">
              Precision meets<br /><em>visual craft.</em>
            </h2>
            <div className="bh-cta__buttons bh-reveal bh-d1">
              <a href="/#projects" className="bh-btn-primary">← View All Projects</a>
              <a href="/#contact" className="bh-btn-outline">Get In Touch</a>
            </div>
          </div>

          {/* ════ FOOTER ════ */}
          <footer className="bh-footer">
            <div className="bh-footer__inner">
              <span className="bh-footer__copy">© 2025 Reno Febriyanto — Biograph Horizon</span>
              <div className="bh-footer__links">
                {[
                  ['GitHub', 'https://github.com/RenoFebriyanto'],
                  ['itch.io', 'https://catmounth.itch.io'],
                  ['LinkedIn', 'https://linkedin.com/in/renofebriyanto/'],
                ].map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="bh-footer__link">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </div>

        {/* ── Lightbox ── */}
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
      </div>
    </>
  );
}