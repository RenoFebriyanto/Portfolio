/* ================================================
   ABOUT-RENDER.JS — Build section About dari
   window.ABOUT_DATA (scripts/data/about-data.js).
   Semua konten dikontrol dari about-data.js.
   Tidak perlu sentuh index.html.
================================================ */

(function renderAbout() {
    const data = window.ABOUT_DATA;
    if (!data) {
        console.warn('[About] window.ABOUT_DATA tidak ditemukan.');
        return;
    }

    /* ================================================
       RESOLVER: nilai dinamis untuk stat cards
    ================================================ */

    /**
     * Hitung Years Active secara realtime dari data.startYear / startMonth.
     * Mengembalikan string desimal 1 digit, misal "3.7" atau "4.0".
     * Animasi count-up di section-animations.js akan berjalan normal.
     */
    function resolveYearsActive() {
        const startYear  = data.startYear  || 2022;
        const startMonth = (data.startMonth || 1) - 1; // JS month 0-indexed
        const start = new Date(startYear, startMonth, 1);
        const now   = new Date();
        const diffMs    = now - start;
        const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
        return diffYears.toFixed(1);   // "3.7"
    }

    /**
     * Hitung total project dari window.PROJECTS_DATA.
     * Fallback ke '0' kalau data belum ada.
     */
    function resolveProjectCount() {
        if (Array.isArray(window.PROJECTS_DATA)) {
            return String(window.PROJECTS_DATA.length);
        }
        return '0';
    }

    /** Ganti special key dengan nilai yang sudah dihitung */
    function resolveStatNum(num) {
        if (num === 'YEARS_ACTIVE')   return resolveYearsActive();
        if (num === 'PROJECT_COUNT')  return resolveProjectCount();
        return num;
    }

    /* ---- Heading ---- */
    const headingEl = document.querySelector('.about-heading');
    if (headingEl) headingEl.innerHTML = data.heading;

    /* ---- Bio paragraphs ---- */
    const bioContainer = document.querySelector('.about-bio-container');
    if (bioContainer && Array.isArray(data.bio)) {
        bioContainer.innerHTML = data.bio
            .map(text => `<p class="about-bio reveal reveal-delay-2">${text}</p>`)
            .join('');
    }

    /* ---- Chips (What I Do) ---- */
    const chipsEl = document.querySelector('.about-doing');
    if (chipsEl && Array.isArray(data.chips)) {
        chipsEl.innerHTML = data.chips
            .map(chip => `
                <div class="about-doing-chip">
                    <span class="about-doing-chip-dot"></span>
                    ${chip}
                </div>`)
            .join('');
    }

    /* ---- Photo ---- */
    const photoEl = document.querySelector('.avatar-photo');
    if (photoEl) {
        photoEl.src = data.photo;
        photoEl.alt = data.photoAlt || data.name;
    }

    /* ---- Corner tag ---- */
    const cornerTag = document.querySelector('.avatar-corner-tag');
    if (cornerTag) cornerTag.textContent = data.cornerTag || data.name;

    /* ---- Name & Role ---- */
    const nameEl = document.querySelector('.about-identity-name');
    const roleEl = document.querySelector('.about-identity-role');
    if (nameEl) nameEl.textContent = data.name;
    if (roleEl) roleEl.textContent = data.role;

    /* ---- Meta rows ---- */
    const metaEl = document.querySelector('.about-identity-meta');
    if (metaEl && Array.isArray(data.meta)) {
        metaEl.innerHTML = data.meta
            .map(row => `
                <div class="about-identity-meta-row">
                    <span class="about-identity-meta-label">${row.label}</span>
                    <span class="about-identity-meta-val">${row.value}</span>
                </div>`)
            .join('');
    }

    /* ---- Stats ---- */
    const statsEl = document.querySelector('.about-stats');
    if (statsEl && Array.isArray(data.stats)) {
        statsEl.innerHTML = data.stats
            .map(s => {
                const resolvedNum = resolveStatNum(s.num);
                return `
                <div class="stat-card">
                    <div class="stat-num" data-raw="${s.num}">
                        ${resolvedNum}${s.accent ? `<span class="stat-accent">${s.accent}</span>` : ''}
                    </div>
                    <div class="stat-label">${s.label}</div>
                </div>`;
            })
            .join('');
    }

    /* ---- Status ---- */
    const statusTextEl = document.querySelector('.about-status-text');
    const statusTagEl  = document.querySelector('.about-status-tag');
    if (statusTextEl) statusTextEl.textContent = data.statusText;
    if (statusTagEl)  statusTagEl.textContent  = data.statusTag;

})();