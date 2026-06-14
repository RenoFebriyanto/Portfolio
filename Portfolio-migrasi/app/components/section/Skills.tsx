import { useEffect, useRef } from 'react';

interface Skill { name: string; level: number; }

const SKILL_CATEGORIES: { title: string; skills: Skill[] }[] = [
  {
    title: 'Game Development',
    skills: [
      { name: 'Unity',          level: 85 },
      { name: 'C#',             level: 80 },
      { name: 'Godot',          level: 65 },
      { name: 'Game Design',    level: 75 },
    ],
  },
  {
    title: '3D & Visual',
    skills: [
      { name: 'Blender',        level: 88 },
      { name: 'GLSL Shaders',   level: 55 },
      { name: 'Three.js',       level: 72 },
      { name: 'glTF / GLB',     level: 78 },
    ],
  },
  {
    title: 'Web & Code',
    skills: [
      { name: 'HTML / CSS',     level: 85 },
      { name: 'JavaScript',     level: 78 },
      { name: 'React',          level: 70 },
      { name: 'TypeScript',     level: 60 },
    ],
  },
  {
    title: 'Tools & Pipeline',
    skills: [
      { name: 'Git / GitHub',   level: 80 },
      { name: 'GSAP',           level: 68 },
      { name: 'Figma',          level: 65 },
      { name: 'Vercel / Deploy',level: 72 },
    ],
  },
];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  // Animate bars when section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const bars = section.querySelectorAll<HTMLElement>('.skill-item__bar');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            bars.forEach(bar => bar.classList.add('animated'));
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section scrollable skills" id="skills" ref={sectionRef}>
      <div className="container">
        <div className="skills__inner">
          <div className="reveal">
            <p className="section-label">03 — Expertise</p>
            <h2 className="section-heading">Skills</h2>
          </div>

          <div className="skills__grid">
            {SKILL_CATEGORIES.map(cat => (
              <div className="skills__category reveal" key={cat.title}>
                <p className="skills__category-title">{cat.title}</p>
                <div className="skills__list">
                  {cat.skills.map(skill => (
                    <div className="skill-item" key={skill.name}>
                      <div className="skill-item__header">
                        <span className="skill-item__name">{skill.name}</span>
                        <span className="skill-item__value">{skill.level}%</span>
                      </div>
                      <div className="skill-item__track">
                        <div
                          className="skill-item__bar"
                          style={{ '--skill-level': `${skill.level}%` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}