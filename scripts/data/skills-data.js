/* ================================================
   SKILLS DATA — edit di sini untuk menambah,
   menghapus, atau mengubah skill & learning items.
   Tidak perlu sentuh index.html / CSS.
================================================ */

window.SKILLS_DATA = [
    {
        key: 'game',                     // dipakai untuk class warna (.skill-group.game)
        icon: 'Assets/icons/TechGame.png',
        title: 'Game Dev',
        skills: [
            { name: 'Unity',        level: 85, label: 'Advanced' },
            { name: 'C#',           level: 80, label: 'Advanced' },
            { name: 'Visual Effects',     level: 60, label: 'Intermediate' },
            { name: 'Shader Graph', level: 40, label: 'Beginner' },
        ],
    },
    {
        key: 'art',
        icon: 'Assets/icons/Tech3D.png',
        title: '3D & Art',
        skills: [
            { name: 'Blender',            level: 78, label: 'Advanced' },
            { name: 'Substance Painter',  level: 62, label: 'Intermediate' },
            { name: 'Aseprite',           level: 72, label: 'Intermediate' },
        ],
    },
    {
        key: 'code',
        icon: 'Assets/icons/TechCode.png',
        title: 'Code & Web',
        skills: [
            { name: 'JavaScript',  level: 58, label: 'Advanced' },
            { name: 'HTML / CSS',  level: 85, label: 'Advanced' },
            { name: 'Three.js',    level: 60, label: 'Intermediate' },
            { name: 'GLSL',        level: 55, label: 'Intermediate' },
            { name: 'GSAP',        level: 65, label: 'Intermediate' },
        ],
    },
    {
        key: 'tools',
        icon: 'Assets/icons/TechTools.png',
        title: 'Tools',
        skills: [
            { name: 'Git / GitHub', level: 80, label: 'Intermediate' },
            { name: 'Figma',        level: 66, label: 'Intermediate' },
            { name: 'VS Code',      level: 90, label: 'Advanced' },
        ],
    },
];

window.LEARNING_DATA = [
    'Unreal Engine 5',
    'Visual Effects',
    '3D Animation',
];