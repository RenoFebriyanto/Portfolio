/* ================================================
   ABOUT DATA — edit di sini untuk mengubah konten
   section About. Tidak perlu sentuh index.html.

   Bagian yang bisa diubah:
   - photo      : path ke foto profil
   - name       : nama lengkap
   - role       : jabatan / tagline
   - bio        : array paragraf (HTML diizinkan untuk <strong>)
   - chips      : list keahlian "What I Do"
   - meta       : detail identitas di kartu kanan
   - stats      : angka statistik (infinity → gunakan "∞")
   - status     : teks ketersediaan
   - cornerTag  : label pojok kiri foto
================================================ */

window.ABOUT_DATA = {

    /* ---- Photo ---- */
    photo: 'assets/img/Me.jpeg',   // ganti path kalau foto baru
    photoAlt: 'Reno Febri',

    /* ---- Identity ---- */
    name:       'Reno Febri',
    role:       'Game Tech & 3D Creator',
    cornerTag:  'Reno Febri',

    /* ---- Heading (HTML diizinkan) ---- */
    heading: `Crafting<br><span class="accent">Worlds</span> &<br><span class="dim">Experiences.</span>`,

    /* ---- Bio paragraphs ---- */
    bio: [
        `I'm <strong>Reno Febri</strong> — a Game Tech creator and 3D artist based in Indonesia.
         I work at the intersection of real-time rendering, game systems, and interactive web,
         building things that are both technically solid and visually striking.`,

        `My workflow spans from <strong>concept and 3D modeling in Blender</strong> to
         <strong>game logic and visual effects programming</strong>, through to polished interactive
         web experiences. I care deeply about craft — every project is an opportunity to
         push the boundary between technology and art.`,
    ],

    /* ---- What I Do chips ---- */
    chips: [
        'Game Development',
        '3D Modeling & Art',
        'Shader / GLSL',
        'Interactive Web',
        '2D Art & UI Design',
        'Real-time Rendering',
    ],

    /* ---- Identity card meta rows ---- */
    meta: [
        { label: 'Based in', value: 'Indonesia' },
        { label: 'Focus',    value: 'Game Tech / 3D' },
        { label: 'Engine',   value: 'Unity / Godot' },
        { label: '3D Tool',  value: 'Blender' },
    ],

    /* ---- Stats ---- */
    stats: [
        { num: '3',  accent: '+', label: 'Years Active' },
        { num: '12', accent: '+', label: 'Projects' },
        { num: '5',  accent: '+', label: 'Game Builds' },
        { num: '∞',  accent: '',  label: 'Ideas Left' },
    ],

    /* ---- Availability status ---- */
    statusText: 'Open for work',
    statusTag:  'Available',
};