// SESUDAH
import { useState, useCallback, useEffect, useRef } from 'react';
import { ProjectCard } from '~/components/sections/ProjectCard';
import { projects as PROJECTS } from '~/data/projects';
import type { Project } from '~/data/projects';
import { gsap } from '~/utils/gsap';

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
  const offsetRef = useRef(0);

  const handleFilter = useCallback((key: string) => {
    setActiveFilter(key);
    offsetRef.current = 0;
  }, []);

  const visibleProjects = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

  useEffect(() => {
    const viewport = viewportRef.current;
    const grid = gridRef.current;
    const section = sectionRef.current;
    if (!viewport || !grid || !section) return;

    offsetRef.current = 0;
    gsap.killTweensOf(grid);
    gsap.set(grid, { x: 0 });

    const cards = grid.querySelectorAll<HTMLElement>('[data-project-card]');
    gsap.fromTo(cards,
      { x: 90, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'power3.out' },
    );

    const onResize = () => {
      offsetRef.current = Math.min(offsetRef.current, Math.max(0, grid.scrollWidth - viewport.clientWidth));
      gsap.set(grid, { x: -offsetRef.current });
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 1) return;

      const maxOffset = Math.max(0, grid.scrollWidth - viewport.clientWidth);
      const nextOffset = Math.max(0, Math.min(maxOffset, offsetRef.current + event.deltaY));
      const movingForward = event.deltaY > 0 && offsetRef.current < maxOffset;
      const movingBackward = event.deltaY < 0 && offsetRef.current > 0;

      if (!movingForward && !movingBackward) return;

      event.preventDefault();
      offsetRef.current = nextOffset;
      gsap.to(grid, {
        x: -nextOffset,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0]?.clientX ?? 0;
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaX = touchStartX - touch.clientX;
      const deltaY = touchStartY - touch.clientY;
      if (Math.abs(deltaX) < 20 || Math.abs(deltaX) < Math.abs(deltaY)) return;

      const maxOffset = Math.max(0, grid.scrollWidth - viewport.clientWidth);
      const nextOffset = Math.max(0, Math.min(maxOffset, offsetRef.current + deltaX));
      const movingForward = deltaX > 0 && offsetRef.current < maxOffset;
      const movingBackward = deltaX < 0 && offsetRef.current > 0;
      if (!movingForward && !movingBackward) return;

      event.preventDefault();
      offsetRef.current = nextOffset;
      gsap.to(grid, {
        x: -nextOffset,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    section.addEventListener('wheel', onWheel, { capture: true, passive: false });
    section.addEventListener('touchstart', onTouchStart, { capture: true, passive: true });
    section.addEventListener('touchend', onTouchEnd, { capture: true, passive: false });
    window.addEventListener('resize', onResize);
    return () => {
      section.removeEventListener('wheel', onWheel, { capture: true });
      section.removeEventListener('touchstart', onTouchStart, { capture: true });
      section.removeEventListener('touchend', onTouchEnd, { capture: true });
      window.removeEventListener('resize', onResize);
      gsap.killTweensOf(grid);
    };
  }, [activeFilter]);

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