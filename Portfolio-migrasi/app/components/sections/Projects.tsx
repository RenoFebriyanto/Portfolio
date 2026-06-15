/* ============================================================
   PROJECTS DATA — single source of truth
   Mirror vanilla scripts/data/projects-data.js
   
   Field tambahan vs versi lama:
   - previewImage  → path ke screenshot/thumbnail
   - previewVideo  → path ke video clip (autoplay on hover)
   - previewColor  → accent color dominant project
   - statusLabel   → label untuk badge (In Progress, Completed, dll)
   ============================================================ */

export type ProjectCategory = 'game' | '3d' | 'shader' | 'web';
export type ProjectStatus   = 'completed' | 'wip' | 'archived' | 'concept';

export interface Project {
  slug:          string;
  title:         string;
  category:      ProjectCategory;
  categoryLabel: string;
  description:   string;
  tags:          string[];
  /** Three.js scene type — dipakai sebagai fallback visual */
  sceneType:     'game' | 'art' | 'shader' | 'web';
  /** Path ke preview image (jpg/png/webp) */
  previewImage?: string;
  /** Path ke video clip pendek (mp4/webm), autoplay on hover */
  previewVideo?: string;
  /** Warna dominant project untuk gradient/overlay */
  accentColor?:  string;
  /** GLB model path untuk 3D hover preview */
  modelPath?:    string;
  /** Link external (itch.io, live demo, dll) */
  link?:         string;
  itchLink?:     string;
  githubLink?:   string;
  /** Internal project detail page */
  detailPath?:   string;
  featured?:     boolean;
  status?:       ProjectStatus;
  statusLabel?:  string;
  year?:         number;
}

export const projects: Project[] = [
  {
    slug:          'forbidden-space',
    title:         'Forbidden Space',
    category:      'game',
    categoryLabel: 'Game Dev',
    description:
      'A cosmic time-loop roguelike where death resets the universe. Twin-stick sci-fi combat, boss battles with multi-phase AI, and layered VFX built in Unity.',
    tags:         ['Unity', 'C#', 'VFX Graph', 'Shader Graph'],
    sceneType:    'game',
    previewImage: '/Assets/project/game/ForbiddenSpace/ForbiddenSpacePreview.png',
    previewVideo: '',
    accentColor:  '#359aff',
    link:         '/project-page/ForbiddenSpace/forbidden-space.html',
    itchLink:     'https://wubblyduby.itch.io/forbidden-space',
    detailPath:   '/projects/forbidden-space',
    featured:     true,
    status:       'wip',
    statusLabel:  'In Progress',
    year:         2026,
  },
  {
    slug:          '3d-scene-art',
    title:         '3D Scene / Art Title',
    category:      '3d',
    categoryLabel: '3D Art',
    description:
      'Environment art, character, or product render — describe the concept, mood, and technical approach used in Blender.',
    tags:         ['Blender', 'Cycles', 'Substance Painter'],
    sceneType:    'art',
    previewImage: '/Assets/project/game/ForbiddenSpace/ForbiddenSpacePreview.png',
    previewVideo: '',
    accentColor:  '#a78bfa',
    modelPath:    '/Assets/project/3d/3dSphere.glb',
    status:       'completed',
    statusLabel:  'Completed',
    year:         2025,
  },
  {
    slug:          'shader-experiment',
    title:         'Shader Experiment',
    category:      'shader',
    categoryLabel: 'Shader / GLSL',
    description:
      'A real-time shader experiment — describe the visual effect, technique used (raymarching, noise, SDF, etc.).',
    tags:         ['GLSL', 'WebGL', 'Three.js'],
    sceneType:    'shader',
    previewImage: '',
    previewVideo: '',
    accentColor:  '#4D8CFF',
    status:       'completed',
    statusLabel:  'Completed',
    year:         2025,
  },
  {
    slug:          'game-jam-entry',
    title:         'Game Jam Entry',
    category:      'game',
    categoryLabel: 'Game Dev',
    description:
      'A game jam build — theme, time limit, what was built, what you learned, and any results or ratings received.',
    tags:         ['Godot', 'GDScript', 'Aseprite'],
    sceneType:    'game',
    previewImage: '',
    previewVideo: '',
    accentColor:  '#FF6B35',
    status:       'completed',
    statusLabel:  'Completed',
    year:         2025,
  },
  {
    slug:          'interactive-web',
    title:         'Interactive Web Experience',
    category:      'web',
    categoryLabel: 'Web / Interactive',
    description:
      'A web-based interactive piece — describe what it is, the interaction model, and the visual or narrative experience.',
    tags:         ['Three.js', 'GSAP', 'WebGL'],
    sceneType:    'web',
    previewImage: '',
    previewVideo: '',
    accentColor:  '#4D8CFF',
    status:       'concept',
    statusLabel:  'Concept',
    year:         2026,
  },
  {
    slug:          'character-model',
    title:         'Character / Model Study',
    category:      '3d',
    categoryLabel: '3D Art',
    description:
      'A character modeling or sculpting study — anatomy, style direction, topology decisions, and any rigging or animation work done.',
    tags:         ['Blender', 'Sculpting', 'Rigging'],
    sceneType:    'art',
    previewImage: '',
    previewVideo: '',
    accentColor:  '#a78bfa',
    status:       'archived',
    statusLabel:  'Archived',
    year:         2024,
  },
];

export const categories = [
  'all',
  ...Array.from(new Set(projects.map(p => p.category))),
] as const;

export type CategoryKey = (typeof categories)[number];