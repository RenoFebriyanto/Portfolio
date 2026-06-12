/* ================================================
   PROJECTS-RENDER.JS — Build filter bar & project
   grid dari window.PROJECT_CATEGORIES & window.PROJECTS_DATA.
   
   v2: tambah .project3d-canvas + .project3d-spinner
       per card yang punya field `glb` di data.
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

    /* ---- Preview block builder ---- */
    function buildPreview(proj) {
        const p     = proj.preview || {};
        const color = p.color || 'var(--accent-primary)';
        const num   = String(proj.id).padStart(2, '0');

        /* Kalau tidak ada image maupun video → placeholder generatif */
        if (!p.image && !p.video) {
            return `
                <div class="project-preview project-preview--placeholder"
                     style="--preview-color: ${color}">
                    <div class="project-preview-placeholder-inner">
                        <span class="project-preview-placeholder-num">${num}</span>
                        <span class="project-preview-placeholder-cat">${proj.categoryLabel}</span>
                    </div>
                    <div class="project-preview-noise"></div>
                    ${buildCanvasOverlay(proj)}
                </div>`;
        }

        /* Video tersedia → autoplay on hover */
        const videoEl = p.video
            ? `<video class="project-preview-video"
                      src="${p.video}"
                      muted playsinline loop preload="none"
                      aria-hidden="true"></video>`
            : '';

        /* Image */
        const imageEl = p.image
            ? `<img class="project-preview-img"
                    src="${p.image}"
                    alt="${proj.title} preview"
                    loading="lazy"
                    draggable="false">`
            : '';

        /* Overlay gradient */
        const overlay = `<div class="project-preview-overlay"
                              style="--preview-color: ${color}"></div>`;

        return `
            <div class="project-preview" style="--preview-color: ${color}">
                ${imageEl}
                ${videoEl}
                ${overlay}
                <div class="project-preview-noise"></div>
                ${buildCanvasOverlay(proj)}
            </div>`;
    }

    /* ---- Canvas + Spinner overlay (hanya kalau ada glb) ---- */
    function buildCanvasOverlay(proj) {
        if (!proj.glb) return '';

        return `
            <!-- 3D Canvas: opacity 0 by default, fade in on hover -->
            <canvas class="project3d-canvas" aria-hidden="true"></canvas>

            <!-- Spinner: muncul saat GLB loading -->
            <div class="project3d-spinner" aria-hidden="true">
                <div class="project3d-spinner-ring"></div>
            </div>

            <!-- Drag hint: muncul saat 3D aktif -->
            <span class="project3d-hint">drag to rotate</span>
        `;
    }

    /* ---- Project cards ---- */
    grid.innerHTML = window.PROJECTS_DATA.map((proj, i) => {
        const delay = Math.min(i + 1, 5);
        const num   = String(proj.id).padStart(2, '0');

        const featuredClass = proj.featured ? ' featured' : '';
        const bgNum = proj.featured
            ? `<span class="project-bg-num">${num}</span>`
            : '';

        const tags    = (proj.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('');
        const hasLink = !!proj.link;
        const linkHref  = hasLink ? proj.link : '#';
        const linkClass = hasLink ? 'project-link' : 'project-link disabled';
        const linkLabel = proj.linkLabel || 'View Project';

        /* data-glb attr untuk project3d.js */
        const glbAttr = proj.glb ? `data-glb="${proj.glb}"` : '';

        return `
            <div class="project-card${featuredClass} reveal reveal-delay-${delay}"
                 data-category="${proj.category}"
                 data-project-id="${proj.id}"
                 data-page-type="${proj.pageType || ''}"
                 data-has-video="${!!(proj.preview?.video)}"
                 ${glbAttr}>
                ${bgNum}

                ${buildPreview(proj)}

                <div class="project-card-body">
                    <div class="project-card-top">
                        <span class="project-num">Project ${num}</span>
                        <span class="project-status ${proj.status}">${proj.statusLabel}</span>
                    </div>

                    <div class="project-category">${proj.categoryLabel}</div>
                    <h3 class="project-title">${proj.title}</h3>
                    <p class="project-desc">${proj.desc}</p>

                    <div class="project-tags">${tags}</div>

                    <div class="project-card-footer">
                        <a href="${linkHref}" class="${linkClass}"
                           ${hasLink ? `data-project-slug="${proj.slug}"` : ''}>
                            ${linkLabel} <span class="project-link-arrow">&#8594;</span>
                        </a>
                    </div>
                </div>

                <div class="card-tilt-glow"></div>
            </div>
        `;
    }).join('');

    /* ---- Video hover: play/pause on mouseenter/leave ---- */
    grid.querySelectorAll('.project-card[data-has-video="true"]').forEach(card => {
        /* Skip kalau card punya GLB — video digantikan 3D */
        if (card.dataset.glb) return;

        const video = card.querySelector('.project-preview-video');
        if (!video) return;

        card.addEventListener('mouseenter', () => {
            video.play().catch(() => {});
        });
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });

    /* ---- Initial count ---- */
    if (countEl) countEl.textContent = window.PROJECTS_DATA.length;
})();