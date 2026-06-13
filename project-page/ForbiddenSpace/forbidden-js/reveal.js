/* ============================================================
   REVEAL.JS — Scroll reveal untuk .reveal-up / .reveal-right
   IntersectionObserver, sekali trigger per elemen
============================================================ */
(function initReveal() {
    const items = document.querySelectorAll('.reveal-up, .reveal-right');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
    });

    items.forEach(el => observer.observe(el));
})();