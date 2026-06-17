import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  color: string;
}

const COLORS = ['rgba(255,107,53,', 'rgba(77,140,255,', 'rgba(240,240,240,'];

export function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * Math.min(window.devicePixelRatio, 2);
      canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 2);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const makeParticle = (): Particle => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    const count = Math.min(120, Math.floor((W() * H()) / 8000));
    const particles: Particle[] = Array.from({ length: count }, makeParticle);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('mousemove', onMouse);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, W(), H());

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,107,53,${(1 - d / 120) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update + draw particles
      particles.forEach(p => {
        // Mouse repulsion
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx += (dx / dist) * 0.05;
          p.vy += (dy / dist) * 0.05;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x  += p.vx;
        p.y  += p.vy;

        if (p.x < 0) p.x = W();
        if (p.x > W()) p.x = 0;
        if (p.y < 0) p.y = H();
        if (p.y > H()) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}