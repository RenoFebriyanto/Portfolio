const TECH_STACK = [
  { icon: '🎮', name: 'Unity',      level: '85%' },
  { icon: '🟦', name: 'Godot',      level: '65%' },
  { icon: '🧊', name: 'Blender',    level: '88%' },
  { icon: '#',  name: 'C#',         level: '80%' },
  { icon: '⚡', name: 'JavaScript', level: '78%' },
  { icon: '🌐', name: 'HTML / CSS', level: '85%' },
  { icon: '◈',  name: 'GLSL',       level: '55%' },
  { icon: '⬛', name: 'Three.js',   level: '72%' },
];

const LEARNING = ['Unreal Engine 5', 'TypeScript', 'WebGPU', 'Houdini FX'];

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com/RenoFebriyanto' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/renofebriyanto/' },
  { label: 'itch.io',  href: 'https://catmounth.itch.io' },
  { label: 'Instagram',href: 'https://instagram.com/norigaken' },
];

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about__inner">

          {/* Left — text */}
          <div className="about__text reveal">
            <p className="section-label">01 — About</p>
            <h2 className="section-heading">Who I Am</h2>

            <p className="about__body">
              I'm a <strong>Game Tech &amp; 3D Creator</strong> based in Indonesia,
              passionate about building immersive interactive experiences — from game
              mechanics and 3D art to shader experiments and creative web technology.
            </p>
            <p className="about__body">
              I work across the full pipeline: <strong>design, develop, and ship</strong>.
              Whether it's a Unity game, a Blender render, or a WebGL experiment, I care
              about craft, performance, and visual quality.
            </p>

            {/* Stats */}
            <div className="about__stats">
              <div>
                <span className="about__stat-value">3+</span>
                <span className="about__stat-label">Years Experience</span>
              </div>
              <div>
                <span className="about__stat-value">10+</span>
                <span className="about__stat-label">Projects Shipped</span>
              </div>
              <div>
                <span className="about__stat-value">4</span>
                <span className="about__stat-label">Disciplines</span>
              </div>
            </div>

            {/* Social links */}
            <div className="about__links">
              {SOCIAL_LINKS.map(link => (
                <a
                  key={link.label}
                  className="about__link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — card */}
          <div className="about__visual reveal">
            <div className="about__card">
              <div className="about__tech-grid">
                {TECH_STACK.map(t => (
                  <div className="about__tech-item" key={t.name}>
                    <span className="about__tech-icon">{t.icon}</span>
                    <span className="about__tech-name">{t.name}</span>
                    <span className="about__tech-level">{t.level}</span>
                  </div>
                ))}
              </div>

              <div className="about__learning">
                <p className="about__learning-label">Currently Learning</p>
                <div className="about__learning-tags">
                  {LEARNING.map(l => (
                    <span className="about__tag" key={l}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}