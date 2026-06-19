import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { gsap, useGSAP } from '~/utils/gsap';
import { useProjectSnap, PROJECT_ENTER, PROJECT_LEAVE } from '~/hooks/useProjectSnap';
import { BiographViewer } from './BiographViewer';
import '~/styles/biograph-horizon.css';

/* ── Panel definitions ── */
const BH_PANELS = [
  { id: 'bh-hero',     label: 'Hero',      scrollable: false },
  { id: 'bh-overview', label: 'Overview',  scrollable: false },
  { id: 'bh-gallery',  label: 'Gallery',   scrollable: true  },
  { id: 'bh-bts',      label: 'Process',   scrollable: true  },
  { id: 'bh-viewer',   label: '3D View',   scrollable: false },
  { id: 'bh-specs',    label: 'Specs',     scrollable: true  },
] as const;

/* ── Content data ── */
const BH_DATA = {
  eyebrow:    'Case Study — 3D Art',
  titleLine1: 'Biograph',
  titleLine2: 'Horizon',
  sub: 'A cinematic medical-equipment render exploring material studies, studio lighting, and procedural texturing — fully modeled and rendered in Blender Cycles.',
  heroImage: '/Assets/images/BiographHorizon.png',

  meta: [
    { label: 'Year',     value: '2025' },
    { label: 'Software', value: 'Blender / Cycles' },
    { label: 'Role',     value: '3D Artist' },
    { label: 'Category', value: 'Product / Hard Surface' },
  ],

  overview: {
    heading: 'A Study in <span class="gold">Light</span> &amp; Material.',
    text: 'Biograph Horizon explores how studio-grade lighting and PBR material work can elevate a hard-surface medical scanner into something cinematic — built from reference, sculpted detail, and procedural texturing.',
    stats: [
      { num: 4,  suffix: 'K', label: 'Render Resolution' },
      { num: 3,  suffix: '',  label: 'Material Studies'  },
      { num: 6,  suffix: '+', label: 'Render Passes'     },
      { num: 1,  suffix: '',  label: 'Final Hero Shot'   },
    ],
  },

  gallery: [
    { src: '/Assets/images/BiographHorizon.png',        angle: 'Front',  desc: 'Hero angle — primary render', size: 'main' },
    { src: '/Assets/project/3d/Biograph/side-01.jpg',   angle: 'Side',   desc: 'Side profile study',          size: 'side' },
    { src: '/Assets/project/3d/Biograph/detail-01.jpg', angle: 'Detail', desc: 'Close-up panel detail',       size: 'side' },
  ],

  wireframe: [
    { src: '/Assets/project/3d/Biograph/wireframe-01.jpg', angle: 'Wireframe',   desc: 'Topology overview' },
    { src: '/Assets/project/3d/Biograph/clay-01.jpg',      angle: 'Clay Render', desc: 'Clay / AO pass'    },
  ],

  specs: [
    { icon: '◆', title: 'Modeling', rows: [
      { key: 'Polygon Count',   val: 'TBD' },
      { key: 'Topology',        val: 'Quad-based hard surface' },
      { key: 'Modeling Method', val: 'Box modeling + Boolean' },
    ]},
    { icon: '✦', title: 'Texturing', rows: [
      { key: 'Texture Resolution', val: 'TBD' },
      { key: 'Material Count',     val: 'TBD' },
      { key: 'Workflow',           val: 'Substance Painter → Cycles' },
    ]},
    { icon: '◐', title: 'Lighting', rows: [
      { key: 'Render Engine', val: 'Cycles' },
      { key: 'Light Setup',   val: 'Studio 3-point + HDRI' },
      { key: 'Samples',       val: 'TBD' },
    ]},
    { icon: '▣', title: 'Render', rows: [
      { key: 'Resolution',  val: '4K' },
      { key: 'Render Time', val: 'TBD' },
      { key: 'Denoiser',    val: 'OptiX / OIDN' },
    ]},
  ],

  tools: [
    { name: 'Blender',           role: 'Modeling & Render' },
    { name: 'Cycles',            role: 'Render Engine'     },
    { name: 'Substance Painter', role: 'Texturing'         },
    { name: 'Photoshop',         role: 'Post-Process'      },
  ],

  process: [
    { title: 'Reference & Concept',   desc: 'Gathering reference imagery and breaking down the scanner\u2019s form language before blocking.' },
    { title: 'Modeling & Topology',   desc: 'Hard-surface modeling with clean quad topology, prioritizing silhouette and panel detail.' },
    { title: 'Texturing & Materials', desc: 'PBR material authoring in Substance Painter — metal, plastic, and glass studies.' },
    { title: 'Lighting & Render',     desc: 'Studio lighting setup in Cycles, fine-tuned for a clinical yet cinematic mood.' },
  ],
};

/* ── Sub-component: panel wrapper (mirrors SnapPanel) ── */
function BhPanel({
  id, scrollable = false, onRegister, children,
}: {
  id: string;
  scrollable?: boolean;
  onRegister: (id: string, el: HTMLElement | null) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    onRegister(id, ref.current);
    return () => onRegister(id, null);
  }, [id, onRegister]);

  return (
    <div
      ref={ref}
      className={`bh-panel${scrollable ? ' bh-panel--scroll' : ''}`}
      data-panel-id={id}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export function BiographHorizonDetail() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { currentIdx, goTo, registerPanel } = useProjectSnap([...BH_PANELS]);

  /* ── Lock body scroll for snap system, restore on unmount ── */
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const prevBOv = body.style.overflow;
    const prevHH  = html.style.height;
    const prevHOv = html.style.overflow;

    body.style.overflow = 'hidden';
    html.style.height   = '100%';
    html.style.overflow = 'hidden';

    return () => {
      body.style.overflow = prevBOv;
      html.style.height   = prevHH;
      html.style.overflow = prevHOv;
    };
  }, []);

  /* ── Document title ── */
  useEffect(() => {
    const prev = document.title;
    document.title = 'Biograph Horizon — Reno Febri';
    return () => { document.title = prev; };
  }, []);

  /* ── ALL ANIMATIONS — GSAP, event-driven per panel ── */
  useGSAP(() => {

    const onEnter = (e: Event) => {
      const { id } = (e as CustomEvent).detail as { id: string };
      const panel  = pageRef.current?.querySelector<HTMLElement>(`[data-panel-id="${id}"]`);
      if (!panel) return;

      /* Nav: transparent only on hero */
      document.querySelector('.bh-nav')
        ?.classList.toggle('scrolled', id !== 'bh-hero');

      /* ── HERO ── */
      if (id === 'bh-hero') {
        /* Cinematic bg drift — kill on leave */
        gsap.to(panel.querySelector('.bh-hero-parallax'), {
          yPercent: -4, duration: 20,
          ease: 'sine.inOut', yoyo: true, repeat: -1,
          overwrite: true,
        });

        gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
          .from(panel.querySelector('.bh-hero-eyebrow'),
            { y: 24, autoAlpha: 0, duration: 0.7 })
          .from(panel.querySelectorAll('.bh-hero-title-line span'),
            { yPercent: 110, duration: 0.9, stagger: 0.14 }, '-=0.4')
          .from(panel.querySelector('.bh-hero-sub'),
            { y: 20, autoAlpha: 0, duration: 0.7 }, '-=0.5')
          .from(panel.querySelector('.bh-hero-meta'),
            { y: 16, autoAlpha: 0, duration: 0.65 }, '-=0.45')
          .from(panel.querySelector('.bh-hero-scroll'),
            { y: 8, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
        return;
      }

      /* ── OVERVIEW ── */
      if (id === 'bh-overview') {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from(panel.querySelector('.bh-overview-text'),
            { y: 32, autoAlpha: 0, duration: 0.85 })
          .from(panel.querySelectorAll('.bh-stat'),
            { y: 24, autoAlpha: 0, duration: 0.65, stagger: 0.1 }, '-=0.5')
          .call(() => {
            /* count-up per stat */
            panel.querySelectorAll<HTMLElement>('.bh-stat-num').forEach((el) => {
              const end    = parseFloat(el.dataset.val ?? '0');
              const suffix = el.dataset.suffix ?? '';
              if (isNaN(end)) return;
              const obj = { val: 0 };
              gsap.to(obj, {
                val: end, duration: 1.4, ease: 'power2.out', overwrite: true,
                onUpdate() { el.textContent = `${Math.round(obj.val)}${suffix}`; },
              });
            });
          });
        return;
      }

      /* ── DEFAULT: stagger all .bh-anim elements inside the panel ── */
      const anims = panel.querySelectorAll<HTMLElement>('.bh-anim');
      if (anims.length) {
        gsap.from(anims, {
          y: 28, autoAlpha: 0,
          duration: 0.75, stagger: 0.1,
          ease: 'power3.out', overwrite: true, delay: 0.1,
        });
      }
    };

    const onLeave = (e: Event) => {
      const { id } = (e as CustomEvent).detail as { id: string };
      /* Kill bg drift when leaving hero */
      if (id === 'bh-hero') {
        const panel = pageRef.current?.querySelector<HTMLElement>(`[data-panel-id="${id}"]`);
        if (panel) gsap.killTweensOf(panel.querySelector('.bh-hero-parallax'));
      }
    };

    /* Auto-trigger first panel */
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent(PROJECT_ENTER, { detail: { id: 'bh-hero' } }));
    });

    window.addEventListener(PROJECT_ENTER, onEnter);
    window.addEventListener(PROJECT_LEAVE, onLeave);
    return () => {
      window.removeEventListener(PROJECT_ENTER, onEnter);
      window.removeEventListener(PROJECT_LEAVE, onLeave);
    };
  }, { scope: pageRef });

  const imgErr = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.opacity = '0';
  };

  return (
    <div data-page="biograph-horizon">

      {/* ── Fixed nav (outside pageRef, position:fixed) ── */}
      <nav className="bh-nav">
        <Link to="/" className="bh-nav-back">
          <span className="bh-nav-back-arrow">←</span> Back to Portfolio
        </Link>
        <span className="bh-nav-label">3D Art / Case Study</span>
      </nav>

      {/* ── Dot nav ── */}
      <nav className="bh-dot-nav" aria-label="Section navigation">
        {BH_PANELS.map((p, i) => (
          <button
            key={p.id}
            className={`bh-dot${i === currentIdx ? ' active' : ''}`}
            onClick={() => goTo(i)}
            title={p.label}
            aria-label={`Go to ${p.label}`}
          />
        ))}
      </nav>

      {/* ── PANELS ── */}
      <div className="bh-page" ref={pageRef}>

        {/* ══ PANEL 0: HERO ══ */}
        <BhPanel id="bh-hero" onRegister={registerPanel}>
          <section className="bh-hero">
            <div className="bh-hero-parallax">
              <img
                src={BH_DATA.heroImage}
                alt="Biograph Horizon — full render"
                className="bh-hero-bg"
                onError={imgErr}
              />
              <div className="bh-hero-vignette"  aria-hidden="true" />
              <div className="bh-hero-scanlines" aria-hidden="true" />
            </div>

            <div className="bh-hero-content">
              <div className="bh-hero-eyebrow">
                <span className="bh-hero-eyebrow-line" />
                <span className="bh-hero-eyebrow-text">{BH_DATA.eyebrow}</span>
              </div>

              <h1 className="bh-hero-title">
                <span className="bh-hero-title-line">
                  <span>{BH_DATA.titleLine1}</span>
                </span>
                <span className="bh-hero-title-line">
                  <span className="gold">{BH_DATA.titleLine2}</span>
                </span>
              </h1>

              <p className="bh-hero-sub">{BH_DATA.sub}</p>

              <div className="bh-hero-meta">
                {BH_DATA.meta.map((m, i) => (
                  <div key={m.label} style={{ display: 'contents' }}>
                    {i > 0 && <div className="bh-meta-divider" />}
                    <div className="bh-meta-item">
                      <span className="bh-meta-label">{m.label}</span>
                      <span className="bh-meta-value">{m.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Click advances to next panel */}
            <div
              className="bh-hero-scroll"
              role="button" tabIndex={0} aria-label="Next section"
              onClick={() => goTo(1)}
              onKeyDown={(e) => e.key === 'Enter' && goTo(1)}
            >
              <span className="bh-hero-scroll-text">Scroll</span>
              <div className="bh-hero-scroll-line" />
            </div>
          </section>
        </BhPanel>

        {/* ══ PANEL 1: OVERVIEW ══ */}
        <BhPanel id="bh-overview" onRegister={registerPanel}>
          <section className="bh-overview">
            <div className="bh-overview-text">
              <h2 dangerouslySetInnerHTML={{ __html: BH_DATA.overview.heading }} />
              <p>{BH_DATA.overview.text}</p>
            </div>
            <div className="bh-overview-stats">
              {BH_DATA.overview.stats.map((s) => (
                <div key={s.label} className="bh-stat">
                  <div
                    className="bh-stat-num"
                    data-val={String(s.num)}
                    data-suffix={s.suffix}
                  >
                    {s.num}{s.suffix}
                  </div>
                  <div className="bh-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        </BhPanel>

        {/* ══ PANEL 2: GALLERY ══ */}
        <BhPanel id="bh-gallery" scrollable onRegister={registerPanel}>
          <section className="bh-gallery">
            <div className="bh-section-label bh-anim">
              <span className="bh-section-num">01</span>
              <span className="bh-section-line" />
              <span className="bh-section-text">Gallery</span>
            </div>
            <div className="bh-gallery-grid">
              {BH_DATA.gallery.map((g) => (
                <div
                  key={g.src}
                  className={`bh-gallery-item bh-gallery-item--${g.size} bh-anim`}
                >
                  <img src={g.src} alt={g.desc} loading="lazy" draggable={false} onError={imgErr} />
                  <div className="bh-gallery-caption">
                    <div className="bh-gallery-caption-angle">{g.angle}</div>
                    <div className="bh-gallery-caption-desc">{g.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </BhPanel>

        {/* ══ PANEL 3: BEHIND THE SCENES ══ */}
        <BhPanel id="bh-bts" scrollable onRegister={registerPanel}>
          <section className="bh-gallery">
            <div className="bh-section-label bh-anim">
              <span className="bh-section-num">02</span>
              <span className="bh-section-line" />
              <span className="bh-section-text">Behind the Scenes</span>
            </div>
            <div className="bh-gallery-grid">
              {BH_DATA.wireframe.map((g) => (
                <div key={g.src} className="bh-gallery-item bh-gallery-item--side bh-anim">
                  <img src={g.src} alt={g.desc} loading="lazy" draggable={false} onError={imgErr} />
                  <div className="bh-gallery-caption">
                    <div className="bh-gallery-caption-angle">{g.angle}</div>
                    <div className="bh-gallery-caption-desc">{g.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </BhPanel>

        {/* ══ PANEL 4: 3D VIEWER ══ */}
        <BhPanel id="bh-viewer" onRegister={registerPanel}>
          <section className="bh-viewer">
            <div className="bh-viewer-header bh-anim">
              <h2 className="bh-viewer-title">
                Interactive <span className="gold">3D Viewer</span>
              </h2>
              <div className="bh-viewer-hint">
                <span className="bh-viewer-hint-dot" />
                Drag to rotate
              </div>
            </div>
            <div className="bh-anim">
              <BiographViewer />
            </div>
          </section>
        </BhPanel>

        {/* ══ PANEL 5: SPECS + TOOLS + PROCESS ══ */}
        <BhPanel id="bh-specs" scrollable onRegister={registerPanel}>

          <section className="bh-specs">
            <div className="bh-section-label bh-anim">
              <span className="bh-section-num">03</span>
              <span className="bh-section-line" />
              <span className="bh-section-text">Technical Breakdown</span>
            </div>
            <div className="bh-specs-grid">
              {BH_DATA.specs.map((block) => (
                <div key={block.title} className="bh-spec-block bh-anim">
                  <div className="bh-spec-icon">{block.icon}</div>
                  <div className="bh-spec-title">{block.title}</div>
                  <div className="bh-spec-rows">
                    {block.rows.map((r) => (
                      <div key={r.key} className="bh-spec-row">
                        <span className="bh-spec-key">{r.key}</span>
                        <span className={`bh-spec-val${r.val === 'TBD' ? ' gold' : ''}`}>
                          {r.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bh-tools">
            <div className="bh-section-label bh-anim">
              <span className="bh-section-num">04</span>
              <span className="bh-section-line" />
              <span className="bh-section-text">Tools Used</span>
            </div>
            <div className="bh-tools-grid">
              {BH_DATA.tools.map((t) => (
                <div key={t.name} className="bh-tool-chip bh-anim">
                  <span className="bh-tool-chip-dot" />
                  <span className="bh-tool-name">{t.name}</span>
                  <span className="bh-tool-chip-divider" />
                  <span className="bh-tool-role">{t.role}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bh-process">
            <div className="bh-section-label bh-anim">
              <span className="bh-section-num">05</span>
              <span className="bh-section-line" />
              <span className="bh-section-text">Process</span>
            </div>
            <div className="bh-process-steps">
              {BH_DATA.process.map((step, i) => (
                <div key={step.title} className="bh-step bh-anim">
                  <span className="bh-step-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="bh-step-title">{step.title}</div>
                  <p className="bh-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="bh-footer bh-anim">
            <p className="bh-footer-copy">
              &copy; {new Date().getFullYear()} Reno Febri —{' '}
              <span>Biograph Horizon</span>
            </p>
            <Link to="/" className="bh-back-btn">← Back to Portfolio</Link>
          </footer>

        </BhPanel>

      </div>{/* /.bh-page */}
    </div>
  );
}