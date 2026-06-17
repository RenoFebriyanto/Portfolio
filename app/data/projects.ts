/* ============================================================
   PROJECTS DATA — single source of truth
   Edit di sini untuk add/remove/update projects.
   ============================================================ */

export type ProjectCategory = 'game' | '3d' | 'shader' | 'web';
export type ProjectStatus = 'completed' | 'wip' | 'archived' | 'concept';

export interface Project {
  slug:          string;
  title:         string;
  category:      ProjectCategory;
  categoryLabel: string;
  description:   string;
  tags:          string[];
  /** Three.js scene type untuk preview fallback */
  sceneType:     'game' | 'art' | 'shader' | 'web';
  /** Optional GLB path (relative to /public) — enables 3D hover preview */
  modelPath?:    string;
  /** Optional preview image path */
  previewImage?: string;
  /** External links */
  link?:         string;
  itchLink?:     string;
  githubLink?:   string;
  /** Internal project page */
  detailPath?:   string;
  /** Featured = span 2 cols in grid */
  featured?:     boolean;
  status?:       ProjectStatus;
  statusLabel?:  string;
  year?:         number;
  /** Accent color for gradient preview bg */
  accentColor?:  string;
}

export const projects: Project[] = [
  {
    slug:          'forbidden-space',
    title:         'Forbidden Space',
    category:      'game',
    categoryLabel: 'Game Dev',
    description:
      'A cosmic time-loop roguelike where death resets the universe. Twin-stick sci-fi combat, boss battles with multi-phase AI, and layered VFX built in Unity.',
    tags:          ['Unity', 'C#', 'VFX Graph', 'Shader Graph'],
    sceneType:     'game',
    previewImage:  '/Assets/project/game/ForbiddenSpace/ForbiddenSpacePreview.png',
    itchLink:      'https://wubblyduby.itch.io/forbidden-space',
    detailPath:    '/projects/forbidden-space',
    featured:      true,
    status:        'wip',
    statusLabel:   'In Progress',
    year:          2026,
    accentColor:   '#359aff',
  },
  {
    slug:          '3d-scene-art',
    title:         '3D Scene / Art',
    category:      '3d',
    categoryLabel: '3D Art',
    description:
      'Environment art and product renders exploring material studies, lighting rigs, and procedural texturing pipelines in Blender.',
    tags:          ['Blender', 'Cycles', 'Substance Painter'],
    sceneType:     'art',
    modelPath:     '/Assets/project/3d/3dSphere.glb',
    previewImage:  '/Assets/project/game/ForbiddenSpace/ForbiddenSpacePreview.png',
    status:        'completed',
    statusLabel:   'Completed',
    year:          2025,
    accentColor:   '#a78bfa',
  },
  {
    slug:          'shader-experiment',
    title:         'Shader Experiment',
    category:      'shader',
    categoryLabel: 'Shader / GLSL',
    description:
      'Real-time shader experiments — raymarching, noise-based distortion, and SDF compositions rendered live in WebGL.',
    tags:          ['GLSL', 'WebGL', 'Three.js'],
    sceneType:     'shader',
    status:        'completed',
    statusLabel:   'Completed',
    year:          2025,
    accentColor:   '#4D8CFF',
  },
  {
    slug:          'game-jam-entry',
    title:         'Game Jam Entry',
    category:      'game',
    categoryLabel: 'Game Dev',
    description:
      'A rapid game jam build — constrained design, fast iteration, and shipping something playable in 48 hours.',
    tags:          ['Godot', 'GDScript', 'Aseprite'],
    sceneType:     'game',
    status:        'completed',
    statusLabel:   'Completed',
    year:          2025,
    accentColor:   '#FF6B35',
  },
  {
    slug:          'interactive-web',
    title:         'Interactive Web Experience',
    category:      'web',
    categoryLabel: 'Web / Interactive',
    description:
      'A web-based immersive piece combining particle systems, scroll-driven narrative, and real-time 3D in the browser.',
    tags:          ['Three.js', 'GSAP', 'WebGL'],
    sceneType:     'web',
    status:        'concept',
    statusLabel:   'Concept',
    year:          2026,
    accentColor:   '#4D8CFF',
  },
  {
    slug:          'character-model',
    title:         'Character Model Study',
    category:      '3d',
    categoryLabel: '3D Art',
    description:
      'Character sculpting study focusing on anatomy, stylized topology, and rigging-ready mesh preparation for game engines.',
    tags:          ['Blender', 'Sculpting', 'Rigging'],
    sceneType:     'art',
    status:        'archived',
    statusLabel:   'Archived',
    year:          2024,
    accentColor:   '#a78bfa',
  },
];

export const categories = [
  'all',
  ...Array.from(new Set(projects.map(p => p.category))),
] as const;

export type CategoryKey = (typeof categories)[number];
