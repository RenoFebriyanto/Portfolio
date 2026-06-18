// Portfolio-migrasi/app/components/sections/Projects.tsx
import { useState, useCallback } from 'react';
import { ProjectCard } from '~/components/sections/ProjectCard';

/* ── Project Data (mirrors vanilla scripts/data/projects-data.js) ── */
export type ProjectCategory = 'game' | '3d' | 'vfx' | 'web' | 'app';
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
    slug:          'wataswara',
    title:         'Wataswara Project',
    category:      'game',
    categoryLabel: 'Game Dev',
    description:
      'A rapid game jam build — constrained design, fast iteration, and shipping something playable in 48 hours.',
    tags:          ['Godot', 'GDScript', 'Aseprite'],
    accentColor:   '#FF6B35',
    featured: true,
    status:        'wip',
    previewImage: 'Assets/images/WataswaraProject.jpeg',
    statusLabel:   'In Progress',
    year:          2025,
  },
  {
    id:            2,
    slug:          '3d-biograph',
    title:         'Biograph Horizon',
    category:      '3d',
    categoryLabel: '3D Art',
    description:
      'Environment art and product renders exploring material studies, lighting rigs, and procedural texturing pipelines in Blender.',
    tags:          ['Blender', 'Cycles', 'Substance Painter'],
    previewImage:  'Assets/images/BiographHorizon.png',
    accentColor:   '#a78bfa',
    link:         '/projects/biographhorizon',
    modelPath:     '/models/Biograph.glb',
    status:        'completed',
    statusLabel:   'Completed',
    year:          2025,
  },
  {
    id:            3,
    slug:          'flythothemoon',
    title:         'Fly To The Moon',
    category:      'game',
    categoryLabel: 'Web3 / Game Dev',
    description:
      'A Web3 play-to-earn crypto game. I built the initial website, developed the Unity 2D game, and implemented Phantom wallet connect logic bridging the website to the game.',
    tags:          ['Unity', 'WebGL', 'JavaScript', 'Web3'],
    accentColor:   '#4D8CFF',
    status:        'concept',
    link: 'https://game.kulinohouse.com/',
    previewImage:  'Assets/images/FlyToTheMoon.png',
    statusLabel:   'Need Update',
    year:          2025,
  },
  {
    id:            4,
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
    link:          '/projects/forbidden-space',
    itchLink:      'https://wubblyduby.itch.io/forbidden-space',
    featured:      true,
    status:        'completed',
    statusLabel:   'Completed',
    year:          2026,
  },
  {
    id:            5,
    slug:          'augmentedreality',
    title:         'Augmented Reality',
    category:      'app',
    categoryLabel: 'App / Interactive',
    description:
      'An AR application developed for Picto Grafest 2025 exhibition. I created all 3D models in Blender, integrated into Unity for AR programming by the team. Briefly published on Google Play Store.',
    tags:          ['Unity', 'C#', 'Blender'],
    accentColor:   '#4D8CFF',
    previewImage: 'Assets/images/AugmentedReality.jpg',
    link: '',
    status:        'completed',
    statusLabel:   'Completed',
    year:          2025,
  },
  {
    id:            6,
    slug:          'mystiquegroup',
    title:         'Mystique Banyuwangi Group',
    category:      'web',
    categoryLabel: 'Web',
    description:
      'A professional investor-facing website. I built the frontend while the team handled backend. Currently awaiting further development direction from the client.',
    tags:          ['Blade', 'PHP', 'JavaScript', 'CSS'],
    accentColor:   '#a78bfa',
    previewImage: 'Assets/images/Mystique.png',
    link: 'https://mystiquebanyuwangigroup.co.id/',
    status:        'concept',
    statusLabel:   'Need Update',
    year:          2025,
  },
];

/* ── Categories (mirrors vanilla PROJECT_CATEGORIES) ── */
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