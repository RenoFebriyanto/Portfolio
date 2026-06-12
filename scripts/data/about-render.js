/* ================================================
   ABOUT-RENDER.JS — Build section About dari
   window.ABOUT_DATA (scripts/data/about-data.js).

   Harus dimuat SETELAH about-data.js dan
   SEBELUM section-animations.js, cursor.js, motion.js.
================================================ */

(function renderAbout() {
    const data = window.ABOUT_DATA;
    if (!data) return;

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

    /* ---- Chips ---- */
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

    /* ---- Name & role ---- */
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
            .map(s => `
                <div class="stat-card">
                    <div class="stat-num">${s.num}${s.accent ? `<span class="stat-accent">${s.accent}</span>` : ''}</div>
                    <div class="stat-label">${s.label}</div>
                </div>`)
            .join('');
    }

    /* ---- Status ---- */
    const statusTextEl = document.querySelector('.about-status-text');
    const statusTagEl  = document.querySelector('.about-status-tag');
    if (statusTextEl) statusTextEl.textContent = data.statusText;
    if (statusTagEl)  statusTagEl.textContent  = data.statusTag;

})();