import { useEffect, useRef } from 'react';

/* Particles background — port of forbidden-js/particles.js */
function useParticles(canvasId: string) {
  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx  = canvas.getContext('2d');
    if (!ctx) return;

    let W: number, H: number;
    const COUNT  = 90;
    const CYAN   = { r: 0,   g: 200, b: 255 };
    const ORANGE = { r: 255, g: 107, b: 53  };

    function resize() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

    type Particle = {
      x: number; y: number; r: number;
      vy: number; vx: number; alpha: number;
      pulse: number; pulseSpeed: number;
      tint: typeof CYAN;
    };

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: rand(0, W), y: rand(0, H),
      r: rand(0.6, 2.0),
      vy: rand(0.02, 0.12), vx: rand(-0.04, 0.04),
      alpha: rand(0.08, 0.5),
      pulse: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.004, 0.014),
      tint: Math.random() < 0.12 ? ORANGE : CYAN,
    }));

    let rafId: number;
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.pulse += p.pulseSpeed;
        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.tint.r},${p.tint.g},${p.tint.b},${a})`;
        ctx!.fill();
        p.x += p.vx;
        p.y -= p.vy;
        if (p.y < -4)  { p.y = H + 4; p.x = rand(0, W); }
        if (p.x < -4)  p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
      });
      rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasId]);
}

/* Lightbox */
function useLightbox() {
  useEffect(() => {
    const items    = document.querySelectorAll<HTMLElement>('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightImg = document.getElementById('lightboxImg') as HTMLImageElement | null;
    const closeBtn = document.getElementById('lightboxClose');
    if (!items.length || !lightbox || !lightImg) return;

    const open = (src: string, alt = '') => {
      lightImg.src = src;
      lightImg.alt = alt;
      lightbox.classList.add('active');
    };
    const close = () => {
      lightbox.classList.remove('active');
      setTimeout(() => { lightImg.src = ''; }, 300);
    };

    items.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.src ?? item.querySelector('img')?.src ?? '';
        const alt = item.querySelector('img')?.alt ?? '';
        if (src) open(src, alt);
      });
    });

    closeBtn?.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, []);
}

/* Reveal on scroll */
function useRevealUp() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal-up, .reveal-right');
    if (!items.length) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function ForbiddenSpaceDetail() {
  useParticles('bgCanvas');
  useLightbox();
  useRevealUp();

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

  return (
    <>
      {/* Inline CSS for project page tokens — scoped via data attribute */}
      <style>{`
        [data-page="forbidden-space"] {
          --fs-void: #02090d; --fs-space: #02262b; --fs-dark: #061a1f;
          --fs-panel: #0a2d35; --fs-border: rgba(0,200,255,0.12);
          --fs-cyan: #00c8ff; --fs-cyan-dim: rgba(0,200,255,0.15);
          --fs-cyan-glow: rgba(0,200,255,0.4); --fs-orange: #FF6B35;
          --fs-text: #c8dde3; --fs-text-muted: #5a8a96; --fs-text-dim: #2e5a66;
        }
      `}</style>

      <div data-page="forbidden-space" style={{ background: 'var(--fs-void)', minHeight: '100vh', color: 'var(--fs-text)' }}>
        <canvas
          id="bgCanvas"
          style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}
        />

        {/* Nav */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 40px',
          background: 'linear-gradient(to bottom, rgba(2,9,13,0.95) 0%, transparent 100%)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0,200,255,0.06)',
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.08em', color: 'var(--fs-text-muted)', textDecoration: 'none' }}>
            ← Back to Portfolio
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', padding: '3px 8px', background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)', borderRadius: '3px', color: 'var(--fs-cyan)' }}>GAME</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--fs-text)' }}>Forbidden Space</span>
          </div>
          <a href="https://wubblyduby.itch.io/forbidden-space" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--fs-cyan)', border: '1px solid rgba(0,200,255,0.15)', padding: '6px 14px', borderRadius: '4px', textDecoration: 'none' }}>
            Play on itch.io ↗
          </a>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '120px 80px 80px', gap: '60px' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }} className="reveal-up">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '3px', background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)', color: 'var(--fs-cyan)' }}>ROGUELIKE · 2D · SHOOTER</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '3px', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', color: 'var(--fs-orange)' }}>Unity</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--fs-text-muted)' }}>Released · 2026</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(64px,9vw,120px)', lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: '24px', textTransform: 'uppercase' }} className="reveal-up">
              <span style={{ display: 'block', color: 'var(--fs-text)' }}>FORBIDDEN</span>
              <span style={{
                display: 'block',
                color: 'transparent',
                WebkitTextStroke: '2px var(--fs-cyan)',
                textShadow: '0 0 60px rgba(0,200,255,0.4), 0 0 120px rgba(0,200,255,0.15)',
              }}>SPACE</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--fs-text-muted)', maxWidth: '420px', marginBottom: '28px', fontStyle: 'italic' }} className="reveal-up">
              A cosmic time-loop roguelike where death resets the universe.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }} className="reveal-up">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--fs-text-dim)' }}>MY ROLE</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--fs-cyan)' }}>Programmer · VFX Artist</span>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} className="reveal-up">
              <a href="https://wubblyduby.itch.io/forbidden-space" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--fs-cyan)', color: 'var(--fs-void)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.06em', borderRadius: '4px', textDecoration: 'none', fontWeight: 500 }}>
                Play Free on itch.io
              </a>
              <a href="#overview"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', border: '1px solid var(--fs-border)', color: 'var(--fs-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.06em', borderRadius: '4px', textDecoration: 'none' }}>
                View Project
              </a>
            </div>
          </div>

          {/* Hero image */}
          <div style={{ position: 'relative', zIndex: 2 }} className="reveal-right">
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--fs-border)', boxShadow: '0 0 80px rgba(0,200,255,0.1)' }}>
              <img
                src="/Assets/project/game/ForbiddenSpace/ForbiddenSpacePreview.png"
                alt="Forbidden Space Preview"
                style={{ width: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,200,255,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section id="overview" style={{ padding: '100px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 60px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--fs-cyan)', marginBottom: '24px', opacity: 0.7 }} className="reveal-up">01 — STORY</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '60px', alignItems: 'start' }}>
              <div className="reveal-up">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '32px' }}>Trapped in a Cosmic Loop</h2>
                <p style={{ color: 'var(--fs-text-muted)', lineHeight: 1.75, marginBottom: '16px' }}>
                  In a remote corner of the universe lies a mysterious place known as <em style={{ color: 'var(--fs-cyan)', fontStyle: 'normal' }}>"The Forbidden Space."</em> It is the domain of a four-dimensional extraterrestrial being capable of manipulating time itself.
                </p>
                <p style={{ color: 'var(--fs-text-muted)', lineHeight: 1.75 }}>
                  Players take control of a spacecraft named <strong style={{ color: 'var(--fs-text)' }}>J4-RW0</strong> — "Jarwo" — who accidentally enters The Forbidden Space. Trapped within, Jarwo becomes nothing more than a plaything for the powerful entity, which endlessly resets and repeats time.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }} className="reveal-up">
                {[
                  { v: '2D',   l: 'Art Style' },
                  { v: '∞',    l: 'Time Loops' },
                  { v: '4',    l: 'Team Members' },
                  { v: 'HTML5',l: 'Platform' },
                ].map(s => (
                  <div key={s.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 20px', background: 'var(--fs-panel)', border: '1px solid var(--fs-border)', textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--fs-cyan)', lineHeight: 1, marginBottom: '6px' }}>{s.v}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--fs-text-muted)', textTransform: 'uppercase' }}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO */}
        <section style={{ padding: '100px 0', position: 'relative', zIndex: 1, background: 'linear-gradient(to bottom, var(--fs-void), var(--fs-dark))' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 60px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--fs-cyan)', marginBottom: '24px', opacity: 0.7 }} className="reveal-up">02 — GAMEPLAY</p>
            <div className="reveal-up" style={{ maxWidth: '800px' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '6px', border: '1px solid var(--fs-border)', boxShadow: '0 0 60px rgba(0,200,255,0.06)' }}>
                <iframe
                  src="https://www.youtube.com/embed/jWMfVkl7hZA"
                  title="Forbidden Space Gameplay"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                />
              </div>
              <p style={{ marginTop: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--fs-text-dim)' }}>Gameplay Trailer — Forbidden Space</p>
            </div>
          </div>
        </section>

        {/* SCREENSHOTS */}
        <section style={{ padding: '100px 0', position: 'relative', zIndex: 1, background: 'linear-gradient(to bottom, var(--fs-dark), var(--fs-void))' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 60px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--fs-cyan)', marginBottom: '32px', opacity: 0.7 }} className="reveal-up">04 — SCREENSHOTS</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }} className="reveal-up">
              {screenshots.map((src, i) => (
                <div
                  key={i}
                  className="gallery-item"
                  data-src={src}
                  style={{
                    position: 'relative', overflow: 'hidden', borderRadius: '4px',
                    border: '1px solid var(--fs-border)', cursor: 'zoom-in',
                    aspectRatio: i === 0 || i === 3 ? 'auto' : '4/3',
                    gridRow: i === 0 || i === 3 ? 'span 2' : undefined,
                  }}
                >
                  <img src={src} alt={`Screenshot ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Lightbox */}
          <div id="lightbox" style={{ position: 'fixed', inset: 0, background: 'rgba(2,9,13,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, pointerEvents: 'none', transition: 'opacity 0.3s' }}>
            <button id="lightboxClose" style={{ position: 'absolute', top: '24px', right: '32px', background: 'none', border: 'none', color: 'var(--fs-text-muted)', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            <img id="lightboxImg" src="" alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '4px' }} />
          </div>
        </section>

        {/* CONTRIBUTION */}
        <section style={{ padding: '100px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 60px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--fs-cyan)', marginBottom: '24px', opacity: 0.7 }} className="reveal-up">05 — MY CONTRIBUTION</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
              {[
                {
                  num: '01', title: 'Boss Fight Programming',
                  desc: 'Designed and implemented the entire boss encounter system — boss AI state machines, multi-phase attack logic, and the in-game UI for boss health, phase indicators, and combat feedback.',
                  tags: ['C#', 'Unity', 'Boss AI', 'UI System'],
                },
                {
                  num: '02', title: 'Boss VFX Artist',
                  desc: 'Created all visual effects for the boss fight — portal summon effects, slam impact shockwaves, laser beam attacks, projectile shoot effects, hit reactions, and death VFX.',
                  tags: ['VFX Graph', 'Shader Graph'],
                },
              ].map(c => (
                <div key={c.num} className="reveal-up" style={{ padding: '40px 36px', background: 'var(--fs-panel)', border: '1px solid var(--fs-border)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, color: 'var(--fs-text-dim)', lineHeight: 1, marginBottom: '20px', opacity: 0.4 }}>{c.num}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--fs-text)', marginBottom: '14px', letterSpacing: '0.02em' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--fs-text-muted)', marginBottom: '20px' }}>{c.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {c.tags.map(t => (
                      <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', padding: '3px 10px', background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.2)', borderRadius: '3px', color: 'var(--fs-cyan)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section style={{ padding: '100px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 60px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--fs-cyan)', marginBottom: '24px', opacity: 0.7 }} className="reveal-up">07 — TEAM</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px' }} className="reveal-up">
              {[
                { initials: 'RFK', name: 'Robbani Fadhillah Kafura', role: 'Game Designer · Programmer', isMe: false },
                { initials: 'RF',  name: 'Reno Febriyanto',           role: 'Programmer · VFX Artist',  isMe: true  },
                { initials: 'AFK', name: 'Adinda Fadilla Kirana Dewi', role: 'Game Artist 2D',           isMe: false },
                { initials: 'PP',  name: 'Putu Pande',                 role: 'Game Artist 2D',           isMe: false },
              ].map(m => (
                <div key={m.initials} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px 28px', background: 'var(--fs-panel)', border: `1px solid ${m.isMe ? 'rgba(0,200,255,0.3)' : 'var(--fs-border)'}`, position: 'relative' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: m.isMe ? 'rgba(0,200,255,0.15)' : 'var(--fs-dark)', border: `1px solid ${m.isMe ? 'var(--fs-cyan)' : 'var(--fs-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: m.isMe ? 'var(--fs-cyan)' : 'var(--fs-text-muted)', flexShrink: 0 }}>
                    {m.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--fs-text)', marginBottom: '2px' }}>{m.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--fs-text-muted)', letterSpacing: '0.04em' }}>{m.role}</div>
                  </div>
                  {m.isMe && (
                    <span style={{ position: 'absolute', top: '12px', right: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', padding: '2px 7px', background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)', borderRadius: '3px', color: 'var(--fs-cyan)' }}>YOU</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '100px 0', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 60px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--fs-cyan)', marginBottom: '16px', fontStyle: 'italic' }} className="reveal-up">The loop awaits.</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '40px', color: 'var(--fs-text)' }} className="reveal-up">
              Ready to enter The Forbidden Space?
            </h2>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }} className="reveal-up">
              <a href="https://wubblyduby.itch.io/forbidden-space" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 36px', background: 'var(--fs-cyan)', color: 'var(--fs-void)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', letterSpacing: '0.06em', borderRadius: '4px', textDecoration: 'none', fontWeight: 500 }}>
                Play Free Now — itch.io
              </a>
              <a href="/"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 36px', border: '1px solid var(--fs-border)', color: 'var(--fs-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', letterSpacing: '0.06em', borderRadius: '4px', textDecoration: 'none' }}>
                ← Back to Portfolio
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ position: 'relative', zIndex: 1, padding: '28px 0', borderTop: '1px solid var(--fs-border)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--fs-text-dim)', letterSpacing: '0.06em' }}>© 2026 Reno Febriyanto</span>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                ['GitHub',   'https://github.com/RenoFebriyanto'],
                ['itch.io',  'https://catmounth.itch.io'],
                ['LinkedIn', 'https://linkedin.com/in/renofebriyanto/'],
              ].map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--fs-text-muted)', letterSpacing: '0.06em', textDecoration: 'none' }}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
