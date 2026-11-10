import { useState, useCallback, useRef } from 'react';
import { ProjectCard } from '~/components/sections/ProjectCard';
import { projects as PROJECTS } from '~/data/projects';
import type { Project } from '~/data/projects';
import { gsap, useGSAP } from '~/utils/gsap';

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
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleFilter = useCallback((key: string) => {
    setActiveFilter(key);
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const grid = gridRef.current;
    if (!section || !viewport || !grid) return;

    const media = gsap.matchMedia();
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const getDistance = () => Math.max(0, grid.scrollWidth - viewport.clientWidth);
      if (getDistance() <= 0) return;

      gsap.to(grid, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 0.8, getDistance() * 0.65)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => media.revert();
  }, { scope: sectionRef, dependencies: [activeFilter], revertOnUpdate: true });

  const visibleProjects = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <div className="container" data-horizontal-projects>

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
              Showing <span id="project-visible-count">{visibleProjects.length}</span> projects
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
        <div className="projects-grid-viewport" ref={viewportRef}>
          <div className="projects-grid" id="projects-grid" ref={gridRef}>
            {visibleProjects.map((proj, index) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                index={index}
                hidden={false}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}