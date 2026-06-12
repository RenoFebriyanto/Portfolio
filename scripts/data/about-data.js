window.ABOUT_DATA = {

    /* ---- Foto profil ---- */
    // Ganti path ke foto baru di sini
    photo:    'assets/images/Me.jpeg',
    photoAlt: 'Reno Febri',

    /* ---- Identitas ---- */
    name:      'Reno Febri',
    role:      'Game Tech & 3D Creator',
    cornerTag: 'Reno Febri',   // label pojok kanan foto

    /* ---- Heading (HTML diizinkan) ---- */
    heading: `Crafting<br><span class="accent">Worlds</span> &<br><span class="dim">Experiences.</span>`,

    /* ---- Bio — tambah/hapus paragraf bebas ---- */
    bio: [
        `I'm <strong>Reno Febri</strong> — a Game Tech creator and 3D artist based in Indonesia.
         I work at the intersection of real-time rendering, game systems, and interactive web,
         building things that are both technically solid and visually striking.`,

        `My workflow spans from <strong>concept and 3D modeling in Blender</strong> to
         <strong>game logic and visual effects programming</strong>, through to polished interactive
         web experiences. I care deeply about craft — every project is an opportunity to
         push the boundary between technology and art.`,
    ],

    /* ---- Chips "What I Do" — tambah/hapus bebas ---- */
    chips: [
        'Game Development',
        '3D Modeling & Art',
        'Shader / GLSL',
        'Interactive Web',
        '2D Art & UI Design',
        'Visual Effects Graph',
    ],

    /* ---- Kartu identitas — baris label/nilai ---- */
    meta: [
        { label: 'Based in', value: 'Indonesia'      },
        { label: 'Focus',    value: 'Game Tech / 3D' },
        { label: 'Engine',   value: 'Unity'  },
        { label: '3D Tool',  value: 'Blender'         },
    ],

    stats: [
    { num: 'YEARS_ACTIVE', accent: '+', label: 'Years Active' },  // dihitung otomatis
    { num: 'PROJECT_COUNT', accent: '+', label: 'Projects'     },  // dihitung dari PROJECTS_DATA
    { num: '5',             accent: '+', label: 'Game Builds'  },  // manual
    { num: '∞',             accent: '',  label: 'Ideas Left'   },
],

    /* ---- Config untuk Years Active ---- */
    startYear: 2023,   // <-- ganti sesuai tahun mulai aktif kamu
    startMonth: 1,     // <-- bulan mulai (1 = Januari)

    /* ---- Status ketersediaan ---- */
    statusText: 'Open for work',
    statusTag:  'Available',
};