/* ============================================================
   GALLERY.JS — Screenshot grid lightbox
============================================================ */
(function initGallery() {
    const items    = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');
    if (!items.length || !lightbox || !lightImg) return;

    function open(src, alt) {
        lightImg.src = src;
        lightImg.alt = alt || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightImg.src = ''; }, 300);
    }

    items.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.dataset.src || item.querySelector('img')?.src;
            const alt = item.querySelector('img')?.alt;
            if (src) open(src, alt);
        });
    });

    closeBtn?.addEventListener('click', close);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) close();
    });
})();