window.PROJECT_CATEGORIES = [
    { key: 'all',    label: 'All' },
    { key: 'game',   label: 'Game Dev' },
    { key: '3d',     label: '3D Art' },
    { key: 'vfx',    label: 'Visual Effects' },
    { key: 'web',    label: 'Web' },
];

window.PROJECTS_DATA = [
    {
        id: 1,
        slug: 'project-name-here',
        category: 'game',
        categoryLabel: 'Game Dev',
        status: 'wip',
        statusLabel: 'In Progress',
        featured: true,
        title: 'Project Name Here',
        desc: 'A brief description of what this game is about — genre, core mechanic, and what makes it unique. Keep it punchy and specific.',
        tags: ['Unity', 'C#', 'HLSL', 'Blender', 'FMOD'],
        link: 'd',
        linkLabel: 'View Project',
        pageType: 'game',

        /* ---- Preview ---- */
        // image : path ke screenshot / thumbnail (jpg, png, webp)
        // video : path ke clip pendek (mp4/webm), autoplay on hover
        // color : fallback accent color kalau tidak ada media
        preview: {
            image: 'assets/images/projects/project-name-here.jpg',
            video: 'assets/videos/projects/project-name-here.mp4', // kosongkan '' kalau tidak ada
            color: '#FF6B35',   // warna dominant project
        },
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
        desc: 'Environment art, character, or product render — describe the concept, mood, and technical approach used in Blender.',
        tags: ['Blender', 'Cycles', 'Substance'],
        link: '',
        linkLabel: 'View Artwork',
        pageType: '3d',

        preview: {
            image: 'assets/images/projects/3d-scene-art-title.jpg',
            video: '',
            color: '#a78bfa',
        },
    },
    {
        id: 3,
        slug: 'shader-experiment',
        category: 'vfx',
        categoryLabel: 'Shader / GLSL',
        status: 'completed',
        statusLabel: 'Completed',
        featured: false,
        title: 'Shader Experiment',
        desc: 'A real-time shader experiment — describe the visual effect, technique used (raymarching, noise, SDF, etc.).',
        tags: ['GLSL', 'WebGL', 'Three.js'],
        link: '',
        linkLabel: 'Live Demo',
        pageType: 'shader',

        preview: {
            image: 'assets/images/projects/shader-experiment.jpg',
            video: 'assets/videos/projects/shader-experiment.mp4',
            color: '#4D8CFF',
        },
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

        preview: {
            image: 'assets/images/projects/game-jam-entry.jpg',
            video: '',
            color: '#FF6B35',
        },
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
        desc: 'A web-based interactive piece — describe what it is, the interaction model, and the visual or narrative experience.',
        tags: ['Three.js', 'GSAP', 'WebGL'],
        link: '',
        linkLabel: 'Coming Soon',
        pageType: 'web',

        preview: {
            image: '',
            video: '',
            color: '#4D8CFF',
        },
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

        preview: {
            image: 'assets/images/projects/character-model-study.jpg',
            video: '',
            color: '#a78bfa',
        },
    },
];