import { useState, useCallback } from 'react';
import { projects, categories } from '~/data/projects';
import { ProjectCard } from './ProjectCard';

const CATEGORY_LABELS: Record<string, string> = {
  all:    'All',
  game:   'Game Dev',
  '3d':   '3D Art',
  shader: 'Visual Effects',
  web:    'Web',
};

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const handleFilter = useCallback((cat: string) => {
    setActiveFilter(cat);
  }, []);

  return (
    <section className="section scrollable projects" id="projects">
      <div className="container">
        <div className="section-divider reveal" />

        {/* Section label */}
        <div className="section-label reveal">
          <span className="section-label-num">02</span>
          <span className="section-label-line" />
          <span className="section-label-text">Projects</span>
        </div>

        {/* Header */}
        <div className="projects__header">
          <div>
            <h2 className="projects__heading reveal reveal-delay-1">
              Selected<br /><span className="accent">Work.</span>
            </h2>
          </div>
          <div className="reveal reveal-delay-2">
            <p className="projects__count">
              Showing <span>{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="projects__filters reveal reveal-delay-2">
          {categories.map(cat => (
            <button
              key={cat}
              className={`projects__filter${activeFilter === cat ? ' active' : ''}`}
              onClick={() => handleFilter(cat)}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="projects__grid">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
