import { useEffect } from 'react';

/* ── Data (mirrors about-data.js) ── */
const ABOUT = {
  name:       'Reno Febri',
  role:       'Game Tech & 3D Creator',
  cornerTag:  'Reno Febri',
  photo:      '/assets/images/Me.jpeg',
  heading:    <>Crafting<br /><span className="accent">Worlds</span> &amp;<br /><span className="dim">Experiences.</span></>,
  bio: [
    <>I&apos;m <strong>Reno Febri</strong> — a Game Tech creator and 3D artist based in Indonesia. I work at the intersection of real-time rendering, game systems, and interactive web, building things that are both technically solid and visually striking.</>,
    <>My workflow spans from <strong>concept and 3D modeling in Blender</strong> to <strong>game logic and visual effects programming</strong>, through to polished interactive web experiences. I care deeply about craft — every project is an opportunity to push the boundary between technology and art.</>,
  ],
  chips: [
    'Game Development', '3D Modeling & Art', 'Shader / GLSL',
    'Interactive Web', '2D Art & UI Design', 'Visual Effects Graph',
  ],
  meta: [
    { label: 'Based in', value: 'Indonesia'      },
    { label: 'Focus',    value: 'Game Tech / 3D' },
    { label: 'Engine',   value: 'Unity'           },
    { label: '3D Tool',  value: 'Blender'         },
  ],
  stats: [
    { num: '2.5', accent: '+', label: 'Years Active'  },
    { num: '6',   accent: '+', label: 'Projects'       },
    { num: '5',   accent: '+', label: 'Game Builds'    },
    { num: '∞',   accent: '',  label: 'Ideas Left'     },
  ],
  statusText: 'Open for work',
  statusTag:  'Available',
};

export function About() {
  /* Avatar photo reveal on section enter */
  useEffect(() => {
    const onEnter = (e: Event) => {
      if ((e as CustomEvent).detail?.id !== 'about') return;
      const wrap = document.getElementById('avatar-wrap');
      if (wrap) {
        wrap.classList.remove('photo-ready');
        void wrap.offsetWidth;
        setTimeout(() => wrap.classList.add('photo-ready'), 200);
      }
    };
    window.addEventListener('sectionenter', onEnter);
    return () => window.removeEventListener('sectionenter', onEnter);
  }, []);

  return (
    <section className="about" id="about">
      <div className="container">

        {/* Section label */}
        <div className="section-label reveal">
          <span className="section-label-num">01</span>
          <span className="section-label-line" />
          <span className="section-label-text">About</span>
        </div>

        <div className="about-grid">

          {/* ── Left: text ── */}
          <div className="about-left">
            <h2 className="about-heading reveal reveal-delay-1">
              {ABOUT.heading}
            </h2>

            <div className="about-bio-container">
              {ABOUT.bio.map((para, i) => (
                <p key={i} className="about-bio reveal reveal-delay-2">{para}</p>
              ))}
            </div>

            <div className="about-doing reveal reveal-delay-3">
              {ABOUT.chips.map(chip => (
                <div key={chip} className="about-doing-chip">
                  <span className="about-doing-chip-dot" />
                  {chip}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: panel ── */}
          <div className="about-panel">

            {/* Identity card */}
            <div className="about-identity reveal reveal-delay-2">
              <div className="about-identity-avatar" id="avatar-wrap">
                <img
                  src={ABOUT.photo}
                  alt={ABOUT.name}
                  className="avatar-photo"
                  draggable={false}
                  onError={e => {
                    // Graceful fallback if photo missing
                    (e.target as HTMLImageElement).style.opacity = '0.3';
                  }}
                />
                <div className="avatar-scanline" aria-hidden />
                <span className="avatar-corner-tag">{ABOUT.cornerTag}</span>
              </div>
              <div className="about-identity-body">
                <div className="about-identity-name">{ABOUT.name}</div>
                <div className="about-identity-role">{ABOUT.role}</div>
                <div className="about-identity-meta">
                  {ABOUT.meta.map(row => (
                    <div key={row.label} className="about-identity-meta-row">
                      <span className="about-identity-meta-label">{row.label}</span>
                      <span className="about-identity-meta-val">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="about-stats reveal reveal-delay-3">
              {ABOUT.stats.map(s => (
                <div key={s.label} className="stat-card">
                  <div
                    className="stat-num"
                    data-count={isNaN(parseFloat(s.num)) ? undefined : s.num}
                  >
                    {s.num}
                    {s.accent && <span className="stat-accent">{s.accent}</span>}
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="about-status reveal reveal-delay-4">
              <div className="about-status-left">
                <span className="about-status-dot" />
                <span className="about-status-text">{ABOUT.statusText}</span>
              </div>
              <span className="about-status-tag">{ABOUT.statusTag}</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
