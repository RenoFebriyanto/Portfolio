// Portfolio-migrasi/app/components/sections/Projects.tsx
import { useState, useCallback } from 'react';
import { ProjectCard } from '~/components/sections/ProjectCard';

/* ── Project Data (mirrors vanilla scripts/data/projects-data.js) ── */
export type ProjectCategory = 'game' | '3d' | 'vfx' | 'web';
export type ProjectStatus   = 'completed' | 'wip' | 'archived' | 'concept';

export interface Project {
  id:            number;
  slug:          string;
  title:         string;
  category:      ProjectCategory;
  categoryLabel: string;
  description:   string;
  tags:          string[];
  previewImage?: string;
  previewVideo?: string;
  accentColor?:  string;
  modelPath?:    string;
  link?:         string;
  itchLink?:     string;
  detailPath?:   string;
  featured?:     boolean;
  status:        ProjectStatus;
  statusLabel:   string;
  year?:         number;
}

const PROJECTS: Project[] = [
  {
    id:            1,
    slug:          'forbidden-space',
    title:         'Forbidden Space',
    category:      'game',
    categoryLabel: 'Game Dev',
    description:
      'A cosmic time-loop roguelike where death resets the universe. Twin-stick sci-fi combat, boss battles with multi-phase AI, and layered VFX built in Unity.',
    tags:          ['Unity', 'C#', 'VFX Graph', 'Shader Graph'],
    previewImage:  '/Assets/project/game/ForbiddenSpace/ForbiddenSpacePreview.png',
    previewVideo:  '',
    accentColor:   '#359aff',
    link:          '/project-page/ForbiddenSpace/forbidden-space.html',
    itchLink:      'https://wubblyduby.itch.io/forbidden-space',
    featured:      true,
    status:        'wip',
    statusLabel:   'In Progress',
    year:          2026,
  },
  {
    id:            2,
    slug:          '3d-scene-art',
    title:         '3D Scene / Art Title',
    category:      '3d',
    categoryLabel: '3D Art',
    description:
      'Environment art and product renders exploring material studies, lighting rigs, and procedural texturing pipelines in Blender.',
    tags:          ['Blender', 'Cycles', 'Substance Painter'],
    previewImage:  '/Assets/project/game/ForbiddenSpace/ForbiddenSpacePreview.png',
    accentColor:   '#a78bfa',
    modelPath:     '/Assets/project/3d/3dSphere.glb',
    status:        'completed',
    statusLabel:   'Completed',
    year:          2025,
  },
  {
    id:            3,
    slug:          'shader-experiment',
    title:         'Shader Experiment',
    category:      'vfx',
    categoryLabel: 'Shader / GLSL',
    description:
      'Real-time shader experiments — raymarching, noise-based distortion, and SDF compositions rendered live in WebGL.',
    tags:          ['GLSL', 'WebGL', 'Three.js'],
    accentColor:   '#4D8CFF',
    status:        'completed',
    statusLabel:   'Completed',
    year:          2025,
  },
  {
    id:            4,
    slug:          'game-jam-entry',
    title:         'Game Jam Entry',
    category:      'game',
    categoryLabel: 'Game Dev',
    description:
      'A rapid game jam build — constrained design, fast iteration, and shipping something playable in 48 hours.',
    tags:          ['Godot', 'GDScript', 'Aseprite'],
    accentColor:   '#FF6B35',
    status:        'completed',
    statusLabel:   'Completed',
    year:          2025,
  },
  {
    id:            5,
    slug:          'interactive-web',
    title:         'Interactive Web Experience',
    category:      'web',
    categoryLabel: 'Web / Interactive',
    description:
      'A web-based immersive piece combining particle systems, scroll-driven narrative, and real-time 3D in the browser.',
    tags:          ['Three.js', 'GSAP', 'WebGL'],
    accentColor:   '#4D8CFF',
    status:        'concept',
    statusLabel:   'Concept',
    year:          2026,
  },
  {
    id:            6,
    slug:          'character-model',
    title:         'Character / Model Study',
    category:      '3d',
    categoryLabel: '3D Art',
    description:
      'Character sculpting study focusing on anatomy, stylized topology, and rigging-ready mesh preparation for game engines.',
    tags:          ['Blender', 'Sculpting', 'Rigging'],
    accentColor:   '#a78bfa',
    status:        'archived',
    statusLabel:   'Archived',
    year:          2024,
  },
];

const CATEGORIES = [
  { key: 'all',   label: 'All'            },
  { key: 'game',  label: 'Game Dev'       },
  { key: '3d',    label: '3D Art'         },
  { key: 'vfx',   label: 'Visual Effects' },
  { key: 'web',   label: 'Web'            },
];

/* ── Section Component ── */
export function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleFilter = useCallback((key: string) => {
    setActiveFilter(key);
  }, []);

  const visible = PROJECTS.filter(
    p => activeFilter === 'all' || p.category === activeFilter,
  );

  return (
    <section className="projects" id="projects">
      <div className="container">

        {/* Section divider */}
        <div className="section-divider" />

        {/* Section label */}
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
              Showing <span id="project-visible-count">{visible.length}</span> projects
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="projects-filter reveal reveal-delay-2">
          {CATEGORIES.map((cat, i) => (
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

        {/* Project grid */}
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