import { useEffect } from 'react';

/* ── Data (mirrors skills-data.js) ── */
const SKILLS_DATA = [
  {
    key: 'game', icon: '/Assets/icons/TechGame.png', title: 'Game Dev',
    skills: [
      { name: 'Unity',          level: 85, label: 'Advanced'     },
      { name: 'C#',             level: 80, label: 'Advanced'     },
      { name: 'Visual Effects', level: 60, label: 'Intermediate' },
      { name: 'Shader Graph',   level: 40, label: 'Beginner'     },
    ],
  },
  {
    key: 'art', icon: '/Assets/icons/Tech3D.png', title: '3D & Art',
    skills: [
      { name: 'Blender',           level: 78, label: 'Advanced'     },
      { name: 'Substance Painter', level: 62, label: 'Intermediate' },
      { name: 'Aseprite',          level: 72, label: 'Intermediate' },
    ],
  },
  {
    key: 'code', icon: '/Assets/icons/TechCode.png', title: 'Code & Web',
    skills: [
      { name: 'JavaScript', level: 58, label: 'Advanced'     },
      { name: 'HTML / CSS', level: 85, label: 'Advanced'     },
      { name: 'Three.js',   level: 60, label: 'Intermediate' },
      { name: 'GLSL',       level: 55, label: 'Intermediate' },
      { name: 'GSAP',       level: 65, label: 'Intermediate' },
    ],
  },
  {
    key: 'tools', icon: '/Assets/icons/TechTools.png', title: 'Tools',
    skills: [
      { name: 'Git / GitHub', level: 80, label: 'Intermediate' },
      { name: 'Figma',        level: 66, label: 'Intermediate' },
      { name: 'VS Code',      level: 90, label: 'Advanced'     },
    ],
  },
];

const LEARNING = ['Unreal Engine 5', 'Visual Effects', '3D Animation'];

/* Color map per group key */
const GROUP_COLORS: Record<string, string> = {
  game:  'var(--color-accent)',
  art:   '#a78bfa',
  code:  'var(--color-blue)',
  tools: '#34d399',
};

export function Skills() {
  /* Animate bars when section enters */
  useEffect(() => {
    const onEnter = (e: Event) => {
      if ((e as CustomEvent).detail?.id !== 'skills') return;
      document.querySelectorAll<HTMLElement>('.skill-bar-fill').forEach(bar => {
        bar.style.width = '0%';
        void bar.offsetWidth;
        bar.style.width = bar.dataset.level ?? '0%';
      });
    };
    window.addEventListener('sectionenter', onEnter);
    return () => window.removeEventListener('sectionenter', onEnter);
  }, []);

  return (
    <section className="skills" id="skills">
      <div className="container">

        {/* Section divider */}
        <div className="section-divider reveal" />

        {/* Section label */}
        <div className="section-label reveal">
          <span className="section-label-num">03</span>
          <span className="section-label-line" />
          <span className="section-label-text">Skills</span>
        </div>

        {/* Header */}
        <div className="skills-header">
          <div>
            <h2 className="skills-heading reveal reveal-delay-1">
              Tech &amp;<br /><span className="accent">Tools.</span>
            </h2>
          </div>
          <p className="skills-sub reveal reveal-delay-2">
            The tools and technologies I work with — from game engines and 3D software
            to shaders and interactive web.
          </p>
        </div>

        {/* Skills grid */}
        <div className="skills-grid">
          {SKILLS_DATA.map((group, i) => (
            <div
              key={group.key}
              className={`skill-group ${group.key} reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              {/* Group icon */}
              <div className="skill-group-icon">
                <img
                  src={group.icon}
                  alt={group.title}
                  className="skill-group-icon-img"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="skill-group-title">{group.title}</div>
              <div className="skill-group-count">{group.skills.length} skills</div>

              {/* Skill list */}
              <div className="skill-list">
                {group.skills.map(skill => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-item-top">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level-label">{skill.label}</span>
                    </div>
                    <div className="skill-bar-track">
                      <div
                        className="skill-bar-fill"
                        data-level={`${skill.level}%`}
                        style={{
                          '--skill-level': `${skill.level}%`,
                          background: `linear-gradient(90deg, ${GROUP_COLORS[group.key]}, color-mix(in srgb, ${GROUP_COLORS[group.key]} 70%, white))`,
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Currently Learning strip */}
        <div className="skills-learning reveal reveal-delay-3">
          <div className="skills-learning-label">
            <span className="skills-learning-dot" />
            <span className="skills-learning-title">Currently Learning</span>
          </div>
          <div className="skills-learning-divider" />
          <div className="skills-learning-items">
            {LEARNING.map(item => (
              <span key={item} className="skills-learning-chip">{item}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
