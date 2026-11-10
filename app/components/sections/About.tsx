const startYear  = 2023;
const startMonth = 1;

function resolveYearsActive() {
  const start     = new Date(startYear, startMonth - 1, 1);
  const diffYears = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return diffYears.toFixed(1);
}

const ABOUT = {
  name:      'Reno Febri',
  role:      'Game Tech & 3D Creator',
  cornerTag: 'Reno Febri',
  photo:     'Assets/images/Me1.jpeg',
  headingHTML: `Crafting<br/><span class="accent">Worlds</span> &amp;<br/><span class="dim">Experiences.</span>`,
  bio: [
    `I'm <strong>Reno Febri</strong> — a Game Tech creator and 3D artist based in Indonesia.
     I work at the intersection of real-time rendering, game systems, and interactive web,
     building things that are both technically solid and visually striking.`,
    `My workflow spans from <strong>concept and 3D modeling in Blender</strong> to
     <strong>game logic and visual effects programming</strong>, through to polished interactive
     web experiences. I care deeply about craft — every project is an opportunity to
     push the boundary between technology and art.`,
  ],
  chips: [
    'Game Development', '3D Modeling & Art', 'Shader Graph',
    'Interactive Web', '2D Art & UI Design', 'Visual Effects Graph',
  ],
  meta: [
    { label: 'Based in', value: 'Indonesia'      },
    { label: 'Focus',    value: 'Game Tech / 3D' },
    { label: 'Engine',   value: 'Unity'           },
    { label: '3D Tool',  value: 'Blender'         },
  ],
  stats: [
    { num: 'YEARS_ACTIVE',  accent: '+', label: 'Years Active' },
    { num: 'PROJECT_COUNT', accent: '+', label: 'Projects'     },
    { num: '5',             accent: '+', label: 'Game Builds'  },
    { num: '∞',             accent: '',  label: 'Ideas Left'   },
  ],
  statusText: 'Open for work',
  statusTag:  'Available',
};

function resolveStatNum(num: string): string {
  if (num === 'YEARS_ACTIVE')  return resolveYearsActive();
  if (num === 'PROJECT_COUNT') return '6';
  return num;
}

export function About() {
  return (
    <section className="about" id="about">
      <div className="container">

        <div className="section-label reveal">
          <span className="section-label-num">01</span>
          <span className="section-label-line"></span>
          <span className="section-label-text">About</span>
        </div>

        <div className="about-grid">
          <div className="about-left">
            <h2 className="about-heading reveal" dangerouslySetInnerHTML={{ __html: ABOUT.headingHTML }} />
            <div className="about-bio-container">
              {ABOUT.bio.map((text, i) => (
                <p key={i} className="about-bio reveal" dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </div>
            <div className="about-doing reveal">
              {ABOUT.chips.map(chip => (
                <div key={chip} className="about-doing-chip">
                  <span className="about-doing-chip-dot"></span>
                  {chip}
                </div>
              ))}
            </div>
          </div>

          <div className="about-panel">
            <div className="about-identity reveal">
              <div className="about-identity-avatar" id="avatar-wrap">
                <img src={ABOUT.photo} alt={ABOUT.name} className="avatar-photo"
                     draggable={false}
                     onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />
                <div className="avatar-scanline" aria-hidden="true"></div>
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

            <div className="about-stats">
              {ABOUT.stats.map(s => (
                <div key={s.label} className="stat-card reveal">
                  <div className="stat-num" data-raw={s.num}>
                    {resolveStatNum(s.num)}
                    {s.accent && <span className="stat-accent">{s.accent}</span>}
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="about-status reveal">
              <div className="about-status-left">
                <span className="about-status-dot"></span>
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