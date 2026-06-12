/* ================================================
   SKILLS-RENDER.JS — Build skills section from
   window.SKILLS_DATA & window.LEARNING_DATA
   Must run BEFORE section-animations.js binds
   .skill-group elements.
================================================ */

(function renderSkills() {
    const grid    = document.querySelector('.skills-grid');
    const learnEl = document.querySelector('.skills-learning-items');

    if (grid && Array.isArray(window.SKILLS_DATA)) {
        grid.innerHTML = window.SKILLS_DATA.map((group, i) => {
            const delay = Math.min(i + 1, 4); // reveal-delay-1..4

            const items = group.skills.map(s => `
                <div class="skill-item">
                    <div class="skill-item-top">
                        <span class="skill-name">${s.name}</span>
                        <span class="skill-level-label">${s.label}</span>
                    </div>
                    <div class="skill-bar-track">
                        <div class="skill-bar-fill" style="--skill-level: ${s.level}%;"></div>
                    </div>
                </div>
            `).join('');

            return `
                <div class="skill-group ${group.key} reveal reveal-delay-${delay}">
                    <div class="skill-group-icon">
                        <img src="${group.icon}" alt="${group.title}" class="skill-group-icon-img">
                    </div>
                    <div class="skill-group-title">${group.title}</div>
                    <div class="skill-group-count">${group.skills.length} skills</div>
                    <div class="skill-list">${items}</div>
                </div>
            `;
        }).join('');
    }

    if (learnEl && Array.isArray(window.LEARNING_DATA)) {
        learnEl.innerHTML = window.LEARNING_DATA
            .map(label => `<span class="skills-learning-chip">${label}</span>`)
            .join('');
    }
})();