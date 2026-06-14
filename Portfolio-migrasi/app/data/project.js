/* ============================================================
   PROJECTS DATA — single source of truth
   Add/edit/remove project dari sini.
   ============================================================ */
export const projects = [
    {
        slug: 'project-game-01',
        title: 'Game Project 01',
        category: 'game',
        description: 'Placeholder for your first game project. Edit di app/data/projects.ts.',
        tags: ['Unity', 'C#', 'Game Design'],
        sceneType: 'game',
        status: 'wip',
        year: 2024,
    },
    {
        slug: 'project-3d-01',
        title: '3D Art 01',
        category: '3d',
        description: 'Placeholder untuk 3D art / render. Edit di app/data/projects.ts.',
        tags: ['Blender', 'glTF', 'Rendering'],
        sceneType: 'art',
        status: 'completed',
        year: 2024,
    },
    {
        slug: 'project-shader-01',
        title: 'Shader Experiment',
        category: 'shader',
        description: 'GLSL shader experiment. Edit di app/data/projects.ts.',
        tags: ['GLSL', 'Three.js', 'WebGL'],
        sceneType: 'shader',
        status: 'completed',
        year: 2024,
    },
    {
        slug: 'project-web-01',
        title: 'Web Interactive',
        category: 'web',
        description: 'Placeholder web interactive project. Edit di app/data/projects.ts.',
        tags: ['JavaScript', 'Three.js', 'GSAP'],
        sceneType: 'web',
        status: 'wip',
        year: 2024,
    },
    {
        slug: 'project-game-02',
        title: 'Game Project 02',
        category: 'game',
        description: 'Placeholder untuk game kedua. Edit di app/data/projects.ts.',
        tags: ['Godot', 'GDScript', '2D'],
        sceneType: 'game',
        status: 'wip',
        year: 2025,
    },
    {
        slug: 'project-3d-02',
        title: '3D Art 02',
        category: '3d',
        description: 'Placeholder 3D kedua. Edit di app/data/projects.ts.',
        tags: ['Blender', 'Substance'],
        sceneType: 'art',
        status: 'completed',
        year: 2025,
    },
];
/** Semua kategori unik dari data */
export const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
