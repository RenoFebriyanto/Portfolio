/* ============================================================
   PARTICLES.JS — Forbidden Space background starfield
   Cyan/teal drifting particles + sesekali "spark" orange
   Render ke #bgCanvas (fixed, full viewport)
============================================================ */
(function initParticles() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles;

    const COUNT  = 90;
    const CYAN   = { r: 0,   g: 200, b: 255 };
    const ORANGE = { r: 255, g: 107, b: 53  };

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function build() {
        particles = Array.from({ length: COUNT }, () => ({
            x: rand(0, W),
            y: rand(0, H),
            r: rand(0.6, 2.0),
            vy: rand(0.02, 0.12),
            vx: rand(-0.04, 0.04),
            alpha: rand(0.08, 0.5),
            pulse: rand(0, Math.PI * 2),
            pulseSpeed: rand(0.004, 0.014),
            tint: Math.random() < 0.12 ? ORANGE : CYAN,
        }));
    }
    build();

    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            p.pulse += p.pulseSpeed;
            const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.tint.r},${p.tint.g},${p.tint.b},${a})`;
            ctx.fill();

            p.x += p.vx;
            p.y -= p.vy; // drift ke atas, kesan starfield jauh

            if (p.y < -4) { p.y = H + 4; p.x = rand(0, W); }
            if (p.x < -4) p.x = W + 4;
            if (p.x > W + 4) p.x = -4;
        });

        requestAnimationFrame(draw);
    }
    draw();
})();