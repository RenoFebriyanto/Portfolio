import { useEffect } from 'react';

export const SWARM_REBUILD_EVENT = 'portfolio:swarm-rebuild';

const AGENT_COUNT = 14;
const ORBIT_DURATION = 1150;
const FAN_DURATION = 850;
const BUILD_STEP = 420;
const BUILD_FADE = 600;
const COLORS = ['#ff6b35', '#f4eee8', '#ff9b69', '#e7a14a'];

interface Point {
  x: number;
  y: number;
}

interface BuildTarget {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'text' | 'image' | 'control';
}

interface Agent {
  x: number;
  y: number;
  previous: Point;
  targets: BuildTarget[];
}

function collectTargets(width: number, height: number): BuildTarget[] {
  const activePanel = document.querySelector<HTMLElement>('#snap-root [data-visible="true"]');
  const root = activePanel ?? document.querySelector<HTMLElement>('main') ?? document.body;
  const candidates = root.querySelectorAll<HTMLElement>(
    'h1, h2, h3, p, a, button, img, svg, video, .tag, .project-card, .hero-status, #hero-3d-canvas',
  );
  const targets: BuildTarget[] = [];

  candidates.forEach(element => {
    const bounds = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    if (
      style.display === 'none'
      || style.visibility === 'hidden'
      || Number(style.opacity) < 0.05
      || bounds.width < 5
      || bounds.height < 5
      || bounds.bottom < 0
      || bounds.top > height
      || bounds.right < 0
      || bounds.left > width
    ) return;

    const isImage = element.matches('img, svg, video, #hero-3d-canvas');
    const isControl = element.matches('a, button, .tag, .hero-status');
    targets.push({
      x: Math.max(0, Math.min(width, bounds.left)),
      y: Math.max(0, Math.min(height, bounds.top)),
      width: Math.min(bounds.width, width),
      height: Math.min(bounds.height, height),
      type: isImage ? 'image' : isControl ? 'control' : 'text',
    });
  });

  if (!targets.length) {
    for (let row = 1; row <= 5; row += 1) {
      for (let column = 1; column <= 6; column += 1) {
        targets.push({
          x: (width * column) / 7 - 24,
          y: (height * row) / 6 - 20,
          width: 48,
          height: 40,
          type: 'text',
        });
      }
    }
  }

  return targets.sort((a, b) => a.y - b.y || a.x - b.x);
}

function drawAgent(
  context: CanvasRenderingContext2D,
  position: Point,
  previous: Point,
  color: string,
  index: number,
  alpha: number,
) {
  const angle = Math.atan2(position.y - previous.y, position.x - previous.x);
  const direction = Number.isFinite(angle) ? angle : -Math.PI / 3;

  context.save();
  context.translate(position.x, position.y);
  context.rotate(direction);
  context.globalAlpha = alpha;
  context.shadowColor = color;
  context.shadowBlur = 12;
  context.strokeStyle = color;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(-7, 0);
  context.lineTo(7, 0);
  context.moveTo(0, -7);
  context.lineTo(0, 7);
  context.stroke();
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(1, -6);
  context.lineTo(8, 8);
  context.lineTo(2, 6);
  context.lineTo(-1, 10);
  context.closePath();
  context.fill();
  context.shadowBlur = 0;
  context.font = '10px monospace';
  context.fillText(String(index + 1).padStart(2, '0'), 9, -8);
  context.restore();
}

export function SwarmRebuild() {
  useEffect(() => {
    const revealCanvas = document.createElement('canvas');
    const agentCanvas = document.createElement('canvas');
    revealCanvas.className = 'swarm-rebuild-canvas';
    agentCanvas.className = 'swarm-rebuild-agents';
    revealCanvas.setAttribute('aria-hidden', 'true');
    agentCanvas.setAttribute('aria-hidden', 'true');
    document.body.append(revealCanvas, agentCanvas);

    const context = revealCanvas.getContext('2d');
    const agentContext = agentCanvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrame = 0;
    let startedAt = 0;
    let running = false;
    let targets: BuildTarget[] = [];
    let agents: Agent[] = [];
    let logoCenter: Point = { x: width / 2, y: height / 2 };
    let lastTimestamp = 0;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      [revealCanvas, agentCanvas].forEach(canvas => {
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      });
      context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      agentContext?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const findLogoCenter = (): Point => {
      const logo = document.querySelector<HTMLElement>('.nav-logo, .fs-nav-logo, header img');
      const bounds = logo?.getBoundingClientRect();
      if (!bounds || bounds.width === 0 || bounds.height === 0) {
        return { x: width / 2, y: Math.min(height * 0.32, 260) };
      }
      return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
    };

    const begin = () => {
      if (!context || running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      resizeCanvas();
      targets = collectTargets(width, height);
      logoCenter = findLogoCenter();
      const initialAgentPositions = Array.from({ length: AGENT_COUNT }, (_, index) => {
        const angle = (index / AGENT_COUNT) * Math.PI * 2;
        return {
          x: logoCenter.x + Math.cos(angle) * 4,
          y: logoCenter.y + Math.sin(angle) * 4,
        };
      });

      agents = initialAgentPositions.map((position, index) => ({
        ...position,
        previous: { ...position },
        targets: targets.filter((_, targetIndex) => targetIndex % AGENT_COUNT === index),
      }));
      startedAt = performance.now();
      lastTimestamp = startedAt;
      running = true;
      drawVeil();
      revealCanvas.classList.add('is-active');
      agentCanvas.classList.add('is-active');
      window.addEventListener('keydown', onKeyDown, true);
      window.addEventListener('wheel', preventNavigation, { capture: true, passive: false });
      window.addEventListener('touchmove', preventNavigation, { capture: true, passive: false });
      animationFrame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      context?.clearRect(0, 0, width, height);
      agentContext?.clearRect(0, 0, width, height);
      revealCanvas.classList.remove('is-active');
      agentCanvas.classList.remove('is-active');
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('wheel', preventNavigation, true);
      window.removeEventListener('touchmove', preventNavigation, true);
    };

    function preventNavigation(event: Event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') stop();
      else if ([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        preventNavigation(event);
      }
    }

    const drawVeil = () => {
      if (!context) return;
      const background = window.getComputedStyle(document.body).backgroundColor;
      context.globalCompositeOperation = 'source-over';
      context.globalAlpha = 0.985;
      context.fillStyle = background === 'rgba(0, 0, 0, 0)' ? '#05050a' : background;
      context.fillRect(0, 0, width, height);
      context.globalAlpha = 1;
    };

    const revealTarget = (target: BuildTarget, progress: number) => {
      if (!context) return;
      const eased = 1 - (1 - progress) ** 3;
      const revealWidth = target.type === 'image'
        ? target.width
        : Math.max(2, target.width * eased);
      const revealHeight = target.type === 'text'
        ? target.height
        : Math.max(2, target.height * eased);
      const left = target.type === 'image'
        ? target.x
        : target.x + (target.width - revealWidth) / 2;
      const top = target.type !== 'control'
        ? target.y
        : target.y + (target.height - revealHeight) / 2;

      context.globalCompositeOperation = 'destination-out';
      context.globalAlpha = 0.94;
      context.beginPath();
      context.roundRect(left, top, revealWidth, revealHeight, Math.min(12, revealHeight / 3));
      context.fill();
      context.globalAlpha = 1;

      if (target.type === 'text' && progress < 0.96) {
        context.globalCompositeOperation = 'source-over';
        context.save();
        context.fillStyle = COLORS[0];
        context.globalAlpha = progress > 0.45 ? 0.85 : 0.45 + progress;
        context.fillRect(left + revealWidth, top, 2, target.height);
        context.restore();
      }

      if (progress < 0.9) {
        context.globalCompositeOperation = 'source-over';
        context.save();
        context.strokeStyle = COLORS[Math.round(target.x + target.y) % COLORS.length];
        context.globalAlpha = 0.68 * (1 - progress * 0.65);
        context.lineWidth = 1;
        context.setLineDash([4, 4]);
        context.strokeRect(left, top, revealWidth, revealHeight);
        context.setLineDash([]);
        context.restore();
      }
    };

    function tick(now: number) {
      if (!context || !running) return;
      animationFrame = 0;
      const elapsed = now - startedAt;
      const delta = Math.min(48, now - lastTimestamp);
      lastTimestamp = now;
      agentContext?.clearRect(0, 0, width, height);

      if (elapsed < ORBIT_DURATION) {
        const radius = 22 + Math.sin(elapsed * 0.009) * 5;
        agents.forEach((agent, index) => {
          agent.previous = { x: agent.x, y: agent.y };
          const angle = elapsed * 0.006 + (index / AGENT_COUNT) * Math.PI * 2;
          agent.x = logoCenter.x + Math.cos(angle) * radius;
          agent.y = logoCenter.y + Math.sin(angle) * radius * 0.7;
        });
      } else {
        const buildElapsed = elapsed - ORBIT_DURATION - FAN_DURATION;
        const fanProgress = Math.min(1, (elapsed - ORBIT_DURATION) / FAN_DURATION);
        const fanEase = 1 - (1 - fanProgress) ** 3;

        agents.forEach((agent, index) => {
          agent.previous = { x: agent.x, y: agent.y };
          const firstTarget = agent.targets[0];
          const fanAngle = (index / AGENT_COUNT) * Math.PI * 2;
          const fanTarget = firstTarget
            ? { x: firstTarget.x + firstTarget.width / 2, y: firstTarget.y + firstTarget.height / 2 }
            : { x: width / 2 + Math.cos(fanAngle) * width * 0.4, y: height / 2 + Math.sin(fanAngle) * height * 0.4 };
          const orbitAngle = elapsed * 0.006 + fanAngle;
          const orbitPosition = {
            x: logoCenter.x + Math.cos(orbitAngle) * 22,
            y: logoCenter.y + Math.sin(orbitAngle) * 16,
          };
          agent.x = orbitPosition.x + (fanTarget.x - orbitPosition.x) * fanEase;
          agent.y = orbitPosition.y + (fanTarget.y - orbitPosition.y) * fanEase;

          if (buildElapsed >= 0) {
            const step = Math.floor(buildElapsed / BUILD_STEP);
            const localProgress = (buildElapsed % BUILD_STEP) / BUILD_STEP;
            const target = agent.targets[step];
            if (target) {
              revealTarget(target, localProgress);
              agent.x += (target.x + target.width / 2 - agent.x) * 0.16;
              agent.y += (target.y + target.height / 2 - agent.y) * 0.16;
            }
          }
        });
      }

      agents.forEach((agent, index) => {
        const alpha = elapsed < ORBIT_DURATION + FAN_DURATION
          ? 0.9
          : Math.max(0, 1 - Math.max(0, elapsed - ORBIT_DURATION - FAN_DURATION - 2000) / BUILD_FADE);
        if (agentContext) {
          const targetStep = Math.floor(Math.max(0, elapsed - ORBIT_DURATION - FAN_DURATION) / BUILD_STEP);
          const targetType = agent.targets[targetStep]?.type;
          if (targetType) {
            const label = targetType === 'image' ? 'IMG' : targetType === 'control' ? 'UI' : 'TYPE';
            agentContext.save();
            agentContext.font = '9px monospace';
            agentContext.fillStyle = COLORS[index % COLORS.length];
            agentContext.globalAlpha = alpha * 0.8;
            agentContext.fillText(label, agent.x + 14, agent.y + 13);
            agentContext.restore();
          }
          drawAgent(agentContext, agent, agent.previous, COLORS[index % COLORS.length], index, alpha);
        }
      });

      const taskCount = Math.max(...agents.map(agent => agent.targets.length), 0);
      const buildDuration = taskCount * BUILD_STEP;
      const fadeStart = ORBIT_DURATION + FAN_DURATION + buildDuration + 400;
      if (elapsed >= fadeStart) {
        context.globalCompositeOperation = 'destination-out';
        context.globalAlpha = Math.min(1, delta / (BUILD_FADE * 0.2));
        context.fillRect(0, 0, width, height);
        context.globalAlpha = 1;
        if (elapsed >= fadeStart + BUILD_FADE) {
          stop();
          return;
        }
      }

      animationFrame = window.requestAnimationFrame(tick);
    }

    const onRebuild = () => begin();
    const onResize = () => {
      if (running) stop();
      resizeCanvas();
    };
    resizeCanvas();
    window.addEventListener(SWARM_REBUILD_EVENT, onRebuild);
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      window.removeEventListener(SWARM_REBUILD_EVENT, onRebuild);
      window.removeEventListener('resize', onResize);
      revealCanvas.remove();
      agentCanvas.remove();
    };
  }, []);

  return null;
}
