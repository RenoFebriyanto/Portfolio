/* ================================================
   PROJECTS DATA — edit di sini untuk menambah,
   menghapus, atau mengubah project & category.
   Tidak perlu sentuh index.html / CSS.

   Tambah project baru:
   - Tambahkan object baru ke PROJECTS_DATA.
   - "category" harus cocok dengan salah satu "key"
     di PROJECT_CATEGORIES.
   - "featured: true" -> card lebih besar (span 2 kolom).
   - "link" -> URL halaman detail project (kosongkan "" 
     kalau belum ada, tombol jadi "Coming Soon").
   - "pageType" -> dipakai nanti utk pilih layout/animasi
     halaman detail (misal "3d" pakai layout 3D viewer).

   Hapus project:
   - Hapus / comment-out object-nya.

   Tambah category baru:
   - Tambahkan { key: 'xxx', label: 'Label' } ke
     PROJECT_CATEGORIES, lalu pakai key itu di "category".
================================================ */

window.PROJECT_CATEGORIES = [
    { key: 'all',    label: 'All' },
    { key: 'game',   label: 'Game Dev' },
    { key: '3d',     label: '3D Art' },
    { key: 'vfx', label: 'Visual Effects' },
    { key: 'web',    label: 'Web' },
];

window.PROJECTS_DATA = [
    {
        id: 1,
        slug: 'project-name-here',
        category: 'game',
        categoryLabel: 'Game Dev',
        status: 'wip',           // completed | wip | archived | concept
        statusLabel: 'In Progress',
        featured: true,
        title: 'Project Name Here',
        desc: 'A brief description of what this game is about — genre, core mechanic, and what makes it unique. Keep it punchy and specific. What problem does it solve, what experience does it deliver?',
        tags: ['Unity', 'C#', 'HLSL', 'Blender', 'FMOD'],
        link: 'd',
        linkLabel: 'View Project',
        pageType: 'game',
    },
    {
        id: 2,
        slug: '3d-scene-art-title',
        category: '3d',
        categoryLabel: '3D Art',
        status: 'completed',
        statusLabel: 'Completed',
        featured: false,
        title: '3D Scene / Art Title',
        desc: 'Environment art, character, or product render — describe the concept, mood, and technical approach used in Blender to achieve the final look.',
        tags: ['Blender', 'Cycles', 'Substance'],
        link: '',
        linkLabel: 'View Artwork',
        pageType: '3d',
    },
    {
        id: 3,
        slug: 'shader-experiment',
        category: 'shader',
        categoryLabel: 'Shader / GLSL',
        status: 'completed',
        statusLabel: 'Completed',
        featured: false,
        title: 'Shader Experiment',
        desc: 'A real-time shader experiment — describe the visual effect, technique used (raymarching, noise, SDF, etc.) and what drove the exploration.',
        tags: ['GLSL', 'WebGL', 'Three.js'],
        link: '',
        linkLabel: 'Live Demo',
        pageType: 'shader',
    },
    {
        id: 4,
        slug: 'game-jam-entry',
        category: 'game',
        categoryLabel: 'Game Dev',
        status: 'completed',
        statusLabel: 'Completed',
        featured: false,
        title: 'Game Jam Entry',
        desc: 'A game jam build — theme, time limit, what was built, what you learned, and any results or ratings received.',
        tags: ['Godot', 'GDScript', 'Aseprite'],
        link: '',
        linkLabel: 'Play on itch.io',
        pageType: 'game',
    },
    {
        id: 5,
        slug: 'interactive-web-experience',
        category: 'web',
        categoryLabel: 'Web / Interactive',
        status: 'concept',
        statusLabel: 'Concept',
        featured: false,
        title: 'Interactive Web Experience',
        desc: 'A web-based interactive piece — describe what it is, the interaction model, and the visual or narrative experience it delivers.',
        tags: ['Three.js', 'GSAP', 'WebGL'],
        link: '',
        linkLabel: 'Coming Soon',
        pageType: 'web',
    },
    {
        id: 6,
        slug: 'character-model-study',
        category: '3d',
        categoryLabel: '3D Art',
        status: 'archived',
        statusLabel: 'Archived',
        featured: false,
        title: 'Character / Model Study',
        desc: 'A character modeling or sculpting study — anatomy, style direction, topology decisions, and any rigging or animation work done.',
        tags: ['Blender', 'Sculpt', 'Rigging'],
        link: '',
        linkLabel: 'View Model',
        pageType: '3d',
    },
];