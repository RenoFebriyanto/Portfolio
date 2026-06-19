// SESUDAH
import { useState, useCallback } from 'react';
import { ProjectCard } from '~/components/sections/ProjectCard';
import { projects as PROJECTS } from '~/data/projects';
import type { Project } from '~/data/projects';

export type { Project };

/* ── Categories (filter bar labels) ── */
const CATEGORIES = [
  { key: 'all',   label: 'All'            },
  { key: 'game',  label: 'Game Dev'       },
  { key: '3d',    label: '3D Art'         },
  { key: 'vfx',   label: 'Visual Effects' },
  { key: 'web',   label: 'Web'            },
  { key: 'app',   label: 'Application'    },
];

/* ── Section Component ── */
export function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleFilter = useCallback((key: string) => {
    setActiveFilter(key);
  }, []);

  const visibleCount = activeFilter === 'all'
    ? PROJECTS.length
    : PROJECTS.filter(p => p.category === activeFilter).length;

  return (
    <section className="projects" id="projects">
      <div className="container">

        {/* Section divider — animated line draw via useSectionAnimations */}
        <div className="section-divider" />

        {/* Section label — identical structure to vanilla */}
        <div className="section-label reveal">
          <span className="section-label-num">02</span>
          <span className="section-label-line" />
          <span className="section-label-text">Projects</span>
        </div>

        {/* Header */}
        <div className="projects-header">
          <div>
            <h2 className="projects-heading reveal reveal-delay-1">
              Selected<br /><span className="accent">Work.</span>
            </h2>
          </div>
          <div className="reveal reveal-delay-2">
            <p className="projects-count">
              Showing <span id="project-visible-count">{visibleCount}</span> projects
            </p>
          </div>
        </div>

        {/* Filter bar — mirrors vanilla .projects-filter with .filter-btn */}
        <div className="projects-filter reveal reveal-delay-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`filter-btn${activeFilter === cat.key ? ' active' : ''}`}
              data-filter={cat.key}
              onClick={() => handleFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project grid — identical to vanilla #projects-grid */}
        <div className="projects-grid" id="projects-grid">
          {PROJECTS.map((proj, index) => {
            const isHidden = activeFilter !== 'all' && proj.category !== activeFilter;
            return (
              <ProjectCard
                key={proj.id}
                project={proj}
                index={index}
                hidden={isHidden}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}