import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { BiographViewer } from './BiographViewer';
import '~/styles/biograph-horizon.css';

/* ============================================================
   BIOGRAPH HORIZON — Project Detail Page
   Edit semua konten di object BH_DATA di bawah ini.
   Specs masih placeholder (val: 'TBD') — isi sendiri nanti.
   ============================================================ */

const BH_DATA = {
  eyebrow:    'Case Study — 3D Art',
  titleLine1: 'Biograph',
  titleLine2: 'Horizon',
  sub: 'A cinematic medical-equipment render exploring material studies, studio lighting, and procedural texturing — fully modeled and rendered in Blender Cycles.',
  heroImage:  '/Assets/images/BiographHorizon.png',

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
      { num: '4K',  label: 'Render Resolution' },
      { num: '3',   label: 'Material Studies'  },
      { num: '6+',  label: 'Render Passes'     },
      { num: '1',   label: 'Final Hero Shot'   },
    ],
  },

  /* Gallery utama — main = 4:3, side = 3:4 (lihat .bh-gallery-item--main/--side) */
  gallery: [
    { src: '/Assets/images/BiographHorizon.png',            angle: 'Front',  desc: 'Hero angle — primary render',  size: 'main' },
    { src: '/Assets/project/3d/Biograph/side-01.jpg',       angle: 'Side',   desc: 'Side profile study',           size: 'side' },
    { src: '/Assets/project/3d/Biograph/detail-01.jpg',     angle: 'Detail', desc: 'Close-up panel detail',        size: 'side' },
  ],

  /* Behind the scenes — wireframe / clay, ganti src kalau asset sudah ada */
  wireframe: [
    { src: '/Assets/project/3d/Biograph/wireframe-01.jpg', angle: 'Wireframe',   desc: 'Topology overview' },
    { src: '/Assets/project/3d/Biograph/clay-01.jpg',      angle: 'Clay Render', desc: 'Clay / AO pass'    },
  ],

  specs: [
    {
      icon: '◆', title: 'Modeling',
      rows: [
        { key: 'Polygon Count',   val: 'TBD' },
        { key: 'Topology',        val: 'Quad-based hard surface' },
        { key: 'Modeling Method', val: 'Box modeling + Boolean' },
      ],
    },
    {
      icon: '✦', title: 'Texturing',
      rows: [
        { key: 'Texture Resolution', val: 'TBD' },
        { key: 'Material Count',     val: 'TBD' },
        { key: 'Workflow',           val: 'Substance Painter → Cycles' },
      ],
    },
    {
      icon: '◐', title: 'Lighting',
      rows: [
        { key: 'Render Engine', val: 'Cycles' },
        { key: 'Light Setup',   val: 'Studio 3-point + HDRI' },
        { key: 'Samples',       val: 'TBD' },
      ],
    },
    {
      icon: '▣', title: 'Render',
      rows: [
        { key: 'Resolution',   val: '4K' },
        { key: 'Render Time',  val: 'TBD' },
        { key: 'Denoiser',     val: 'OptiX / OIDN' },
      ],
    },
  ],

  tools: [
    { name: 'Blender',             role: 'Modeling & Render' },
    { name: 'Cycles',              role: 'Render Engine'     },
    { name: 'Substance Painter',   role: 'Texturing'         },
    { name: 'Photoshop',           role: 'Post-Process'      },
  ],

  process: [
    { title: 'Reference & Concept',   desc: 'Gathering reference imagery and breaking down the scanner\u2019s form language before blocking.' },
    { title: 'Modeling & Topology',   desc: 'Hard-surface modeling with clean quad topology, prioritizing silhouette and panel detail.' },
    { title: 'Texturing & Materials', desc: 'PBR material authoring in Substance Painter — metal, plastic, and glass studies.' },
    { title: 'Lighting & Render',     desc: 'Studio lighting setup in Cycles, fine-tuned for a clinical yet cinematic mood.' },
  ],
};

export function BiographHorizonDetail() {
  const pageRef       = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroImgRef    = useRef<HTMLImageElement>(null);
  const parallaxRef   = useRef<HTMLDivElement>(null);
  const [navScrolled, setNavScrolled] = useState(false);

  /* Document title */
  useEffect(() => {
    const prev = document.title;
    document.title = 'Biograph Horizon — Reno Febri';
    return () => { document.title = prev; };
  }, []);

  /* Nav background on scroll */
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Hero cinematic entrance (delay sudah dibakar di CSS via transition-delay) */
  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el) return;
    const targets = el.querySelectorAll(
      '.bh-hero-eyebrow, .bh-hero-title-line, .bh-hero-sub, .bh-hero-meta, .bh-hero-scroll'
    );
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        targets.forEach(t => t.classList.add('visible'));
      });
    });
  }, []);

  /* Hero parallax — background bergerak lebih lambat dari scroll */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        if (!parallaxRef.current) return;
        const offset = Math.min(window.scrollY * 0.15, 120);
        parallaxRef.current.style.transform = `translateY(${offset}px)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  /* Scroll-reveal untuk section di bawah hero */
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>('.bh-reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bh-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(t => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  const fadeOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.opacity = '0';
  };

  return (
    <div data-page="biograph-horizon">
      <div className="bh-page" ref={pageRef}>

        {/* ── NAV ── */}
        <nav className={`bh-nav${navScrolled ? ' scrolled' : ''}`}>
          <Link to="/" className="bh-nav-back">
            <span className="bh-nav-back-arrow">←</span> Back to Portfolio
          </Link>
          <span className="bh-nav-label">3D Art / Case Study</span>
        </nav>

        {/* ── HERO ── */}
        <section className="bh-hero" ref={heroSectionRef}>
          <div className="bh-hero-parallax" ref={parallaxRef}>
            <img
              ref={heroImgRef}
              src={BH_DATA.heroImage}
              alt="Biograph Horizon — full render"
              className="bh-hero-bg"
              onLoad={() => heroImgRef.current?.classList.add('loaded')}
              onError={fadeOnError}
            />
            <div className="bh-hero-vignette" aria-hidden="true" />
            <div className="bh-hero-scanlines" aria-hidden="true" />
          </div>

          <div className="bh-hero-content">
            <div className="bh-hero-eyebrow">
              <span className="bh-hero-eyebrow-line" />
              <span className="bh-hero-eyebrow-text">{BH_DATA.eyebrow}</span>
            </div>

            <h1 className="bh-hero-title">
              <span className="bh-hero-title-line">
                <span style={{ transitionDelay: '0.5s' }}>{BH_DATA.titleLine1}</span>
              </span>
              <span className="bh-hero-title-line">
                <span className="gold" style={{ transitionDelay: '0.65s' }}>{BH_DATA.titleLine2}</span>
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

          <div className="bh-hero-scroll">
            <span className="bh-hero-scroll-text">Scroll</span>
            <div className="bh-hero-scroll-line" />
          </div>
        </section>

        {/* ── OVERVIEW ── */}
        <section className="bh-overview">
          <div className="bh-overview-text bh-reveal">
            <h2 dangerouslySetInnerHTML={{ __html: BH_DATA.overview.heading }} />
            <p>{BH_DATA.overview.text}</p>
          </div>
          <div className="bh-overview-stats">
            {BH_DATA.overview.stats.map((s, i) => (
              <div key={s.label} className={`bh-stat bh-reveal bh-reveal-d${Math.min(i + 1, 4)}`}>
                <div className="bh-stat-num">{s.num}</div>
                <div className="bh-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="bh-gallery">
          <div className="bh-section-label bh-reveal">
            <span className="bh-section-num">01</span>
            <span className="bh-section-line" />
            <span className="bh-section-text">Gallery</span>
          </div>
          <div className="bh-gallery-grid">
            {BH_DATA.gallery.map((g, i) => (
              <div
                key={g.src}
                className={`bh-gallery-item bh-gallery-item--${g.size} bh-reveal bh-reveal-d${Math.min(i + 1, 4)}`}
              >
                <img src={g.src} alt={g.desc} loading="lazy" draggable={false} onError={fadeOnError} />
                <div className="bh-gallery-caption">
                  <div className="bh-gallery-caption-angle">{g.angle}</div>
                  <div className="bh-gallery-caption-desc">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BEHIND THE SCENES (wireframe / clay) ── */}
        <section className="bh-gallery">
          <div className="bh-section-label bh-reveal">
            <span className="bh-section-num">02</span>
            <span className="bh-section-line" />
            <span className="bh-section-text">Behind the Scenes</span>
          </div>
          <div className="bh-gallery-grid">
            {BH_DATA.wireframe.map((g, i) => (
              <div
                key={g.src}
                className={`bh-gallery-item bh-gallery-item--side bh-reveal bh-reveal-d${Math.min(i + 1, 4)}`}
              >
                <img src={g.src} alt={g.desc} loading="lazy" draggable={false} onError={fadeOnError} />
                <div className="bh-gallery-caption">
                  <div className="bh-gallery-caption-angle">{g.angle}</div>
                  <div className="bh-gallery-caption-desc">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3D VIEWER ── */}
        <section className="bh-viewer">
          <div className="bh-viewer-header bh-reveal">
            <h2 className="bh-viewer-title">Interactive <span className="gold">3D Viewer</span></h2>
            <div className="bh-viewer-hint">
              <span className="bh-viewer-hint-dot" />
              Drag to rotate
            </div>
          </div>
          <div className="bh-reveal bh-reveal-d2">
            <BiographViewer />
          </div>
        </section>

        {/* ── TECHNICAL BREAKDOWN ── */}
        <section className="bh-specs">
          <div className="bh-section-label bh-reveal">
            <span className="bh-section-num">03</span>
            <span className="bh-section-line" />
            <span className="bh-section-text">Technical Breakdown</span>
          </div>
          <div className="bh-specs-grid">
            {BH_DATA.specs.map((block, i) => (
              <div key={block.title} className={`bh-spec-block bh-reveal bh-reveal-d${Math.min(i + 1, 4)}`}>
                <div className="bh-spec-icon">{block.icon}</div>
                <div className="bh-spec-title">{block.title}</div>
                <div className="bh-spec-rows">
                  {block.rows.map(r => (
                    <div key={r.key} className="bh-spec-row">
                      <span className="bh-spec-key">{r.key}</span>
                      <span className={`bh-spec-val${r.val === 'TBD' ? ' gold' : ''}`}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOOLS USED ── */}
        <section className="bh-tools">
          <div className="bh-section-label bh-reveal">
            <span className="bh-section-num">04</span>
            <span className="bh-section-line" />
            <span className="bh-section-text">Tools Used</span>
          </div>
          <div className="bh-tools-grid">
            {BH_DATA.tools.map((t, i) => (
              <div key={t.name} className={`bh-tool-chip bh-reveal bh-reveal-d${Math.min(i + 1, 4)}`}>
                <span className="bh-tool-chip-dot" />
                <span className="bh-tool-name">{t.name}</span>
                <span className="bh-tool-chip-divider" />
                <span className="bh-tool-role">{t.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section className="bh-process">
          <div className="bh-section-label bh-reveal">
            <span className="bh-section-num">05</span>
            <span className="bh-section-line" />
            <span className="bh-section-text">Process</span>
          </div>
          <div className="bh-process-steps">
            {BH_DATA.process.map((step, i) => (
              <div key={step.title} className={`bh-step bh-reveal bh-reveal-d${Math.min(i + 1, 4)}`}>
                <span className="bh-step-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="bh-step-title">{step.title}</div>
                <p className="bh-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bh-footer bh-reveal">
          <p className="bh-footer-copy">
            &copy; {new Date().getFullYear()} Reno Febri — <span>Biograph Horizon</span>
          </p>
          <Link to="/" className="bh-back-btn">← Back to Portfolio</Link>
        </footer>

      </div>
    </div>
  );
}