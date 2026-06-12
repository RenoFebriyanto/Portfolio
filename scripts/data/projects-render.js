/* ================================================
   PROJECTS-RENDER.JS — Build filter bar & project
   grid dari window.PROJECT_CATEGORIES & window.PROJECTS_DATA.

   Harus dimuat SEBELUM main.js (filter logic) dan
   SEBELUM cursor.js / motion.js (hover & 3D tilt),
   supaya card sudah ada di DOM saat script-script itu
   query .project-card / .filter-btn.
================================================ */

(function renderProjects() {
    const filterWrap = document.querySelector('.projects-filter');
    const grid       = document.getElementById('projects-grid');
    const countEl    = document.getElementById('project-visible-count');

    if (!grid || !Array.isArray(window.PROJECTS_DATA)) return;

    /* ---- Filter buttons ---- */
    if (filterWrap && Array.isArray(window.PROJECT_CATEGORIES)) {
        filterWrap.innerHTML = window.PROJECT_CATEGORIES.map((cat, i) => `
            <button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${cat.key}">${cat.label}</button>
        `).join('');
    }

    /* ---- Project cards ---- */
    grid.innerHTML = window.PROJECTS_DATA.map((proj, i) => {
        const delay = Math.min(i + 1, 5); // reveal-delay-1..5
        const num   = String(proj.id).padStart(2, '0');

        const featuredClass = proj.featured ? ' featured' : '';
        const bgNum = proj.featured
            ? `<span class="project-bg-num">${num}</span>`
            : '';

        const tags = (proj.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('');

        const hasLink   = !!proj.link;
        const linkHref  = hasLink ? proj.link : '#';
        const linkClass = hasLink ? 'project-link' : 'project-link disabled';
        const linkLabel = proj.linkLabel || 'View Project';

        return `
            <div class="project-card${featuredClass} reveal reveal-delay-${delay}"
                 data-category="${proj.category}"
                 data-project-id="${proj.id}"
                 data-page-type="${proj.pageType || ''}">
                ${bgNum}

                <div class="project-card-top">
                    <span class="project-num">Project ${num}</span>
                    <span class="project-status ${proj.status}">${proj.statusLabel}</span>
                </div>

                <div class="project-category">${proj.categoryLabel}</div>
                <h3 class="project-title">${proj.title}</h3>
                <p class="project-desc">${proj.desc}</p>

                <div class="project-tags">${tags}</div>

                <div class="project-card-footer">
                    <a href="${linkHref}" class="${linkClass}" ${hasLink ? `data-project-slug="${proj.slug}"` : ''}>
                        ${linkLabel} <span class="project-link-arrow">&#8594;</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');

    /* ---- Initial visible count ---- */
    if (countEl) {
        countEl.textContent = window.PROJECTS_DATA.length;
    }
})();