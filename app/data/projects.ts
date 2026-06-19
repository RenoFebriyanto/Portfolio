/* ============================================================
   PROJECTS DATA — single source of truth
   Tambah / edit / hapus project HANYA di sini.
   Semua tempat lain (homepage grid & halaman detail) otomatis
   ikut update karena keduanya import dari file ini.
   ============================================================ */

export type ProjectCategory = 'game' | '3d' | 'vfx' | 'web' | 'app';
export type ProjectStatus   = 'completed' | 'wip' | 'archived' | 'concept';

export interface Project {
  /** Unique numeric id — dipakai untuk nomor urut kartu (01, 02, ...) */
  id: number;
  /** URL slug — dipakai di /projects/:slug, harus unik */
  slug: string;
  title: string;
  category: ProjectCategory;
  /** Label tampilan kategori, e.g. "Game Dev", "3D Art" */
  categoryLabel: string;
  description: string;
  tags: string[];

  /** Preview di card — pilih salah satu (image dan/atau video) */
  previewImage?: string;
  previewVideo?: string;
  /** Warna aksen untuk glow/overlay preview card */
  accentColor?: string;

  /** Optional GLB/FBX path (relative ke /public) — enable 3D hover preview di card */
  modelPath?: string;

  /** Links — isi salah satu atau lebih sesuai kebutuhan */
  link?: string;
  itchLink?: string;
  githubLink?: string;
  /** Halaman detail custom internal, e.g. '/projects/forbidden-space' */
  detailPath?: string;

  /** true = card span 2 kolom di grid */
  featured?: boolean;

  status: ProjectStatus;
  statusLabel: string;
  year?: number;
}

export const projects: Project[] = [
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
    featured:      true,
    status:        'wip',
    previewImage:  'Assets/images/WataswaraProject.jpeg',
    statusLabel:   'In Progress',
    year:          2025,
  },
  {
    id:            2,
    slug:          'biographhorizon',
    title:         'Biograph Horizon',
    category:      '3d',
    categoryLabel: '3D Art',
    description:
      'Cinematic medical-equipment render exploring material studies, studio lighting, and procedural texturing in Blender Cycles.',
    tags:          ['Blender', 'Cycles', 'Substance Painter'],
    modelPath:     '/models/Biograph.glb',
    previewImage:  '/Assets/images/BiographHorizon.png',
    detailPath:    '/projects/biographhorizon',
    status:        'completed',
    statusLabel:   'Completed',
    year:          2025,
    accentColor:   '#C9912B',
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
    link:          'https://game.kulinohouse.com/',
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
    previewImage:  'Assets/images/AugmentedReality.jpg',
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
    previewImage:  'Assets/images/Mystique.png',
    link:          'https://mystiquebanyuwangigroup.co.id/',
    status:        'concept',
    statusLabel:   'Need Update',
    year:          2025,
  },
];

/** Semua kategori unik dari data, plus 'all' di awal — dipakai untuk filter bar */
export const categories = [
  'all',
  ...Array.from(new Set(projects.map(p => p.category))),
] as const;

export type CategoryKey = (typeof categories)[number];